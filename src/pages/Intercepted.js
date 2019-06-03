import React from 'react';

function Intercepted() {
    let params = (new URL(window.location)).searchParams; // since chrome 51, no IE
    let url = params.get('url');

    return (
        <div>
            <h1>You were intercepted!</h1>

            <iframe title="Interception page" 
                width="100%" height={800} src="https://www.zeeguu.org/">
            </iframe>
            <h4>You tried to visit {url}...</h4>
            <a href={url}>Continue anyway...</a>
        </div>
    );
}

export default Intercepted;