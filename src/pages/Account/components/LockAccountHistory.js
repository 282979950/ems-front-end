/* eslint-disable no-undef,no-unused-vars,react/self-closing-comp */
import { Form, Input, Modal ,Table} from 'antd';
import React, { PureComponent } from 'react';
import StandardTable from '../../../components/StandardTable';
import Authorized from '../../../utils/Authorized';

const FormItem = Form.Item;
@Form.create()
class LockAccountHistory extends PureComponent{
  columns = [
    {
      title: '用户编号',
      dataIndex: 'userId',
    },
    {
      title: '锁定状态',
      dataIndex: 'lockStatus',
    },
    {
      title: '解锁/锁定原因',
      dataIndex: 'lockReason',
    },
    {
      title: '解锁/锁定时间',
      dataIndex: 'createTime'
    }
  ];

  handleRemoveModalVisible = () => {
    const { form, handleRemoveModalVisible } = this.props;
    form.resetFields();
    handleRemoveModalVisible();
  };

  render() {
    const { modalVisible,historyData,selectedRows,handleRemoveModalVisible } = this.props;
    return (
      <Modal
        title="历史锁定记录"
        visible={modalVisible}
        width={780}
        footer={null}
        onCancel={this.handleRemoveModalVisible}
      >
        <Table
          dataSource={historyData}
          columns={this.columns}
          rowKey='userId'
          pagination={false}
        />
      </Modal>
    );
  }
};
export default LockAccountHistory;
