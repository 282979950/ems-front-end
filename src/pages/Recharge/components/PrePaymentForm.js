import { Form, Input, Modal } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'dva';

const FormItem = Form.Item;

@connect(({ account, loading }) => ({
  account,
  loading: loading.models.account,
}))
@Form.create()
class PrePaymentForm extends PureComponent{
  constructor(props) {
    super(props);
    this.state = {};
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

  getOrderPayment = () => {
    const { form, dispatch } =  this.props;
    const userId = form.getFieldValue("userId");
    const orderGas = form.getFieldValue("orderGas");
    if(orderGas === undefined || orderGas ==="")return;
    const fieldsValue = form.getFieldsValue();
    dispatch({
      type: 'account/getOrderPayment',
      payload: {
        userId,
        orderGas
      },
      callback: (response) => {
        const params = {
          ...fieldsValue,
          orderPayment: response.data,
          orderDetail: response.message
        };
        form.setFieldsValue(params);
      }
    });
  };

  render() {
    const {
      modalVisible,
      form,
      selectedData
    } = this.props;
    const { userId, userName, iccardIdentifier } = selectedData;
    return (
      <Modal
        title="预付费充值"
        visible={modalVisible}
        onOk={this.handleOK}
        onCancel={this.handleCancel}
      >
        <FormItem {...this.formStyle} style={{display: 'none'}} label="户号">
          {form.getFieldDecorator('userId', {
            initialValue: userId
          })(<Input disabled />)}
        </FormItem>
        <FormItem {...this.formStyle} label="用户姓名">
          {form.getFieldDecorator('userName', {
            initialValue: userName,
          })(<Input disabled />)}
        </FormItem>
        <FormItem {...this.formStyle} label="IC卡识别号">
          {form.getFieldDecorator('iccardIdentifier', {
            initialValue: iccardIdentifier,
          })(<Input disabled />)}
        </FormItem>
        <FormItem {...this.formStyle} label="充值气量">
          {form.getFieldDecorator('orderGas', {})(<Input onBlur={this.getOrderPayment} />)}
        </FormItem>
        <FormItem {...this.formStyle} label="充值金额">
          {form.getFieldDecorator('orderPayment', {})(<Input disabled />)}
        </FormItem>
        <FormItem {...this.formStyle} label="订单详情">
          {form.getFieldDecorator('orderDetail', {})(<Input disabled />)}
        </FormItem>
      </Modal>
    );
  }
}
export default PrePaymentForm;
