import { Button, Card, Col, Icon, Input, Layout, Row, Switch, Table, Tag } from 'antd';
import moment, { duration } from 'moment';
import React from 'react';
import ExerciseOptions from '../components/options/ExerciseOptions';
import Statistics from '../components/options/Statistics';
import { blockWebsite, setTimeout, unblockWebsite } from '../util/block-site';
import { defaultTimeout, defaultTimeoutInterval, s2 } from '../util/constants';
import { addStorageListener, getFromStorage } from '../util/storage';
import './Options.css';
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

class Options extends React.Component {
  constructor(props) {
    super(props);
    this.addBlockedWebsiteInput = new React.createRef();
  }

  state = {
    blockedUrls: []
  }

  componentDidMount() {
    addStorageListener(() => this.setup());
    this.setup();
  }

  setup() {
    getFromStorage('blockedUrls').then(res => {
      let blockedUrls = res.blockedUrls || {};
      this.setState({ blockedUrls });
    });
  }
  
  didAddBlockedWebsite(e) {
    let url = e.target.getAttribute('value');
    this.addBlockedWebsiteInput.current.setValue('');
    blockWebsite(url);
  }

  renderLabel({ value }) {
    return duration(value).humanize();
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
                        dataSource={this.state.blockedUrls.map(
                          (obj, key) => ({ ...obj, key })
                        )} 
                        showHeader={false} />
                </Card>
              </Col>
            </Row>
            <Row>
              <Col lg={16} offset={4} className="grid-col">
                <h3>Exercising</h3>
                <Card>
                  <ExerciseOptions />
                </Card>
              </Col>
            </Row>
            <Row>
              <Col lg={16} offset={4} className="grid-col">
                <h3>Statistics</h3>
                <Card>
                  <Statistics />
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
