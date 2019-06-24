/* eslint-disable no-param-reassign */
import { Button, Form, Input, Modal, Select, Steps, Switch, Tag, TreeSelect } from 'antd';
import React, { PureComponent } from 'react';
import DictSelect from './DictSelect';

const FormItem = Form.Item;
const { Option } = Select;
const { Step } = Steps;

@Form.create()
class EmpAddForm extends PureComponent{
  constructor(props) {
    super(props);
    this.state = {
      formValues: {
        empNumber: null,
        empName: null,
        roleId: null,
        empOrgId: null,
        empDistId: null,
        empLoginName: null,
        empPassword: null,
        confirmPassword: null,
        empEmail: null,
        empPhone: null,
        empMobile: null,
        empAddress: null,
        empType: null,
        empManagementDistId: null,
        empLoginFlag: true,
      },
      confirmDirty: false,
      useDefaultPassword: true,
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

  handleDefaultPasswordChange = () => {
    const { useDefaultPassword } = this.state;
    this.setState({
      useDefaultPassword: !useDefaultPassword
    })
  };

  handlePasswordVisible = () => {
    const { useDefaultPassword, formValues } = this.state;
    const { form } = this.props;
    return useDefaultPassword ? null : (
      <FormItem {...this.formStyle} label="密码">
        {form.getFieldDecorator('empPassword', {
          initialValue: formValues.empPassword,
          rules: [{
            required: true,
            message: '密码不能为空！',
          }, {
            max: 20,
            message: '密码不能超过20个字',
          }, {
            min: 4,
            message: '密码不能少于4个字',
          }, {
            validator: this.validateToNextPassword
          }],
        })(<Input type="password" />)}
      </FormItem>);
  };

  handleConfirmPasswordVisible = () => {
    const { useDefaultPassword, formValues } = this.state;
    const { form } = this.props;
    return useDefaultPassword ? null : (
      <FormItem {...this.formStyle} label="确认密码">
        {form.getFieldDecorator('confirmPassword', {
          initialValue: formValues.confirmPassword,
          rules: [{
            required: true,
            message: '确认密码不能为空！',
          }, {
            validator: this.compareToFirstPassword
          }],
        })(<Input type="password" onBlur={this.handleConfirmBlur} />)}
      </FormItem>);
  };

  handleConfirmBlur = (e) => {
    const { value } = e.target;
    const { confirmDirty } = this.state;
    this.setState({ confirmDirty: confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('empPassword')) {
      callback('两次输入的密码不一致，请重新输入！');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    const { confirmDirty } = this.state;
    if (value && confirmDirty) {
      form.validateFields(['confirmPassword'], { force: true });
    }
    callback();
  };

  renderForm = () => {
    const { currentStep, useDefaultPassword, formValues } = this.state;
    const { form, distData, orgData, roleData } = this.props;
    switch (currentStep) {
      case 1:
        return [
          <FormItem {...this.formStyle} label="邮箱" key="empEmail">
            {form.getFieldDecorator('empEmail', {
              initialValue: formValues.empEmail,
              rules: [{
                max: 50,
                message: '邮箱不能超过50个字',
              }, {
                type: 'email',
                message: '邮箱格式不正确'
              }],
            })(<Input />)}
          </FormItem>,
          <FormItem {...this.formStyle} label="电话" key="empPhone">
            {form.getFieldDecorator('empPhone', {
              initialValue: formValues.empPhone,
              rules: [{
                max: 20,
                message: '电话不能超过20个字',
              }],
            })(<Input />)}
          </FormItem>,
          <FormItem {...this.formStyle} label="手机" key="empMobile">
            {form.getFieldDecorator('empMobile', {
              initialValue: formValues.empMobile,
              rules: [{
                max: 20,
                message: '姓名不能超过20个字',
              }],
            })(<Input />)}
          </FormItem>,
          <FormItem {...this.formStyle} label="地址" key="empAddress">
            {form.getFieldDecorator('empAddress', {
              initialValue: formValues.empAddress,
              rules: [{
                max: 50,
                message: '地址不能超过20个字',
              }],
            })(<Input />)}
          </FormItem>,
        ];
      case 2:
        return [
          <FormItem {...this.formStyle} label="所属机构" key="empOrgId">
            {form.getFieldDecorator('empOrgId', {
              initialValue: formValues.empOrgId,
              rules: [{
                required: true,
                message: '工号不能为空！',
              }],
            })(
              <TreeSelect
                style={{ width: '100%' }}
                treeData={this.loadOrgData(orgData)}
                treeDefaultExpandAll
                allowClear
              />
            )}
          </FormItem>,
          <FormItem {...this.formStyle} label="所属区域" key="empDistId">
            {form.getFieldDecorator('empDistId', {
              initialValue: formValues.empDistId,
            })(
              <TreeSelect
                style={{ width: '100%' }}
                treeData={this.loadDistData1(distData)}
                treeDefaultExpandAll
                allowClear
              />
            )}
          </FormItem>,
          <FormItem {...this.formStyle} label="用户角色" key="roleId">
            {form.getFieldDecorator('roleId', {
              initialValue: formValues.roleId,
              rules: [{
                required: true,
                message: '用户角色不能为空！',
              }],
            })(
              <Select style={{ width:'100%' }}>
                {roleData && roleData.map((option) => <Option value={option.roleId} key={option.roleId}>{option.roleName}</Option>)}
              </Select>
            )}
          </FormItem>,
          <FormItem {...this.formStyle} label="用户类型" key="empType">
            {form.getFieldDecorator('empType', {
              initialValue: formValues.empType,
              rules: [{
                required: true,
                message: '用户类型不能为空！',
              }],
            })(
              <DictSelect category="emp_type" />
            )}
          </FormItem>,
          <FormItem {...this.formStyle} label="负责区域" key="empManagementDistId">
            {form.getFieldDecorator('empManagementDistId', {
              initialValue: formValues.empManagementDistId,
            })(
              <TreeSelect
                style={{ width: '100%' }}
                treeData={this.loadDistData2(distData)}
                treeDefaultExpandAll
                treeCheckable
              />
            )}
          </FormItem>,
          <FormItem {...this.formStyle} label="登录标记" key="empLoginFlag">
            {form.getFieldDecorator('empLoginFlag', {
              initialValue: formValues.empLoginFlag,
              valuePropName: 'checked'
            })(<Switch />)}
          </FormItem>
        ];
      default:
        return [
          <FormItem {...this.formStyle} label="工号" key="empNumber">
            {form.getFieldDecorator('empNumber', {
              initialValue: formValues.empNumber,
              rules: [{
                required: true,
                message: '工号不能为空！',
              }, {
                max: 20,
                message: '工号不能超过20个字',
              }],
            })(<Input />)}
          </FormItem>,
          <FormItem {...this.formStyle} label="姓名" key="empName">
            {form.getFieldDecorator('empName', {
              initialValue: formValues.empName,
              rules: [{
                required: true,
                message: '姓名不能为空！',
              }, {
                max: 20,
                message: '姓名不能超过20个字',
              }],
            })(<Input />)}
          </FormItem>,
          <FormItem {...this.formStyle} label="登录名" key="empLoginName">
            {form.getFieldDecorator('empLoginName', {
              initialValue: formValues.empLoginName,
              rules: [{
                required: true,
                message: '登录名不能为空！',
              }, {
                max: 20,
                message: '登录名不能超过20个字',
              }, {
                min: 4,
                message: '登录名不能少于4个字',
              }],
            })(<Input />)}
          </FormItem>,
          <FormItem {...this.formStyle} label="使用默认密码" key="useDefaultPassword">
            <Switch checked={useDefaultPassword} onChange={this.handleDefaultPasswordChange} />
            &nbsp;
            <Tag color="blue">默认密码为0000</Tag>
          </FormItem>,
          this.handlePasswordVisible(),
          this.handleConfirmPasswordVisible()
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
          <Button key="cancel" onClick={this.handleCancel}>
            取消
          </Button>,
        ];
      case 2:
        return [
          <Button key="back" onClick={this.handlePrev}>
            上一步
          </Button>,
          <Button key="submit" type="primary" onClick={this.handleAdd}>
            新建
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
          <Button key="cancel" onClick={this.handleCancel}>
            取消
          </Button>,
        ];
    }
  };

  handleAdd = () => {
    const { form, handleAdd } = this.props;
    const { formValues } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        formValues: {
          empNumber: null,
          empName: null,
          roleId: null,
          empOrgId: null,
          empDistId: null,
          empLoginName: null,
          empPassword: null,
          confirmPassword: null,
          empEmail: null,
          empPhone: null,
          empMobile: null,
          empAddress: null,
          empType: null,
          empManagementDistId: null,
          empLoginFlag: true,
        },
        confirmDirty: false,
        useDefaultPassword: true,
        currentStep: 0
      });
      form.resetFields();
      handleAdd({
        ...formValues,
        ...fieldsValue,
        empManagementDistId: fieldsValue.empManagementDistId && fieldsValue.empManagementDistId.length ? fieldsValue.empManagementDistId.join(",") : null,
        empPassword: formValues.empPassword ? formValues.empPassword: "0000"
      });
    });
  };

