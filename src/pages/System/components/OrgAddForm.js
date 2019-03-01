import { Form, Input, Modal, Select, TreeSelect } from 'antd';
import React, { PureComponent } from 'react';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
class OrgAddForm extends PureComponent{
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

  loadTreeData = (data0 = []) => {
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
    const { modalVisible, form, orgTypeOptions, treeSelectData } = this.props;
    return (
      <Modal
        title="机构新增"
        visible={modalVisible}
        onOk={this.handleOK}
        onCancel={this.handleCancel}
      >
        <FormItem {...this.formStyle} label="机构名称">
          {form.getFieldDecorator('orgName', {
            rules: [{
              required: true,
              message: '机构名称不能为空！'
            },{
              max: 20,
              message: '机构名称不能超过20个字',
            }],
          })(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="机构代码">
          {form.getFieldDecorator('orgCode', {
            rules: [{
              required: true,
              message: '机构代码不能为空！'
            },{
              max: 20,
              message: '机构代码不能超过20个字'
            }],
          })(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="机构类别">
          {form.getFieldDecorator('orgCategory', {
            rules: [{
              required: true,
              message: '机构类别不能为空！'
            }],
          })(<Select style={{ width: '100%' }}>{orgTypeOptions && orgTypeOptions.map((option) => <Option value={option.dictValue} key={option.dictId}>{option.dictKey}</Option>)}</Select>)}
        </FormItem>
        <FormItem {...this.formStyle} label="父级机构">
          {form.getFieldDecorator('orgParentId', {
            rules: [{
              required: true,
              message: '父级机构不能为空！'
            }],
          })(<TreeSelect style={{ width: '100%' }} treeData={this.loadTreeData(treeSelectData)} treeDefaultExpandAll />)}
        </FormItem>
      </Modal>
    );
  }
}
export default OrgAddForm;
