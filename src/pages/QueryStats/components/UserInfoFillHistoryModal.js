import { Form, Modal ,Table} from 'antd';
import React, { PureComponent } from 'react';

@Form.create()
class UserInfoFillHistoryModal extends PureComponent{
  columns = [
    {
      title: '用户编号',
      dataIndex: 'userId',
    },
    {
      title: '订单类型',
      dataIndex: 'fillGasOrderTypeName',
    },
    {
      title: '历史购气总量',
      dataIndex: 'gasCount'
    },
    {
      title: '历史表止码',
      dataIndex: 'stopCodeCount'
    },
    {
      title: '应补气量',
      dataIndex: 'needFillGas'
    },
    {
      title: '实补气量',
      dataIndex: 'fillGas'
    },
    {
      title: '剩余气量',
      dataIndex: 'leftGas'
    },
    {
      title: '应补金额',
      dataIndex: 'needFillMoney'
    },
    {
      title: '实补金额',
      dataIndex: 'fillMoney'
    },
    {
      title: '剩余金额',
      dataIndex: 'leftMoney'
    },
    {
      title: '订单状态',
      dataIndex: 'fillGasOrderStatusName'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime'
    },
  ];

  render() {
    const { modalVisible, historyData, handleReplaceCardHistoryFormVisible } = this.props;
    console.log(historyData)
    return (
      <Modal
        title="历史变更记录"
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
export default UserInfoFillHistoryModal;
