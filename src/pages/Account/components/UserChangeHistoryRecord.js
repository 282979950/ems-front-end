/* eslint-disable no-undef,no-unused-vars,react/self-closing-comp */
import { Form, Input, Modal ,Table} from 'antd';
import React, { PureComponent } from 'react';
import StandardTable from '../../../components/StandardTable';
import Authorized from '../../../utils/Authorized';

const FormItem = Form.Item;
@Form.create()
class UserChangeHistoryRecord extends PureComponent{
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
      dataIndex: 'userChangeIdcard',
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
    },{
      title: '过户当前表止码',
      dataIndex: 'tableCode'
    },
    {
      title: '创建时间',
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
        title="变更记录"
        visible={modalVisible}
        width={1300}
        footer={null}
        onCancel={this.handleRemoveModalVisible}
      >
        <Table
          dataSource={historyData}
          columns={this.columns}
          rowKey='userId'
          pagination={false}
          size='small'
        />
      </Modal>
    );
  }
};
export default UserChangeHistoryRecord;
