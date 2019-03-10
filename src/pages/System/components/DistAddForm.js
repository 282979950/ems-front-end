import { Form, Input, Modal } from 'antd';
import React, { PureComponent } from 'react';
import DictSelect from './DictSelect';
import DistTreeSelect from './DistTreeSelect';

const FormItem = Form.Item;

@Form.create()
class DistAddForm extends PureComponent{
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
        title="新建区域"
        visible={modalVisible}
        onOk={this.handleOK}
        onCancel={this.handleCancel}
      >
        <FormItem {...this.formStyle} label="区域名称">
          {form.getFieldDecorator('distName', {
            rules: [{
              required: true,
              message: '区域名称不能为空！',
            }, {
              max: 20,
              message: '区域名称不能超过20个字',
            }],
          })(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="区域编码">
          {form.getFieldDecorator('distCode', {
            rules: [{
              max: 20,
              message: '区域编码不能超过20个字'
            }],
          })(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="区域类别">
          {form.getFieldDecorator('distCategory', {
            rules: [{
              required: true,
              message: '区域类别不能为空！'
            }],
          })(<DictSelect category="dist_type" />)}
        </FormItem>
        <FormItem {...this.formStyle} label="区域地址">
          {form.getFieldDecorator('distAddress', {
            rules: [{
              max: 50,
              message: '区域地址不能超过50个字！'
            }],
          })(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="父级区域">
          {form.getFieldDecorator('distParentId', {
            rules: [{
              required: true,
              message: '父级区域不能为空！'
            }],
          })(<DistTreeSelect />)}
        </FormItem>
      </Modal>
    );
  }
}
export default DistAddForm;
