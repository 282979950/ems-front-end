/* eslint-disable no-undef,no-unused-vars */
import { Form, Input, Modal } from 'antd';
import React, { PureComponent } from 'react';

const FormItem = Form.Item;
@Form.create({
  mapPropsToFields(props) {
    const { selectedData } = props;
    return {id: Form.createFormField({
        value: selectedData.id
      }),
      couponNumber: Form.createFormField({
        value: selectedData.couponNumber
      }),
      couponGas: Form.createFormField({
        value: selectedData.couponGas
      }),
      couponStatusName: Form.createFormField({
        value: selectedData.couponStatusName
      }),
      couponStatus: Form.createFormField({
        value: selectedData.couponStatus
      }),
      createName: Form.createFormField({
        value: selectedData.createName
      }),
      createTime: Form.createFormField({
        value: selectedData.createTime
      }),
    };
  }
})
class CouponProcessingForm extends PureComponent{
  constructor() {
    super();
    this.state = {

    };
    this.formStyle = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };
  }

  handleOK = () => {
    const { form, Processing } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      Processing(fieldsValue);
    });
  };

  handleCancel = () => {
    const { form, handleCancel } = this.props;
    form.resetFields();
    handleCancel();
  };

  render() {
    const { modalVisible, form, Processing, handleCancel,selectedData } = this.props;
    return (
      <Modal
        title="购气劵处理"
        visible={modalVisible}
        onOk={this.handleOK}
        onCancel={this.handleCancel}
        okText={selectedData.couponStatus===1?'回收':'开放'}
      >
        <FormItem {...this.formStyle} style={{ display: 'none' }} label="编号">
          {form.getFieldDecorator('id', {})(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} style={{ display: 'none' }} label="状态">
          {form.getFieldDecorator('couponStatus', {})(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="优惠券编号">
          {form.getFieldDecorator('couponNumber', {})(<Input readOnly />)}
        </FormItem>
        <FormItem {...this.formStyle} label="面值(气量)">
          {form.getFieldDecorator('couponGas', {})(<Input readOnly />)}
        </FormItem>
        <FormItem {...this.formStyle} label="创建人姓名">
          {form.getFieldDecorator('createName', {})(<Input readOnly />)}
        </FormItem>
        <FormItem {...this.formStyle} label="创建日期">
          {form.getFieldDecorator('createTime', {})(<Input readOnly />)}
        </FormItem>
      </Modal>
    );
  }
};
export default CouponProcessingForm;