  handleCancel = () => {
    const { form, handleCancel } = this.props;
    form.resetFields();
    this.setState({
      formValues: {
        empNumber: null,
        empName: null,
        roleId: null,
        empOrgId: null,
        empDistId: null,
        empLoginName: null,
        empPassword: null,
        confirmPassword: null,
        empEmail: null,
        empPhone: null,
        empMobile: null,
        empAddress: null,
        empType: null,
        empManagementDistId: null,
        empLoginFlag: true,
      },
      useDefaultPassword: true,
      currentStep: 0
    });
    handleCancel();
  };

  loadDistData1 = (data0 = []) => {
    const treeData = JSON.parse(JSON.stringify(data0));

    function convert(data1 = []) {
      data1.forEach((item) => {
        item.key = item.distName;
        item.value = item.distId;
        item.title = item.distName;
        if (item.children) {
          convert(item.children);
        }
      });
    }

    convert(treeData);
    return treeData;
  };

  loadDistData2 = (data0 = []) => {
    const treeData = JSON.parse(JSON.stringify(data0));

    function convert(data1 = []) {
      data1.forEach((item) => {
        item.key = item.distName;
        item.value = item.distName;
        item.title = item.distName;
        if (item.children) {
          convert(item.children);
        }
      });
    }

    convert(treeData);
    return treeData;
  };

  loadOrgData = (data0 = []) => {
    const treeData = JSON.parse(JSON.stringify(data0));

    function convert(data1 = []) {
      data1.forEach((item) => {
        item.key = item.orgName;
        item.value = item.orgId;
        item.title = item.orgName;
        if (item.children) {
          convert(item.children);
        }
      });
    }

    convert(treeData);
    return treeData;
  };

  render() {
    const { modalVisible } = this.props;
    const { currentStep } = this.state;
    return (
      <Modal
        title="新建用户"
        visible={modalVisible}
        onOk={this.handleOK}
        onCancel={this.handleCancel}
        footer={this.renderFooter()}
        destroyOnClose
      >
        <Steps style={{ marginBottom: 28 }} size="small" current={currentStep}>
          <Step title="基本信息" />
          <Step title="联系方式" />
          <Step title="工作信息" />
        </Steps>
        {this.renderForm()}
      </Modal>
    );
  }
}
export default EmpAddForm;
