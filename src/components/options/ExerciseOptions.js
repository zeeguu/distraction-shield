import React from 'react';
import { addStorageListener, getFromStorage, setInStorage } from '../../util/storage';
import { defaultExerciseSite, defaultExerciseSites, defaultexerciseDuration, s2 } from '../../util/constants';
import { addExerciseSite } from '../../util/block-site';
import { Row, Col, Radio, Input, Divider, TimePicker, Icon } from 'antd';
import moment from 'moment';

class ExerciseOptions extends React.Component {
  constructor(props) {
    super(props);
    this.addExerciseSiteInput = new React.createRef();
  }

  state = {
    currentExerciseSite: '',
    exerciseSites: [],
    exerciseDuration: 0 
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

  // time is a moment object
  setExerciseDuration(time) {
    const exerciseDuration = time.valueOf();
    setInStorage({ exerciseDuration }).then(() => {
      this.setState({ exerciseDuration });
    });
  }

  render() {
    return (
      <>
      <Row>
        <Col span={6}>
          Current exercise website
        </Col>
        <Col span={18} style={{ textAlign: 'right' }}>
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
        </Col>
      <Input ref={this.addExerciseSiteInput}
            placeholder="Add exercise site..." 
            onPressEnter={(e) => this.didAddExerciseSite(e)}
            style={{ margin: '20px 0px', width: '300px' }} />
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
