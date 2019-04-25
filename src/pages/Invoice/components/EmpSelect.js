import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Select } from 'antd';

const { Option } = Select;

@connect(({ empDic }) => ({
  empDic
}))
class EmpSelect extends PureComponent{
  state = {};

  componentDidMount () {
    const { dispatch } = this.props;
    dispatch({
      type: 'empDic/fetch'
    });
  }

  render() {
    const {
      empDic : { data },
    } = this.props;
    return (
      <Select style={{ width: '100%' }} {...this.props} allowClear>
        {data && data.map((option) => <Option value={option.empId} key={option.empId}>{option.empLoginName}</Option>)}
      </Select>
    );
  }
}

export default EmpSelect;
