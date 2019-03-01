import { Form, Input, Modal, Select, TreeSelect } from 'antd';
import React  from 'react';

const FormItem = Form.Item;
const { Option } = Select;

const OrgEditForm = Form.create({
  mapPropsToFields(props) {
    const { selectedData } = props;
    return {
      orgId: Form.createFormField({
        value: selectedData.orgId
      }),
      orgName: Form.createFormField({
        value: selectedData.orgName
      }),
      orgCode: Form.createFormField({
        value: selectedData.orgCode
      }),
      orgCategory: Form.createFormField({
        value: selectedData.orgCategory
      }),
      orgParentId: Form.createFormField({
        value: selectedData.orgParentId
      }),
    };
  }
})((props) => {
  const { modalVisible, form, orgTypeOptions, treeSelectData, handleEdit, handleCancel } = props;
  const formStyle = {
    labelCol: { span: 5 },
    wrapperCol: { span: 15 },
  };

  const handleOK = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleEdit(fieldsValue);
    });
  };

  const handleCancel0 = () => {
    form.resetFields();
    handleCancel();
  };

  const loadTreeData = (data0 =[]) => {
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

  return(
    <Modal
      title="机构编辑"
      visible={modalVisible}
      onOk={handleOK}
      onCancel={handleCancel0}
    >
      <FormItem {...formStyle} style={{display: 'none'}} label="机构ID">
        {form.getFieldDecorator('orgId', {})(<Input />)}
      </FormItem>
      <FormItem {...formStyle} label="机构名称">
        {form.getFieldDecorator('orgName', {
          rules: [{
            max: 20,
            message: '机构名称不能超过20个字',
          }],
        })(<Input />)}
      </FormItem>
      <FormItem {...formStyle} label="机构代码">
        {form.getFieldDecorator('orgCode', {
          rules: [{
            max: 20,
            message: '机构代码不能超过20个字'
          }],
        })(<Input />)}
      </FormItem>
      <FormItem {...formStyle} label="机构类别">
        {form.getFieldDecorator('orgCategory', {
          rules: [{
            required: true,
            message: '机构类别不能为空！'
          }],
        })(<Select style={{ width: '100%' }}>{orgTypeOptions.map((option) => <Option value={option.dictValue} key={option.dictId}>{option.dictKey}</Option>)}</Select>)}
      </FormItem>
      <FormItem {...formStyle} label="父级机构">
        {form.getFieldDecorator('orgParentId', {
          rules: [{
            required: true,
            message: '父级机构不能为空！'
          }],
        })(<TreeSelect style={{ width: '100%' }} treeData={loadTreeData(treeSelectData)} treeDefaultExpandAll />)}
      </FormItem>
    </Modal>
  );
});
export default OrgEditForm;
