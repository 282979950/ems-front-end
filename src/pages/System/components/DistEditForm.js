import { Form, Input, Modal } from 'antd';
import React  from 'react';
import DictSelect from './DictSelect';
import DistTreeSelect from './DistTreeSelect';

const FormItem = Form.Item;

const DistEditForm = Form.create({
  mapPropsToFields(props) {
    const { selectedData } = props;
    return {
      distId: Form.createFormField({
        value: selectedData.distId
      }),
      distName: Form.createFormField({
        value: selectedData.distName
      }),
      distCode: Form.createFormField({
        value: selectedData.distCode
      }),
      distCategory: Form.createFormField({
        value: selectedData.distCategory
      }),
      distAddress: Form.createFormField({
        value: selectedData.distAddress
      }),
      distParentId: Form.createFormField({
        value: selectedData.distParentId
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
      title="编辑区域"
      visible={modalVisible}
      onOk={handleOK}
      onCancel={handleCancel0}
    >
      <FormItem {...formStyle} style={{display: 'none'}} label="区域ID">
        {form.getFieldDecorator('distId', {})(<Input />)}
      </FormItem>
      <FormItem {...formStyle} label="区域名称">
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
      <FormItem {...formStyle} label="区域编码">
        {form.getFieldDecorator('distCode', {
          rules: [{
            max: 20,
            message: '区域编码不能超过20个字'
          }],
        })(<Input />)}
      </FormItem>
      <FormItem {...formStyle} label="区域类别">
        {form.getFieldDecorator('distCategory', {
          rules: [{
            required: true,
            message: '区域类别不能为空！'
          }],
        })(<DictSelect category="dist_type" />)}
      </FormItem>
      <FormItem {...formStyle} label="区域地址">
        {form.getFieldDecorator('distAddress', {
          rules: [{
            max: 50,
            message: '区域地址不能超过50个字！'
          }],
        })(<Input />)}
      </FormItem>
      <FormItem {...formStyle} label="父级区域">
        {form.getFieldDecorator('distParentId', {
          rules: [{
            required: true,
            message: '父级区域不能为空！'
          }],
        })(<DistTreeSelect />)}
      </FormItem>
    </Modal>
  );
});
export default DistEditForm;
