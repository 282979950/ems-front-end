import { Form, Input, Modal, Select, TreeSelect } from 'antd';
import React, { PureComponent } from 'react';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
class DistAddForm extends PureComponent{
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

  render() {
    const { modalVisible, form, distTypeOptions, treeSelectData } = this.props;
    return (
      <Modal
        title="新建区域"
        visible={modalVisible}
        onOk={this.handleOK}
        onCancel={this.handleCancel}
      >
        <FormItem {...this.formStyle} label="区域名称">
          {form.getFieldDecorator('distName', {
            rules: [{
              required: true,
              message: '区域名称不能为空！',
            }, {
              max: 20,
              message: '区域名称不能超过20个字',
            }],
          })(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="区域编码">
          {form.getFieldDecorator('distCode', {
            rules: [{
              max: 20,
              message: '区域编码不能超过20个字'
            }],
          })(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="区域类别">
          {form.getFieldDecorator('distCategory', {
            rules: [{
              required: true,
              message: '区域类别不能为空！'
            }],
          })(<Select style={{ width: '100%' }}>{distTypeOptions && distTypeOptions.map((option) => <Option value={option.dictValue} key={option.dictId}>{option.dictKey}</Option>)}</Select>)}
        </FormItem>
        <FormItem {...this.formStyle} label="区域地址">
          {form.getFieldDecorator('distAddress', {
            rules: [{
              max: 50,
              message: '区域地址不能超过50个字！'
            }],
          })(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="父级区域">
          {form.getFieldDecorator('distParentId', {
            rules: [{
              required: true,
              message: '父级区域不能为空！'
            }],
          })(<TreeSelect style={{ width: '100%' }} treeData={this.loadTreeData(treeSelectData)} treeDefaultExpandAll />)}
        </FormItem>
      </Modal>
    );
  }
}
export default DistAddForm;
