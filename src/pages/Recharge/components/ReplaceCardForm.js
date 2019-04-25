import { Form, Input, Modal, Button, message } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import DictSelect from '../../System/components/DictSelect';

const FormItem = Form.Item;

@connect(({ account, loading }) => ({
  account,
  loading: loading.models.account,
}))
@Form.create()
class ReplaceCardForm extends PureComponent {
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
    const { form, dispatch } = this.props;
    const userId = form.getFieldValue("userId");
    const orderGas = form.getFieldValue("orderGas");
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

  getCardIdentifier = () => {
    const { getCardIdentifier, form } = this.props;
    const fieldsValue = form.getFieldsValue();
    const result = getCardIdentifier();
    if (result === '读卡失败') {
      message.error(result);
      form.setFieldsValue({
        "nIcCardIdentifier": "",
      });
    } else if (result === '只能使用新卡进行补卡') {
      message.error(result);
      form.setFieldsValue({
        "nIcCardIdentifier": "",
      });
    } else {
      form.setFieldsValue({
        "nIcCardIdentifier": result,
      })
    }
  };

  render() {
    const {
      modalVisible,
      form,
      selectedData
    } = this.props;
    const { userId, iccardId, userName, iccardIdentifier } = selectedData;
    return (
      <Modal
        title="补卡充值"
        visible={modalVisible}
        onOk={this.handleOK}
        onCancel={this.handleCancel}
      >
        <FormItem {...this.formStyle} style={{ display: 'none' }} label="户号">
          {form.getFieldDecorator('userId', {
            initialValue: userId
          })(<Input disabled />)}
        </FormItem>
        <FormItem {...this.formStyle} style={{ display: 'none' }} label="IC卡号">
          {form.getFieldDecorator('iccardId', {
            initialValue: iccardId
          })(<Input disabled />)}
        </FormItem>
        <FormItem {...this.formStyle} label="用户姓名">
          {form.getFieldDecorator('userName', {
            initialValue: userName,
          })(<Input disabled />)}
        </FormItem>
        <FormItem {...this.formStyle} label="旧IC卡识别号">
          {form.getFieldDecorator('iccardIdentifier', {
            initialValue: iccardIdentifier,
          })(<Input disabled />)}
        </FormItem>
        <FormItem {...this.formStyle} label="新IC卡识别号">
          {form.getFieldDecorator('nIcCardIdentifier', {
            rules: [{
              required: true,
              message: 'IC卡识别号不能为空！'
            }],
          })(<Input disabled />)}
          <Button type="primary" onClick={this.getCardIdentifier}>识别IC卡</Button>
        </FormItem>
        <FormItem {...this.formStyle} label="补卡费用">
          {form.getFieldDecorator('cardCost', {
            rules: [{
              required: true,
              message: '补卡费用不能为空！'
            }],
          })(<DictSelect category='card_cost' />)}
        </FormItem>
        <FormItem {...this.formStyle} label="充值气量">
          {form.getFieldDecorator('orderGas', {
            rules: [{
              required: true,
              message: '充值气量不能为空！'
            }],
          })(<Input onBlur={this.getOrderPayment} />)}
        </FormItem>
        <FormItem {...this.formStyle} label="充值金额">
          {form.getFieldDecorator('orderPayment', {
            rules: [{
              required: true,
              message: '充值金额不能为空！'
            }],
          })(<Input disabled />)}
        </FormItem>
        <FormItem {...this.formStyle} label="订单详情">
          {form.getFieldDecorator('orderDetail', {})(<Input disabled />)}
        </FormItem>
      </Modal>
    );
  }
}
export default ReplaceCardForm;
