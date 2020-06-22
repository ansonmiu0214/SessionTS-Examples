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

export default abstract class S13<ComponentState = {}> extends React.Component<Props, ComponentState>
{

    protected buy: SendComponentFactory<[]>;

    constructor(props: Props) {
        super(props);
        this.buy = props.factory<[]>(
            Roles.Peers.S, 'buy', TerminalState.S9
        );

    }
}