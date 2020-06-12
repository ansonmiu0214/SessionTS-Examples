import { Coordinate as Point } from "./GameTypes";


import {
    FromPromise,
    MaybePromise,
} from "./types";

// ==============
// Protocol roles
// ==============

export namespace Roles {

    type Self = "Svr";

    // Constant value for value comparisons
    export const Self: Self = "Svr";

    export enum Peers {
        P2 = "P2", P1 = "P1",
    };

    export type All = Self | Peers;

    export type PeersToMapped<Value> = {
        [Role in Peers]: Value
    };
};

// ==============
// Message labels
// ==============

export namespace Labels {
    export enum S13 {
        Pos = "Pos",
    };
    export enum S19 {
        Pos = "Pos",
    };

    export enum S20 {
        Lose = "Lose", Draw = "Draw", Update = "Update",
    };
    export enum S21 {
        Win = "Win",
    };
    export enum S22 {
        Draw = "Draw",
    };
    export enum S23 {
        Update = "Update",
    };
    export enum S15 {
        Lose = "Lose", Draw = "Draw", Update = "Update",
    };
    export enum S16 {
        Win = "Win",
    };
    export enum S17 {
        Draw = "Draw",
    };
    export enum S18 {
        Update = "Update",
    };

};

// =======
// Message
// =======
export namespace Message {

    export interface S20Lose {
        label: Labels.S20.Lose,
        payload: [Point],
    };
    export interface S20Draw {
        label: Labels.S20.Draw,
        payload: [Point],
    };
    export interface S20Update {
        label: Labels.S20.Update,
        payload: [Point],
    };

    export type S20 = | S20Lose | S20Draw | S20Update;

    export interface S21Win {
        label: Labels.S21.Win,
        payload: [Point],
    };

    export type S21 = | S21Win;

    export interface S22Draw {
        label: Labels.S22.Draw,
        payload: [Point],
    };

    export type S22 = | S22Draw;

    export interface S23Update {
        label: Labels.S23.Update,
        payload: [Point],
    };

    export type S23 = | S23Update;

    export interface S15Lose {
        label: Labels.S15.Lose,
        payload: [Point],
    };
    export interface S15Draw {
        label: Labels.S15.Draw,
        payload: [Point],
    };
    export interface S15Update {
        label: Labels.S15.Update,
        payload: [Point],
    };

    export type S15 = | S15Lose | S15Draw | S15Update;

    export interface S16Win {
        label: Labels.S16.Win,
        payload: [Point],
    };

    export type S16 = | S16Win;

    export interface S17Draw {
        label: Labels.S17.Draw,
        payload: [Point],
    };

    export type S17 = | S17Draw;

    export interface S18Update {
        label: Labels.S18.Update,
        payload: [Point],
    };

    export type S18 = | S18Update;

    export interface S13Pos {
        label: Labels.S13.Pos,
        payload: [Point],
    };

    export type S13 = | S13Pos;

    export interface S19Pos {
        label: Labels.S19.Pos,
        payload: [Point],
    };

    export type S19 = | S19Pos;


    export interface ConnectRequest {
        connect: Roles.Peers
    };

    export const ConnectConfirm = {
        connected: true
    };

    export interface Channel {
        role: Roles.All
        label: string
        payload: any[]
    };

    export const toChannel = (role: Roles.All, label: string, payload: any[]) => (
        { role, label, payload }
    );
};

// ================
// Message handlers
// ================

export namespace Handler {
    export type S20 =
        MaybePromise<| [Labels.S20.Lose, Message.S20Lose['payload'], Implementation.S21] | [Labels.S20.Draw, Message.S20Draw['payload'], Implementation.S22] | [Labels.S20.Update, Message.S20Update['payload'], Implementation.S23]>;
    export type S21 =
        MaybePromise<| [Labels.S21.Win, Message.S21Win['payload'], Implementation.S14]>;
    export type S22 =
        MaybePromise<| [Labels.S22.Draw, Message.S22Draw['payload'], Implementation.S14]>;
    export type S23 =
        MaybePromise<| [Labels.S23.Update, Message.S23Update['payload'], Implementation.S13]>;
    export type S15 =
        MaybePromise<| [Labels.S15.Lose, Message.S15Lose['payload'], Implementation.S16] | [Labels.S15.Draw, Message.S15Draw['payload'], Implementation.S17] | [Labels.S15.Update, Message.S15Update['payload'], Implementation.S18]>;
    export type S16 =
        MaybePromise<| [Labels.S16.Win, Message.S16Win['payload'], Implementation.S14]>;
    export type S17 =
        MaybePromise<| [Labels.S17.Draw, Message.S17Draw['payload'], Implementation.S14]>;
    export type S18 =
        MaybePromise<| [Labels.S18.Update, Message.S18Update['payload'], Implementation.S19]>;

