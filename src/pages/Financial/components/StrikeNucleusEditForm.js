/* eslint-disable no-undef,no-unused-vars */
import { Form, Input, Modal, Button } from 'antd';
import React, { PureComponent } from 'react';

const FormItem = Form.Item;

@Form.create({
  mapPropsToFields(props) {
    const { selectedData } = props;
    return {
      id: Form.createFormField({
        value: selectedData.id
      }),
      orderId: Form.createFormField({
        value: selectedData.orderId
      }),
      userName: Form.createFormField({
        value: selectedData.userName
      }),
      nucleusGas: Form.createFormField({
        value: selectedData.nucleusGas
      }),
      nucleusPayment: Form.createFormField({
        value: selectedData.nucleusPayment
      }),
      nucleusLaunchingPerson: Form.createFormField({
        value: selectedData.nucleusLaunchingPerson
      }),
      rechargeTime: Form.createFormField({
        value: selectedData.rechargeTime
      }),
      nucleusOpinion: Form.createFormField({
        value: selectedData.nucleusOpinion
      })
    };
  }
})
class StrikeNucleusEditForm extends PureComponent{
  constructor() {
    super();

    this.state = {

    };
    this.formStyle = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };
  }
  /* 审核通过 */

  handleVia = () => {
    const { form, handleEditVia } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleEditVia(fieldsValue);
    });
  };
  /* 审核未通过 */

  handleNotVia = () => {
    const { form, handleEditNotVia } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleEditNotVia(fieldsValue);
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
        title="账务审批"
        visible={modalVisible}
        onCancel={this.handleCancel}
        footer={[
          <Button key="via" icon="check-circle" type="primary" onClick={this.handleVia}>审核通过</Button>,
          <Button key="notvia" onClick={this.handleNotVia}>不通过</Button>,
          <Button key="back" icon="close-circle" onClick={this.handleCancel}>取消</Button>
        ]}
      >
        <FormItem {...this.formStyle} style={{display: 'none'}} label="账务编号">
          {form.getFieldDecorator('id', {})(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="订单编号">
          {form.getFieldDecorator('orderId', {})(<Input disabled />)}
        </FormItem>
        <FormItem {...this.formStyle} label="用户名称">
          {form.getFieldDecorator('userName', {})(<Input disabled />)}
        </FormItem>
        <FormItem {...this.formStyle} label="发起人姓名">
          {form.getFieldDecorator('nucleusLaunchingPerson', {})(<Input disabled />)}
        </FormItem>
        <FormItem {...this.formStyle} label="审核意见">
          {form.getFieldDecorator('nucleusOpinion', {
            rules: [{
              max: 20,
              message: '审核意见不能超过20个字'
            }],
          })(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} style={{display: 'none'}} label="充值气量单位(方)">
          {form.getFieldDecorator('nucleusGas', {})(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} style={{display: 'none'}} label="充值金额">
          {form.getFieldDecorator('nucleusPayment', {})(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} style={{display: 'none'}} label="充值时间">
          {form.getFieldDecorator('rechargeTime', {})(<Input />)}
        </FormItem>
      </Modal>
    );
  }
}
export default StrikeNucleusEditForm;
