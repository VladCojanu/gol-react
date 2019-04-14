import React, { Component } from 'react';
import Game from './components/Game';

class App extends Component {
  render() {
    return (
      [<h1> Conway's Game of Life </h1>,
      <Game/>]
    );
  }
}

export default App;
