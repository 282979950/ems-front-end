import { Form, Input, Modal } from 'antd';
import React, { PureComponent } from 'react';
import DictSelect from '../../System/components/DictSelect';
import DistTreeSelect from '../../System/components/DistTreeSelect';

const FormItem = Form.Item;

@Form.create()
class CreateArchiveAddForm extends PureComponent{
  constructor() {
    super();
    this.state = {};
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
    const { modalVisible, form } = this.props;
    return (
      <Modal
        title="建档"
        visible={modalVisible}
        onOk={this.handleOK}
        onCancel={this.handleCancel}
      >
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
      </Modal>
    );
  }
}
export default CreateArchiveAddForm;
