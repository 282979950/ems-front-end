import { Form, Input, Modal } from 'antd';
import React, { PureComponent } from 'react';
import DictSelect from '../../System/components/DictSelect';
import DistTreeSelect from '../../System/components/DistTreeSelect';

const FormItem = Form.Item;


@Form.create({
  mapPropsToFields(props) {
    const { selectedData } = props;
    return {
      userId: Form.createFormField({
        value: selectedData.userId
      }),
      userDistId: Form.createFormField({
        value: selectedData.userDistId
      }),
      userAddress: Form.createFormField({
        value: selectedData.userAddress
      }),
      userStatus: Form.createFormField({
        value: selectedData.userStatus
      }),
      meterCode: Form.createFormField({
        value: selectedData.meterCode
      }),
    };
  }
})
class InstallMeterEditForm extends PureComponent{
  constructor() {
    super();
    this.state = {};
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
        title="编辑用户档案"
        visible={modalVisible}
        onOk={this.handleOK}
        onCancel={this.handleCancel}
      >
        <FormItem {...this.formStyle} label="用户编号">
          {form.getFieldDecorator('userId', {})(<Input disabled />)}
        </FormItem>
        <FormItem {...this.formStyle} label="用户区域">
          {form.getFieldDecorator('userDistId', {})(<DistTreeSelect disabled />)}
        </FormItem>
        <FormItem {...this.formStyle} label="用户地址">
          {form.getFieldDecorator('userAddress', {})(<Input disabled />)}
        </FormItem>
        <FormItem {...this.formStyle} label="用户状态">
          {form.getFieldDecorator('userStatus', {})(<DictSelect category="user_status" disabled />)}
        </FormItem>
        <FormItem {...this.formStyle} label="表具编号">
          {form.getFieldDecorator('meterCode', {
            rules: [{
              required: true,
              message: '表具编号不能为空！',
            }, {
              len: 12,
              message: '表具编号长度必须为12位',
            }],
          })(<Input />)}
        </FormItem>
      </Modal>
    );
  }
}
export default InstallMeterEditForm;
