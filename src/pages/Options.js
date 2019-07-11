import React from 'react';
import './Options.css';
import { Table, Button, Input, Layout, Row, Col, Radio, TimePicker, Icon, 
  Tag, Switch, Tooltip as AntTooltip, Card, Divider } from 'antd';
import {
  blockWebsite,
  getWebsites,
  unblockWebsite,
  addExerciseSite,
  setTimeout
} from '../util/block-site';
import { addStorageListener, getFromStorage, setInStorage } from '../util/storage';
import { defaultExerciseSites, s2, defaultexerciseDuration, defaultExerciseSite, defaultTimeout, defaultTimeoutInterval } from '../util/constants';
import {
  PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, Tooltip
} from 'recharts';
import { duration } from 'moment';
import moment from 'moment';
const { Header, Content, Footer } = Layout;

const columns = [
  {
    dataIndex: 'name',
    render: (name, site) => (
      <div>
        <img alt='favicon' className='site-favicon' src={`${s2}${site.hostname}`} />
        {name}
      </div>
    ),
  },
  {
    dataIndex: 'regex',
    render: regex => (
      <code>{regex}</code>
    )
  },
  {
    dataIndex: 'timeout',
    render: (timeout, site) => {
      
      const start = moment() // now
      const end = moment(timeout);
      
      let timedout = timeout && start.isSameOrBefore(end);
      
      const timeLeftStr = end.from(start, true);
      const tillStr = end.format('HH:mm');
      
      let now = new Date().valueOf();
      
      return (
        <div style={{ display: 'flex' }}>
          <Switch size="small" checked={timedout}
            onChange={checked => 
              setTimeout(site, checked ? now + defaultTimeout : now)
            }
            style={{ marginRight: '5px' }} />
          {timedout === true && (
            <>
              <small style={{ display: 'flex', flexDirection: 'column' }}>
                For {timeLeftStr}
                <Tag color="blue" style={{
                  borderColor: 'transparent',
                  backgroundColor: 'transparent'
                }} >
                  Till {tillStr}
                </Tag>
              </small>
              <Button icon="minus" size="small" type="link"
                style={{ color: '#8c8c8c' }}
                onClick={() => setTimeout(site, timeout - defaultTimeoutInterval)} />
              <Button icon="plus" size="small" type="link"
                style={{ color: '#8c8c8c' }}
                onClick={() => setTimeout(site, timeout + defaultTimeoutInterval)} />
            </>
          )}
        </div>
      );
    }
  },
  {
    dataIndex: 'hostname',
    render: hostname => (
      <Button type="link" shape="circle" icon="close"
        onClick={() => unblockWebsite(hostname)}
        className="remove-button"
        title="Delete website"/>
    ),
    align: 'right'
  },
];

function addKeyToObj(obj, key) {
  return { ...obj, key };
}

class Options extends React.Component {
  constructor(props) {
    super(props);
    this.addBlockedWebsiteInput = new React.createRef();
    this.addExerciseSiteInput = new React.createRef();
  }

  state = {
    data: [],
    currentExerciseSite: '',
    interceptsData: [],
    timeSpentLearningData: [],
    exerciseSites: [],
    exerciseDuration: 0
  }

  componentDidMount() {
    addStorageListener(() => this.setup());
    this.setup();
  }

  setup() {
    getWebsites().then(blockedUrls => {
      let data = blockedUrls.map(addKeyToObj);
      this.setState({ data });
    });
    getFromStorage('currentExerciseSite', 'intercepts', 
                   'timeSpentLearning', 'exerciseSites',
                   'exerciseDuration')
      .then(res => {
      let currentExerciseSite = res.currentExerciseSite || defaultExerciseSite.domain;
      
      let intercepts = res.intercepts || {};
      let interceptsData = Object.keys(intercepts).map(key => ({
        name: key,
        value: intercepts[key]
      }));

      let timeSpentLearning = res.timeSpentLearning || {};
      let timeSpentLearningData = Object.keys(timeSpentLearning).map(key => ({
        name: key,
        value: Math.round(timeSpentLearning[key] / 1000 / 60) // minutes
      }));

      let exerciseSites = res.exerciseSites || defaultExerciseSites;

      let exerciseDuration = res.exerciseDuration || defaultexerciseDuration;

      this.setState({ currentExerciseSite, interceptsData,
                      timeSpentLearningData, exerciseSites,
                      exerciseDuration
                    });
    });
  }
  
