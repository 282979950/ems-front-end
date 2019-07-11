import { Form, Input, Modal } from 'antd';
import React, { PureComponent } from 'react';
import EmpSelect from './EmpSelect'

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
        title="分配"
        visible={modalVisible}
        onOk={this.handleOK}
        onCancel={this.handleCancel}
      >
        <FormItem {...this.formStyle} label="发票代码">
          {form.getFieldDecorator('invoiceCode', {
            rules: [{
              required: true,
              message: '请填写发票代码！',
            }],
          })(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="发票起始号码">
          {form.getFieldDecorator('sInvoiceNumber', {
            rules: [{
              required: true,
              message: '请填写发票起始号码！',
            }],
          })(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="发票终止号码">
          {form.getFieldDecorator('eInvoiceNumber', {
            rules: [{
              required: true,
              message: '请填写发票终止号码！',
            }],
          })(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="所属员工">
          {form.getFieldDecorator('empId', {
            rules: [{
              required: true,
              message: '请填写所属员工！'
            }],
          })(<EmpSelect />)}
        </FormItem>
      </Modal>
    );
  }
}
export default InvoiceAddForm;
