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
        <FormItem {...this.formStyle} label="表止码">
          {form.getFieldDecorator('meterStopCode', {
            initialValue: 0
          })(<Input />)}
        </FormItem>
      </Modal>
    );
  }
}
export default CreateAccountForm;
