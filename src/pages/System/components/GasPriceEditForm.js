import { Button, Form, Input, Modal, Steps } from 'antd';
import React, { PureComponent } from 'react';

const FormItem = Form.Item;
const { Step } = Steps;

@Form.create()
class GasPriceEditForm extends PureComponent{
  constructor(props) {
    super(props);
    const { selectedData } = props;
    this.state = {
      formValues: {
        ...selectedData
      },
      currentStep: 0
    };
    this.formStyle = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };
  }

  backward = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep - 1,
    });
  };

  forward = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep + 1,
    });
  };

  handlePrev = () => {
    const { form } = this.props;
    const { formValues } = this.state;
    this.setState({
      formValues: { ...formValues, ...form.getFieldsValue() },
    });
    this.backward();
  };

  handleNext = () => {
    const { form } = this.props;
    const { formValues } = this.state;
    form.validateFields((errors, fieldsValue) => {
      if (errors) return;
      this.setState({
        formValues: { ...formValues, ...fieldsValue }
      });
      this.forward();
    });
  };

  handleEdit = () => {
    const { form, handleEdit } = this.props;
    const { formValues } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        formValues: {
          gasPriceId: null,
          userType: null,
          userGasType: null,
          userTypeName: null,
          userGasTypeName: null,
          gasRangeOne: null,
          gasPriceOne: null,
          gasRangeTwo: null,
          gasPriceTwo: null,
          gasRangeThree: null,
          gasPriceThree: null,
          gasRangeFour: null,
          gasPriceFour: null,
        },
        currentStep: 0
      });
      form.resetFields();
      handleEdit({
        ...formValues,
        ...fieldsValue
      });
    });
  };

  renderForm = () => {
    const { currentStep, formValues } = this.state;
    const { form } = this.props;
    switch (currentStep) {
      case 1:
        return [
          <FormItem {...this.formStyle} label="二阶梯气量(不含)" key="gasRangeTwo">
            {form.getFieldDecorator('gasRangeTwo',{
              initialValue: formValues.gasRangeTwo,
              rules: [{
                required: true,
                message: '二阶梯气量(不含)不能为空！'
              }]
            })(<Input />)}
          </FormItem>,
          <FormItem {...this.formStyle} label="二阶梯气价" key="gasPriceTwo">
            {form.getFieldDecorator('gasPriceTwo',{
              initialValue: formValues.gasPriceTwo,
              rules: [{
                required: true,
                message: '二阶梯气价不能为空！'
              },{
                pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
                message: '二阶梯气价只能为整数',
              }]
            })(<Input />)}
          </FormItem>,
        ];
      case 2:
        return [
          <FormItem {...this.formStyle} label="三阶梯气量(不含)" key="gasRangeThree">
            {form.getFieldDecorator('gasRangeThree',{
              initialValue: formValues.gasRangeThree,
              rules: [{
                required: true,
                message: '三阶梯气量(不含)不能为空！'
              }]
            })(<Input />)}
          </FormItem>,
          <FormItem {...this.formStyle} label="三阶梯气价" key="gasPriceThree">
            {form.getFieldDecorator('gasPriceThree',{
              initialValue: formValues.gasPriceThree,
              rules: [{
                required: true,
                message: '三阶梯气价不能为空！'
              },{
                pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
                message: '三阶梯气价只能为整数',
              }]
            })(<Input />)}
          </FormItem>
        ];
      case 3:
        return [
          <FormItem {...this.formStyle} label="四阶梯气量(不含)" key="gasRangeFour">
            {form.getFieldDecorator('gasRangeFour',{
              initialValue: formValues.gasRangeFour,
              rules: [{
                required: true,
                message: '四阶梯气量(不含)不能为空！'
              }]
            })(<Input />)}
          </FormItem>,
          <FormItem {...this.formStyle} label="四阶梯气价" key="gasPriceFour">
            {form.getFieldDecorator('gasPriceFour',{
              initialValue: formValues.gasPriceFour,
              rules: [{
                required: true,
                message: '四阶梯气价不能为空！'
              },{
                pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
                message: '四阶梯气价只能为整数',
              }]
            })(<Input />)}
          </FormItem>
      ];
      default:
        return [
          <FormItem {...this.formStyle} style={{display: 'none'}} label="气价ID" key="gasPriceId">
            {form.getFieldDecorator('gasPriceId', {initialValue: formValues.gasPriceId})(<Input />)}
          </FormItem>,
          <FormItem {...this.formStyle} style={{display: 'none'}} label="用户类型" key="userType">
            {form.getFieldDecorator('userType', {initialValue: formValues.userType})(<Input />)}
          </FormItem>,
          <FormItem {...this.formStyle} style={{display: 'none'}} label="用气类型" key="userGasType">
            {form.getFieldDecorator('userGasType', {initialValue: formValues.userGasType})(<Input />)}
          </FormItem>,
          <FormItem {...this.formStyle} label="用户类型" key="userTypeName">
            {form.getFieldDecorator('userTypeName', {initialValue: formValues.userTypeName})(<Input disabled />)}
          </FormItem>,
          <FormItem {...this.formStyle} label="用气类型" key="userGasTypeName">
            {form.getFieldDecorator('userGasTypeName',{initialValue: formValues.userGasTypeName})(<Input disabled />)}
          </FormItem>,
          <FormItem {...this.formStyle} label="一阶梯气量" key="gasRangeOne">
            {form.getFieldDecorator('gasRangeOne',{
              initialValue: formValues.gasRangeOne,
              rules: [{
                required: true,
                message: '一阶梯气量不能为空！'
              }]
            })(<Input />)}
          </FormItem>,
          <FormItem {...this.formStyle} label="一阶梯气价" key="gasPriceOne">
            {form.getFieldDecorator('gasPriceOne',{
              initialValue: formValues.gasPriceOne,
              rules: [{
                required: true,
                message: '一阶梯气价不能为空！'
              },{
                pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
                message: '一阶梯气价只能为整数',
              }]
            })(<Input />)}
          </FormItem>

        ];
    }
  };

  renderFooter = () => {
    const { currentStep } = this.state;
    switch (currentStep) {
      case 1:
        return [
          <Button key="back" onClick={this.handlePrev}>
            上一步
          </Button>,
          <Button key="forward" type="primary" onClick={this.handleNext}>
            下一步
          </Button>,
          <Button key="submit" type="primary" onClick={this.handleEdit}>
            二阶编辑
          </Button>,
          <Button key="cancel" onClick={this.handleCancel}>
            取消
          </Button>,
        ];
      case 2:
        return [
          <Button key="back" onClick={this.handlePrev}>
            上一步
          </Button>,
          <Button key="forward" type="primary" onClick={this.handleNext}>
            下一步
          </Button>,
          <Button key="submit" type="primary" onClick={this.handleEdit}>
            三阶编辑
          </Button>,
          <Button key="cancel" onClick={this.handleCancel}>
            取消
          </Button>,
        ];
      case 3:
        return [
          <Button key="back" onClick={this.handlePrev}>
            上一步
          </Button>,
          <Button key="submit" type="primary" onClick={this.handleEdit}>
            四阶编辑
          </Button>,
          <Button key="cancel" onClick={this.handleCancel}>
            取消
          </Button>,
        ];
      default:
        return [
          <Button key="forward" type="primary" onClick={this.handleNext}>
            下一步
          </Button>,
          <Button key="submit" type="primary" onClick={this.handleEdit}>
            一阶编辑
          </Button>,
          <Button key="cancel" onClick={this.handleCancel}>
            取消
          </Button>,
        ];
    }
  };

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
    this.setState({

      currentStep: 0
    });
    handleCancel();
  };

  render() {
    const { modalVisible } = this.props;
    const { currentStep } = this.state;
    return (
      <Modal
        title="编辑气量/气价"
        visible={modalVisible}
        onOk={this.handleOK}
        onCancel={this.handleCancel}
        footer={this.renderFooter()}
        destroyOnClose
      >
        <Steps style={{ marginBottom: 28 }} size="small" current={currentStep}>
          <Step title="基本信息/一阶梯" />
          <Step title="二阶梯" />
          <Step title="三阶梯" />
          <Step title="四阶梯" />
        </Steps>
        {this.renderForm()}
      </Modal>
    );
  }
}
export default GasPriceEditForm;
