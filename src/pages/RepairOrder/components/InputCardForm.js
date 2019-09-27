import { Form, Input, Modal, Button, message } from 'antd';
import React from 'react';
import DictSelect from '../../System/components/DictSelect';
import OCX from '../../../components/OCX';

const FormItem = Form.Item;

const InputCardForm = Form.create({
  mapPropsToFields(props) {
    const { selectedData } = props;
    return {
      userId: Form.createFormField({
        value: selectedData.userId
      }),
      cardId: Form.createFormField({
        value: selectedData.cardId
      }),
      oldCardIdentifier: Form.createFormField({
        value: selectedData.oldCardIdentifier
      }),
      cardCost: Form.createFormField({
        value: selectedData.cardCost
      }),
      userCardId: Form.createFormField({
        value: selectedData.userCardId
      }),
    }
  }
})((props) => {
  const { modalVisible, form, handleCard, handleCancel } = props;
  const formStyle = {
    labelCol: { span: 5 },
    wrapperCol: { span: 15 },
  };

  const handleOk = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleCard(fieldsValue, form);
    })
  };

  const handleCancel0 = () => {
    form.resetFields();
    handleCancel();
  };

  const getCardIdentifier = () => {
    const result = OCX.readCard();
    if (result[0] !== 'S') {
      message.error("读卡失败");
      form.setFieldsValue({
        "newCardIdentifier": "",
      });
      return;
    }
    if (result[1] !== '0') {
      message.error("只能使用新卡进行开户");
      form.setFieldsValue({
        "newCardIdentifier": "",
      });
      return;
    }
    form.setFieldsValue({
      "newCardIdentifier": result[2],
    })
  };

  return (
    <Modal title="绑定新卡" visible={modalVisible} onOk={handleOk} onCancel={handleCancel0}>
      <FormItem {...formStyle} label='userCardId' style={{ 'display': 'none' }}>
        {form.getFieldDecorator('userCardId', {})(<Input disabled />)}
      </FormItem>
      <FormItem {...formStyle} label='IC卡号'>
        {form.getFieldDecorator('userId', {})(<Input disabled />)}
      </FormItem>
      <FormItem {...formStyle} label='IC卡号'>
        {form.getFieldDecorator('cardId', {})(<Input disabled />)}
      </FormItem>
      <FormItem {...formStyle} label='旧IC卡识别号'>
        {form.getFieldDecorator('oldCardIdentifier', {})(<Input disabled />)}
      </FormItem>
      <FormItem {...formStyle} label="补卡费用">
        {form.getFieldDecorator('cardCost', {
          rules: [{
            required: true,
            message: '补卡费用不能为空！'
          }],
        })(<DictSelect category='card_cost' />)}
      </FormItem>
      <FormItem {...formStyle} label='新IC卡识别号'>
        {form.getFieldDecorator('newCardIdentifier', {
          rules: [{
            required: true,
            message: '新IC卡识别号不能为空！'
          }]
        })(<Input disabled />)}
        <Button type="primary" onClick={getCardIdentifier}>识别IC卡</Button>
      </FormItem>
      <OCX />
    </Modal>
  )
})
export default InputCardForm;
