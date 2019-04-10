import { Form, Modal ,Table} from 'antd';
import React, { PureComponent } from 'react';

@Form.create()
class UserInfoModifyHistoryModal extends PureComponent{
  columns = [
    {
      title: '用户名称',
      dataIndex: 'userChangeName',
    },
    {
      title: '用户电话',
      dataIndex: 'userChangePhone',
    },
    {
      title: '用户身份证号码',
      dataIndex: 'userChangeIdcard'
    },
    {
      title: '用户房产证号码',
      dataIndex: 'userChangeDeed'
    },
    {
      title: '旧用户名称',
      dataIndex: 'userOldName'
    },
    {
      title: '旧用户电话',
      dataIndex: 'userOldPhone'
    },
    {
      title: '旧用户身份证号码',
      dataIndex: 'userOldIdcard'
    },
    {
      title: '旧用户房产证号码',
      dataIndex: 'userOldDeed'
    },
  ];

  render() {
    const { modalVisible, historyData, handleReplaceCardHistoryFormVisible } = this.props;
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
export default UserInfoModifyHistoryModal;
