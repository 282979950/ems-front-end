import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { TreeSelect } from 'antd';

@connect(({ perm }) => ({
  perm
}))
class PermTreeSelect extends PureComponent{
  state = {};

  componentDidMount () {
    const { dispatch } = this.props;
    dispatch({
      type: 'perm/fetchAllPerms'
    });
  }

  render() {
    const {
      perm : { allPerms }
    } = this.props;
    return (
      <TreeSelect
        style={{ width: '100%' }}
        treeData={allPerms}
        treeDataSimpleMode
        treeDefaultExpandAll
        allowClear
        {...this.props}
      />
    );
  }
}

export default PermTreeSelect;
