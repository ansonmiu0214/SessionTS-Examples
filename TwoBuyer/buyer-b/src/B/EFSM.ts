// EFSM.ts

// ======
// States
// ======

export enum SendState {
    S24 = 'S24',
};

export enum ReceiveState {
    S21 = 'S21', S23 = 'S23',
};

export enum TerminalState {
    S22 = 'S22',
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