import { Form, Input, InputNumber, Modal, DatePicker, message } from 'antd';
import { connect } from 'dva';
import React, { PureComponent } from 'react';
import moment from 'moment';
import MeterTypeSelect from '../../Account/components/MeterTypeSelect';
import DictSelect from '../../System/components/DictSelect';

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
        value: ['IC卡表', selectedData.oldMeterTypeId]
      }),
      oldMeterTypeName: Form.createFormField({
        value: selectedData.oldMeterTypeName
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
        value: ['IC卡表', selectedData.newMeterTypeId]
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
    super(props);
    // const { selectedData: { repairStartTime, repairEndTime } } = this.props;
    this.state = {
      startValue: null,
      endValue: null,
      endOpen: false
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
        oldMeterTypeId: fieldsValue.oldMeterTypeId ? fieldsValue.oldMeterTypeId[1] : null,
        newMeterTypeId: fieldsValue.newMeterTypeId ? fieldsValue.newMeterTypeId[1] : null,
        repairStartTime: fieldsValue.repairStartTime ? fieldsValue.repairStartTime.format('YYYY-MM-DD HH:mm') : undefined,
        repairEndTime: fieldsValue.repairEndTime ? fieldsValue.repairEndTime.format('YYYY-MM-DD HH:mm') : undefined,
      }, form)
    })
  };

  handleCancel0 = () => {
    const { form, handleCancel } = this.props;
    form.resetFields();
    handleCancel();
  };

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
  };

  disabledStartDate = startValue => {
    const { endValue } = this.state;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  disabledEndDate = (endValue) => {
    const { startValue } = this.state;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  };

  onStartChange = (value) => {
    this.onChange("startValue", value);
  };

  onEndChange = (value) => {
    this.onChange('endValue', value);
  };

  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  };

  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open });
  };

  render() {
    const {
      modalVisible,
      form,
    } = this.props;
    const { selectedData: { repairType, repairResultType } } = this.props;
    let disableOrHide = false;
    if (repairType === 0 || repairType === 6 || repairType === 7) {
      disableOrHide = true;
    }
    let isRepairResultType = false;
    if (repairResultType === 4 || repairResultType === 9) {
      isRepairResultType = true;
    }
    const { endOpen } = this.state;

    return (
      <Modal
        title="编辑区域"
        visible={modalVisible}
        onOk={this.handleOk}
        onCancel={this.handleCancel0}
      >
        <div style={{ overflow:"scroll", height:"400px", overflowX:'hidden' }}>
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
          <FormItem {...this.formStyle} label='IC卡号'>
            {form.getFieldDecorator('userId', {
              rules: [{
                required: true,
                message: 'IC卡号不能为空'
              }]
            })(<Input readOnly />)}
          </FormItem>
          <FormItem {...this.formStyle} label='用户名称'>
            {form.getFieldDecorator('userName', {})(<Input readOnly />)}
          </FormItem>
          <FormItem {...this.formStyle} label='用户手机'>
            {form.getFieldDecorator('userPhone', {})(<Input readOnly />)}
          </FormItem>
          <FormItem {...this.formStyle} label='用户地址'>
            {form.getFieldDecorator('userAddress', {
              rules: [{
                required: true,
                message: '用户地址不能为空！'
              }],
            })(<Input readOnly />)}
          </FormItem>
          <FormItem {...this.formStyle} label="维修类型">
            {form.getFieldDecorator('repairType', {})(<DictSelect style={{"width":"100%","pointerEvents": "none"}} category="repair_type" />)}
          </FormItem>
          <FormItem {...this.formStyle} label="燃气设备类型">
            {form.getFieldDecorator('gasEquipmentType', {})(<DictSelect style={{ "width":"100%","pointerEvents": "none"}} category="gas_equipment_type" />)}
          </FormItem>
          <FormItem {...this.formStyle} label="旧表编号">
            {form.getFieldDecorator('oldMeterCode', {})(<Input readOnly />)}
          </FormItem>
          <FormItem {...this.formStyle} style={{ display: 'none' }} label="旧表编号表具ID">
            {form.getFieldDecorator('oldMeterId', {})(<Input />)}
          </FormItem>
          <FormItem {...this.formStyle} label="旧表类型">
            {form.getFieldDecorator('oldMeterTypeId', {
            })(<MeterTypeSelect style={{ "width": "100%","pointerEvents": "none" }} placeholder={null} />)}
          </FormItem>
          <FormItem {...this.formStyle} label="旧表表向">
            {form.getFieldDecorator('oldMeterDirection', {})(<DictSelect category="meter_direction" style={{"pointerEvents": "none"}} />)}
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
          <FormItem {...this.formStyle} label='新表编码' style={disableOrHide ? null : { display: 'none' }}>
            {form.getFieldDecorator('newMeterCode', {})(<Input />)}
          </FormItem>
          <FormItem {...this.formStyle} label="新表类型">
            {form.getFieldDecorator('newMeterTypeId', {
            })(<MeterTypeSelect style={{ "width": "100%","pointerEvents": "none" }} placeholder={null} />)}
          </FormItem>
          <FormItem {...this.formStyle} label="新表表向" style={disableOrHide ? null : { display: 'none' }}>
            {form.getFieldDecorator('newMeterDirection')
              (<DictSelect category="meter_direction" disabled={disableOrHide} />)}
          </FormItem>
          <FormItem {...this.formStyle} label='新表止码' style={disableOrHide ? null : { display: 'none' }}>
            {form.getFieldDecorator('newMeterStopCode', {})(<InputNumber style={{ "width": "100%" }} />)}
          </FormItem>
          <FormItem {...this.formStyle} label="新安全卡编号" style={disableOrHide ? null : { display: 'none' }}>
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
            })(<Input readOnly />)}
          </FormItem>
          <FormItem {...this.formStyle} label="维修开始时间">
            {form.getFieldDecorator('repairStartTime', {
              rules: [{
                required: true,
                message: '维修开始时间不能为空！'
              }]
            })(
              <DatePicker
                disabledDate={this.disabledStartDate}
                onChange={this.onStartChange}
                onOpenChange={this.handleStartOpenChange}
                showTime
                format="YYYY-MM-DD HH:mm"
                style={{ "width": "100%" }}
              />
            )}
          </FormItem>
          <FormItem {...this.formStyle} label="维修结束时间">
            {form.getFieldDecorator('repairEndTime', {
              rules: [{
                required: true,
                message: '维修结束时间不能为空！'
              },]
            })(
              <DatePicker
                disabledDate={this.disabledEndDate}
                onChange={this.onEndChange}
                open={endOpen}
                onOpenChange={this.handleEndOpenChange}
                showTime
                format="YYYY-MM-DD HH:mm"
                style={{ "width": "100%" }}
              />
            )}
          </FormItem>
        </div>
      </Modal>
    )
  }
}

export default InputEditForm;
