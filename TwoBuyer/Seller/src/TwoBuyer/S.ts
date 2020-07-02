import WebSocket from 'ws';

import * as Cancellation from './Cancellation';

import {
    Implementation,
    Message,
    MessageHandler,
    Roles,
} from './EFSM';

import {
    MaybePromise,
} from './types';

// ===============
// WebSocket Types
// ===============

type RoleToSocket = Roles.PeersToMapped<WebSocket>;
type RoleToMessageQueue = Roles.PeersToMapped<any[]>;
type RoleToHandlerQueue = Roles.PeersToMapped<MessageHandler[]>;

interface WebSocketMessage {
    data: any
    type: string
    target: WebSocket
};

// ==========
// Connection
// ==========

export class S {

    constructor(wss: WebSocket.Server,
        initialState: Implementation.S32,
        cancellation: (role: Roles.All, reason?: any) => MaybePromise<void>) {

        // Keep track of participants that have yet to join.
        const waiting: Set<Roles.Peers> = new Set([Roles.Peers.B, Roles.Peers.A]);

        // Keep track of mapping between role and WebSocket.
        const roleToSocket: Partial<RoleToSocket> = {
            [Roles.Peers.B]: undefined, [Roles.Peers.A]: undefined,
        };
        const socketToRole = new Map<WebSocket, Roles.Peers>();

        // Handle explicit cancellation during the join phase.
        const onClose = ({ target: socket }: WebSocket.CloseEvent) => {
            socket.removeAllListeners();

            // Wait for the role again - guaranteed to occur in map by construction.
            waiting.add(socketToRole.get(socket) as Roles.Peers);
        }

        // Handle connection invitation message from participant.
        const onSubscribe = (event: WebSocketMessage) => {
            const { data, target: socket } = event;
            const { connect: role } = JSON.parse(data) as Message.ConnectRequest;

            const roleAlreadyOccupied = !waiting.has(role);
            if (roleAlreadyOccupied) {
                // Remove listeners, as all events are irrelevant now.
                socket.removeAllListeners();

                // Inform participant of unsuccessful join and cancel.
                socket.close(Cancellation.Emit.ROLE_OCCUPIED);
                return;
            }

            // Update role-WebSocket mapping.
            roleToSocket[role] = socket;
            socketToRole.set(socket, role);
            waiting.delete(role);

            // Execute protocol when all participants have joined.
            if (waiting.size === 0) {
                new Session(wss, roleToSocket as RoleToSocket, cancellation, initialState);
            }
        }

        // Remove previous connection listeners.
        wss.removeAllListeners();

        // Bind event listeners for every new connection.
        wss.addListener('connection', (ws: WebSocket) => {
            ws.onmessage = onSubscribe;
            ws.onclose = onClose;
        });
    }

}

// =======
// Session
// =======

class Session {

    private wss: WebSocket.Server;
    private roleToSocket: RoleToSocket;

    private cancellation: (role: Roles.All, reason?: any) => MaybePromise<void>;

    private initialState: Implementation.S32;
    private messageQueue: RoleToMessageQueue;
    private handlerQueue: RoleToHandlerQueue;

    private activeRoles: Set<Roles.Peers>;

    constructor(wss: WebSocket.Server,
        roleToSocket: RoleToSocket,
        cancellation: (role: Roles.All, reason?: any) => MaybePromise<void>,
        initialState: Implementation.S32) {
        this.wss = wss;
        this.roleToSocket = roleToSocket;
        this.cancellation = cancellation;
        this.initialState = initialState;

        // Keep track of active participants in the session.
        this.activeRoles = new Set([Roles.Peers.B, Roles.Peers.A]);

        // Bind instance methods that are passed as callbacks to EFSM implementations.
        this.next = this.next.bind(this);
        this.send = this.send.bind(this);
        this.receive = this.receive.bind(this);
        this.registerMessageHandler = this.registerMessageHandler.bind(this);
        this.close = this.close.bind(this);
        this.cancel = this.cancel.bind(this);
        this.restart = this.restart.bind(this);

        Object.values(Roles.Peers).forEach(role => {
            const socket = this.roleToSocket[role];

            // Bind handlers for message receive and socket close.
            socket.onmessage = this.receive(role);
            socket.onclose = this.close(role);
        });

        // Initialise queues for receiving.
        this.messageQueue = {
            [Roles.Peers.B]: [], [Roles.Peers.A]: [],
        };

        this.handlerQueue = {
            [Roles.Peers.B]: [], [Roles.Peers.A]: [],
        };

        // Notify all roles for confirming the connection.
        Object.values(this.roleToSocket).forEach(socket => {
            socket.send(JSON.stringify(Message.ConnectConfirm));
        });

        // Initialise state machine.
        this.next(initialState);
    }

