import React from "react";

// ===============
// Component types
// ===============

type Props = {
    terminate: () => void,
};

export default abstract class S32<ComponentState = {}> extends React.Component<Props, ComponentState> {

    componentDidMount() {
        this.props.terminate();
    }

}