  didAddBlockedWebsite(e) {
    let url = e.target.getAttribute('value');
    this.addBlockedWebsiteInput.current.setValue('');
    blockWebsite(url);
  }

  didAddExerciseSite(e) {
    let url = e.target.getAttribute('value');
    this.addExerciseSiteInput.current.setValue('');
    addExerciseSite(url);
  }

  handleExerciseSiteChange(e) {
    let currentExerciseSite = e.target.value;
    setInStorage({ currentExerciseSite }).then(() => {
      this.setState({ currentExerciseSite });
    });
  }

  renderLabel({ value }) {
    return duration(value).humanize();
  }

  // time is a moment object
  setExerciseDuration(time) {
    const exerciseDuration = time.valueOf();
    setInStorage({ exerciseDuration }).then(() => {
      this.setState({ exerciseDuration });
    });
  }

  render() {
    return (
      <Layout className="layout" style={{ background: 'rgb(248, 249, 250)' }}>
        <Header>
          <header className="Options-header">
            Distraction Shield
          </header>
        </Header>
        <Content style={{ padding: '20px 50px' }}>
          <div>
            <Row className="options-grid">
              <Col lg={16} offset={4} className="grid-col">
                <h3>Blocked Websites</h3>
                <Card>
                  <Input autoFocus ref={this.addBlockedWebsiteInput}
                        placeholder="Block url..." 
                        onPressEnter={(e) => this.didAddBlockedWebsite(e)}
                        className='block-button'
                        prefix={<Icon type="stop" style={{ color: 'rgba(0,0,0,.25)' }} />}/>
                  <Table columns={columns}
                        dataSource={this.state.data} 
                        showHeader={false} />
                </Card>
              </Col>
            </Row>
            <Row>
              <Col lg={16} offset={4} className="grid-col">
                <h3>Exercise website:</h3>
                <Card>
                  <Radio.Group value={this.state.currentExerciseSite}
                              onChange={(e) => this.handleExerciseSiteChange(e)}
                              size="large">
                    {this.state.exerciseSites.map((site, i) => {
                        return (
                          <Radio.Button value={site.domain} key={i}>
                            <img alt='favicon'
                              src={`${s2}${site.hostname}`} />&nbsp;
                            {site.name}
                          </Radio.Button>
                        )
                      }
                    )}
                  </Radio.Group>
                  <Input ref={this.addExerciseSiteInput}
                        placeholder="Add exercise site..." 
                        onPressEnter={(e) => this.didAddExerciseSite(e)}
                        style={{ margin: '20px 0px', width: '300px' }} />

                  <Divider />
                  <h3>Exercise duration:</h3>
                  <TimePicker 
                    allowClear={false}
                    defaultValue={moment('12:08', 'mm:ss')}
                    value={moment(this.state.exerciseDuration)}
                    secondStep={5}
                    suffixIcon={<Icon type="hourglass" />}
                    format={'mm:ss'}
                    onChange={time => this.setExerciseDuration(time)} />
                </Card>
              </Col>
            </Row>
            <Row>
              <Col lg={16} offset={4} className="grid-col">
                <h3>Interception statistics:</h3>
                <Card>

                  <PieChart width={300} height={250}>
                    <Pie dataKey="value" isAnimationActive={false}
                          data={this.state.interceptsData}
                          cx={150} cy={100} outerRadius={80} fill="#8884d8"
                          label />
                    <Tooltip />
                  </PieChart>
                  <br /><br />

                  <h3>Time spent on exercises:</h3>
                  <BarChart
                    width={400}
                    height={300}
                    data={this.state.timeSpentLearningData}
                    margin={{
                      top: 5, right: 30, left: 20, bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" name="Time spent (minutes)" />
                  </BarChart>
                </Card>
              </Col>
            </Row>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>University of Groningen © 2019</Footer>
      </Layout>
    );
  }
}

export default Options;
