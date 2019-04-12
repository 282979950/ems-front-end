import { Form, Input, Modal } from 'antd';
import React from 'react';
import MeterTypeSelect from '../../Account/components/MeterTypeSelect';
import DictSelect from '../../System/components/DictSelect';

const FormItem = Form.Item;

const InputEditForm = Form.create({
  mapPropsToFields(props) {
    const { selectedData } = props;
    return {
      repairOrderId: Form.createFormField({
        value: selectedData.repairOrderId
      }),
      userId: Form.createFormField({
        value: selectedData.userId
      }),
      userName: Form.createFormField({
        value: selectedData.userName
      }),
      userPhone: Form.createFormField({
        value: selectedData.userPhone
      }),
      userAddress: Form.createFormField({
        value: selectedData.userAddress
      }),
      oldMeterStopCode: Form.createFormField({
        value: selectedData.oldMeterStopCode
      }),
      oldSafetyCode: Form.createFormField({
        value: selectedData.oldSafetyCode
      }),
      // newMeterCode: Form.createFormField({
      //   value: selectedData.newMeterCode
      // }),
      // newMeterTypeId: Form.createFormField({
      //   value: selectedData.newMeterTypeId
      // }),
      // newMeterDirection: Form.createFormField({
      //   value: selectedData.newMeterDirection
      // }),
      // newMeterStopCode: Form.createFormField({
      //   value: selectedData.newMeterStopCode
      // }),
    }
  }
})((props) => {
  const { modalVisible, form, handleEdit, handleCancel } = props;
  const formStyle = {
    labelCol: { span: 5 },
    wrapperCol: { span: 15 },
  };

  const handleOk = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleEdit(fieldsValue);
    })
  }

  const handleCancel0 = () => {
    form.resetFields();
    handleCancel();
  }

  return (
    <Modal
      title="编辑区域"
      visible={modalVisible}
      onOk={handleOk}
      onCancel={handleCancel0}
    >
      <FormItem {...formStyle} label='维修单编号'>
        {form.getFieldDecorator('repairOrderId', {})(<Input />)}
      </FormItem>
      <FormItem {...formStyle} label='户号'>
        {form.getFieldDecorator('userId', {})(<Input disabled={true}/>)}
      </FormItem>
      <FormItem {...formStyle} label='用户名称'>
        {form.getFieldDecorator('userName', {})(<Input disabled={true}/>)}
      </FormItem>
      <FormItem {...formStyle} label='用户手机'>
        {form.getFieldDecorator('userPhone', {})(<Input disabled={true}/>)}
      </FormItem>
      <FormItem {...formStyle} label='用户地址'>
        {form.getFieldDecorator('userAddress', {})(<Input disabled={true}/>)}
      </FormItem>
      <FormItem {...formStyle} label='旧表止码'>
        {form.getFieldDecorator('oldMeterStopCode', {})(<Input />)}
      </FormItem>
      <FormItem {...formStyle} label='旧安全卡编码'>
        {form.getFieldDecorator('oldSafetyCode', {})(<Input disabled={true} />)}
      </FormItem>
      <FormItem {...formStyle} label='新表编码'>
        {form.getFieldDecorator('newMeterCode', {})(<Input />)}
      </FormItem>
      <FormItem {...formStyle} label="新表类型">
        {form.getFieldDecorator('newMeterTypeId')
        (<MeterTypeSelect disabled={true} style={{ "width": "100%" }} />)}
      </FormItem>
      <FormItem {...formStyle} label="新表表向">
        {form.getFieldDecorator('newMeterDirection')
        (<DictSelect category="meter_direction" disabled={true} />)}
      </FormItem>
      <FormItem {...formStyle} label='新表止码'>
        {form.getFieldDecorator('newMeterStopCode', {})(<Input />)}
      </FormItem>
    </Modal>
  )
})

export default InputEditForm;