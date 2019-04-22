import { Form, Input, InputNumber, Modal, DatePicker, message } from 'antd';
import { connect } from 'dva';
import React, { PureComponent } from 'react';
import MeterTypeSelect from '../../Account/components/MeterTypeSelect';
import DictSelect from '../../System/components/DictSelect';
import moment from 'moment';
const FormItem = Form.Item;

@connect(({ input, emp, entryMeter, loading }) => ({
  input,
  emp,
  entryMeter,
  loading: loading.models.input,
}))
@Form.create({
  mapPropsToFields(props) {
    const { selectedData } = props;
    return {
      id: Form.createFormField({
        value: selectedData.id
      }),
      repairOrderId: Form.createFormField({
        value: selectedData.repairOrderId
      }),
      userId: Form.createFormField({
        value: selectedData.userId
      }),
      userName: Form.createFormField({
        value: selectedData.userName
      }),
      userPhone: Form.createFormField({
        value: selectedData.userPhone
      }),
      userAddress: Form.createFormField({
        value: selectedData.userAddress
      }),
      userAddress: Form.createFormField({
        value: selectedData.userAddress
      }),
      oldMeterStopCode: Form.createFormField({
        value: selectedData.oldMeterStopCode
      }),
      repairType: Form.createFormField({
        value: selectedData.repairType
      }),
      gasEquipmentType: Form.createFormField({
        value: selectedData.gasEquipmentType
      }),
      oldMeterCode: Form.createFormField({
        value: selectedData.oldMeterCode
      }),
      oldMeterId: Form.createFormField({
        value: selectedData.oldMeterId
      }),
      oldMeterTypeId: Form.createFormField({
        value: selectedData.oldMeterTypeId
      }),
      oldMeterDirection: Form.createFormField({
        value: selectedData.oldMeterDirection
      }),
      oldSafetyCode: Form.createFormField({
        value: selectedData.oldSafetyCode
      }),
      repairFaultType: Form.createFormField({
        value: selectedData.repairFaultType
      }),
      repairResultType: Form.createFormField({
        value: selectedData.repairResultType
      }),
      empNumber: Form.createFormField({
        value: selectedData.empNumber
      }),
      empId: Form.createFormField({
        value: selectedData.empId
      }),
      empName: Form.createFormField({
        value: selectedData.empName
      }),
      newSafetyCode: Form.createFormField({
        value: selectedData.newSafetyCode
      }),
      newMeterCode: Form.createFormField({
        value: selectedData.newMeterCode
      }),
      newMeterTypeId: Form.createFormField({
        value: selectedData.newMeterTypeId
      }),
      newMeterDirection: Form.createFormField({
        value: selectedData.newMeterDirection
      }),
      newMeterStopCode: Form.createFormField({
        value: selectedData.newMeterStopCode
      }),
      repairStartTime: Form.createFormField({
        value: moment(selectedData.repairStartTime, "YYYY-MM-DD HH:mm")
      }),
      repairEndTime: Form.createFormField({
        value: moment(selectedData.repairEndTime, "YYYY-MM-DD HH:mm")
      }),
    }
  }
})

