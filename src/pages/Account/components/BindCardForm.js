import { Form, Input, Modal, Button, message } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'dva';

const FormItem = Form.Item;

@connect(({ account, loading }) => ({
  account,
  loading: loading.models.account,
}))
@Form.create()
class BindCardForm extends PureComponent {
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

  getCardIdentifier = () => {
    const { getCardIdentifier, form } = this.props;
    const fieldsValue = form.getFieldsValue();
    const result = getCardIdentifier();

    if (result === '读卡失败') {
      message.error("读卡失败，请检查读卡设备和卡片是否正常！");
      form.setFieldsValue({
        "iccardIdentifier": "",
      });
    } else if (result === '只能使用新卡进行开户') {
      message.error(result);
      form.setFieldsValue({
        "iccardIdentifier": "",
      });
    } else {
      form.setFieldsValue({
        ...fieldsValue,
        iccardIdentifier: result,
      });
    }
  };

  getOrderPayment = () => {
    const { form, dispatch } = this.props;
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
    const { userId } = selectedData;

    return (
      <Modal
        title="发卡"
        visible={modalVisible}
        onOk={this.handleOK}
        onCancel={this.handleCancel}
      >
        <FormItem {...this.formStyle} label="账户编号">
          {form.getFieldDecorator('userId', {
            initialValue: userId
          })(<Input disabled />)}
        </FormItem>
        <FormItem {...this.formStyle} style={{display: 'none'}} label="用户类型">
          {form.getFieldDecorator('userType', {
            initialValue: selectedData.userType?selectedData.userType:''
          })(<Input disabled />)}
        </FormItem>
        <FormItem {...this.formStyle} label="IC卡识别号">
          {form.getFieldDecorator('iccardIdentifier', {
            rules: [{
              required: true,
              message: 'IC卡识别号不能为空！'
            }],
          })(<Input disabled />)}
          <Button type="primary" onClick={this.getCardIdentifier}>识别IC卡</Button>
        </FormItem>
        <FormItem {...this.formStyle} label="充值气量">
          {form.getFieldDecorator('orderGas', {
            rules: [{
              pattern: /^[1-9]\d*$/,
              message: '充值气量不能小于等于0！',
            }],
          })(<Input onBlur={this.getOrderPayment} />)}
        </FormItem>
        <FormItem {...this.formStyle} label="充值金额">
          {form.getFieldDecorator('orderPayment', {})(<Input readOnly />)}
        </FormItem>
        <FormItem {...this.formStyle} label="订单详情">
          {form.getFieldDecorator('orderDetail', {})(<Input readOnly />)}
        </FormItem>
      </Modal>
    );
  }
}
export default BindCardForm;
