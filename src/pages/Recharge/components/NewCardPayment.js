/* eslint-disable no-unused-vars */
import { Form, Input, Modal, Radio } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'dva';

const FormItem = Form.Item;

@connect(({ coupon,account, loading }) => ({
  coupon,
  account,
  loading: loading.models.account,
}))
@Form.create()
class NewCardPayment extends PureComponent{
  constructor(props) {
    super(props);
    this.state = {
      radioFlag : 1,
    };
    this.formStyle = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };
  }

  onChange = e => {
    console.log('radio checked', e.target.value);
    const { form } =  this.props;
    const orderGas = form.getFieldValue("orderGas");
    this.setState({
      radioFlag: e.target.value,
    });
    const params = {
      orderGas :e.target.value===1 && orderGas!==undefined?"":orderGas
    };
    form.setFieldsValue(params);
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

  getOrderPayment = () => {
    const { form, dispatch } =  this.props;
    const userId = form.getFieldValue("userId");
    const orderGas = form.getFieldValue("orderGas");
    const couponGas = form.getFieldValue("couponGas") ? form.getFieldValue("couponGas") : 0;
    if(orderGas === undefined || orderGas ==="")return;
    const fieldsValue = form.getFieldsValue();
    dispatch({
      type: 'account/getOrderPayment',
      payload: {
        userId,
        orderGas: orderGas> couponGas? orderGas-couponGas : 0
      },
      callback: (response) => {
        const params = {
          ...fieldsValue,
          orderPayment: response.data,
          orderDetail: response.message
        };
        form.setFieldsValue(params);
      }
    });
  };

  getCouponPayment = () => {
    const { form, dispatch } =  this.props;
    const couponNumbers = form.getFieldValue("couponNumber");
    // 方便重置之前查询的气量
    const orderGas = form.getFieldValue("orderGas")? form.getFieldValue("orderGas") : "";
    console.log(couponNumbers)
    if(couponNumbers === undefined || couponNumbers ==="")return;
    const fieldsValue = form.getFieldsValue();
    dispatch({
      type: 'coupon/getCouponPayment',
      payload: {
        couponNumbers,
      },
      callback: (response) => {
        console.log(response)
        const params = {
          ...fieldsValue,
          couponGas: response.data,
          orderGas :""
        };
        form.setFieldsValue(params);
      }
    });
  };

  render() {
    const {
      modalVisible,
      form,
      selectedData
    } = this.props;
    const { userId, userName, iccardIdentifier } = selectedData;
    const { radioFlag } = this.state;
    return (
      <Modal
        title="发卡充值"
        visible={modalVisible}
        onOk={this.handleOK}
        onCancel={this.handleCancel}
      >
        <FormItem {...this.formStyle} style={{display: 'none'}} label="户号">
          {form.getFieldDecorator('userId', {
            initialValue: userId
          })(<Input disabled />)}
        </FormItem>
        <FormItem {...this.formStyle} label="用户姓名">
          {form.getFieldDecorator('userName', {
            initialValue: userName,
          })(<Input disabled />)}
        </FormItem>
        <FormItem {...this.formStyle} label="IC卡识别号">
          {form.getFieldDecorator('iccardIdentifier', {
            initialValue: iccardIdentifier,
          })(<Input disabled />)}
        </FormItem>
        <FormItem {...this.formStyle} label="是否使用劵">
          <Radio.Group name="radiogroup" onChange={this.onChange} defaultValue={1}>
            <Radio value={1}>否</Radio>
            <Radio value={2}>是</Radio>
          </Radio.Group>
        </FormItem>
        {radioFlag === 2 ?(
          <FormItem {...this.formStyle} label="购气劵编号">
            {form.getFieldDecorator('couponNumber', {})(<Input onBlur={this.getCouponPayment} />)}
          </FormItem>
        ):null
        }
        {radioFlag === 2 ?(
          <FormItem {...this.formStyle} label="购气劵面值">
            {form.getFieldDecorator('couponGas', {
              rules: [{
                required: true,
                message: '请核对购气劵编号或查看是否开放'
              }],
            })(<Input disabled />)}
          </FormItem>
        ):null
        }
        <FormItem {...this.formStyle} label="充值气量">
          {form.getFieldDecorator('orderGas', {})(<Input onBlur={this.getOrderPayment} />)}
        </FormItem>
        <FormItem {...this.formStyle} label="充值金额">
          {form.getFieldDecorator('orderPayment', {})(<Input disabled />)}
        </FormItem>
        <FormItem {...this.formStyle} label="订单详情">
          {form.getFieldDecorator('orderDetail', {})(<Input disabled />)}
        </FormItem>
      </Modal>
    );
  }
}
export default NewCardPayment;
