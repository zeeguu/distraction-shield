import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// pages
import Popup from './pages/Popup';
import Options from './pages/Options';
import Intercepted from './pages/Intercepted';

function Router() {
    let params = (new URL(window.location)).searchParams; // since chrome 51, no IE

    switch (params.get('page')) {
        case 'options':
            return <Options />;
        case 'intercepted':
            return <Intercepted />;
        default:
            return <Popup />;
    }
}

ReactDOM.render(<Router /> , document.getElementById('root'));
