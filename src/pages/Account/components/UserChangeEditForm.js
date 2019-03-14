/* eslint-disable no-undef,no-unused-vars */
import { Form, Input, Modal } from 'antd';
import React, { PureComponent } from 'react';

const FormItem = Form.Item;
/*
  *OrderSupplement 应补金额暂时屏蔽
  * userMoney  充值金额 暂时屏蔽
 */
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
      userPhone: Form.createFormField({
        value: selectedData.userPhone
      }),
      distName: Form.createFormField({
        value: selectedData.distName
      }),
      userAddress: Form.createFormField({
        value: selectedData.userAddress
      }),
      userIdcard: Form.createFormField({
        value: selectedData.userIdcard
      }),
      userDeed: Form.createFormField({
          value: selectedData.userDeed
      }),
      userTypeName: Form.createFormField({
          value: selectedData.userTypeName
      }),
      userGasTypeName: Form.createFormField({
          value: selectedData.userGasTypeName
      }),
      userStatusName: Form.createFormField({
          value: selectedData.userStatusName
      }),
      userMoney: Form.createFormField({
        value: 0
      }),
      OrderSupplement: Form.createFormField({
        value: 0
      })
    };
  }
})
class UserChangeEditForm extends PureComponent{
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
    const { modalVisible, form, handleEdit, handleCancel } = this.props;
    return (
      <Modal
        title="账户过户"
        visible={modalVisible}
        onOk={this.handleOK}
        onCancel={this.handleCancel}
        width={600}

      >
        <FormItem {...this.formStyle} style={{ display: 'none' }} label="用户ID">
          {form.getFieldDecorator('userId', {})(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} style={{ display: 'none' }}>
          {form.getFieldDecorator('userName', {})(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} style={{ display: 'none' }}>
          {form.getFieldDecorator('userPhone', {})(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} style={{ display: 'none' }}>
          {form.getFieldDecorator('distName', {})(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} style={{ display: 'none' }}>
          {form.getFieldDecorator('userAddress', {})(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} style={{ display: 'none' }}>
          {form.getFieldDecorator('userIdcard', {})(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} style={{ display: 'none' }}>
          {form.getFieldDecorator('userDeed', {})(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} style={{ display: 'none' }}>
          {form.getFieldDecorator('userTypeName', {})(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} style={{ display: 'none' }}>
          {form.getFieldDecorator('userGasTypeName', {})(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} style={{ display: 'none' }}>
          {form.getFieldDecorator('userStatusName', {})(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="名称">
          {form.getFieldDecorator('userChangeName', {
            rules: [{
              required: true,
              message: '名称不能为空！'
            }],
          })(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="电话">
          {form.getFieldDecorator('userChangePhone', {
            rules: [{
              required: true,
              message: '电话不能为空！'
            }],
          })(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="身份证号码">
          {form.getFieldDecorator('userChangeIdcard', {
            rules: [{
              required: true,
              message: '身份证号码不能为空！'
            }],
          })(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="房产证号码">
          {form.getFieldDecorator('userChangeDeed', {
            rules: [{
              required: true,
              message: '房产证号码不能为空！'
            }],
          })(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="燃气表当前止码">
          {form.getFieldDecorator('tableCode', {
            rules: [{
              required: true,
              message: '房产证号码不能为空！'
            }],
          })(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} style={{ display: 'none' }} label="">
          {form.getFieldDecorator('userMoney', {})(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} style={{ display: 'none' }} label="">
          {form.getFieldDecorator('OrderSupplement', {})(<Input />)}
        </FormItem>
      </Modal>
    );
  }
};
export default UserChangeEditForm;