    // =====================
    // State machine methods
    // =====================

    next(state: Implementation.Type) {
        try {
            switch (state.type) {
                case 'Send': {
                    return state.performSend(this.next, this.cancel, this.send);
                }
                case 'Receive': {
                    return state.prepareReceive(this.next, this.cancel, this.registerMessageHandler);
                }
                case 'Terminal': {
                    return;
                }
            }
        } catch (error) {
            this.cancel(error);
        }
    }

    restart() {
        new S(this.wss, this.initialState, this.cancellation);
    }

    // ===============
    // Channel methods
    // ===============

    send(to: Roles.Peers, label: string, payload: any[], from: Roles.All = Roles.Self) {
        const message = Message.toChannel(from, label, payload);
        const onError = (error?: Error) => {
            if (error !== undefined) {

                // Only flag an error if the recipient is meant to be active,
                // and the message cannot be sent.
                if (this.activeRoles.has(to)) {
                    throw new Error(`Cannot send to role: ${to}`);
                }

            }
        };
        this.roleToSocket[to].send(JSON.stringify(message), onError);
    }

    receive(from: Roles.Peers) {
        return ({ data }: WebSocketMessage) => {
            const { role, label, payload } = JSON.parse(data) as Message.Channel;
            if (role !== Roles.Self) {
                // Route message
                this.send(role, label, payload, from);
            } else {
                const handler = this.handlerQueue[from].shift();
                if (handler !== undefined) {
                    handler(data);
                } else {
                    this.messageQueue[from].push(data);
                }
            }
        }
    }

    registerMessageHandler(from: Roles.Peers, messageHandler: MessageHandler) {
        const message = this.messageQueue[from].shift();
        if (message !== undefined) {
            messageHandler(message);
        } else {
            this.handlerQueue[from].push(messageHandler);
        }
    }

    // ============
    // Cancellation
    // ============

    close(role: Roles.Peers) {
        return ({ target: socket, code, reason }: WebSocket.CloseEvent) => {
            this.activeRoles.delete(role);
            switch (code) {
                case Cancellation.Receive.NORMAL: {
                    // Unsubscribe from socket events.
                    socket.removeAllListeners();

                    // Restart the protocol when all roles have reached terminal states.
                    if (this.activeRoles.size === 0) {
                        this.restart();
                    }

                    return;
                }
                case Cancellation.Receive.CLIENT_BROWSER_CLOSED: {
                    // Client closed their browser
                    this.propagateCancellation(role, 'browser disconnected');
                    return;
                }
                case Cancellation.Receive.LOGICAL_ERROR: {
                    // Client has logical error
                    this.propagateCancellation(role, reason);
                    return;
                }
                default: {
                    // Unsupported code
                    this.propagateCancellation(role, reason);
                    return;
                }
            }
        }
    }

    /**
      * Propagate explicit cancellation to other roles.
      * 
      * @param cancelledRole 
      */
    propagateCancellation(cancelledRole: Roles.Peers, reason?: any) {

        // Deactivate all roles as the session is cancelled.
        this.activeRoles.clear();

        // Emit cancellation to other roles.
        const message = Cancellation.toChannel(cancelledRole, reason);
        Object.entries(this.roleToSocket)
            .filter(([role, _]) => role !== cancelledRole)
            .forEach(([_, socket]) => {
                socket.removeAllListeners();
                socket.close(Cancellation.Emit.LOGICAL_ERROR, JSON.stringify(message));
            });

        try {

            // Execute user-defined cancellation handler.
            const doCancel = this.cancellation(cancelledRole, reason);
            if (doCancel instanceof Promise) {
                doCancel.then(this.restart).catch(this.restart);
            } else {
                this.restart();
            }

        } catch {
            this.restart();
        }

    }

    cancel(reason?: any) {

        // Deactivate all roles as the session is cancelled.
        this.activeRoles.clear();

        // Emit cancellation to other roles.
        const message = Cancellation.toChannel(Roles.Self, reason);
        Object.values(this.roleToSocket)
            .forEach(socket => {
                socket.removeAllListeners();
                socket.close(Cancellation.Emit.LOGICAL_ERROR, JSON.stringify(message));
            });

        try {
            // Execute user-defined cancellation handler.
            const doCancel = this.cancellation(Roles.Self, reason);
            if (doCancel instanceof Promise) {
                doCancel.then(this.restart).catch(this.restart);
            } else {
                this.restart();
            }
        } catch {
            this.restart();
        }

    }

}