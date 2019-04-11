import { Form, Modal ,Table} from 'antd';
import React, { PureComponent } from 'react';

@Form.create()
class UserInfoAddHistoryModal extends PureComponent{
  columns = [
    {
      title: '用户编号',
      dataIndex: 'userId',
    },
    {
      title: '实付金额',
      dataIndex: 'orderPayment',
    },
    {
      title: '充值气量',
      dataIndex: 'orderGas'
    },
    {
      title: '流水号',
      dataIndex: 'flowNumber'
    },
    {
      title: '应付金额',
      dataIndex: 'orderSupplement'
    },
    {
      title: '订单状态',
      dataIndex: 'orderStatusName'
    },
    {
      title: '订单类型',
      dataIndex: 'orderTypeName'
    },
    {
      title: '账务状态',
      dataIndex: 'accountStateName'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime'
    },
  ];

  render() {
    const { modalVisible, historyData, handleReplaceCardHistoryFormVisible } = this.props;
    return (
      <Modal
        title="补气记录"
        visible={modalVisible}
        width={1250}
        footer={null}
        onCancel={() => handleReplaceCardHistoryFormVisible(false)}
      >
        <Table
          dataSource={historyData}
          columns={this.columns}
          rowKey='createTime'
          pagination={false}
        />
      </Modal>
    );
  }
};
export default UserInfoAddHistoryModal;
