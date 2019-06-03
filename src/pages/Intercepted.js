import React from 'react';
import { Progress, message, Icon, Row, Col, Button } from 'antd';

function Intercepted() {
    message.open({
        content: 'You were intercepted!',
        icon: <Icon type="stop" />
    });

    let params = (new URL(window.location)).searchParams; // since chrome 51, no IE
    let url = params.get('url');

    return (
        <div>
            <iframe title="Interception page" 
                width="100%"
                src="https://www.zeeguu.org/"
                style={{ height: '90vh'}}>
            </iframe>
            <div style={{ height: '9vh' }}>
                <Row type="flex" justify="space-around" align="middle">
                    <Col span={8} offset={6}>
                        <h3>Exercises completed:</h3>
                        <code>1 / 4</code>
                        <Progress percent={25} />
                    </Col>
                    <Col span={2}>
                        <a href={url}>
                            <Button type="danger" icon="bell">
                                Turn off for 10 minutes
                            </Button>
                        </a>
                    </Col>
                </Row>
            </div>
            
        </div>
    );
}

export default Intercepted;