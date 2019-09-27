import { Form, Input, Modal } from 'antd';
import React, { PureComponent } from 'react';

const FormItem = Form.Item;

@Form.create({
  mapPropsToFields(props) {
    const { selectedData } = props;
    return {
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
      repairOrderId: Form.createFormField({
        value: selectedData.repairOrderId
      }),
      gasCount: Form.createFormField({
        value: selectedData.gasCount
      }),
      stopCodeCount: Form.createFormField({
        value: selectedData.stopCodeCount
      }),
      needFillGas: Form.createFormField({
        value: selectedData.needFillGas
      }),
      fillGas: Form.createFormField({
        value: selectedData.fillGas
      }),
      leftGas: Form.createFormField({
        value: selectedData.leftGas
      }),
      fillGasOrderStatusName: Form.createFormField({
        value: selectedData.fillGasOrderStatusName
      }),
      needFillMoney: Form.createFormField({
        value: selectedData.needFillMoney
      }),
      fillMoney: Form.createFormField({
        value: selectedData.fillMoney
      }),
      leftMoney: Form.createFormField({
        value: selectedData.leftMoney
      }),
      remarks: Form.createFormField({
        value: selectedData.remarks
      }),
    }
  }
})

class FillGasEditForm extends PureComponent {
  constructor() {
    super();

    this.formStyle = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };
  }

  handleOk = () => {
    const { form, handleEdit } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleEdit(fieldsValue);
    })
  };

  handleCancel0 = () => {
    const { form, handleCancel } = this.props;
    form.resetFields();
    handleCancel();
  };

  render() {
    const {
      modalVisible,
      form,
      selectedData : { fillGasOrderType }
    } = this.props;

    return (
      <Modal
        title='补气补缴'
        visible={modalVisible}
        onOk={this.handleOk}
        onCancel={this.handleCancel0}
      >
        <div style={{ overflow:"scroll", height:"400px", overflowX:'hidden' }}>
          <FormItem {...this.formStyle} label='IC卡号'>
            {form.getFieldDecorator('userId', {})(<Input readOnly />)}
          </FormItem>
          <FormItem {...this.formStyle} label='用户名称'>
            {form.getFieldDecorator('userName', {})(<Input readOnly />)}
          </FormItem>
          <FormItem {...this.formStyle} label='用户手机'>
            {form.getFieldDecorator('userPhone', {})(<Input readOnly />)}
          </FormItem>
          <FormItem {...this.formStyle} label='用户地址'>
            {form.getFieldDecorator('userAddress', {})(<Input readOnly />)}
          </FormItem>
          <FormItem {...this.formStyle} label='维修单编号'>
            {form.getFieldDecorator('repairOrderId', {})(<Input readOnly />)}
          </FormItem>
          <FormItem {...this.formStyle} label='历史购气总量'>
            {form.getFieldDecorator('gasCount', {})(<Input readOnly />)}
          </FormItem>
          <FormItem {...this.formStyle} label='历史表止码'>
            {form.getFieldDecorator('stopCodeCount', {})(<Input readOnly />)}
          </FormItem>
          <FormItem {...this.formStyle} label='应补气量'>
            {form.getFieldDecorator('needFillGas', {})(<Input readOnly />)}
          </FormItem>
          <FormItem {...this.formStyle} label='实补气量'>
            {form.getFieldDecorator('fillGas', {})(<Input readOnly />)}
          </FormItem>
          <FormItem {...this.formStyle} label='剩余气量'>
            {form.getFieldDecorator('leftGas', {})(<Input readOnly />)}
          </FormItem>
          {fillGasOrderType !== 1 ? (
            <div>
              <FormItem {...this.formStyle} label='应补金额'>
                {form.getFieldDecorator('needFillMoney', {})(<Input readOnly />)}
              </FormItem>
              <FormItem {...this.formStyle} label='实补金额'>
                {form.getFieldDecorator('fillMoney', {
                rules: [{
                  required: true,
                  message: '实补金额不能为空'
                }],
              })(<Input />)}
              </FormItem>
              <FormItem {...this.formStyle} label='备注'>
                {form.getFieldDecorator('remarks', {})(<Input />)}
              </FormItem>
            </div>
        ) : null}
        </div>
      </Modal>
    )
  }
}

export default FillGasEditForm;
