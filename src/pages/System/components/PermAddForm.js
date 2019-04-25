import { Form, Input, Modal, Select, TreeSelect } from 'antd';
import React, { PureComponent } from 'react';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
class PermAddForm extends PureComponent{
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
        item.key = item.permId;
        item.value = item.permId;
        item.title = item.permCaption;
        if (item.children) {
          convert(item.children);
        }
      });
    }

    convert(treeData);
    return treeData;
  };

  render() {
    const { modalVisible, form, treeSelectData } = this.props;
    return (
      <Modal
        title="新建权限"
        visible={modalVisible}
        onOk={this.handleOK}
        onCancel={this.handleCancel}
      >
        <FormItem {...this.formStyle} label="权限名称">
          {form.getFieldDecorator('permName', {
            rules: [{
              required: true,
              message: '权限名称不能为空！',
            }, {
              max: 20,
              message: '权限名称不能超过20个字',
            }],
          })(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="权限标题">
          {form.getFieldDecorator('permCaption',{
            rules: [{
              required: true,
              message: '权限标题不能为空！',
            }, {
              max: 20,
              message: '权限标题不能超过20个字',
            }],
          })(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="按钮权限">
          {form.getFieldDecorator('isButton', {
            rules: [{
              required: true,
              message: '区域类别不能为空！'
            }],
          })(
            <Select style={{ width: '100%' }}>
              <Option value>是</Option>
              <Option value={false}>否</Option>
            </Select>
          )}
        </FormItem>
      </Modal>
    );
  }
}
export default PermAddForm;
