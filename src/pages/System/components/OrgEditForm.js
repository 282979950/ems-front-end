import { Form, Input, Modal } from 'antd';
import React  from 'react';
import DictSelect from './DictSelect';
import OrgTreeSelect from './OrgTreeSelect';

const FormItem = Form.Item;

const OrgEditForm = Form.create({
  mapPropsToFields(props) {
    const { selectedData } = props;
    return {
      orgId: Form.createFormField({
        value: selectedData.orgId
      }),
      orgName: Form.createFormField({
        value: selectedData.orgName
      }),
      orgCode: Form.createFormField({
        value: selectedData.orgCode
      }),
      orgCategory: Form.createFormField({
        value: selectedData.orgCategory
      }),
      orgParentId: Form.createFormField({
        value: selectedData.orgParentId
      }),
    };
  }
})((props) => {
  const { modalVisible, form, handleEdit, handleCancel } = props;
  const formStyle = {
    labelCol: { span: 5 },
    wrapperCol: { span: 15 },
  };

  const handleOK = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleEdit(fieldsValue);
    });
  };

  const handleCancel0 = () => {
    form.resetFields();
    handleCancel();
  };

  return(
    <Modal
      title="机构编辑"
      visible={modalVisible}
      onOk={handleOK}
      onCancel={handleCancel0}
    >
      <FormItem {...formStyle} style={{display: 'none'}} label="机构ID">
        {form.getFieldDecorator('orgId', {})(<Input />)}
      </FormItem>
      <FormItem {...formStyle} label="机构名称">
        {form.getFieldDecorator('orgName', {
          rules: [{
            max: 20,
            message: '机构名称不能超过20个字',
          }],
        })(<Input />)}
      </FormItem>
      <FormItem {...formStyle} label="机构代码">
        {form.getFieldDecorator('orgCode', {
          rules: [{
            max: 20,
            message: '机构代码不能超过20个字'
          }],
        })(<Input />)}
      </FormItem>
      <FormItem {...formStyle} label="机构类别">
        {form.getFieldDecorator('orgCategory', {
          rules: [{
            required: true,
            message: '机构类别不能为空！'
          }],
        })(<DictSelect category="org_type" />)}
      </FormItem>
      <FormItem {...formStyle} label="父级机构">
        {form.getFieldDecorator('orgParentId', {
          rules: [{
            required: true,
            message: '父级机构不能为空！'
          }],
        })(<OrgTreeSelect />)}
      </FormItem>
    </Modal>
  );
});
export default OrgEditForm;
