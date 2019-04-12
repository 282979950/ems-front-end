import {Form,Input,Modal} from 'antd';
import React from 'react';
import DictSelect from '../../System/components/DictSelect';

const FormItem = Form.Item;

const InputCardForm = Form.create({
  mapPropsToFields(props){
    const {selectedData} = props;
    return{
      userId:Form.createFormField({
        value:selectedData.userId
      }),
      cardId:Form.createFormField({
        value:selectedData.cardId
      }),
      oldCardIdentifier:Form.createFormField({
        value:selectedData.oldCardIdentifier
      }),
      cardCost:Form.createFormField({
        value:selectedData.cardCost
      }),
    }
  }
})((props) => {
  const {modalVisible,form,handleCard,handleCancel} = props;
  const formStyle = {
    labelCol :{span:5},
    wrapperCol:{span:15},
  };

  const handleOk = () => {
    form.validateFields((err,fieldsValue) =>{
      if(err)return;
      form.resetFields();
      handleCard(fieldsValue);
    })
  }

  const handleCancel0 = () =>{
    form.resetFields();
    handleCancel();
  }

  return(
    <Modal title="绑定新卡" visible={modalVisible} onOk={handleOk} onCancel={handleCancel0}>
      <FormItem {...formStyle} label='户号'>
        {form.getFieldDecorator('userId',{})(<Input disabled={true}/>)}
      </FormItem>
      <FormItem {...formStyle} label='IC卡号'>
        {form.getFieldDecorator('cardId',{})(<Input disabled={true}/>)}
      </FormItem>
      <FormItem {...formStyle} label='旧IC卡识别号'>
        {form.getFieldDecorator('oldCardIdentifier',{})(<Input disabled={true}/>)}
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
        {form.getFieldDecorator('newCardIdentifier',{
          rules: [{
            required: true,
            message: '新IC卡识别号不能为空！'
          }]
        })(<Input />)}
      </FormItem>
    </Modal>
  )
})
export default InputCardForm;