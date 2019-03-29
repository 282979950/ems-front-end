import { Form, Modal ,Table} from 'antd';
import React, { PureComponent } from 'react';

@Form.create()
class ReplaceCardHistoryForm extends PureComponent{
  columns = [
    {
      title: '户号',
      dataIndex: 'userId',
    },
    {
      title: 'IC卡识别号',
      dataIndex: 'iccardIdentifier',
    },
    {
      title: '补卡工本费',
      dataIndex: 'castCost'
    },
    {
      title: '充值气量',
      dataIndex: 'orderGas'
    },
    {
      title: '充值金额',
      dataIndex: 'orderPayment'
    },
    {
      title: '换卡时间',
      dataIndex: 'createTime'
    },
  ];

  render() {
    const { modalVisible, historyData, handleReplaceCardHistoryFormVisible } = this.props;
    return (
      <Modal
        title="补卡历史记录"
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
export default ReplaceCardHistoryForm;
