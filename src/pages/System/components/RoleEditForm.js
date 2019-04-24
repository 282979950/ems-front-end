import { Form, Input, Modal, Select, Divider, Icon, Button } from 'antd';
import React, { PureComponent } from 'react';
import DistTreeSelect from './DistTreeSelect';
import OrgTreeSelect from './OrgTreeSelect';
import { connect } from 'dva';

const FormItem = Form.Item;
const { Option } = Select;
@connect(({ perm }) => ({
  perm
}))
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
class RoleEditForm extends PureComponent {
  constructor() {
    super();

    this.state = {
      selectedItems: [],
      isOpen: false
    };
    this.formStyle = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'perm/fetchAllPerms',
      callback: (response) => {
        const { data } = response;
        let list = [];
        data.map(item => {
          list.push(item.value)
        });
        this.setState({ selectedItems: list });
      }
    });
  };

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

  checkAll = () => {
    const { form } = this.props;
    const { selectedItems } = this.state;
    form.setFieldsValue({ rolePermIds: selectedItems });
    this.handleIsOpen(false);
  };

  checkCancel = () => {
    const { form } = this.props;
    form.setFieldsValue({ rolePermIds: [] });
    this.handleIsOpen(false);
  };

  handleIsOpen = (isOpen) => {
    this.setState({ isOpen });
  };

  render() {
    const { modalVisible, form, perm: { allPerms } } = this.props;
    const { isOpen } = this.state;
    return (
      <Modal
        title="新建角色"
        visible={modalVisible}
        onOk={this.handleOK}
        onCancel={this.handleCancel}
      >
        <FormItem {...this.formStyle} style={{ display: 'none' }} label="区域ID">
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
          })(
            <Select
              mode="multiple"
              placeholder="权限"
              style={{ width: "100%" }}
              onFocus={() => this.handleIsOpen(true)}
              onBlur={() => this.handleIsOpen(false)}
              open={isOpen}
              dropdownRender={menu => (
                <div>
                  {menu}
                  <Divider style={{ margin: "4px 0" }} />
                  <Button onClick={this.checkAll} style={{ cursor: "pointer", margin: '0 5px 5px 5px' }}>
                    <Icon type="plus" /> 全选
                  </Button>
                  <Button onClick={this.checkCancel} style={{ cursor: "pointer", margin: '0 5px 5px 5px' }}>
                    <Icon type="close" /> 清空
                  </Button>
                </div>
              )}
            >
              {allPerms.map(item => (
                <Option key={item.key} value={item.value}>
                  {item.title}
                </Option>
              ))}
            </Select>
          )}
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
