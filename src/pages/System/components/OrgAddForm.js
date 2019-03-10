import { Form, Input, Modal } from 'antd';
import React, { PureComponent } from 'react';
import DictSelect from './DictSelect';
import OrgTreeSelect from './OrgTreeSelect';

const FormItem = Form.Item;

@Form.create()
class OrgAddForm extends PureComponent{
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
        title="机构新增"
        visible={modalVisible}
        onOk={this.handleOK}
        onCancel={this.handleCancel}
      >
        <FormItem {...this.formStyle} label="机构名称">
          {form.getFieldDecorator('orgName', {
            rules: [{
              required: true,
              message: '机构名称不能为空！'
            },{
              max: 20,
              message: '机构名称不能超过20个字',
            }],
          })(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="机构代码">
          {form.getFieldDecorator('orgCode', {
            rules: [{
              required: true,
              message: '机构代码不能为空！'
            },{
              max: 20,
              message: '机构代码不能超过20个字'
            }],
          })(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="机构类别">
          {form.getFieldDecorator('orgCategory', {
            rules: [{
              required: true,
              message: '机构类别不能为空！'
            }],
          })(<DictSelect category="org_type" />)}
        </FormItem>
        <FormItem {...this.formStyle} label="父级机构">
          {form.getFieldDecorator('orgParentId', {
            rules: [{
              required: true,
              message: '父级机构不能为空！'
            }],
          })(<OrgTreeSelect />)}
        </FormItem>
      </Modal>
    );
  }
}
export default OrgAddForm;
