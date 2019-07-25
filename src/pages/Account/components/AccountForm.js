import { Form, Input, Modal } from 'antd';
import React, { PureComponent } from 'react';
import DistTreeSelect from '../../System/components/DistTreeSelect';
import DictSelect from '../../System/components/DictSelect';

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
      userIdcard: Form.createFormField({
        value: selectedData.userIdcard
      }),
      userDeed: Form.createFormField({
        value: selectedData.userDeed
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
    };
  }
})
class AccountForm extends PureComponent {
  constructor(props) {
    super(props);
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
    const {
      modalVisible,
      form,
      selectedData
    } = this.props;
    const { userStatus } = selectedData;
    return (
      <Modal
        title="账户开户"
        visible={modalVisible}
        onOk={this.handleOK}
        onCancel={this.handleCancel}
      >
        <FormItem {...this.formStyle} label="账户编号">
          {form.getFieldDecorator('userId', {})(<Input disabled />)}
        </FormItem>
        {
          userStatus === 2 || userStatus === 3 ? (
            <div>
              <FormItem {...this.formStyle} label="账户姓名">
                {form.getFieldDecorator('userName', {
                  rules: [{
                    required: true,
                    message: '账户姓名不能为空！',
                  }],
                })(<Input />)}
              </FormItem>
              <FormItem {...this.formStyle} label="手机">
                {form.getFieldDecorator('userPhone', {
                  rules: [{
                    pattern: /^1[34578]\d{9}$/,
                    message: '请输入正确的手机号！',
                  }, {
                    required: true,
                    message: '手机号不能为空！'
                  }]
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem {...this.formStyle} label="身份证">
                {form.getFieldDecorator('userIdcard', {
                  rules: [{
                    pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                    message: '请输入正确的份证号！',
                  }, {
                    required: true,
                    message: '身份证不能为空！',
                  }],
                })(<Input />)}
              </FormItem>
              <FormItem {...this.formStyle} label="房产证号">
                {form.getFieldDecorator('userDeed', {})(<Input />)}
              </FormItem>
            </div>
          ) : null
        }
        <FormItem {...this.formStyle} label="用户区域">
          {form.getFieldDecorator('userDistId', {
            rules: [{
              required: true,
              message: '用户区域不能为空！'
            }],
          })(<DistTreeSelect />)}
        </FormItem>
        <FormItem {...this.formStyle} label="地址">
          {form.getFieldDecorator('userAddress', {
          })(<Input />)}
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
              message: '用户类型不能为空！'
            }],
          })(<DictSelect category="user_gas_type" />)}
        </FormItem>
      </Modal>
    );
  }
}
export default AccountForm;
