import React from 'react';
import { Progress, message, Icon, Row, Col, Button } from 'antd';
import { getFromStorage, setInStorage } from '../util/storage';
import { exerciseSites, exerciseTime } from '../util/constants';
import { autoLink, urlToParser } from '../util/block-site';
import { duration } from 'moment';

class Intercepted extends React.Component {
    state = {
      currentExerciseSite: '',
      timeLeft: exerciseTime, // 5 minutes in miliseconds
      timestamp: new Date().getTime(),
      timer: null
    }

    componentDidMount() {
        message.open({
            content: 'You were intercepted!',
            icon: <Icon type="stop" />
        });

        getFromStorage('intercepts').then(res => {
            let intercepts = res.intercepts || {};
            let parsed = this.getParsedUrl();
            let count = intercepts[parsed.hostname] + 1 || 1;
            intercepts[parsed.hostname] = count;
            return setInStorage({ intercepts });
        });

        getFromStorage('currentExerciseSite').then(res => {
            let { currentExerciseSite } = res;
            this.setState({ currentExerciseSite });
        });

        let timer = setInterval(() => {
            let timestamp = new Date().getTime();
            let timeLeft = this.state.timeLeft - (
                timestamp - this.state.timestamp
            );
            
            if (timeLeft <= 0) {
                clearInterval(this.state.timer);
                console.log('interval cleared.');
            }

            this.setState({ timeLeft, timestamp });
        }, 1000);
        this.setState({ timer });
    }

    getParsedUrl() {
        let url = this.getUrl();
        let parsed = autoLink(url).map(urlToParser)[0];
        return parsed;
    }

    getUrl() {
        let params = (new URL(window.location)).searchParams; // since chrome 51, no IE
        let url = params.get('url');
        return url;
    }

    render() {
        let url = this.getUrl();
        let parsedUrl = this.getParsedUrl();
        let site = exerciseSites.find(site => {
            return site.name === this.state.currentExerciseSite;
        });
        let progressPercentage = 100 - Math.round(
            (
                // convert to seconds first.
                Math.round(this.state.timeLeft / 1000)
                / 
                Math.round(exerciseTime / 1000)
            ) * 100
        );

        // time left string
        let padZero = unit => unit < 10 ? `0${unit}` : `${unit}`;
        let timeLeftMoment = duration(this.state.timeLeft);
        let timeLeftString = `${padZero(timeLeftMoment.minutes())}:` +
                                `${padZero(timeLeftMoment.seconds())}`;

        return (
            <div>
                <iframe title="Interception page" 
                    width="100%"
                    src={site ? site.url : 'https://www.babbel.com/'}
                    style={{ height: '90vh'}}>
                </iframe>
                <div style={{ height: '9vh' }}>
                    <Row type="flex" justify="space-around" align="middle">
                        <Col md={8}>
                            <h3>Time left:</h3>
                            <code>{timeLeftString}</code>
                            <Progress percent={progressPercentage} />
                            {this.state.timeLeft <= 0 &&
                                <div>Well done! You earned &nbsp;
                                {duration(exerciseTime).humanize()}
                                &nbsp;of browsing time.</div>
                            }
                        </Col>
                        <Col md={2}>
                            <a href={parsedUrl.href} style={{ margin: '5px' }}>
                                <Button icon="login" disabled={this.state.timeLeft > 0}>
                                    Continue to {url}
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