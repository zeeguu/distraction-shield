import React from 'react';
import { addStorageListener, getFromStorage, setInStorage } from '../../util/storage';
import { defaultExerciseSite, defaultExerciseSites, defaultexerciseDuration, s2 } from '../../util/constants';
import { addExerciseSite, parseUrls } from '../../util/block-site';
import { Row, Col, Input, Divider, TimePicker, Icon, Select, Button, Modal } from 'antd';
import moment from 'moment';

const { Option } = Select;

class ExerciseOptions extends React.Component {
  constructor(props) {
    super(props);
    this.addExerciseSiteInput = new React.createRef();
  }

  state = {
    currentExerciseSite: '',
    exerciseSites: [],
    exerciseDuration: 0,
    addSiteModalVisible: false,
    newExerciseSiteUrl: '',
    newExerciseSite: null
  }

  componentDidMount() {
    addStorageListener(() => this.setup());
    this.setup();
  }

  setup() {
    getFromStorage('currentExerciseSite', 'exerciseSites', 'exerciseDuration')
      .then(res => {
      let currentExerciseSite = res.currentExerciseSite || defaultExerciseSite.domain;
      let exerciseSites = res.exerciseSites || defaultExerciseSites;
      let exerciseDuration = res.exerciseDuration || defaultexerciseDuration;

      this.setState({ currentExerciseSite, exerciseSites, exerciseDuration });
    });
  }

  handleExerciseSiteChange(currentExerciseSite) {
    setInStorage({ currentExerciseSite }).then(() => {
      this.setState({ currentExerciseSite });
    });
  }

  // time is a moment object
  setExerciseDuration(time) {
    const exerciseDuration = time.valueOf();
    setInStorage({ exerciseDuration }).then(() => {
      this.setState({ exerciseDuration });
    });
  }

  setAddSiteModalVisible(visible) {
    this.setState({ addSiteModalVisible: visible });
  }

  addExerciseSite() {
    addExerciseSite(this.state.newExerciseSite);
    this.setState({ newExerciseSiteUrl: '', newExerciseSite: null });
    this.setAddSiteModalVisible(false);
  }

  setExerciseSiteUrl(e) {
    let newExerciseSiteUrl = e && e.target && e.target.value;

    let { newExerciseSite } = this.state;
    if (!newExerciseSiteUrl) newExerciseSite = null;

    this.setState({ newExerciseSiteUrl, newExerciseSite });
  }

  setExerciseSiteName() {
    if (!this.state.newExerciseSiteUrl) return;

    let urls = parseUrls(this.state.newExerciseSiteUrl);

    if (urls && urls.length === 1) {
      let newExerciseSite = urls[0];
      this.setState({ newExerciseSite });
    }
  }

  closeModal() {
    this.setState({ newExerciseSiteUrl: '', newExerciseSite: null });
    this.setAddSiteModalVisible(false);
  }

  render() {
    return (
      <>
      <Row>
        <Col span={8}>
          Current exercise website
        </Col>
        <Col span={16} style={{ textAlign: 'right' }}>
          <Select
            value={this.state.currentExerciseSite}
            style={{ width: 170 }}
            onChange={(e) => this.handleExerciseSiteChange(e)}
          >
            {this.state.exerciseSites.map((site, i) => {
                return (
                  <Option value={site.name} key={i}>
                    <img alt='favicon'
                      src={`${s2}${site.hostname}`} />&nbsp;
                    {site.name}
                  </Option>
                )
              }
            )}
          </Select><br/>
          <Button ghost 
            onClick={() => this.setAddSiteModalVisible(true)}
            style={{ margin:'5px', color: '#40a9ff' }}>
            Add
          </Button>
          <Modal
            title="Add an exercise website"
            centered
            visible={this.state.addSiteModalVisible}
            onOk={() => this.addExerciseSite()}
            onCancel={() => this.closeModal()}
            width={350}
            cancelText=''
          >
            <Input placeholder="Exercise site url..."
                  onChange={e => this.setExerciseSiteUrl(e)}
                  onBlur={() => this.setExerciseSiteName()}
                  value={this.state.newExerciseSiteUrl}
                  style={{ margin: '20px 0px'}}
                  prefix={<Icon type="global" style={{ color: 'rgba(0,0,0,.25)' }} />}/>
            <Input placeholder="Name..."
                  onChange={e => {
                    let { newExerciseSite } = this.state;
                    newExerciseSite.name = e.target.value;
                    this.setState({ newExerciseSite });
                  }}
                  value={this.state.newExerciseSite && 
                          this.state.newExerciseSite.name}
                  style={{ margin: '20px 0px' }}
                  prefix={this.state.newExerciseSite &&
                    <img
                      alt='favicon'
                      src={`${s2}${this.state.newExerciseSite.hostname}`} />
                  }/>
          </Modal>
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col span={6}>
          Exercise duration
        </Col>
        <Col span={18} style={{ textAlign: 'right' }}>
            <TimePicker 
                allowClear={false}
                defaultValue={moment('12:08', 'mm:ss')}
                value={moment(this.state.exerciseDuration)}
                secondStep={5}
                suffixIcon={<Icon type="hourglass" />}
                format={'mm:ss'}
                onChange={time => this.setExerciseDuration(time)} />
        </Col>
      </Row>
      </>
    )
  }
}

export default ExerciseOptions;