    export interface S13 {
        [Labels.S13.Pos]: (...payload: Message.S13Pos['payload']) => MaybePromise<Implementation.S15>,

    }
    export interface S19 {
        [Labels.S19.Pos]: (...payload: Message.S19Pos['payload']) => MaybePromise<Implementation.S20>,

    }

};

// ===========
//
// ===========

abstract class ISend {
    type: 'Send' = 'Send';
    abstract performSend(
        next: EfsmTransitionHandler,
        cancel: (reason?: any) => void,
        send: (role: Roles.Peers, label: string, payload: any[]) => void
    ): void;
}

abstract class IReceive {
    type: 'Receive' = 'Receive';
    abstract prepareReceive(
        next: EfsmTransitionHandler,
        cancel: (reason?: any) => void,
        register: (from: Roles.Peers, messageHandler: MessageHandler) => void
    ): void;
}

abstract class ITerminal {
    type: 'Terminal' = 'Terminal';
}

// =================================
// "Implementation"
// := wrapper around message handler
// =================================

export namespace Implementation {

    export type Type = ISend | IReceive | ITerminal;

    export class S20 extends ISend {

        constructor(private handler: Handler.S20) {
            super();
        }

        performSend(
            next: EfsmTransitionHandler,
            cancel: (reason?: any) => void,
            send: (role: Roles.Peers, label: string, payload: any[]) => void
        ) {
            const thunk = ([label, payload, successor]: FromPromise<Handler.S20>) => {
                send(Roles.Peers.P1, label, payload);
                return next(successor);
            }
            if (this.handler instanceof Promise) {
                // Asynchronous implementation -- wait for completion
                this.handler.then(thunk).catch(cancel);
            } else {
                try {
                    thunk(this.handler);
                } catch (error) {
                    cancel(error);
                }
            }
        }

    }
    export class S21 extends ISend {

        constructor(private handler: Handler.S21) {
            super();
        }

        performSend(
            next: EfsmTransitionHandler,
            cancel: (reason?: any) => void,
            send: (role: Roles.Peers, label: string, payload: any[]) => void
        ) {
            const thunk = ([label, payload, successor]: FromPromise<Handler.S21>) => {
                send(Roles.Peers.P2, label, payload);
                return next(successor);
            }
            if (this.handler instanceof Promise) {
                // Asynchronous implementation -- wait for completion
                this.handler.then(thunk).catch(cancel);
            } else {
                try {
                    thunk(this.handler);
                } catch (error) {
                    cancel(error);
                }
            }
        }

    }
    export class S22 extends ISend {

        constructor(private handler: Handler.S22) {
            super();
        }

        performSend(
            next: EfsmTransitionHandler,
            cancel: (reason?: any) => void,
            send: (role: Roles.Peers, label: string, payload: any[]) => void
        ) {
            const thunk = ([label, payload, successor]: FromPromise<Handler.S22>) => {
                send(Roles.Peers.P2, label, payload);
                return next(successor);
            }
            if (this.handler instanceof Promise) {
                // Asynchronous implementation -- wait for completion
                this.handler.then(thunk).catch(cancel);
            } else {
                try {
                    thunk(this.handler);
                } catch (error) {
                    cancel(error);
                }
            }
        }

    }
    export class S23 extends ISend {

        constructor(private handler: Handler.S23) {
            super();
        }

        performSend(
            next: EfsmTransitionHandler,
            cancel: (reason?: any) => void,
            send: (role: Roles.Peers, label: string, payload: any[]) => void
        ) {
            const thunk = ([label, payload, successor]: FromPromise<Handler.S23>) => {
                send(Roles.Peers.P2, label, payload);
                return next(successor);
            }
            if (this.handler instanceof Promise) {
                // Asynchronous implementation -- wait for completion
                this.handler.then(thunk).catch(cancel);
            } else {
                try {
                    thunk(this.handler);
                } catch (error) {
                    cancel(error);
                }
            }
        }

    }
    export class S15 extends ISend {

        constructor(private handler: Handler.S15) {
            super();
        }

