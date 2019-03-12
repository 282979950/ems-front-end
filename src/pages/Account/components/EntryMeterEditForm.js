import { Form, Input, Modal, DatePicker } from 'antd';
import React, { PureComponent } from 'react';
import moment from 'moment';
import MeterTypeSelect from './MeterTypeSelect';
import DictSelect from '../../System/components/DictSelect';

const FormItem = Form.Item;
const { MonthPicker } = DatePicker;


@Form.create({
  mapPropsToFields(props) {
    const { selectedData } = props;
    return {
      meterId: Form.createFormField({
        value: selectedData.meterId
      }),
      meterCode: Form.createFormField({
        value: selectedData.meterCode
      }),
      meterStopCode: Form.createFormField({
        value: selectedData.meterStopCode
      }),
      meterType: Form.createFormField({
        value: [selectedData.meterCategory, selectedData.meterType],
      }),
      meterDirection: Form.createFormField({
        value: selectedData.meterDirection
      }),
      meterProdDate: Form.createFormField({
        value: moment(selectedData.meterProdDate, 'YYYY-MM'),
      }),
      meterEntryDate: Form.createFormField({
        value: moment(selectedData.meterEntryDate, 'YYYY-MM-DD'),
      })
    };
  }
})
class EntryMeterEditForm extends PureComponent{
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
      handleEdit({
        ...fieldsValue,
        meterCategory: fieldsValue.meterType[0],
        meterType: fieldsValue.meterType[1],
        meterProdDate: fieldsValue.meterProdDate.format('YYYY-MM'),
        meterEntryDate: fieldsValue.meterEntryDate.format('YYYY-MM-DD')
      });
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
        title="编辑入库信息"
        visible={modalVisible}
        onOk={this.handleOK}
        onCancel={this.handleCancel}
      >
        <FormItem {...this.formStyle} style={{display: 'none'}} label="表具ID">
          {form.getFieldDecorator('meterId', {})(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="表具编号">
          {form.getFieldDecorator('meterCode', {
            rules: [{
              required: true,
              message: '表具编号不能为空！',
            }, {
              length: 12,
              message: '表具编号长度必须为12位',
            }],
          })(<Input />)}
        </FormItem>
        <FormItem {...this.formStyle} label="表止码">
          {form.getFieldDecorator('meterStopCode')(
            <Input />
          )}
        </FormItem>
        <FormItem {...this.formStyle} label="表具型号">
          {form.getFieldDecorator('meterType', {
            rules: [{
              required: true,
              message: '表具型号不能为空！'
            }],
          })(<MeterTypeSelect placeholder={null} style={{"width":"100%"}} />)}
        </FormItem>
        <FormItem {...this.formStyle} label="表向">
          {form.getFieldDecorator('meterDirection', {
            rules: [{
              required: true,
              message: '表具型号不能为空！'
            }],
          })(<DictSelect category="meter_direction" />)}
        </FormItem>
        <FormItem {...this.formStyle} label="生产日期">
          {form.getFieldDecorator('meterProdDate', {
            rules: [{
              required: true,
              message: '生产日期不能为空！'
            }],
          })(<MonthPicker placeholder="生产日期" style={{"width":"100%"}} />)}
        </FormItem>
        <FormItem {...this.formStyle} label="入库日期">
          {form.getFieldDecorator('meterEntryDate', {
            rules: [{
              required: true,
              message: '入库日期不能为空！'
            }],
          })(<DatePicker placeholder="生产日期" style={{"width":"100%"}} />)}
        </FormItem>
      </Modal>
    );
  }
}
export default EntryMeterEditForm;
