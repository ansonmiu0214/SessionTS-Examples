import React from 'react';

import * as Roles from './Roles';

import {
    ReceiveState,
    SendState,
    TerminalState
} from './EFSM';

import {
    SendComponentFactory,
    SendComponentFactoryFactory
} from './Session';



// ===============
// Component types
// ===============

type Props = {
    factory: SendComponentFactoryFactory
}

export default abstract class S24<ComponentState = {}> extends React.Component<Props, ComponentState>
{

    protected accept: SendComponentFactory<[]>;
    protected reject: SendComponentFactory<[]>;

    constructor(props: Props) {
        super(props);
        this.accept = props.factory<[]>(
            Roles.Peers.A, 'accept', TerminalState.S22
        );
        this.reject = props.factory<[]>(
            Roles.Peers.A, 'reject', TerminalState.S22
        );

    }
}