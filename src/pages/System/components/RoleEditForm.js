import { Form, Input, Modal, Select } from 'antd';
import React, { PureComponent } from 'react';
import DistTreeSelect from './DistTreeSelect';
import OrgTreeSelect from './OrgTreeSelect';
import PermTreeSelect from './PermTreeSelect';
import FooterToolbar from '../../../components/FooterToolbar';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create({
  mapPropsToFields(props) {
    const { selectedData } = props;
    return {
      roleId: Form.createFormField({
        value: selectedData.roleId
      }),
      roleName: Form.createFormField({
        value: selectedData.roleName
      }),
      roleDistIds: Form.createFormField({
        value: selectedData.roleDistIds
      }),
      roleOrgIds: Form.createFormField({
        value: selectedData.roleOrgIds
      }),
      rolePermIds: Form.createFormField({
        value: selectedData.rolePermIds
      }),
      isAdmin: Form.createFormField({
        value: selectedData.isAdmin
      })
    };
  }
})
class RoleEditForm extends PureComponent{
  constructor() {
    super();

    this.state = {

    };
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
        title="新建角色"
        visible={modalVisible}
        onOk={this.handleOK}
        onCancel={this.handleCancel}
      >
        <FormItem {...this.formStyle} style={{display: 'none'}} label="区域ID">
          {form.getFieldDecorator('roleId', {})(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="角色名称">
          {form.getFieldDecorator('roleName', {
            rules: [{
              required: true,
              message: '角色名称不能为空！',
            }, {
              max: 20,
              message: '角色名称不能超过20个字',
            }],
          })(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="区域权限">
          {form.getFieldDecorator('roleDistIds', {
            rules: [{
              required: true,
              message: '角色区域权限不能为空！'
            }],
          })(<DistTreeSelect placeholder="区域权限" multiple treeCheckable />)}
        </FormItem>
        <FormItem {...this.formStyle} label="机构权限">
          {form.getFieldDecorator('roleOrgIds', {
            rules: [{
              required: true,
              message: '角色机构权限不能为空！'
            }],
          })(<OrgTreeSelect placeholder="机构权限" multiple treeCheckable />)}
        </FormItem>
        <FormItem {...this.formStyle} label="权限">
          {form.getFieldDecorator('rolePermIds', {
            rules: [{
              required: true,
              message: '角色权限不能为空！'
            }],
          })(<PermTreeSelect placeholder="权限" multiple treeCheckable />)}
        </FormItem>
        <FormItem {...this.formStyle} label="是否管理员">
          {form.getFieldDecorator('isAdmin', {
            rules: [{
              required: true,
              message: '是否管理员！'
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
export default RoleEditForm;
