import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { TreeSelect } from 'antd';

@connect(({ dist }) => ({
  dist
}))
class DistTreeSelect extends PureComponent{
  state = {};

  componentDidMount () {
    const { dispatch } = this.props;
    dispatch({
      type: 'dist/loadTreeData'
    });
  }

  render() {
    console.log(this.props)
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

export default DistTreeSelect;
