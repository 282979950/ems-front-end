import { Form, Input, InputNumber, Modal, DatePicker, message } from 'antd';
import { connect } from 'dva';
import React, { PureComponent } from 'react';
import DictSelect from '../../System/components/DictSelect';
import MeterTypeSelect from '../../Account/components/MeterTypeSelect';

const FormItem = Form.Item;

@connect(({ input, emp, entryMeter, loading }) => ({
  input,
  emp,
  entryMeter,
  loading: loading.models.input,
}))

@Form.create()
class InputAddForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      repairTypeVal: "",
      startValue: null,
      endValue: null,
      endOpen: false
    };
    this.formStyle = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    }
  };

  handleCancel = () => {
    const { form, handleCancel } = this.props;
    form.resetFields();
    handleCancel();
  };

  handleOK = () => {
    const { form, handleAdd } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // form.resetFields();
      handleAdd({
        ...fieldsValue,
        oldMeterTypeId: fieldsValue.oldMeterTypeId ? fieldsValue.oldMeterTypeId[1] : null,
        newMeterTypeId: fieldsValue.newMeterTypeId ? fieldsValue.newMeterTypeId[1] : null,
        repairStartTime: fieldsValue.repairStartTime ? fieldsValue.repairStartTime.format('YYYY-MM-DD HH:mm') : undefined,
        repairEndTime: fieldsValue.repairEndTime ? fieldsValue.repairEndTime.format('YYYY-MM-DD HH:mm') : undefined,
      }, form)
    })
  };

  handleGetRepairOrderUser = (e) => {
    const { dispatch, form } = this.props;
    dispatch({
      type: 'input/getRepairOrderUserById',
      payload: {
        userId: e.target.value,
      },
      callback: (response) => {
        const {data} = response;
        if (data) {
          const { userName, userPhone, userAddress, meterId, meterCode, meterStopCode, meterTypeId, meterDirection } = data;
          form.setFieldsValue({
            'userName': userName,
            'userPhone': userPhone,
            'userAddress': userAddress,
            'oldMeterId': meterId,
            'oldMeterCode': meterCode,
            'oldMeterStopCode': meterStopCode,
            'oldMeterTypeId': ['IC卡表', meterTypeId],
            'oldMeterDirection': meterDirection,
          });
        } else {
          message.error("户号错误，请重新输入");
        }
      }
    });
  };

  handleRepairTypeChange = (e) => {
    this.setState({
      repairTypeVal: e,
    });
  };

  handleGetMeterByMeterCode = (e) => {
    const { dispatch, form } = this.props;
    dispatch({
      type: 'entryMeter/getMeterByMeterCode',
      payload: {
        meterCode: e.target.value,
      },
      callback: (response) => {
        if (response.data === null) {
          message.error("表号错误，请重新输入");
        } else {
          const {
            data: { meterId, meterTypeId, meterDirection, meterStopCode, safetyCode, meterStatus}
          } = response;
          switch (meterStatus) {
            case 2:
              message.error("表具已被其他用户绑定，请重新输入");
              return;
            case 3:
              message.error("表具已报废，请重新输入");
              return;
            default:
              form.setFieldsValue({
                'newMeterId': meterId,
                'newMeterTypeId': ['IC卡表', meterTypeId],
                'newMeterDirection': meterDirection,
                'newMeterStopCode': meterStopCode,
                'newSafetyCode': safetyCode,
              });
          }
        }
      }
    });
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
      emp: { empList },
      modalVisible, form,
    } = this.props;
    const { repairTypeVal, endOpen } = this.state;

    return (
      <Modal
        title="新建维修单"
        visible={modalVisible}
        onOk={this.handleOK}
        onCancel={this.handleCancel}
      >
        <div style={{ overflow:"scroll", height:"400px", overflowX:'hidden' }}>
          <FormItem {...this.formStyle} label="维修单编号">
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
          <FormItem {...this.formStyle} label="户号">
            {form.getFieldDecorator('userId', {
            rules: [{
              required: true,
              message: '户号不能为空'
            }, {
              max: 10,
              message: '户号不能超过10个字',
            }]
          })(<Input onBlur={this.handleGetRepairOrderUser} />)}
          </FormItem>
          <FormItem {...this.formStyle} label="用户名称">
            {form.getFieldDecorator('userName', {
          })(<Input readOnly />)}
          </FormItem>
          <FormItem {...this.formStyle} label="用户手机">
            {form.getFieldDecorator('userPhone', {
          })(<Input readOnly />)}
          </FormItem>
          <FormItem {...this.formStyle} label="用户地址">
            {form.getFieldDecorator('userAddress', {
            rules: [{
              required: true,
              message: '用户地址不能为空！'
            }],
          })(<Input readOnly />)}
          </FormItem>
          <FormItem {...this.formStyle} label="维修类型">
            {form.getFieldDecorator('repairType', {
            rules: [{
              required: true,
              message: '维修类型不能为空！'
            }]
          })(<DictSelect onChange={this.handleRepairTypeChange} category="repair_type" />)}
          </FormItem>
          <FormItem {...this.formStyle} label="燃气设备类型">
            {form.getFieldDecorator('gasEquipmentType', {
            rules: [{
              required: true,
              message: '燃气设备类型不能为空！'
            }]
          })(<DictSelect category="gas_equipment_type" />)}
          </FormItem>
          <FormItem {...this.formStyle} label="旧表编号">
            {form.getFieldDecorator('oldMeterCode', {
          })(<Input readOnly />)}
          </FormItem>
          <FormItem {...this.formStyle} style={{ display: 'none' }} label="旧表编号表具ID">
            {form.getFieldDecorator('oldMeterId', {
          })(<Input />)}
          </FormItem>
          <FormItem {...this.formStyle} label="旧表类型">
            {form.getFieldDecorator('oldMeterTypeId', {
            })(<MeterTypeSelect readOnly style={{ "width": "100%" }} placeholder={null} />)}
          </FormItem>
          <FormItem {...this.formStyle} label="旧表表向">
            {form.getFieldDecorator('oldMeterDirection', {
          })(<DictSelect category="meter_direction" readOnly />)}
          </FormItem>
          <FormItem {...this.formStyle} label="旧表止码">
            {form.getFieldDecorator('oldMeterStopCode', {
            rules: [{
              required: true,
              message: '旧表止码不能为空！'
            }]
          })(<InputNumber style={{ "width": "100%" }} />)}
          </FormItem>
          <FormItem {...this.formStyle} label="旧安全卡编号">
            {form.getFieldDecorator('oldSafetyCode', {})(<Input />)}
          </FormItem>
          {repairTypeVal === 0 || this.repairTypeVal === 6 || this.repairTypeVal === 7 ? (
            <div>
              <FormItem {...this.formStyle} style={{ display: 'none' }} label="新表ID">
                {form.getFieldDecorator('newMeterId', {
                })(<Input />)}
              </FormItem>
              <FormItem {...this.formStyle} label="新表编号">
                {form.getFieldDecorator('newMeterCode', {
              })(<Input onBlur={this.handleGetMeterByMeterCode} />)}
              </FormItem>
              <FormItem {...this.formStyle} label="新表类型">
                {form.getFieldDecorator('newMeterTypeId', {
                // initialValue: repairOrderUser.newMeterTypeId,
              })(<MeterTypeSelect disabled style={{ "width": "100%" }} placeholder={null} />)}
              </FormItem>
              <FormItem {...this.formStyle} label="新表表向">
                {form.getFieldDecorator('newMeterDirection', {
                // initialValue: repairOrderUser.meterDirectionName,
              })(<DictSelect category="meter_direction" disabled />)}
              </FormItem>
              <FormItem {...this.formStyle} label="新表止码">
                {form.getFieldDecorator('newMeterStopCode', {})(<InputNumber style={{ "width": "100%" }} disabled />)}
              </FormItem>
              <FormItem {...this.formStyle} label="新安全卡编号">
                {form.getFieldDecorator('newSafetyCode', {})(<Input />)}
              </FormItem>
            </div>
        ) : null}
          <FormItem {...this.formStyle} label="维修故障类型">
            {form.getFieldDecorator('repairFaultType', {
            rules: [{
              required: true,
              message: '维修故障类型不能为空！'
            }]
          })(<DictSelect category="repair_fault_type" />)}
          </FormItem>
          <FormItem {...this.formStyle} label="维修结果">
            {form.getFieldDecorator('repairResultType', {
            rules: [{
              required: true,
              message: '维修结果不能为空！'
            }]
          })(<DictSelect category="repair_result_type" />)}
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
            {form.getFieldDecorator('empId', {
            initialValue: empList ? empList.empId : '',
          })(<Input />)}
          </FormItem>
          <FormItem {...this.formStyle} label="维修员姓名">
            {form.getFieldDecorator('empName', {
            rules: [{
              required: true,
              message: '维修员姓名不能为空！'
            }],
            initialValue: empList ? empList.empName : '',
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
            }]
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
export default InputAddForm;
