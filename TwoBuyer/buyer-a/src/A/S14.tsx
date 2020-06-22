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

export default abstract class S14<ComponentState = {}> extends React.Component<Props, ComponentState>
{

    protected cancel: SendComponentFactory<[]>;

    constructor(props: Props) {
        super(props);
        this.cancel = props.factory<[]>(
            Roles.Peers.S, 'cancel', TerminalState.S9
        );

    }
}