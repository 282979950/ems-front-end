import { Form, Input, message, Modal, Radio } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'dva';

const FormItem = Form.Item;

@connect(({ coupon, account, loading }) => ({
  coupon,
  account,
  loading: loading.models.account,
}))
@Form.create()
class MessageMeterPaymentForm extends PureComponent{
  constructor(props) {
    super(props);
    this.formStyle = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };
  }

  handleOK = () => {
    const { form, handleOK } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleOK(fieldsValue);
    });
  };

  handleCancel = () => {
    const { form, handleCancel } = this.props;
    form.resetFields();
    handleCancel();
  };

  render() {
    const {
      modalVisible,
      form,
      selectedData
    } = this.props;
    const { userId, userName, userTypeName } = selectedData;
    return (
      <Modal
        title="短信表充值"
        visible={modalVisible}
        onOk={this.handleOK}
        onCancel={this.handleCancel}
      >
        <FormItem {...this.formStyle} label="IC卡号">
          {form.getFieldDecorator('userId', {
            initialValue: userId
          })(<Input readOnly />)}
        </FormItem>
        <FormItem {...this.formStyle} label="用户姓名">
          {form.getFieldDecorator('userName', {
            initialValue: userName,
          })(<Input readOnly />)}
        </FormItem>
        <FormItem {...this.formStyle} label="用户类型">
          {form.getFieldDecorator('userTypeName', {
            initialValue: userTypeName
          })(<Input readOnly />)}
        </FormItem>
        <FormItem {...this.formStyle} label="充值金额">
          {form.getFieldDecorator('orderPayment', {
            rules: [{
              required: true,
              message: '充值金额不能为空!'
            }],
          })(<Input />)}
        </FormItem>
      </Modal>
    );
  }
}
export default MessageMeterPaymentForm;
