import React, { PureComponent } from 'react';
import { Cascader } from 'antd';

class MeterTypeSelect extends PureComponent{

  constructor() {
    super();
    this.state = {};
    this.options = [{
      label: 'IC卡表',
      value: 'IC卡表',
      children: [{
        label: '4-3B(C)(石门)',
        value: 17,
      }, {
        label: '4-3B(C)(Y 石门)',
        value: 18,
      }, {
        label: '4-3B(QK1)(石门)',
        value: 19,
      }, {
        label: '4-3B(C)(M石门)',
        value: 20,
      }, {
        label: '4-3B(QK)(M 石门)',
        value: 21,
      },{
        label: 'CG-L-10(工业表)',
        value: 22,
      },{
        label: 'CG-L-16(工业表)',
        value: 23,
      },{
        label: 'CG-L-25(工业表)',
        value: 24,
      }]
    }];
  }

  render() {
    return (
      <Cascader options={this.options} {...this.props} />
    );
  }
}

export default MeterTypeSelect;
