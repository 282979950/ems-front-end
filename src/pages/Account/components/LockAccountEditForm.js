/* eslint-disable no-undef,no-unused-vars */
import { Form, Input, Modal } from 'antd';
import React, { PureComponent } from 'react';

const FormItem = Form.Item;
@Form.create({
  mapPropsToFields(props) {
    const { selectedData } = props;
    return {
      userId: Form.createFormField({
        value: selectedData.userId
      }),
      userName: Form.createFormField({
        value: selectedData.userName
      }),
      iccardId: Form.createFormField({
        value: selectedData.iccardId
      }),
      distName: Form.createFormField({
        value: selectedData.distName
      }),
      userAddress: Form.createFormField({
        value: selectedData.userAddress
      }),
      lockStatus: Form.createFormField({
        value: selectedData.lockStatus
      }),
      lastLockReason: Form.createFormField({
        value: selectedData.lastLockReason
      }),
      lockReason: Form.createFormField({
        value: selectedData.lockReason
      }),
      isLock: Form.createFormField({
        value: selectedData.isLock
      })
    };
  }
})
class LockAccountEditForm extends PureComponent{
  constructor() {
    super();
    this.state = {

    };
    this.formStyle = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };
  }

  handleOK = () => {
    const { form, handleEdit } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleEdit(fieldsValue);
    });
  };

  handleCancel = () => {
    const { form, handleCancel } = this.props;
    form.resetFields();
    handleCancel();
  };

  render() {
    const { modalVisible, form, handleEdit, handleCancel,selectedData } = this.props;
    return (
      <Modal
        title="账户锁定/解锁"
        visible={modalVisible}
        onOk={this.handleOK}
        onCancel={this.handleCancel}
        okText={selectedData.isLock?'解锁':'锁定'}
      >
        <FormItem {...this.formStyle} style={{ display: 'none' }} label="IC卡号">
          {form.getFieldDecorator('userId', {})(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="客户姓名">
          {form.getFieldDecorator('userName', {})(<Input disabled />)}
        </FormItem>
        <FormItem {...this.formStyle} label="IC卡号">
          {form.getFieldDecorator('iccardId', {})(<Input disabled />)}
        </FormItem>
        <FormItem {...this.formStyle} label="区域名称">
          {form.getFieldDecorator('distName', {})(<Input disabled />)}
        </FormItem>
        <FormItem {...this.formStyle} label="用户地址">
          {form.getFieldDecorator('userAddress', {})(<Input disabled />)}
        </FormItem>
        <FormItem {...this.formStyle} label="锁定状态">
          {form.getFieldDecorator('lockStatus', {})(<Input disabled />)}
        </FormItem>
        <FormItem {...this.formStyle} label="上次操作原因">
          {form.getFieldDecorator('lastLockReason', {})(<Input disabled />)}
        </FormItem>
        <FormItem {...this.formStyle} label="本次操作原因">
          {form.getFieldDecorator('lockReason', {
            rules: [{
              required: true,
              message: '本次操作原因不能为空！'
            }],
          })(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} style={{ display: 'none' }} label="标记">
          {form.getFieldDecorator('isLock', {})(<Input />)}
        </FormItem>
      </Modal>
    );
  }
};
export default LockAccountEditForm;
