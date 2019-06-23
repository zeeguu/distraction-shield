import React from 'react';
import { Progress, message, Icon, Row, Col, Button } from 'antd';
import { getFromStorage } from '../util/storage';
import { exerciseSites } from '../util/constants';

class Intercepted extends React.Component {
    state = {
      currentExerciseSite: 'https://dunnkers.com/'
    }

    componentDidMount() {
        message.open({
            content: 'You were intercepted!',
            icon: <Icon type="stop" />
        });

        getFromStorage('currentExerciseSite').then(res => {
            let { currentExerciseSite } = res;
            this.setState({ currentExerciseSite });
        });
    }

    render() {
        let params = (new URL(window.location)).searchParams; // since chrome 51, no IE
        let url = params.get('url');

        let site = exerciseSites.find(site => {
            return site.name === this.state.currentExerciseSite;
        });

        return (
            <div>
                <iframe title="Interception page" 
                    width="100%"
                    src={site ? site.url : 'https://www.babbel.com/'}
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
}
export default Intercepted;