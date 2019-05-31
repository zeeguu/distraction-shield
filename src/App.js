/* global chrome */
import React from 'react';
import logo from './aikido.png';
import './App.css';
import { Switch, Button } from 'antd';
import { blockCurrentWebsite } from './util/block-site';
import { getFromStorage, setInStorage } from './util/storage';

class App extends React.Component {
  state = {
    currentBlocked: false,
    enabled: undefined
  };

  componentDidMount() {
    getFromStorage('enabled').then((res) => {
      this.setState(res); // enabled: (true | false)
    });
  }

  onSwitchChange(enabled) {
    this.setState({ enabled });
    setInStorage({ enabled });
  }

  openOptionsPage() {
    if (chrome && chrome.runtime && chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.history.pushState({ urlPath:'?options' }, '', '?options');
      window.location.reload(); // not ideal, but works.
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div>
            <Switch 
              disabled={this.state.enabled === undefined}
              checked={this.state.enabled}
              onChange={checked => this.onSwitchChange(checked)} />
          </div>
          <p>
            Distraction Shield
          </p>
          <div>
            <img src={logo} className="App-logo" alt="logo" />
          </div>
        </header>
        <p>
          <Button ghost={this.state.currentBlocked}
            type="primary" onClick={() => blockCurrentWebsite()}>
            Block
          </Button>
        </p>
        <p>
          <Button type="default" shape="circle" icon="setting" 
            onClick={() => this.openOptionsPage()}
            />
        </p>
      </div>
    );
  }
}

export default App;
