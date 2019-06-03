import React from 'react';
import './Options.css';
import { Table, Button, Input, Layout } from 'antd';
import { blockWebsite, getWebsites, unblockWebsite } from '../util/block-site';
import { addStorageListener } from '../util/storage';
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
    data: []
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
  }
  
  blockFromInput(e) {
    let url = e.target.getAttribute('value');
  
    this.blockButton.current.setValue('');
  
    blockWebsite(url);
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
            <div className="block-input-and-table">
              <Input autoFocus ref={this.blockButton}
                    placeholder="Block website..." 
                    onPressEnter={(e) => this.blockFromInput(e)}
                    className='block-button' />
              <Table rowSelection={rowSelection}
                    columns={columns}
                    dataSource={this.state.data} />
            </div>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>University of Groningen © 2019</Footer>
      </Layout>
    );
  }
}

export default Options;
