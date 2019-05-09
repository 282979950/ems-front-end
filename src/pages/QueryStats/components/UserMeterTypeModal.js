/* eslint-disable no-undef,no-unused-vars,react/no-unused-state */
import { Form, Input, Modal } from 'antd';
import React, { PureComponent } from 'react';

const FormItem = Form.Item;

@Form.create({
  mapPropsToFields(props) {
    const { selectedData } = props;
    return {
      userId: Form.createFormField({
        value: selectedData[0].userId,
      }),
      userName: Form.createFormField({
        value: selectedData[0].userName,
      }),
      userPhone: Form.createFormField({
        value: selectedData[0].userPhone,
      }),
      userIdcard: Form.createFormField({
        value: selectedData[0].userIdcard,
      }),
      userAddress: Form.createFormField({
        value: selectedData[0].userAddress,
      }),
      userLocked: Form.createFormField({
        value: selectedData[0].userLocked,
      }),
      meterCategory: Form.createFormField({
        value: selectedData[0].meterCategory,
      }),
      meterType: Form.createFormField({
        value: selectedData[0].meterType,
      }),
    };
  },
})
class UserMeterTypeModal extends PureComponent {
  constructor() {
    super();
    this.state = {
      selectedItems: [],
      isOpen: false,
    };
    this.formStyle = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };
  }

  render() {
    const { modalVisible, form, handleReplaceCardHistoryFormVisible } = this.props;
    return (
      <Modal
        title="表具信息"
        visible={modalVisible}
        footer={null}
        onCancel={() => handleReplaceCardHistoryFormVisible(false)}
      >
        <FormItem {...this.formStyle} style={{ display: 'none' }} label="ID">
          {form.getFieldDecorator('userId', {})(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="用户名称">
          {form.getFieldDecorator('userName', {})(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="用户电话">
          {form.getFieldDecorator('userPhone', {})(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="身份证号">
          {form.getFieldDecorator('userIdcard', {})(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="用户住址">
          {form.getFieldDecorator('userAddress', {})(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="表具类别">
          {form.getFieldDecorator('meterCategory', {})(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="表具型号">
          {form.getFieldDecorator('meterType', {})(<Input />)}
        </FormItem>
      </Modal>
    );
  }
};
export default UserMeterTypeModal;
