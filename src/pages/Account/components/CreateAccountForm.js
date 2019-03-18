import { Form, Input, Modal, Button } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'dva';

const FormItem = Form.Item;

@connect(({ account, loading }) => ({
  account,
  loading: loading.models.account,
}))
@Form.create()
class CreateAccountForm extends PureComponent{
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
      form.setFieldsValue({
        ...fieldsValue,
        iccardIdentifier: "读卡失败，请检查读卡设备和卡片是否正常！",
      });
    } else if (result === '只能使用新卡进行开户！') {
      form.setFieldsValue({
        ...fieldsValue,
        iccardIdentifier: result,
      });
    } else {
      form.setFieldsValue({
        ...fieldsValue,
        iccardIdentifier: result,
      });
    }
  };

  getOrderPayment = () => {
    const { form, dispatch } =  this.props;
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
          orderPayment: response.data
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
              required: true,
              message: '手机不能为空！',
            }]
          })(
            <Input />
          )}
        </FormItem>
        <FormItem {...this.formStyle} label="身份证">
          {form.getFieldDecorator('userIdcard', {
            rules: [{
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
          {form.getFieldDecorator('orderGas', {})(<Input onBlur={this.getOrderPayment} />)}
        </FormItem>
        <FormItem {...this.formStyle} label="充值金额">
          {form.getFieldDecorator('orderPayment', {})(<Input disabled />)}
        </FormItem>
      </Modal>
    );
  }
}
export default CreateAccountForm;
