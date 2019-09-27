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
      userType: Form.createFormField({
        value: selectedData.userType,
      }),
      userGasType: Form.createFormField({
        value: selectedData.userGasType
      }),
      userStatus: Form.createFormField({
        value: selectedData.userStatus
      }),
    };
  }
})
class CreateArchiveEditForm extends PureComponent{
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
        <FormItem {...this.formStyle} label="IC卡号">
          {form.getFieldDecorator('userId', {})(<Input disabled />)}
        </FormItem>
        <FormItem {...this.formStyle} label="用户区域">
          {form.getFieldDecorator('userDistId', {
            rules: [{
              required: true,
              message: '用户区域不能为空！',
            }],
          })(<DistTreeSelect />)}
        </FormItem>
        <FormItem {...this.formStyle} label="用户地址">
          {form.getFieldDecorator('userAddress', {
            rules: [{
              required: true,
              message: '用户地址不能为空！',
            }, {
              max: 100,
              message: '用户地址不能超过100字！',
            }]
          })(
            <Input />
          )}
        </FormItem>
        <FormItem {...this.formStyle} label="用户类型">
          {form.getFieldDecorator('userType', {
            rules: [{
              required: true,
              message: '用户类型不能为空！'
            }],
          })(<DictSelect category="user_type" />)}
        </FormItem>
        <FormItem {...this.formStyle} label="用气类型">
          {form.getFieldDecorator('userGasType', {
            rules: [{
              required: true,
              message: '用气类型不能为空！'
            }],
          })(<DictSelect category="user_gas_type" />)}
        </FormItem>
        <FormItem {...this.formStyle} label="用户状态" style={{display: 'none'}}>
          {form.getFieldDecorator('userStatus', {})(<Input />)}
        </FormItem>
      </Modal>
    );
  }
}
export default CreateArchiveEditForm;
