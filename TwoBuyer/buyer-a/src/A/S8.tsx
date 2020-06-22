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

export default abstract class S8<ComponentState = {}> extends React.Component<Props, ComponentState>
{

    protected title: SendComponentFactory<[string]>;

    constructor(props: Props) {
        super(props);
        this.title = props.factory<[string]>(
            Roles.Peers.S, 'title', ReceiveState.S10
        );

    }
}