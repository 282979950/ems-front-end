import { Form, Input, Modal } from 'antd';
import React, { PureComponent } from 'react';

const FormItem = Form.Item;
@Form.create()
class DicAddForm extends PureComponent{
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
    const { modalVisible, form} = this.props;
    return (
      <Modal
        title="字典新增"
        visible={modalVisible}
        onOk={this.handleOK}
        onCancel={this.handleCancel}
      >
        <FormItem {...this.formStyle} label="字典键">
          {form.getFieldDecorator('dictKey', {
            rules: [{
              required: true,
              message: '字典键不能为空！'
            },{
              max: 20,
              message: '字典键不能超过20个字',
            }],
          })(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="字典值">
          {form.getFieldDecorator('dictValue', {
            rules: [{
              required: true,
              message: '字典值不能为空！'
            },{
              max: 20,
              message: '字典值不能超过20个字'
            }],
          })(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="字典类型">
          {form.getFieldDecorator('dictCategory', {
            rules: [{
              required: true,
              message: '字典类型不能为空！'
            }],
          })(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="序号">
          {form.getFieldDecorator('dictSort', {

          })(<Input />)}
        </FormItem>
      </Modal>
    );
  }
}
export default DicAddForm;
