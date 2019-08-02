/* eslint-disable no-unused-vars */
import { Form, Input, Modal, Button, message, Radio } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import DictSelect from '../../System/components/DictSelect';

const FormItem = Form.Item;

@connect(({ coupon,account, loading }) => ({
  coupon,
  account,
  loading: loading.models.account,
}))
@Form.create()
class ReplaceCardForm extends PureComponent {
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
    this.setState({
      radioFlag : 1,
      isLowIncome: false
    });
    handleCancel();
  };

  getOrderPayment = () => {
    const { form, dispatch } =  this.props;
    const userId = form.getFieldValue("userId");
    const orderGas = form.getFieldValue("orderGas");
    const couponGas = form.getFieldValue("couponGas") ? form.getFieldValue("couponGas") : 0;
    const isLowIncome = form.getFieldValue('isLowIncome');
    const useCoupon = form.getFieldValue("useCoupon");
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

  getCardIdentifier = () => {
    const { getCardIdentifier, form } = this.props;
    const fieldsValue = form.getFieldsValue();
    const result = getCardIdentifier();
    if (result === '读卡失败') {
      message.error(result);
      form.setFieldsValue({
        "nIcCardIdentifier": "",
      });
    } else if (result === '该卡片类型不是新卡') {
      message.error(result);
      form.setFieldsValue({
        "nIcCardIdentifier": "",
      });
    } else {
      form.setFieldsValue({
        "nIcCardIdentifier": result,
      })
    }
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
            freeGas: 4
          });
        } else {
          form.setFieldsValue({
            ...fieldValues,
            freeGas: 0
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
    const { userId, iccardId, userName, iccardIdentifier } = selectedData;
    const { radioFlag, isLowIncome } = this.state;
    return (
      <Modal
        title="补卡充值"
        visible={modalVisible}
        onOk={this.handleOK}
        onCancel={this.handleCancel}
      >
        <FormItem {...this.formStyle} style={{ display: 'none' }} label="户号">
          {form.getFieldDecorator('userId', {
            initialValue: userId
          })(<Input disabled />)}
        </FormItem>
        <FormItem {...this.formStyle} style={{ display: 'none' }} label="IC卡号">
          {form.getFieldDecorator('iccardId', {
            initialValue: iccardId
          })(<Input disabled />)}
        </FormItem>
        <FormItem {...this.formStyle} label="用户姓名">
          {form.getFieldDecorator('userName', {
            initialValue: userName,
          })(<Input disabled />)}
        </FormItem>
        <FormItem {...this.formStyle} label="旧IC卡识别号">
          {form.getFieldDecorator('iccardIdentifier', {
            initialValue: iccardIdentifier,
          })(<Input disabled />)}
        </FormItem>
        <FormItem {...this.formStyle} label="新IC卡识别号">
          {form.getFieldDecorator('nIcCardIdentifier', {
            rules: [{
              required: true,
              message: 'IC卡识别号不能为空！'
            }],
          })(<Input disabled />)}
          <Button type="primary" onClick={this.getCardIdentifier}>识别IC卡</Button>
        </FormItem>
        <FormItem {...this.formStyle} label="补卡费用">
          {form.getFieldDecorator('cardCost', {
            rules: [{
              required: true,
              message: '补卡费用不能为空！'
            }],
          })(<DictSelect category='card_cost' />)}
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
          <Radio.Group name="useCoupon" onChange={this.onChange} defaultValue={1}>
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
          {form.getFieldDecorator('orderGas', {
            rules: [{
              required: true,
              message: '充值气量不能为空！'
            }],
          })(<Input onBlur={this.getOrderPayment} />)}
        </FormItem>
        <FormItem {...this.formStyle} label="充值金额">
          {form.getFieldDecorator('orderPayment', {
            rules: [{
              required: true,
              message: '充值金额不能为空！'
            }],
          })(<Input disabled />)}
        </FormItem>
        <FormItem {...this.formStyle} label="订单详情">
          {form.getFieldDecorator('orderDetail', {})(<Input disabled />)}
        </FormItem>
      </Modal>
    );
  }
}
export default ReplaceCardForm;
