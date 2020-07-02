

import {
    FromPromise,
    MaybePromise,
} from "./types";

// ==============
// Protocol roles
// ==============

export namespace Roles {

    type Self = "S";

    // Constant value for value comparisons
    export const Self: Self = "S";

    export enum Peers {
        B = "B", A = "A",
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
    export enum S32 {
        title = "title",
    };
    export enum S36 {
        buy = "buy", cancel = "cancel",
    };

    export enum S35 {
        quote = "quote",
    };
    export enum S34 {
        quote = "quote",
    };

};

// =======
// Message
// =======
export namespace Message {

    export interface S35quote {
        label: Labels.S35.quote,
        payload: [number],
    };

    export type S35 = | S35quote;

    export interface S34quote {
        label: Labels.S34.quote,
        payload: [number],
    };

    export type S34 = | S34quote;

    export interface S32title {
        label: Labels.S32.title,
        payload: [string],
    };

    export type S32 = | S32title;

    export interface S36buy {
        label: Labels.S36.buy,
        payload: [],
    };
    export interface S36cancel {
        label: Labels.S36.cancel,
        payload: [],
    };

    export type S36 = | S36buy | S36cancel;


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
    export type S35 =
        MaybePromise<| [Labels.S35.quote, Message.S35quote['payload'], Implementation.S36]>;
    export type S34 =
        MaybePromise<| [Labels.S34.quote, Message.S34quote['payload'], Implementation.S35]>;

    export interface S32 {
        [Labels.S32.title]: (...payload: Message.S32title['payload']) => MaybePromise<Implementation.S34>,

    }
    export interface S36 {
        [Labels.S36.buy]: (...payload: Message.S36buy['payload']) => MaybePromise<Implementation.S33>,
        [Labels.S36.cancel]: (...payload: Message.S36cancel['payload']) => MaybePromise<Implementation.S33>,

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

    export class S35 extends ISend {

        constructor(private handler: Handler.S35) {
            super();
        }

        performSend(
            next: EfsmTransitionHandler,
            cancel: (reason?: any) => void,
            send: (role: Roles.Peers, label: string, payload: any[]) => void
        ) {
            const thunk = ([label, payload, successor]: FromPromise<Handler.S35>) => {
                send(Roles.Peers.B, label, payload);
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
    export class S34 extends ISend {

        constructor(private handler: Handler.S34) {
            super();
        }

        performSend(
            next: EfsmTransitionHandler,
            cancel: (reason?: any) => void,
            send: (role: Roles.Peers, label: string, payload: any[]) => void
        ) {
            const thunk = ([label, payload, successor]: FromPromise<Handler.S34>) => {
                send(Roles.Peers.A, label, payload);
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
    export class S32 extends IReceive {

        constructor(private handler: Handler.S32) {
            super();
        }

        prepareReceive(
            next: EfsmTransitionHandler,
            cancel: (reason?: any) => void,
            register: (from: Roles.Peers, messageHandler: MessageHandler) => void
        ) {
            const messageHandler = (message: any) => {
                const parsedMessage = JSON.parse(message) as Message.S32;
                switch (parsedMessage.label) {
                    case Labels.S32.title: {
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

            register(Roles.Peers.A, messageHandler);
        }

    }
    export class S36 extends IReceive {

        constructor(private handler: Handler.S36) {
            super();
        }

        prepareReceive(
            next: EfsmTransitionHandler,
            cancel: (reason?: any) => void,
            register: (from: Roles.Peers, messageHandler: MessageHandler) => void
        ) {
            const messageHandler = (message: any) => {
                const parsedMessage = JSON.parse(message) as Message.S36;
                switch (parsedMessage.label) {
                    case Labels.S36.buy: {
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
                    case Labels.S36.cancel: {
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

            register(Roles.Peers.A, messageHandler);
        }

    }
    export class S33 extends ITerminal {
    }


    // Type aliases for annotation
    // Const aliases for constructor
    export type Initial = S32;
    export const Initial = S32;
    export type Terminal = S33;
    export const Terminal = S33;
}

// =============
// Runtime types
// =============

export type EfsmTransitionHandler = (implementation: Implementation.Type) => void
export type MessageHandler = (message: any) => void