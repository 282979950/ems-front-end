import { Form, Input, InputNumber, Modal, message } from 'antd';
import { connect } from 'dva';
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
  constructor(props) {
    super();

    this.formStyle = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    }
    this.state = {
      confirmLoading: false,
    }
  }

  handleOk = () => {
    const { form, handleEdit } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      var confirmLoading = handleEdit(fieldsValue);
    })
  }

  handleCancel0 = () => {
    const { form, handleCancel } = this.props;
    form.resetFields();
    handleCancel();
  }

  render() {
    const {
      modalVisible,
      form,
      loading,
    } = this.props;
    const fillGasOrderTypeVal = this.props.selectedData.fillGasOrderType;
    const { confirmLoading } = this.state;

    return (
      <Modal
        title='补气补缴'
        visible={modalVisible}
        onOk={this.handleOk}
        onCancel={this.handleCancel0}
      >
        <FormItem {...this.formStyle} label='户号1' >
          {form.getFieldDecorator('userId', {})(<Input disabled={true} />)}
        </FormItem>
        <FormItem {...this.formStyle} label='用户名称' >
          {form.getFieldDecorator('userName', {})(<Input disabled={true} />)}
        </FormItem>
        <FormItem {...this.formStyle} label='用户手机' >
          {form.getFieldDecorator('userPhone', {})(<Input disabled={true} />)}
        </FormItem>
        <FormItem {...this.formStyle} label='用户地址' >
          {form.getFieldDecorator('userAddress', {})(<Input disabled={true} />)}
        </FormItem>
        <FormItem {...this.formStyle} label='维修单编号' >
          {form.getFieldDecorator('repairOrderId', {})(<Input disabled={true} />)}
        </FormItem>
        <FormItem {...this.formStyle} label='历史购气总量' >
          {form.getFieldDecorator('gasCount', {})(<Input disabled={true} />)}
        </FormItem>
        <FormItem {...this.formStyle} label='历史表止码' >
          {form.getFieldDecorator('stopCodeCount', {})(<Input disabled={true} />)}
        </FormItem>
        <FormItem {...this.formStyle} label='应补气量' >
          {form.getFieldDecorator('needFillGas', {})(<Input disabled={true} />)}
        </FormItem>
        <FormItem {...this.formStyle} label='实补气量' >
          {form.getFieldDecorator('fillGas', {})(<Input disabled={true} />)}
        </FormItem>
        <FormItem {...this.formStyle} label='剩余气量' >
          {form.getFieldDecorator('leftGas', {})(<Input disabled={true} />)}
        </FormItem>
        <FormItem {...this.formStyle} label='补气单状态' >
          {form.getFieldDecorator('fillGasOrderStatusName', {})(<Input disabled={true} />)}
        </FormItem>
        {fillGasOrderTypeVal != 1 ? (
          <div>
            <FormItem {...this.formStyle} label='应补金额' >
              {form.getFieldDecorator('needFillMoney', {})(<Input disabled={true} />)}
            </FormItem>
            <FormItem {...this.formStyle} label='实补金额' >
              {form.getFieldDecorator('fillMoney', {
                rules: [{
                  required: true,
                  message: '实补金额不能为空'
                }],
              })(<Input />)}
            </FormItem>
            <FormItem {...this.formStyle} label='剩余金额' >
              {form.getFieldDecorator('leftMoney', {
                rules: [{
                  required: true,
                  message: '剩余金额不能为空'
                }],
              })(<Input />)}
            </FormItem>
            <FormItem {...this.formStyle} label='备注' >
              {form.getFieldDecorator('remarks', {})(<Input />)}
            </FormItem>
          </div>
        ) : null}
      </Modal>
    )
  }
}

export default FillGasEditForm;