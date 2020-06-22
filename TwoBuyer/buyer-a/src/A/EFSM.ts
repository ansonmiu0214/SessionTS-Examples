// EFSM.ts

// ======
// States
// ======

export enum SendState {
    S8 = 'S8', S11 = 'S11', S13 = 'S13', S14 = 'S14',
};

export enum ReceiveState {
    S10 = 'S10', S12 = 'S12',
};

export enum TerminalState {
    S9 = 'S9',
};

export type State = ReceiveState | SendState | TerminalState;

// ===========
// Type Guards
// ===========

export function isReceiveState(state: State): state is ReceiveState {
    return (Object.values(ReceiveState) as Array<State>).includes(state)
}

export function isSendState(state: State): state is SendState {
    return (Object.values(SendState) as Array<State>).includes(state)
}

export function isTerminalState(state: State): state is TerminalState {
    return (Object.values(TerminalState) as Array<State>).includes(state)
}