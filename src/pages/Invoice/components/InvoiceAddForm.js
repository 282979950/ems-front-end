import { Form, Input, Modal } from 'antd';
import React, { PureComponent } from 'react';

const FormItem = Form.Item;

@Form.create()
class InvoiceAddForm extends PureComponent{
  constructor(props) {
    super(props);

    this.state = {

    };
    this.formStyle = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };
  }

  handleOK = () => {
    const { form, handleAdd } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  handleCancel = () => {
    const { form, handleCancel } = this.props;
    form.resetFields();
    handleCancel();
  };

  render() {
    const { modalVisible, form } = this.props;
    return (
      <Modal
        title="新增"
        visible={modalVisible}
        onOk={this.handleOK}
        onCancel={this.handleCancel}
      >
        <FormItem {...this.formStyle} label="发票代码">
          {form.getFieldDecorator('invoiceCode', {
            rules: [{
              required: true,
              message: '不能为空！',
            }],
          })(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="发票起始号码">
          {form.getFieldDecorator('sInvoiceNumber', {
            rules: [{
              required: true,
              message: '不能为空！',
            },{
              pattern: /^\d{8}$/,
              message: '只能为8位数字'
            }],
          })(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="发票终止号码">
          {form.getFieldDecorator('eInvoiceNumber', {
            rules: [{
              required: true,
              message: '不能为空！',
            },{
              pattern: /^\d{8}$/,
              message: '只能为8位数字'
            }],
          })(<Input />)}
        </FormItem>
      </Modal>
    );
  }
}
export default InvoiceAddForm;
