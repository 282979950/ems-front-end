/* eslint-disable no-undef,no-unused-vars,react/self-closing-comp */
import { Form, Input, Modal, Table } from 'antd';
import React, { PureComponent } from 'react';

const FormItem = Form.Item;

@Form.create()
class RepairOrderCardHistory extends PureComponent {
  columns = [
    {
      title: '序号',
      width:'6%',
      render:(text,record,index)=>`${index+1}`
    },
    {
      title: '用户号',
      dataIndex: 'userId',
      width: '20%',
    },
    {
      title: '卡号',
      dataIndex: 'cardId',
      width: '20%',
    },
    {
      title: '卡识别号',
      dataIndex: 'cardIdentifier',
      width: '20%',
    },
    {
      title: '补卡费用',
      dataIndex: 'cardCost',
      width: '10%',
    },
    {
      title: '补卡日期',
      dataIndex: 'createTime',
      width: '20%',
    },
  ];

  handleRemoveModalVisible = () => {
    const { form, handleRemoveModalVisible } = this.props;
    form.resetFields();
    handleRemoveModalVisible();
  };

  render() {
    const { modalVisible, historyData, selectedRows, handleRemoveModalVisible } = this.props;
    return (
      <Modal
        title="维修单历史补卡记录"
        visible={modalVisible}
        width={950}
        footer={null}
        onCancel={this.handleRemoveModalVisible}
      >
        <Table
          dataSource={historyData}
          columns={this.columns}
          rowKey='userCardId'
          pagination={false}
          bordered
          size='small'
          scroll={{ y: 430 }}
        />
      </Modal>
    );
  }
};
export default RepairOrderCardHistory;
