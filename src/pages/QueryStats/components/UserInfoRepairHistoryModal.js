import { Form, Modal ,Table} from 'antd';
import React, { PureComponent } from 'react';

@Form.create()
class UserInfoRepairHistoryModal extends PureComponent{
  columns = [
    {
      title: '用户编号',
      dataIndex: 'userId',
    },
    {
      title: '维修单号',
      dataIndex: 'repairOrderId',
    },
    {
      title: '维修类型',
      dataIndex: 'repairTypeName'
    },
    {
      title: '燃气设备',
      dataIndex: 'gasEquipmentTypeName'
    },
    {
      title: '旧表编号',
      dataIndex: 'oldMeterId'
    },
    {
      title: '旧表止码',
      dataIndex: 'oldMeterStopCode',
    },
    {
      title: '旧安全卡编号',
      dataIndex: 'oldSafetyCode',
    },
    {
      title: '新表编号',
      dataIndex: 'newMeterId'
    },
    {
      title: '新表止码',
      dataIndex: 'newMeterStopCode'
    },
    {
      title: '新安全卡编号',
      dataIndex: 'newSafetyCode'
    },
    {
      title: '维修故障类型',
      dataIndex: 'repairFaultTypeName'
    },
    {
      title: '维修处理结果',
      dataIndex: 'repairResultTypeName'
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
        title="维修记录"
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
export default UserInfoRepairHistoryModal;
