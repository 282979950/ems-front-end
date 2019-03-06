import { Form, Input, Modal } from 'antd';
import React  from 'react';

const FormItem = Form.Item;

const DicEditForm = Form.create({
  mapPropsToFields(props) {
    const { selectedData } = props;
    return {
      dictId: Form.createFormField({
        value: selectedData.dictId
      }),
      dictKey: Form.createFormField({
        value: selectedData.dictKey
      }),
      dictValue: Form.createFormField({
        value: selectedData.dictValue
      }),
      dictCategory: Form.createFormField({
        value: selectedData.dictCategory
      }),
      dictSort: Form.createFormField({
        value: selectedData.dictSort
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
      title="字典编辑"
      visible={modalVisible}
      onOk={handleOK}
      onCancel={handleCancel0}
    >
      <FormItem {...formStyle} style={{display: 'none'}} label="字典ID">
        {form.getFieldDecorator('dictId', {})(<Input />)}
      </FormItem>
      <FormItem {...formStyle} label="字典键">
        {form.getFieldDecorator('dictKey', {
          rules: [{
            required: true,
            message: '字典键不能为空！'
          }],
        })(<Input />)}
      </FormItem>
      <FormItem {...formStyle} label="字典值">
        {form.getFieldDecorator('dictValue', {
          rules: [{
            required: true,
            message: '字典值不能为空！'
          }],
        })(<Input />)}
      </FormItem>
      <FormItem {...formStyle} label="字典类型">
        {form.getFieldDecorator('dictCategory', {
          rules: [{
            required: true,
            message: '字典类型不能为空！'
          }],
        })(<Input />)}
      </FormItem>
      <FormItem {...formStyle} label="序号">
        {form.getFieldDecorator('dictSort', {})(<Input />)}
      </FormItem>

    </Modal>
  );
});
export default DicEditForm;
