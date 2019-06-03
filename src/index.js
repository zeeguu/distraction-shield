import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// pages
import Popup from './pages/Popup';
import Options from './pages/Options';
import Intercepted from './pages/Intercepted';

function Router() {
    switch (window.location.search) {
        case '?options':
            return <Options />;
        case '?intercepted':
            return <Intercepted />;
        default:
            return <Popup />;
    }
}

ReactDOM.render(<Router /> , document.getElementById('root'));
