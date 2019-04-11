import { Form, Modal ,Table} from 'antd';
import React, { PureComponent } from 'react';

@Form.create()
class UserInfoCardHistoryModal extends PureComponent{
  columns = [
    {
      title: '用户编号',
      dataIndex: 'userId',
    },
    {
      title: 'IC卡卡号',
      dataIndex: 'cardId',
    },
    {
      title: 'IC卡识别号',
      dataIndex: 'cardIdentifier'
    },
    {
      title: '补卡工本费用',
      dataIndex: 'cardCost'
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
        title="IC卡相关信息"
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
export default UserInfoCardHistoryModal;
