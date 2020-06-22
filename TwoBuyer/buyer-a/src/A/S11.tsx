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

export default abstract class S11<ComponentState = {}> extends React.Component<Props, ComponentState>
{

    protected split: SendComponentFactory<[number]>;

    constructor(props: Props) {
        super(props);
        this.split = props.factory<[number]>(
            Roles.Peers.B, 'split', ReceiveState.S12
        );


    }
}