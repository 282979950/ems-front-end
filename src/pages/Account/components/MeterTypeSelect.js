import React, { PureComponent } from 'react';
import { Cascader } from 'antd';

class MeterTypeSelect extends PureComponent{

  constructor() {
    super();
    this.state = {};
    this.options = [{
      value: 'IC卡表',
      label: 'IC卡表',
      children: [{
        value: '10-3B(LMN)',
        label: '10-3B(LMN)',
      }, {
        value: '10-4A(G)',
        label: '10-4A(G)',
      }, {
        value: '10-4A(LMN)',
        label: '10-4A(LMN)',
      }, {
        value: '16-3B(LMN)',
        label: '16-3B(LMN)',
      }, {
        value: '16-4A(ACD)',
        label: '16-4A(ACD)',
      }, {
        value: '16-4A(LMN)',
        label: '16-4A(LMN)',
      }, {
        value: '2.5-3B(C)',
        label: '2.5-3B(C)',
      }, {
        value: '2.5-3B(C)（T1）',
        label: '2.5-3B(C)（T1）',
      }, {
        value: '2.5-3B(CQ)',
        label: '2.5-3B(CQ)',
      }, {
        value: '2.5-3B(QK)',
        label: '2.5-3B(QK)',
      }, {
        value: '25-3B(LMN)',
        label: '25-3B(LMN)',
      }, {
        value: '25-4A(ACD)',
        label: '25-4A(ACD)',
      }, {
        value: '25-4A(LMN)',
        label: '25-4A(LMN)',
      }, {
        value: '40-3B(LMN)',
        label: '40-3B(LMN)',
      }, {
        value: '40-4A(G)',
        label: '40-4A(G)',
      }, {
        value: '40-4A(LMN)',
        label: '40-4A(LMN)',
      }, {
        value: '4-3B(C)',
        label: '4-3B(C)',
      }, {
        value: '4-3B(C) (II)',
        label: '4-3B(C) (II)',
      }, {
        value: '4-3B(C) (T1)',
        label: '4-3B(C) (T1)',
      }, {
        value: '4-3B(C) (T1Q)',
        label: '4-3B(C) (T1Q)',
      }, {
        value: '4-3B(C)（Y6）',
        label: '4-3B(C)（Y6）',
      }, {
        value: '4-3B(CQ)',
        label: '4-3B(CQ)',
      }, {
        value: '4-3B(CQ)（T1）',
        label: '4-3B(CQ)（T1）',
      }, {
        value: '4-3B(QK)',
        label: '4-3B(QK)',
      }, {
        value: '6-3B(C)',
        label: '6-3B(C)',
      }, {
        value: '6-3B(C)（T1）',
        label: '6-3B(C)（T1）',
      }, {
        value: '6-3B(CQ)',
        label: '6-3B(CQ)',
      }, {
        value: '6-3B(QK)',
        label: '6-3B(QK)',
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
