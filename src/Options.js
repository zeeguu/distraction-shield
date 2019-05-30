import React from 'react';
import './Options.css';
import { Table, Button, Input } from 'antd';
import { blockWebsite, getWebsites,
  storageChange, unblockWebsite } from './util/block-site';

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
  },
];

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: record => ({
    disabled: record.name === 'Disabled User', // Column configuration not to be checked
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
    storageChange(() => this.setup());
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
      <div className="Options">
        <header className="Options-header">
          <p>
            Distraction Shield
          </p>
        </header>
        <Input ref={this.blockButton}
              placeholder="Block website..." 
              onPressEnter={(e) => this.blockFromInput(e)}
              className='block-button' />
        <Table rowSelection={rowSelection}
               columns={columns}
               dataSource={this.state.data} />
      </div>
    );
  }
}

export default Options;
