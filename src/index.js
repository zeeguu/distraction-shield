import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Options from './Options';
import * as serviceWorker from './serviceWorker';

let opt = window.location.search === '?options';
ReactDOM.render(opt ? <Options /> : <App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
