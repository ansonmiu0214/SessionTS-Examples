import React from 'react';

type ContextProps = {
  serverQuote: number,
  setServerQuote: (quote: number) => void,
};

const Context = React.createContext<ContextProps>({
  serverQuote: 0,
  setServerQuote: () => {}
});

export default Context;

export class AppState extends React.Component<{}, {
  serverQuote: number
}> {

  state = {
    serverQuote: 0
  };

  render() {
    return <Context.Provider value={{
      serverQuote: this.state.serverQuote,
      setServerQuote: (serverQuote) => this.setState({ serverQuote })
    }}>
      {this.props.children}
    </Context.Provider>

  }

}