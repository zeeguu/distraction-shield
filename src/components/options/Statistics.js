import React from 'react';
import { addStorageListener, getFromStorage } from '../../util/storage';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Pie,
    PieChart,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

class Statistics extends React.Component {
  state = {
    interceptsData: [],
    timeSpentLearningData: []
  }

  componentDidMount() {
    addStorageListener(() => this.setup());
    this.setup();
  }

  setup() {
    getFromStorage('intercepts',  'timeSpentLearning')
      .then(res => {
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

      this.setState({ interceptsData, timeSpentLearningData });
    });
  }

  render() {
    return (
      <>
        <h4>Times intercepted per website:</h4>
        <PieChart width={400} height={400}>
            <Pie dataKey="value" isAnimationActive={false}
                    data={this.state.interceptsData}
                    cx={200} cy={200} outerRadius={80} fill="#8884d8"
                    label />
            <Tooltip />
        </PieChart>
        
        <h4>Time spent on exercises:</h4>
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
      </>
    )
  }
}

export default Statistics;