class InputEditForm extends PureComponent {
  constructor(props) {
    super();
    this.state = {

    };
    this.formStyle = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    }
  }

  handleOk = () => {
    const { form, handleEdit } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleEdit({
        ...fieldsValue,
        repairStartTime: fieldsValue.repairStartTime ? fieldsValue.repairStartTime.format('YYYY-MM-DD HH:mm') : undefined,
        repairEndTime: fieldsValue.repairEndTime ? fieldsValue.repairEndTime.format('YYYY-MM-DD HH:mm') : undefined,
      }, form)
    })
  }

  handleCancel0 = () => {
    const { form, handleCancel } = this.props;
    form.resetFields();
    handleCancel();
  }

  handleGetEmpByEmpNumber = (e) => {
    const { form, dispatch } = this.props;
    dispatch({
      type: 'emp/getEmpByEmpNumber',
      payload: {
        empNumber: e.target.value,
      },
      callback: (response) => {
        if (response.data === null) {
          message.error(response.message)
        } else {
          form.setFieldsValue({
            "empNumber": response.data.empNumber,
            "empId": response.data.empId,
            "empName": response.data.empName
          })
        }
      }
    });
  }

  render() {
    const {
      modalVisible,
      form,
      loading, } = this.props;
    const repairType = this.props.selectedData.repairType;
    let disableOrHide = false;
    if (repairType === 0 || repairType === 6 || repairType === 7) {
      disableOrHide = true;
    }
    const repairResultType = this.props.selectedData.repairResultType;
    let isRepairResultType = false;
    if (repairResultType === 4 || repairResultType === 9) {
      isRepairResultType = true;
    }

    return (
      <Modal
        title="编辑区域"
        visible={modalVisible}
        onOk={this.handleOk}
        onCancel={this.handleCancel0}
      >
        <FormItem {...this.formStyle} label='维修单编号' style={{ 'display': 'none' }}>
          {form.getFieldDecorator('id', {})(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label='维修单编号'>
          {form.getFieldDecorator('repairOrderId', {
            rules: [{
              required: true,
              message: ''
            }, {
              max: 20,
              message: '维修员工号不能超过20个字',
            }],
          })(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label='户号'>
          {form.getFieldDecorator('userId', {
            rules: [{
              required: true,
              message: '户号不能为空'
            }]
          })(<Input disabled={true} />)}
        </FormItem>
        <FormItem {...this.formStyle} label='用户名称'>
          {form.getFieldDecorator('userName', {})(<Input disabled={true} />)}
        </FormItem>
        <FormItem {...this.formStyle} label='用户手机'>
          {form.getFieldDecorator('userPhone', {})(<Input disabled={true} />)}
        </FormItem>
        <FormItem {...this.formStyle} label='用户地址'>
          {form.getFieldDecorator('userAddress', {
            rules: [{
              required: true,
              message: '用户地址不能为空！'
            }],
          })(<Input disabled={true} />)}
        </FormItem>
        <FormItem {...this.formStyle} label="维修类型">
          {form.getFieldDecorator('repairType', {})(<DictSelect disabled={true} category="repair_type" />)}
        </FormItem>
        <FormItem {...this.formStyle} label="燃气设备类型">
          {form.getFieldDecorator('gasEquipmentType', {})(<DictSelect disabled={true} category="gas_equipment_type" />)}
        </FormItem>
        <FormItem {...this.formStyle} label="旧表编号">
          {form.getFieldDecorator('oldMeterCode', {})(<Input disabled={true} />)}
        </FormItem>
        <FormItem {...this.formStyle} style={{ display: 'none' }} label="旧表编号表具ID">
          {form.getFieldDecorator('oldMeterId', {})(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="旧表类型">
          {form.getFieldDecorator('oldMeterTypeId', {})(<Input style={{ "width": "100%" }} disabled={true} />)}
        </FormItem>
        {/* <FormItem {...this.this.formStyle} label="旧表类型">
          {form.getFieldDecorator('oldMeterTypeId', {
            initialValue: [ 'IC卡表', repairOrderUser.meterTypeName ],
          })(<MeterTypeSelect  disabled={true} style={{ "width": "100%" }} />)}
        </FormItem> */}
        <FormItem {...this.formStyle} label="旧表表向">
          {form.getFieldDecorator('oldMeterDirection', {})(<DictSelect category="meter_direction" disabled={true} />)}
        </FormItem>
        <FormItem {...this.formStyle} label='旧表止码'>
          {form.getFieldDecorator('oldMeterStopCode', {
            rules: [{
              required: true,
              message: '旧表止码不能为空！'
            }]
          })(<InputNumber style={{ "width": "100%" }} />)}
        </FormItem>
        <FormItem {...this.formStyle} label='旧安全卡编码'>
          {form.getFieldDecorator('oldSafetyCode', {})(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label='新表编码' style={disableOrHide ? '' : { display: 'none' }}>
          {form.getFieldDecorator('newMeterCode', {})(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="新表类型" style={disableOrHide ? '' : { display: 'none' }}>
          {form.getFieldDecorator('newMeterTypeId')
            (<MeterTypeSelect disabled={disableOrHide} style={{ "width": "100%" }} />)}
        </FormItem>
        <FormItem {...this.formStyle} label="新表表向" style={disableOrHide ? '' : { display: 'none' }}>
          {form.getFieldDecorator('newMeterDirection')
            (<DictSelect category="meter_direction" disabled={disableOrHide} />)}
        </FormItem>
        <FormItem {...this.formStyle} label='新表止码' style={disableOrHide ? '' : { display: 'none' }}>
          {form.getFieldDecorator('newMeterStopCode', {})(<InputNumber style={{ "width": "100%" }} />)}
        </FormItem>
        <FormItem {...this.formStyle} label="新安全卡编号" style={disableOrHide ? '' : { display: 'none' }}>
          {form.getFieldDecorator('newSafetyCode', {})(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="维修故障类型">
          {form.getFieldDecorator('repairFaultType', {
            rules: [{
              required: true,
              message: '维修故障类型不能为空！'
            }]
          })(<DictSelect disabled={disableOrHide || isRepairResultType} category="repair_fault_type" />)}
        </FormItem>
        <FormItem {...this.formStyle} label="维修结果">
          {form.getFieldDecorator('repairResultType', {
            rules: [{
              required: true,
              message: '维修结果不能为空！'
            }]
          })(<DictSelect disabled={disableOrHide || isRepairResultType} category="repair_result_type" />)}
        </FormItem>
        <FormItem {...this.formStyle} label="维修员工号">
          {form.getFieldDecorator('empNumber', {
            rules: [{
              required: true,
              message: '维修员工号不能为空！'
            }],
          })(<Input onBlur={this.handleGetEmpByEmpNumber} />)}
        </FormItem>
        <FormItem {...this.formStyle} label="维修员工号ID" style={{ 'display': 'none' }}>
          {form.getFieldDecorator('empId', {})(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="维修员姓名">
          {form.getFieldDecorator('empName', {
            rules: [{
              required: true,
              message: '维修员姓名不能为空！'
            }],
          })(<Input disabled={true} />)}
        </FormItem>
        <FormItem {...this.formStyle} label="维修开始时间">
          {form.getFieldDecorator('repairStartTime', {
            rules: [{
              required: true,
              message: '维修开始时间不能为空！'
            }]
          })(
            <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ "width": "100%" }} />
          )}
        </FormItem>
        <FormItem {...this.formStyle} label="维修结束时间">
          {form.getFieldDecorator('repairEndTime', {
            rules: [{
              required: true,
              message: '维修结束时间不能为空！'
            },]
          })(
            <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ "width": "100%" }} />
          )}
        </FormItem>
      </Modal>
    )
  }
}

export default InputEditForm;