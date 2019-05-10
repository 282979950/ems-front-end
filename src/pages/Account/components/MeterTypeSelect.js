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
        label: '10-3B(LMN)',
        value: 1,
      }, {
        label: '10-4A(G)',
        value: 2,
      }, {
        label: '10-4A(LMN)',
        value: 3,
      }, {
        label: '16-3B(LMN)',
        value: 4,
      }, {
        label: '16-4A(ACD)',
        value: 5,
      }, {
        label: '16-4A(LMN)',
        value: 6,
      }, {
        label: '2.5-3B(C)',
        value: 7,
      }, {
        label: '2.5-3B(C)（T1）',
        value: 8,
      }, {
        label: '2.5-3B(CQ)',
        value: 9,
      }, {
        label: '2.5-3B(QK)',
        value: 10,
      }, {
        label: '25-3B(LMN)',
        value: 11,
      }, {
        label: '25-4A(ACD)',
        value: 12,
      }, {
        label: '25-4A(LMN)',
        value: 13,
      }, {
        label: '40-3B(LMN)',
        value: 14,
      }, {
        label: '40-4A(G)',
        value: 15,
      }, {
        label: '40-4A(LMN)',
        value: 16,
      }, {
        label: '4-3B(C)',
        value: 17,
      }, {
        label: '4-3B(C) (II)',
        value: 18,
      }, {
        label: '4-3B(C) (T1)',
        value: 19,
      }, {
        label: '4-3B(C) (T1Q)',
        value: 20,
      }, {
        label: '4-3B(C)（Y6）',
        value: 21,
      }, {
        label: '4-3B(CQ)',
        value: 22,
      }, {
        label: '4-3B(CQ)（T1）',
        value: 23,
      }, {
        label: '4-3B(QK)',
        value: 24,
      }, {
        label: '6-3B(C)',
        value: 25,
      }, {
        label: '6-3B(C)（T1）',
        value: 26,
      }, {
        label: '6-3B(CQ)',
        value: 27,
      }, {
        label: '6-3B(QK)',
        value: 28,
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
