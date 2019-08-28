/* eslint-disable no-unused-vars */
import { Form, Input, message, Modal, Radio } from 'antd';
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
      isLowIncome: false
    };
    this.formStyle = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };
  }

  onChange = e => {
    const { form } =  this.props;
    this.setState({
      radioFlag: e.target.value,
    });
    const fieldValues = form.getFieldsValue();
    form.setFieldsValue({
      ...fieldValues,
      orderGas: null,
      orderPayment: null,
      orderDetail: null
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

  getOrderPayment = () => {
    const { form, dispatch } =  this.props;
    const userId = form.getFieldValue("userId");
    const orderGas = form.getFieldValue("orderGas");
    const couponGas = form.getFieldValue("couponGas") ? form.getFieldValue("couponGas") : 0;
    const isLowIncome = form.getFieldValue('isLowIncome');
    const useCoupon = form.getFieldValue("useCoupon");
    if(!/^[0-9]+$/.test(orderGas)){
      message.info("充值气量须为纯数字");
      return;
    }
    if (useCoupon && couponGas > orderGas) {
      message.info("充值气量不能小于气票量");
      return;
    }
    if (isLowIncome && orderGas < 4) {
      message.info("充值气量不能小于低保送气量");
      return;
    }
    if(orderGas === undefined || orderGas ==="") return;
    const fieldsValue = form.getFieldsValue();
    let actualOrderGas = orderGas;
    actualOrderGas = isLowIncome ? actualOrderGas - form.getFieldValue('freeGas') : actualOrderGas;
    actualOrderGas  = useCoupon ? actualOrderGas - couponGas: actualOrderGas;
    if (actualOrderGas < 0) {
      message.info('充值气量不能小于低保送气量和气票的总和');
      return;
    }
    dispatch({
      type: 'account/getOrderPayment',
      payload: {
        userId,
        orderGas: actualOrderGas
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
    if(couponNumbers === undefined || couponNumbers ==="")return;
    const fieldsValue = form.getFieldsValue();
    dispatch({
      type: 'coupon/getCouponPayment',
      payload: {
        couponNumbers,
      },
      callback: (response) => {
        const params = {
          ...fieldsValue,
          couponGas: response.data,
          orderGas :""
        };
        form.setFieldsValue(params);
      }
    });
  };

  handleLowIncomeChange = e => {
    const { dispatch, form } =  this.props;
    const _ = this;
    const userId = form.getFieldValue("userId");
    dispatch({
      type: 'account/checkFreeGasFlag',
      payload: {
        userId
      },
      callback: response => {
        const fieldValues = form.getFieldsValue();
        this.setState({
          ..._.state,
          isLowIncome: e.target.value,
        });
        if (response.data) {
          form.setFieldsValue({
            ...fieldValues,
            freeGas: 4,
            orderGas: null,
            orderPayment: null,
            orderDetail: null
          });
        } else {
          form.setFieldsValue({
            ...fieldValues,
            freeGas: 0,
            orderGas: null,
            orderPayment: null,
            orderDetail: null
          });
        }
      }
    });
  };

  render() {
    const {
      modalVisible,
      form,
      selectedData
    } = this.props;
    const { userId, userName, iccardIdentifier, userType } = selectedData;
    const { radioFlag, isLowIncome } = this.state;
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
        <FormItem {...this.formStyle} style={{display: 'none'}} label="用户类型">
          {form.getFieldDecorator('userType', {
            initialValue: userType
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
        <FormItem {...this.formStyle} label="是否低保户">
          {form.getFieldDecorator('isLowIncome', {
            initialValue: false,
          })(
            <Radio.Group onChange={this.handleLowIncomeChange}>
              <Radio value={false}>否</Radio>
              <Radio value>是</Radio>
            </Radio.Group>
          )}
        </FormItem>
        {isLowIncome ? (
          <FormItem {...this.formStyle} label="低保送气">
            {form.getFieldDecorator('freeGas', {
            })(<Input disabled />)}
          </FormItem>) : null
        }
        <FormItem {...this.formStyle} label="是否使用劵">
          {form.getFieldDecorator('useCoupon', {
            initialValue: 1,
          })(
            <Radio.Group onChange={this.onChange}>
              <Radio value={1}>否</Radio>
              <Radio value={2}>是</Radio>
            </Radio.Group>
          )}
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
          {form.getFieldDecorator('orderGas', {
            rules: [{
              pattern: /^[1-9]\d*$/,
              message: '充值气量不能小于等于0！',
            }],
          })(<Input onBlur={this.getOrderPayment} />)}
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