        performSend(
            next: EfsmTransitionHandler,
            cancel: (reason?: any) => void,
            send: (role: Roles.Peers, label: string, payload: any[]) => void
        ) {
            const thunk = ([label, payload, successor]: FromPromise<Handler.S15>) => {
                send(Roles.Peers.P2, label, payload);
                return next(successor);
            }
            if (this.handler instanceof Promise) {
                // Asynchronous implementation -- wait for completion
                this.handler.then(thunk).catch(cancel);
            } else {
                try {
                    thunk(this.handler);
                } catch (error) {
                    cancel(error);
                }
            }
        }

    }
    export class S16 extends ISend {

        constructor(private handler: Handler.S16) {
            super();
        }

        performSend(
            next: EfsmTransitionHandler,
            cancel: (reason?: any) => void,
            send: (role: Roles.Peers, label: string, payload: any[]) => void
        ) {
            const thunk = ([label, payload, successor]: FromPromise<Handler.S16>) => {
                send(Roles.Peers.P1, label, payload);
                return next(successor);
            }
            if (this.handler instanceof Promise) {
                // Asynchronous implementation -- wait for completion
                this.handler.then(thunk).catch(cancel);
            } else {
                try {
                    thunk(this.handler);
                } catch (error) {
                    cancel(error);
                }
            }
        }

    }
    export class S17 extends ISend {

        constructor(private handler: Handler.S17) {
            super();
        }

        performSend(
            next: EfsmTransitionHandler,
            cancel: (reason?: any) => void,
            send: (role: Roles.Peers, label: string, payload: any[]) => void
        ) {
            const thunk = ([label, payload, successor]: FromPromise<Handler.S17>) => {
                send(Roles.Peers.P1, label, payload);
                return next(successor);
            }
            if (this.handler instanceof Promise) {
                // Asynchronous implementation -- wait for completion
                this.handler.then(thunk).catch(cancel);
            } else {
                try {
                    thunk(this.handler);
                } catch (error) {
                    cancel(error);
                }
            }
        }

    }
    export class S18 extends ISend {

        constructor(private handler: Handler.S18) {
            super();
        }

        performSend(
            next: EfsmTransitionHandler,
            cancel: (reason?: any) => void,
            send: (role: Roles.Peers, label: string, payload: any[]) => void
        ) {
            const thunk = ([label, payload, successor]: FromPromise<Handler.S18>) => {
                send(Roles.Peers.P1, label, payload);
                return next(successor);
            }
            if (this.handler instanceof Promise) {
                // Asynchronous implementation -- wait for completion
                this.handler.then(thunk).catch(cancel);
            } else {
                try {
                    thunk(this.handler);
                } catch (error) {
                    cancel(error);
                }
            }
        }

    }
    export class S13 extends IReceive {

        constructor(private handler: Handler.S13) {
            super();
        }

        prepareReceive(
            next: EfsmTransitionHandler,
            cancel: (reason?: any) => void,
            register: (from: Roles.Peers, messageHandler: MessageHandler) => void
        ) {
            const messageHandler = (message: any) => {
                const parsedMessage = JSON.parse(message) as Message.S13;
                switch (parsedMessage.label) {
                    case Labels.S13.Pos: {
                        try {
                            const successor = this.handler[parsedMessage.label](...parsedMessage.payload);
                            if (successor instanceof Promise) {
                                successor.then(next).catch(cancel);
                            } else {
                                next(successor);
                            }
                        } catch (error) {
                            cancel(error);
                        }
                        return;
                    }

                }
            }

            register(Roles.Peers.P1, messageHandler);
        }

    }
    export class S19 extends IReceive {

        constructor(private handler: Handler.S19) {
            super();
        }

        prepareReceive(
            next: EfsmTransitionHandler,
            cancel: (reason?: any) => void,
            register: (from: Roles.Peers, messageHandler: MessageHandler) => void
        ) {
            const messageHandler = (message: any) => {
                const parsedMessage = JSON.parse(message) as Message.S19;
                switch (parsedMessage.label) {
                    case Labels.S19.Pos: {
                        try {
                            const successor = this.handler[parsedMessage.label](...parsedMessage.payload);
                            if (successor instanceof Promise) {
                                successor.then(next).catch(cancel);
                            } else {
                                next(successor);
                            }
                        } catch (error) {
                            cancel(error);
                        }
                        return;
                    }

                }
            }

            register(Roles.Peers.P2, messageHandler);
        }

    }
    export class S14 extends ITerminal {
    }


    // Type aliases for annotation
    // Const aliases for constructor
    export type Initial = S13;
    export const Initial = S13;
    export type Terminal = S14;
    export const Terminal = S14;
}

// =============
// Runtime types
// =============

export type EfsmTransitionHandler = (implementation: Implementation.Type) => void
export type MessageHandler = (message: any) => void