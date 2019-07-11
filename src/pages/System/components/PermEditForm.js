import { Form, Input, Modal, Select, TreeSelect } from 'antd';
import React, { PureComponent } from 'react';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create({
  mapPropsToFields(props) {
    const { selectedData } = props;
    return {
      permId: Form.createFormField({
        value: selectedData.permId
      }),
      permName: Form.createFormField({
        value: selectedData.permName
      }),
      permCaption: Form.createFormField({
        value: selectedData.permCaption
      }),
      isButton: Form.createFormField({
        value: selectedData.isButton
      })
    };
  }
})
class DistEditForm extends PureComponent{
  constructor() {
    super();

    this.state = {

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
    const formStyle = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };
    const { modalVisible, form, treeSelectData } = this.props;
    return (
      <Modal
        title="新建区域"
        visible={modalVisible}
        onOk={this.handleOK}
        onCancel={this.handleCancel}
      >
        <FormItem {...formStyle} style={{display: 'none'}} label="权限ID">
          {form.getFieldDecorator('permId', {})(<Input />)}
        </FormItem>
        <FormItem {...formStyle} label="权限名称">
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
        <FormItem {...formStyle} label="权限标题">
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
        <FormItem {...formStyle} label="按钮权限">
          {form.getFieldDecorator('isButton', {
            rules: [{
              required: true,
              message: '请选择权限！'
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
export default DistEditForm;
