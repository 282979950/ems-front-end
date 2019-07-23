import { Form, Input, Modal, Button, message } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'dva';

const FormItem = Form.Item;

@connect(({ account, loading }) => ({
  account,
  loading: loading.models.account,
}))
@Form.create()
class CreateAccountForm extends PureComponent {
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
        title="账户开户"
        visible={modalVisible}
        onOk={this.handleOK}
        onCancel={this.handleCancel}
      >
        <FormItem {...this.formStyle} label="账户编号">
          {form.getFieldDecorator('userId', {
            initialValue: userId
          })(<Input disabled />)}
        </FormItem>
        <FormItem {...this.formStyle} label="账户姓名">
          {form.getFieldDecorator('userName', {
            rules: [{
              required: true,
              message: '账户姓名不能为空！',
            }],
          })(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="手机">
          {form.getFieldDecorator('userPhone', {
            rules: [{
              pattern: /^1[34578]\d{9}$/,
              message: '请输入正确的手机号！',
            }, {
              required: true,
              message: '手机号不能为空！'
            }]
          })(
            <Input />
          )}
        </FormItem>
        <FormItem {...this.formStyle} label="身份证">
          {form.getFieldDecorator('userIdcard', {
            rules: [{
              pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
              message: '请输入正确的份证号！',
            }, {
              required: true,
              message: '身份证不能为空！'
            }],
          })(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="房产证号">
          {form.getFieldDecorator('userDeed', {})(<Input />)}
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
          {form.getFieldDecorator('orderPayment', {})(<Input disabled />)}
        </FormItem>
        <FormItem {...this.formStyle} label="订单详情">
          {form.getFieldDecorator('orderDetail', {})(<Input disabled />)}
        </FormItem>
      </Modal>
    );
  }
}
export default CreateAccountForm;
