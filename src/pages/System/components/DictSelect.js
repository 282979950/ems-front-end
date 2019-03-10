import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Select } from 'antd';

const { Option } = Select;

@connect(({ dic }) => ({
  dic
}))
class DictSelect extends PureComponent{
  state = {};

  componentDidMount () {
    const { dispatch, category } = this.props;
    dispatch({
      type: 'dic/fetchByType',
      payload: {
        category
      }
    });
  }

  render() {
    const {
      dic : { dicData },
      category
    } = this.props;
    const listData = dicData[category];
    return (
      <Select style={{ width: '100%' }} {...this.props} allowClear>
        {listData && listData.map((option) => <Option value={option.dictValue} key={option.dictId}>{option.dictKey}</Option>)}
      </Select>
    );
  }
}

export default DictSelect;
