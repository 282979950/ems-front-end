import { Form, Input, Modal } from 'antd';
import React, { PureComponent } from 'react';

const FormItem = Form.Item;
@Form.create()
class DicAddForm extends PureComponent{
  constructor(props) {
    super(props);

    this.state = {

    };
    this.formStyle = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };
  }

  handleOK = () => {
    const { form, handleAdd } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  handleCancel = () => {
    const { form, handleCancel } = this.props;
    form.resetFields();
    handleCancel();
  };



  render() {
    const { modalVisible, form} = this.props;
    return (
      <Modal
        title="创建购气劵"
        visible={modalVisible}
        onOk={this.handleOK}
        onCancel={this.handleCancel}
      >
        <FormItem {...this.formStyle} label="优惠券编号">
          {form.getFieldDecorator('couponNumber', {
            rules: [{
              required: true,
              message: '请输入优惠券编号！'
            },{
              max: 10,
              message: '优惠券编号最大支持十位',
            }],
          })(<Input />)}
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
export default DicAddForm;
