/* global chrome */

import React from 'react';
import './Options.css';
import { Table, Button } from 'antd';

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
    render: () => (
      <Button type="danger" shape="circle" icon="delete" />
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

class Options extends React.Component {
  state = {
    data: [{hostname:'facebook.com'}]
  }

  componentDidMount() {
    // get blocked websites
    if (!(chrome && chrome.storage)) return; // not inside chrome environment.
  
    chrome.storage.sync.get(['blockedUrls'], (result) => {
      let blockedUrls = result.blockedUrls || [];
      let data = blockedUrls.map((blockedUrl, key) => ({
        key,
        ...blockedUrl
      }));

      this.setState({ data });
    });
  }

  render() {
    return (
      <div className="Options">
        <header className="Options-header">
          <p>
            Distraction Shield
          </p>
        </header>
        <Table rowSelection={rowSelection}
               columns={columns}
               dataSource={this.state.data} />
      </div>
    );
  }
}

export default Options;
