import React from 'react';
import './Options.css';
import { Table, Button, Input, Layout, Row, Col, Radio } from 'antd';
import {
  blockWebsite,
  getWebsites,
  unblockWebsite,
  addExerciseSite
} from '../util/block-site';
import { addStorageListener, getFromStorage, setInStorage } from '../util/storage';
import { defaultExerciseSites, s2 } from '../util/constants';
import {
  PieChart, Pie, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import { duration } from 'moment';
const { Header, Content, Footer } = Layout;

const columns = [
  {
    title: 'Blocked websites',
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
    dataIndex: 'hostname',
    key: 'href',
    render: hostname => (
      <Button type="danger" shape="circle" icon="delete"
        onClick={() => unblockWebsite(hostname)} />
    ),
    align: 'right'
  },
];

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: record => ({
    disabled: !record.enabled === 'Disabled User',
    name: record.name,
  }),
};

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
    exerciseSites: []
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
                   'timeSpentLearning', 'exerciseSites')
      .then(res => {
      let { currentExerciseSite } = res;
      
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

      this.setState({ currentExerciseSite, interceptsData,
                      timeSpentLearningData, exerciseSites });
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

  render() {
    return (
      <Layout className="layout" style={{ background: '#fff' }}>
        <Header>
          <header className="Options-header">
            Distraction Shield
          </header>
        </Header>
        <Content style={{ padding: '20px 50px' }}>
          <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
            <Row className="options-grid">
              <Col span={12} className="grid-col">
                <Input autoFocus ref={this.addBlockedWebsiteInput}
                      placeholder="Block website..." 
                      onPressEnter={(e) => this.didAddBlockedWebsite(e)}
                      className='block-button' />
                <Table rowSelection={rowSelection}
                      columns={columns}
                      dataSource={this.state.data} />
              </Col>
              <Col span={12} className="grid-col">
                <h3>Exercise website:</h3>
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
                <br />
                <Input ref={this.addExerciseSiteInput}
                      placeholder="Add exercise site..." 
                      onPressEnter={(e) => this.didAddExerciseSite(e)}
                      style={{ margin: '20px 0px', width: '50%' }} />

                <br /><br /><br /><br />
                <h3>Interception statistics:</h3>
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

                <br /><br /><br /><br />
                <Col md={4}>
                  <Button type="danger" icon="bell">
                      Turn off for 10 minutes
                  </Button>
                </Col>
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
