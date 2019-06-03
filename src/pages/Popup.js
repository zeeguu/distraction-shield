/* global chrome */
import React from 'react';
import logo from '../images/aikido.png';
import './Popup.css';
import { Switch, Button } from 'antd';
import {
  blockCurrentWebsite,
  isCurrentWebsiteBlocked,
  unBlockCurrentWebsite
} from '../util/block-site';
import {
  getFromStorage, setInStorage,
  addStorageListener
} from '../util/storage';

class Popup extends React.Component {
  state = {
    currentBlocked: false,
    enabled: undefined
  };

  componentDidMount() {
    addStorageListener(() => this.setup());
    this.setup();
  }

  setup() {
    getFromStorage('enabled').then((res) => {
      this.setState(typeof res.enabled === 'boolean' ? 
        res : 
        { enabled: true });
        // default value is enabled. will still undefined in storage untill one
        // turns the switch off.
    });
    isCurrentWebsiteBlocked().then(currentBlocked => {
      this.setState({ currentBlocked });
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
      window.history.pushState({ urlPath: '?options' }, '', '?options');
      window.location.reload(); // not ideal, but works.
    }
  }

  render() {
    return (
      <div className="Popup">
        <header className="Popup-header">
          <div>
            <Switch
              loading={this.state.enabled === undefined}
              checked={this.state.enabled}
              onChange={checked => this.onSwitchChange(checked)} />
          </div>
          <p>
            Distraction Shield
          </p>
          <div>
            <img src={logo} className="Popup-logo" alt="logo" />
          </div>
        </header>
        <p>
          <Button ghost={this.state.currentBlocked}
            type="primary" onClick={() => {
              !this.state.currentBlocked && blockCurrentWebsite();
              this.state.currentBlocked && unBlockCurrentWebsite();
            }}>
            {this.state.currentBlocked ? 'Unblock' : 'Block'}
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

export default Popup;
