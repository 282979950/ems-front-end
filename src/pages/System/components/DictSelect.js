import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { TreeSelect } from 'antd';

@connect(({ dic }) => ({
  dic
}))
class DictSelect extends PureComponent{
  state = {};

  componentDidMount () {
    const { dispatch, category } = this.props;
    dispatch({
      type: 'dic/loadListData',
      payload: {
        category
      }
    });
  }

  render() {
    const {
      dist : { treeData }
    } = this.props;
    return (
      <TreeSelect
        style={{ width: '100%' }}
        treeData={treeData}
        treeDataSimpleMode
        treeDefaultExpandAll
        allowClear
        {...this.props}
      />
    );
  }
}

export default DictSelect;
