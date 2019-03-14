/* eslint-disable no-unused-vars,no-undef,react/jsx-no-duplicate-props */
import { Form, Input, Modal,Card } from 'antd';
import React, { PureComponent } from 'react';

const FormItem = Form.Item;
/*
  *OrderSupplement 应补金额
  * userMoney  充值金额
 */
@Form.create({
  mapPropsToFields(props) {
    const { selectedData, userMoney, flage, OrderSupplement } = props;
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
        value: OrderSupplement
      }),
      flage: Form.createFormField({
        value: flage
      }),
      OrderSupplement: Form.createFormField({
        value: OrderSupplement
      }),
      userChangeName: Form.createFormField({
        value: selectedData.userChangeName
      }),
      userChangePhone: Form.createFormField({
        value: selectedData.userChangePhone
      }),
      userChangeIdcard: Form.createFormField({
        value: selectedData.userChangeIdcard
      }),
      userChangeDeed: Form.createFormField({
        value: selectedData.userChangeDeed
      }),
      tableCode: Form.createFormField({
        value: selectedData.tableCode
      })
    };
  }
})
class UserChangeRemoveForm extends PureComponent{
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
    const { form, handleCleans } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleCleans(fieldsValue);
    });
  };

  handleRemoveModalVisible = () => {
    const { form, handleRemoveModalVisible } = this.props;
    form.resetFields();
    handleRemoveModalVisible(false);
  };

  render() {
    const { modalVisible, form, msg,flage,OrderSupplement ,userMoney} = this.props;
    return (
      <Modal
        title="销户明细"
        visible={modalVisible}
        onOk={this.handleOK}
        onCancel={this.handleRemoveModalVisible}

      >
        <FormItem {...this.formStyle} style={{ display: 'none' }} label="用户ID">
          {form.getFieldDecorator('userId', {})(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="名称" style={{ display: 'none' }}>
          {form.getFieldDecorator('userChangeName', {})(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="电话" style={{ display: 'none' }}>
          {form.getFieldDecorator('userChangePhone', {})(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="身份证号码" style={{ display: 'none' }}>
          {form.getFieldDecorator('userChangeIdcard', {})(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="房产证号码" style={{ display: 'none' }}>
          {form.getFieldDecorator('userChangeDeed', {})(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="燃气表当前止码" style={{ display: 'none' }}>
          {form.getFieldDecorator('tableCode', {})(<Input />)}
        </FormItem>
        <Card style={{ ...this.formStyle }}>
          <p> { msg } </p>
        </Card>
        <FormItem {...this.formStyle} label="" style={{ display: 'none' }}>
          {form.getFieldDecorator('flage', {})(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="" style={{ display: 'none' }}>
          {form.getFieldDecorator('OrderSupplement', {})(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="金额">
          {form.getFieldDecorator('userMoney', {
            rules: [{
              required: true,
              message: '金额不能为空！'
            }],
          })(<Input />)}
        </FormItem>
      </Modal>
    );
  }
}
export default UserChangeRemoveForm;
