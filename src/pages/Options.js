import React from 'react';
import './Options.css';
import { Table, Button, Input, Layout, Row, Col, Radio } from 'antd';
import { blockWebsite, getWebsites, unblockWebsite } from '../util/block-site';
import { addStorageListener, getFromStorage, setInStorage } from '../util/storage';
import { exerciseSites } from '../util/constants';
const { Header, Content, Footer } = Layout;

const s2 = 'https://www.google.com/s2/favicons?domain=';

const columns = [
  {
    title: 'Blocked websites',
    dataIndex: 'hostname',
    key: 'hostname',
    render: hostname => (
      <div>
        <img alt='favicon' className='site-favicon' src={`${s2}${hostname}`} />
        {hostname}
      </div>
    ),
  },
  {
    title: '',
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
    this.blockButton = new React.createRef();
  }

  state = {
    data: [],
    currentExerciseSite: ''
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
    getFromStorage('currentExerciseSite').then(res => {
      let { currentExerciseSite } = res;
      this.setState({ currentExerciseSite });
    });
  }
  
  blockFromInput(e) {
    let url = e.target.getAttribute('value');
  
    this.blockButton.current.setValue('');
  
    blockWebsite(url);
  }

  handleExerciseSiteChange(e) {
    let currentExerciseSite = e.target.value;
    setInStorage({ currentExerciseSite }).then(() => {
      this.setState({ currentExerciseSite });
    });
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
                <Input autoFocus ref={this.blockButton}
                      placeholder="Block website..." 
                      onPressEnter={(e) => this.blockFromInput(e)}
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
                  {exerciseSites.map((site, i) => (
                    <Radio.Button value={site.name} key={i}>
                      <img alt={`${site.title}`} src={site.logo}
                        style={{ width: '25px', height: '25px' }}/>
                      {site.title}
                    </Radio.Button>
                  ))}
                </Radio.Group>
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
