import { Form, Input, Modal } from 'antd';
import React, { PureComponent } from 'react';

const FormItem = Form.Item;
@Form.create({
  mapPropsToFields(props) {
    const { selectedData } = props;
    return {
      id: Form.createFormField({
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
    };
  }
})
class CouponEditForm extends PureComponent {
  constructor() {
    super();
    this.formStyle = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };
  }

  handleOK = () => {
    const { form, handleEdit } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleEdit(fieldsValue);
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
        title="修改购气劵"
        visible={modalVisible}
        onOk={this.handleOK}
        onCancel={this.handleCancel}
      >
        <FormItem {...this.formStyle} style={{ display: 'none' }} label="编号">
          {form.getFieldDecorator('id', {})(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="优惠券编号">
          {form.getFieldDecorator('couponNumber', {
            rules: [{
              required: true,
              message: '请输入优惠券编号！'
            },{
              max: 10,
              message: '优惠券编号最大支持十位',
            }],
          })(<Input readOnly />)}
        </FormItem>
        <FormItem {...this.formStyle} label="面值(气量)">
          {form.getFieldDecorator('couponGas', {
            rules: [{
              required: true,
              message: '请输入抵扣卷面值（气量）！'
            }],
          })(<Input />)}
        </FormItem>
      </Modal>
    );
  }
}
export default CouponEditForm;
