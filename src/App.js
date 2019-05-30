/* global chrome */

import React from 'react';
import logo from './aikido.png';
import './App.css';
import { Switch, Input, message, Button } from 'antd';
import Autolinker from 'autolinker';
import * as UrlParser from 'url-parse';

let blockButton = new React.createRef();

function blockFromInput(e) {
  let url = e.target.getAttribute('value');

  blockButton.current.setValue('')

  blockWebsite(url);
}

function blockCurrentWebsite() {
  if (!(chrome && chrome.tabs)) return; // no chrome env.

  chrome.tabs.getSelected(null, function(tab) {
    blockWebsite(tab.url);
  });
}

function blockWebsite(url) {
  let matches = Autolinker.parse(url, {
    urls: true,
    email: true
  });

  if (!matches.length) return message.error('No valid link.');

  let urls = matches.map(urlToParser);

  if (!(chrome && chrome.storage)) return; // not inside chrome environment.


  chrome.storage.sync.get(['blockedUrls'], function(result) {
    let blockedUrls = result.blockedUrls || [];
    blockedUrls.push(...urls.map(mapToBlockedUrl));
    chrome.storage.sync.set({ blockedUrls }, function() {
      if (urls.length > 1) {
        message.success(`Blocked ${urls.length} websites`); 
      } else {
        message.success(`Blocked ${urls[0].hostname}`);
      }
    });
  });
}

function urlToParser(match) {
  let url = match.getUrl();
  let parser = new UrlParser(url);
  return parser;
}

function mapToBlockedUrl(parser) {
  let regex = `*://*.${parser.hostname}/*`;
  let { hostname, href, pathname } = parser;

  return {
    hostname,
    href,
    pathname,
    regex
  };
}

function App() {
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
      <Button type="primary" onClick={() => blockCurrentWebsite()}>
        Block
      </Button>
      <Input ref={blockButton}
             placeholder="Block website" 
             onPressEnter={(e) => blockFromInput(e)} />
    </div>
  );
}

export default App;
