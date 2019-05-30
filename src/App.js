import React from 'react';
import logo from './aikido.png';
import './App.css';
import { Switch, Button } from 'antd';
import { blockCurrentWebsite } from './util/block-site';

class App extends React.Component {
  state = { currentBlocked: false };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div>
            <Switch />
          </div>
          <p>
            Distraction Shield
          </p>
          <div>
            <img src={logo} className="App-logo" alt="logo" />
          </div>
        </header>
        <Button ghost={this.state.currentBlocked}
          type="primary" onClick={() => blockCurrentWebsite()}>
          Block
        </Button>
      </div>
    );
  }
}

export default App;
