import React from 'react';

function Intercepted() {
    let site = window.location.search;

    return (
        <div>
            <h1>You were intercepted!</h1>
            <h4>You tried to visit {site}...</h4>

            <iframe title="Interception page" 
                width={800} height={600} src="https://www.zeeguu.org/">
            </iframe>
        </div>
    );
}

export default Intercepted;