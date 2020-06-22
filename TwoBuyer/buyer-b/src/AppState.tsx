import React from 'react';

type ContextProps = {
  serverQuote: number,
  setServerQuote: (quote: number) => void,
  split: number,
  setSplit: (split: number) => void,
};

const Context = React.createContext<ContextProps>({
  serverQuote: 0,
  setServerQuote: () => {},
  split: 0,
  setSplit: () => {}
});

export default Context;

export class AppState extends React.Component<{}, {
  serverQuote: number,
  split: number,
}> {

  state = {
    serverQuote: 0,
    split: 0,
  };

  render() {
    return <Context.Provider value={{
      serverQuote: this.state.serverQuote,
      setServerQuote: (serverQuote) => this.setState({ serverQuote }),
      split: this.state.split,
      setSplit: (split) => this.setState({ split })
    }}>
      {this.props.children}
    </Context.Provider>

  }

}