import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { TreeSelect } from 'antd';

@connect(({ org }) => ({
  org
}))
class OrgTreeSelect extends PureComponent{
  state = {};

  componentDidMount () {
    const { dispatch } = this.props;
    dispatch({
      type: 'org/loadTreeData'
    });
  }

  render() {
    const {
      org : { treeData }
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

export default OrgTreeSelect;
