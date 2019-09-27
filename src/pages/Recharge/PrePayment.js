/* eslint-disable no-unused-vars */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  message,
  Modal
} from 'antd';
import router from 'umi/router';
import StandardTable from '../../components/StandardTable';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import Authorized from '../../utils/Authorized';
import styles from '../Common.less';
import OCX from '../../components/OCX';
import PrePaymentForm from './components/PrePaymentForm';
import NewCardPayment from './components/NewCardPayment';
import AddGasPaymentForm from './components/AddGasPaymentForm';

@connect(({ prePayment, orderManagement, loading }) => ({
  prePayment,
  orderManagement,
  loading: loading.models.prePayment,
}))
@Form.create()
class PrePayment extends PureComponent {
  state = {
    prePaymentModalVisible: false,
    newCardPaymentModalVisible: false,
    addGasPaymentModalVisible: false,
    selectedRows: [],
    formValues: {},
    pageNum: 1,
    pageSize: 10,
  };

  columns = [
    {
      title: '户号',
      dataIndex: 'userId',
    },
    {
      title: 'IC卡号',
      dataIndex: 'iccardId',
    },
    {
      title: 'IC卡识别号',
      dataIndex: 'iccardIdentifier',
    },
    {
      title: '用户名称',
      dataIndex: 'userName',
    },
    {
      title: '手机',
      dataIndex: 'userPhone',
    },
    {
      title: '用户地址',
      dataIndex: 'userAddress',
    },
    {
      title: '用户类型',
      dataIndex: 'userTypeName',
    },
    {
      title: '用气类型',
      dataIndex: 'userGasTypeName',
    },
    {
      title: '购气次数',
      dataIndex: 'totalOrderTimes',
    },
    {
      title: '购气总量',
      dataIndex: 'totalOrderGas',
    },
    {
      title: '购气总额',
      dataIndex: 'totalOrderPayment',
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    // dispatch({
    //   type: 'prePayment/fetch',
    //   payload: {
    //     pageNum,
    //     pageSize,
    //   },
    // })
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      pageNum: 1,
      pageSize: 10
    });
    dispatch({
      type: 'prePayment/fetch',
      payload: {
        pageNum: 1,
        pageSize: 10
      },
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = () => {
    const { dispatch, form } = this.props;

    form.setFieldsValue({
      'userName': form.getFieldValue('userName') && form.getFieldValue('userName').trim(),
      'iccardId': form.getFieldValue('iccardId') && form.getFieldValue('iccardId').trim(),
      'iccardIdentifier': form.getFieldValue('iccardIdentifier') && form.getFieldValue('iccardIdentifier').trim()
    });
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        formValues: fieldsValue,
        pageNum: 1,
        pageSize: 10
      });
      dispatch({
        type: 'prePayment/search',
        payload: {
          ...fieldsValue,
          pageNum: 1,
          pageSize: 10,
        },
      });
    });
  };

  handlePrePaymentFormVisible = flag => {
    if (flag) {
      const { selectedRows } = this.state;
      const result = OCX.readCard();
      if (result[0] !== 'S') {
        message.error("读卡失败");
        return;
      }
      if (result[1] === '0') {
        message.info('该卡为新卡，请使用发卡充值');
        return;
      }
      if (result[1] === '1') {
        message.info('该卡为密码传递卡，不能充值');
        return;
      }
      if (result[2] !== selectedRows[0].iccardIdentifier) {
        message.info("该卡不是与该用户绑定的卡");
        return;
      }
      if (result[4] !== 0) {
        Modal.confirm({
          title: '是否继续充值',
          content: '卡内已有未圈存的气量,确认覆盖已有气量继续充值吗？',
          okText: '继续充值',
          onOk: () => {
            this.setState({
              prePaymentModalVisible: !!flag,
            });
          },
          cancelText: '取消',
        });
      } else {
        this.setState({
          prePaymentModalVisible: !!flag,
        });
      }
    } else {
      this.setState({
        prePaymentModalVisible: !!flag,
      });
    }
  };

  handleNewCardPaymentFormVisible = flag => {
    if (flag) {
      const { selectedRows } = this.state;
      const result = OCX.readCard();
      if (result[0] !== 'S') {
        message.error("读卡失败");
        return;
      }
      if (result[1] !== '0') {
        message.info('只能对新卡进行发卡充值');
        return;
      }
      if (result[2] !== selectedRows[0].iccardIdentifier) {
        message.info("该卡不是与该用户绑定的卡");
        return;
      }
      this.setState({
        newCardPaymentModalVisible: !!flag,
      });
    } else {
      this.setState({
        newCardPaymentModalVisible: !!flag,
      });
    }
  };

  handleEdit = fields => {
    this.handlePrePaymentFormVisible();
    if(!/^[0-9]+$/.test(fields.orderGas)){
      message.info("提交失败：充值气量须为纯数字");
      return;
    }
    if(fields.freeGas===0){
      message.info("提交失败：低保气量不能为0");
      return;
    }
    const { dispatch } = this.props;
    const { selectedRows, pageNum, pageSize } = this.state;
    this.handleSelectedRowsReset();
    dispatch({
      type: 'prePayment/edit',
      payload: fields,
      callback: (response) => {
        if (response.status === 0) {
          const { data } = response;
          const { iccardId, iccardPassword, orderGas, flowNumber, orderId, serviceTimes } = data;
          const wResult = OCX.writeUCard(iccardId, iccardPassword, orderGas, serviceTimes, flowNumber);
          if (wResult === '写卡成功') {
            dispatch({
              type: 'order/updateOrderStatus',
              payload: {
                orderId,
                orderStatus: 2
              },
              callback: (response2) => {
                if (response2.status === 0) {
                  // 创建当前日期
                  const nowDate = new Date();
                  const Y = nowDate.getFullYear();
                  const M = nowDate.getMonth()+1;
                  const D = nowDate.getDate();
                  dispatch({
                    type: 'prePayment/search',
                    payload: {
                      iccardIdentifier: selectedRows[0].iccardIdentifier,
                      pageNum,
                      pageSize
                    },
                  });
                  const modal = Modal.info();
                  // 若使用了优惠券和低保送气则减去优惠券和低保部分并打印发票
                  if(((fields.couponGas !== undefined || fields.couponGas !== '') && fields.freeGas!==0) && fields.orderGas> fields.couponGas+fields.freeGas){
                    // 使用发票打印时需要验证发票信息
                    modal.update({
                      title: "请输入纳税人识别号码",
                      content: <input name="number" />,
                      onOk: () => {
                        const serialNumber = document.getElementsByName("number")[0].value;
                        Modal.confirm({
                          title: '写卡成功，请打印发票',
                          content: (
                            <div>
                              <p style={{color:"red"}}>基本信息：</p>
                              <p>IC卡识别号：{fields.iccardIdentifier}<br />姓名：{fields.userName}<br />本次购气量：{fields.orderGas}<br />本次支付金额：{fields.orderPayment}<br />详情：{fields.orderDetail}<br />地址：{selectedRows[0].userAddress}</p>
                              <br /><br /><p style={{color:"red"}}>发票打印信息：</p>
                              <div id="billDetails">
                                <div style={{color:"black"}}>
                                  <Row>
                                    <Col>&nbsp;</Col>
                                  </Row>
                                  <Row>
                                    <Col>&nbsp;</Col>
                                  </Row>
                                  <Row>
                                    <Col span={4}>&nbsp;</Col>
                                    <Col>{`${Y  }-${ M  }-${  D}`}</Col>
                                  </Row>
                                  <Row>
                                    <Col>&nbsp;</Col>
                                  </Row>
                                  <Row>
                                    <Col>&nbsp;</Col>
                                  </Row>
                                  <Row>
                                    <Col span={11}>用户编号：{selectedRows[0].userId}</Col>
                                    <Col>用户名称：{selectedRows[0].userName}</Col>
                                  </Row>
                                  <Row>
                                    <Col span={18}>用户地址：{selectedRows[0].userAddress}</Col>
                                  </Row>
                                  <Row>
                                    <Col>纳税人识别号：{serialNumber}</Col>
                                  </Row>
                                  <Row>
                                    <Col span={8}>本次购买气量(单位：方)：{fields.orderGas-fields.couponGas-fields.freeGas}</Col>
                                    <Col>本次充值金额(单位：元)：{fields.orderPayment}</Col>
                                  </Row>
                                  <Row>
                                    <Col>&nbsp;</Col>
                                  </Row>
                                  <Row>
                                    <Col>详&nbsp;情：{fields.orderDetail}</Col>
                                  </Row>
                                  <Row>
                                    <Col>&nbsp;</Col>
                                  </Row>
                                  <Row>
                                    <Col span={2}>&nbsp;</Col>
                                    <Col span={13}>{data.rmbBig?data.rmbBig:""}</Col>
                                    <Col>{fields.orderPayment}</Col>
                                  </Row>
                                  <Row>
                                    <Col span={18}>&nbsp;</Col>
                                    <Col>{data.name?data.name:""}</Col>
                                  </Row>
                                </div>
                              </div>
                            </div>
                          ),
                          okText: '打印发票',
                          onOk: () => {
                            // 验证发票信息开始
                            const temp = window.document.getElementById('billDetails').innerHTML;
                            dispatch({
                              type: 'orderManagement/checkNewInvoicePrint',
                              payload: {
                                orderId: selectedRows[0].orderId,
                              },
                              callback: response3 => {
                                if (response3.data) {
                                  dispatch({
                                    type: 'orderManagement/findInvoice',
                                    payload: {
                                      orderId: data.orderId,
                                      userId: selectedRows[0].userId,
                                      printType: 1
                                    },
                                    callback: (response4) => {
                                      if (response4.status === 0) {
                                        dispatch({
                                          type: 'orderManagement/printInvoice',
                                          payload: {
                                            orderId: data.orderId,
                                            invoiceCode: response4.data.invoiceCode,
                                            invoiceNumber: response4.data.invoiceNumber,
                                            orderPayment:fields.orderPayment,
                                          },
                                          callback: response5 => {
                                            if (response5.status !== 0) {
                                              message.error(response5.message);
                                            }else{
                                              // 验证发票信息结束
                                              window.document.body.innerHTML = temp;
                                              window.print();
                                              window.location.reload();
                                            }
                                          }
                                        });
                                      } else {
                                        message.error(response4.message);
                                      }
                                    }
                                  });
                                } else {
                                  message.info(response3.message);
                                }
                              }
                            });
                          },
                          cancelText: '取消',
                          width:560,
                        });
                      }
                    });
                  }
                  // 只使用低保送气量，且大于充值气量时
                  if(((fields.couponGas === undefined || fields.couponGas === '')&& fields.freeGas!==0) && fields.orderGas> fields.freeGas){
                    // 使用发票打印时需要验证发票信息
                    modal.update({
                      title: "请输入纳税人识别号码",
                      content: <input name="number" />,
                      onOk: () => {
                        const serialNumber = document.getElementsByName("number")[0].value;
                        Modal.confirm({
                          title: '写卡成功，请打印发票',
                          content: (
                            <div>
                              <p style={{color:"red"}}>基本信息：</p>
                              <p>IC卡识别号：{fields.iccardIdentifier}<br />姓名：{fields.userName}<br />本次购气量：{fields.orderGas}<br />本次支付金额：{fields.orderPayment}<br />详情：{fields.orderDetail}<br />地址：{selectedRows[0].userAddress}</p>
                              <br /><br /><p style={{color:"red"}}>发票打印信息：</p>
                              <div id="billDetails">
                                <div style={{color:"black"}}>
                                  <Row>
                                    <Col>&nbsp;</Col>
                                  </Row>
                                  <Row>
                                    <Col>&nbsp;</Col>
                                  </Row>
                                  <Row>
                                    <Col span={4}>&nbsp;</Col>
                                    <Col>{`${Y  }-${ M  }-${  D}`}</Col>
                                  </Row>
                                  <Row>
                                    <Col>&nbsp;</Col>
                                  </Row>
                                  <Row>
                                    <Col>&nbsp;</Col>
                                  </Row>
                                  <Row>
                                    <Col span={11}>用户编号：{selectedRows[0].userId}</Col>
                                    <Col>用户名称：{selectedRows[0].userName}</Col>
                                  </Row>
                                  <Row>
                                    <Col span={18}>用户地址：{selectedRows[0].userAddress}</Col>
                                  </Row>
                                  <Row>
                                    <Col>纳税人识别号：{serialNumber}</Col>
                                  </Row>
                                  <Row>
                                    <Col span={8}>本次购买气量(单位：方)：{fields.orderGas-fields.freeGas}</Col>
                                    <Col>本次充值金额(单位：元)：{fields.orderPayment}</Col>
                                  </Row>
                                  <Row>
                                    <Col>&nbsp;</Col>
                                  </Row>
                                  <Row>
                                    <Col>详&nbsp;情：{fields.orderDetail}</Col>
                                  </Row>
                                  <Row>
                                    <Col>&nbsp;</Col>
                                  </Row>
                                  <Row>
                                    <Col span={2}>&nbsp;</Col>
                                    <Col span={13}>{data.rmbBig?data.rmbBig:""}</Col>
                                    <Col>{fields.orderPayment}</Col>
                                  </Row>
                                  <Row>
                                    <Col span={18}>&nbsp;</Col>
                                    <Col>{data.name?data.name:""}</Col>
                                  </Row>
                                </div>
                              </div>
                            </div>
                          ),
                          okText: '打印发票',
                          onOk: () => {
                            // 验证发票信息开始
                            const temp = window.document.getElementById('billDetails').innerHTML;
                            dispatch({
                              type: 'orderManagement/checkNewInvoicePrint',
                              payload: {
                                orderId: selectedRows[0].orderId,
                              },
                              callback: response3 => {
                                if (response3.data) {
                                  dispatch({
                                    type: 'orderManagement/findInvoice',
                                    payload: {
                                      orderId: data.orderId,
                                      userId: selectedRows[0].userId,
                                      printType: 1
                                    },
                                    callback: (response4) => {
                                      if (response4.status === 0) {
                                        dispatch({
                                          type: 'orderManagement/printInvoice',
                                          payload: {
                                            orderId: data.orderId,
                                            invoiceCode: response4.data.invoiceCode,
                                            invoiceNumber: response4.data.invoiceNumber,
                                            orderPayment:fields.orderPayment,
                                          },
                                          callback: response5 => {
                                            if (response5.status !== 0) {
                                              message.error(response5.message);
                                            }else{
                                              // 验证发票信息结束
                                              window.document.body.innerHTML = temp;
                                              window.print();
                                              window.location.reload();
                                            }
                                          }
                                        });
                                      } else {
                                        message.error(response4.message);
                                      }
                                    }
                                  });
                                } else {
                                  message.info(response3.message);
                                }
                              }
                            });
                          },
                          cancelText: '取消',
                          width:560,
                        });
                      }
                    });
                  }
                  // 只使用优惠券并且充值气量大于优惠券气量时
                  if(((fields.couponGas !== undefined || fields.couponGas !== '') && (fields.freeGas ===0 || fields.freeGas === undefined)) && fields.orderGas> fields.couponGas){
                    // 使用发票打印时需要验证发票信息
                    modal.update({
                      title: "请输入纳税人识别号码",
                      content: <input name="number" />,
                      onOk: () => {
                        const serialNumber = document.getElementsByName("number")[0].value;
                        Modal.confirm({
                          title: '写卡成功，请打印发票',
                          content: (
                            <div>
                              <p style={{color:"red"}}>基本信息：</p>
                              <p>IC卡识别号：{fields.iccardIdentifier}<br />姓名：{fields.userName}<br />本次购气量：{fields.orderGas}<br />本次支付金额：{fields.orderPayment}<br />详情：{fields.orderDetail}<br />地址：{selectedRows[0].userAddress}</p>
                              <br /><br /><p style={{color:"red"}}>发票打印信息：</p>
                              <div id="billDetails">
                                <div style={{color:"black"}}>
                                  <Row>
                                    <Col>&nbsp;</Col>
                                  </Row>
                                  <Row>
                                    <Col>&nbsp;</Col>
                                  </Row>
                                  <Row>
                                    <Col span={4}>&nbsp;</Col>
                                    <Col>{`${Y  }-${ M  }-${  D}`}</Col>
                                  </Row>
                                  <Row>
                                    <Col>&nbsp;</Col>
                                  </Row>
                                  <Row>
                                    <Col>&nbsp;</Col>
                                  </Row>
                                  <Row>
                                    <Col span={11}>用户编号：{selectedRows[0].userId}</Col>
                                    <Col>用户名称：{selectedRows[0].userName}</Col>
                                  </Row>
                                  <Row>
                                    <Col span={18}>用户地址：{selectedRows[0].userAddress}</Col>
                                  </Row>
                                  <Row>
                                    <Col>纳税人识别号：{serialNumber}</Col>
                                  </Row>
                                  <Row>
                                    <Col span={8}>本次购买气量(单位：方)：{fields.orderGas-fields.couponGas}</Col>
                                    <Col>本次充值金额(单位：元)：{fields.orderPayment}</Col>
                                  </Row>
                                  <Row>
                                    <Col>&nbsp;</Col>
                                  </Row>
                                  <Row>
                                    <Col>详&nbsp;情：{fields.orderDetail}</Col>
                                  </Row>
                                  <Row>
                                    <Col>&nbsp;</Col>
                                  </Row>
                                  <Row>
                                    <Col span={2}>&nbsp;</Col>
                                    <Col span={13}>{data.rmbBig?data.rmbBig:""}</Col>
                                    <Col>{fields.orderPayment}</Col>
                                  </Row>
                                  <Row>
                                    <Col span={18}>&nbsp;</Col>
                                    <Col>{data.name?data.name:""}</Col>
                                  </Row>
                                </div>
                              </div>
                            </div>
                          ),
                          okText: '打印发票',
                          onOk: () => {
                            // 验证发票开始
                            const temp = window.document.getElementById('billDetails').innerHTML;
                            dispatch({
                              type: 'orderManagement/checkNewInvoicePrint',
                              payload: {
                                orderId: selectedRows[0].orderId,
                              },
                              callback: response3 => {
                                if (response3.data) {
                                  dispatch({
                                    type: 'orderManagement/findInvoice',
                                    payload: {
                                      orderId: data.orderId,
                                      userId: selectedRows[0].userId,
                                      printType: 1
                                    },
                                    callback: (response4) => {
                                      if (response4.status === 0) {
                                        dispatch({
                                          type: 'orderManagement/printInvoice',
                                          payload: {
                                            orderId: data.orderId,
                                            invoiceCode: response4.data.invoiceCode,
                                            invoiceNumber: response4.data.invoiceNumber,
                                            orderPayment:fields.orderPayment,
                                          },
                                          callback: response5 => {
                                            if (response5.status !== 0) {
                                              message.error(response5.message);
                                            }else{
                                              // 验证发票结束
                                              window.document.body.innerHTML = temp;
                                              window.print();
                                              window.location.reload();

                                            }
                                          }
                                        });
                                      } else {
                                        message.error(response4.message);
                                      }
                                    }
                                  });
                                } else {
                                  message.info(response3.message);
                                }
                              }
                            });
                          },
                          cancelText: '取消',
                          width:560,
                        });
                      }
                    });
                  }
                  // 若只单独使用了优惠券且与充值气量相等时则提示打印凭证
                  if(((fields.couponGas !== undefined || fields.couponGas !== '') && (fields.freeGas ===0 || fields.freeGas === undefined)) && fields.orderGas === `${fields.couponGas}`){
                    Modal.info({
                      title: '写卡成功，请打印凭证',
                      content: (
                        <div>
                          <p style={{color:"red"}}>基本信息：</p>
                          <p>IC卡识别号：{fields.iccardIdentifier}<br />姓名：{fields.userName}<br />本次购气量：{fields.orderGas}<br />本次支付金额：{fields.orderPayment}<br />详情：{fields.orderDetail}<br />地址：{selectedRows[0].userAddress}</p>
                          <br /><br /><p style={{color:"red"}}>凭证打印信息：</p>
                          <div id="billDetails">
                            <div style={{color:"black"}}>
                              <Row>
                                <Col>&nbsp;</Col>
                              </Row>
                              <Row>
                                <Col>&nbsp;</Col>
                              </Row>
                              <Row>
                                <Col span={4}>&nbsp;</Col>
                                <Col>{`${Y  }-${ M  }-${  D}`}</Col>
                              </Row>
                              <Row>
                                <Col>&nbsp;</Col>
                              </Row>
                              <Row>
                                <Col>&nbsp;</Col>
                              </Row>
                              <Row>
                                <Col span={11}>用户编号：{selectedRows[0].userId}</Col>
                                <Col>用户名称：{selectedRows[0].userName}</Col>
                              </Row>
                              <Row>
                                <Col span={18}>用户地址：{selectedRows[0].userAddress}</Col>
                              </Row>
                              <Row>
                                <Col>&nbsp;</Col>
                              </Row>
                              <Row>
                                <Col span={8}>本次购买气量(单位：方)：{fields.orderGas-fields.couponGas}</Col>
                                <Col>本次充值金额(单位：元)：{fields.orderPayment}</Col>
                              </Row>
                              <Row>
                                {fields.isLowIncome ? <Col span={8}>低保赠送气量(单位：方)：{fields.freeGas}</Col>: <Col>&nbsp;</Col>}
                              </Row>
                              <Row>
                                <Col>详&nbsp;情：{fields.orderDetail}</Col>
                              </Row>
                              <Row>
                                <Col>&nbsp;</Col>
                              </Row>
                              <Row>
                                <Col span={2}>&nbsp;</Col>
                                <Col span={13}>{data.rmbBig?data.rmbBig:""}</Col>
                                <Col>{fields.orderPayment}</Col>
                              </Row>
                              <Row>
                                <Col span={18}>&nbsp;</Col>
                                <Col>{data.name?data.name:""}</Col>
                              </Row>
                            </div>
                          </div>
                        </div>
                      ),
                      okText: '打印凭证',
                      onOk: () => {
                        const temp = window.document.getElementById('billDetails').innerHTML;;
                        window.document.body.innerHTML = temp;
                        window.print();
                        window.location.reload();
                      },
                      cancelText: '取消',
                      width:560,
                    });
                  }
                  // 若只单独使用低保送气量且与充值气量相等则打印凭证
                  if(((fields.couponGas === undefined || fields.couponGas === '') && fields.freeGas!==0) && fields.orderGas === `${fields.freeGas}`){
                    Modal.info({
                      title: '写卡成功，请打印凭证',
                      content: (
                        <div>
                          <p style={{color:"red"}}>基本信息：</p>
                          <p>IC卡识别号：{fields.iccardIdentifier}<br />姓名：{fields.userName}<br />本次购气量：{fields.orderGas}<br />本次支付金额：{fields.orderPayment}<br />详情：{fields.orderDetail}<br />地址：{selectedRows[0].userAddress}</p>
                          <br /><br /><p style={{color:"red"}}>凭证打印信息：</p>
                          <div id="billDetails">
                            <div style={{color:"black"}}>
                              <Row>
                                <Col>&nbsp;</Col>
                              </Row>
                              <Row>
                                <Col>&nbsp;</Col>
                              </Row>
                              <Row>
                                <Col span={4}>&nbsp;</Col>
                                <Col>{`${Y  }-${ M  }-${  D}`}</Col>
                              </Row>
                              <Row>
                                <Col>&nbsp;</Col>
                              </Row>
                              <Row>
                                <Col>&nbsp;</Col>
                              </Row>
                              <Row>
                                <Col span={11}>用户编号：{selectedRows[0].userId}</Col>
                                <Col>用户名称：{selectedRows[0].userName}</Col>
                              </Row>
                              <Row>
                                <Col span={18}>用户地址：{selectedRows[0].userAddress}</Col>
                              </Row>
                              <Row>
                                <Col>&nbsp;</Col>
                              </Row>
                              <Row>
                                <Col span={8}>本次购买气量(单位：方)：{fields.orderGas-fields.freeGas}</Col>
                                <Col>本次充值金额(单位：元)：{fields.orderPayment}</Col>
                              </Row>
                              <Row>
                                {fields.isLowIncome ? <Col span={8}>低保赠送气量(单位：方)：{fields.freeGas}</Col>: <Col>&nbsp;</Col>}
                              </Row>
                              <Row>
                                <Col>详&nbsp;情：{fields.orderDetail}</Col>
                              </Row>
                              <Row>
                                <Col>&nbsp;</Col>
                              </Row>
                              <Row>
                                <Col span={2}>&nbsp;</Col>
                                <Col span={13}>{data.rmbBig?data.rmbBig:""}</Col>
                                <Col>{fields.orderPayment}</Col>
                              </Row>
                              <Row>
                                <Col span={18}>&nbsp;</Col>
                                <Col>{data.name?data.name:""}</Col>
                              </Row>
                            </div>
                          </div>
                        </div>
                      ),
                      okText: '打印凭证',
                      onOk: () => {
                        window.document.body.innerHTML = window.document.getElementById('billDetails').innerHTML;
                        window.print();
                        window.location.reload();
                      },
                      cancelText: '取消',
                      width:560,
                    });
                  }
                  // 若使用低保送气量与优惠券且与充值气量相等则打印凭证
                  if(((fields.couponGas !== undefined || fields.couponGas !== '')&& fields.freeGas!==0) && fields.orderGas === `${fields.couponGas + fields.freeGas}`){
                    Modal.info({
                      title: '写卡成功，请打印凭证',
                      content: (
                        <div>
                          <p style={{color:"red"}}>基本信息：</p>
                          <p>IC卡识别号：{fields.iccardIdentifier}<br />姓名：{fields.userName}<br />本次购气量：{fields.orderGas}<br />本次支付金额：{fields.orderPayment}<br />详情：{fields.orderDetail}<br />地址：{selectedRows[0].userAddress}</p>
                          <br /><br /><p style={{color:"red"}}>凭证打印信息：</p>
                          <div id="billDetails">
                            <div style={{color:"black"}}>
                              <Row>
                                <Col>&nbsp;</Col>
                              </Row>
                              <Row>
                                <Col>&nbsp;</Col>
                              </Row>
                              <Row>
                                <Col span={4}>&nbsp;</Col>
                                <Col>{`${Y  }-${ M  }-${  D}`}</Col>
                              </Row>
                              <Row>
                                <Col>&nbsp;</Col>
                              </Row>
                              <Row>
                                <Col>&nbsp;</Col>
                              </Row>
                              <Row>
                                <Col span={11}>用户编号：{selectedRows[0].userId}</Col>
                                <Col>用户名称：{selectedRows[0].userName}</Col>
                              </Row>
                              <Row>
                                <Col span={18}>用户地址：{selectedRows[0].userAddress}</Col>
                              </Row>
                              <Row>
                                <Col>&nbsp;</Col>
                              </Row>
                              <Row>
                                <Col span={8}>本次购买气量(单位：方)：{fields.orderGas-fields.couponGas - fields.freeGas}</Col>
                                <Col>本次充值金额(单位：元)：{fields.orderPayment}</Col>
                              </Row>
                              <Row>
                                {fields.isLowIncome ? <Col span={8}>低保赠送气量(单位：方)：{fields.freeGas}</Col>: <Col>&nbsp;</Col>}
                              </Row>
                              <Row>
                                <Col>详&nbsp;情：{fields.orderDetail}</Col>
                              </Row>
                              <Row>
                                <Col>&nbsp;</Col>
                              </Row>
                              <Row>
                                <Col span={2}>&nbsp;</Col>
                                <Col span={13}>{data.rmbBig?data.rmbBig:""}</Col>
                                <Col>{fields.orderPayment}</Col>
                              </Row>
                              <Row>
                                <Col span={18}>&nbsp;</Col>
                                <Col>{data.name?data.name:""}</Col>
                              </Row>
                            </div>
                          </div>
                        </div>
                      ),
                      okText: '打印凭证',
                      onOk: () => {
                        window.document.body.innerHTML = window.document.getElementById('billDetails').innerHTML;
                        window.print();
                        window.location.reload();
                      },
                      cancelText: '取消',
                      width:560,
                    });
                  }
                  // 不使用优惠充值
                  if(fields.couponGas === undefined && (fields.freeGas === undefined || fields.freeGas === 0)) {
                    // 使用发票打印时需要验证发票信息
                    modal.update({
                      title: "请输入纳税人识别号码",
                      content: <input name="number" />,
                      onOk: () => {
                        const serialNumber = document.getElementsByName("number")[0].value;
                        Modal.confirm({
                          title: '写卡成功，请打印发票',
                          content: (
                            <div>
                              <p style={{color:"red"}}>基本信息：</p>
                              <p>IC卡识别号：{fields.iccardIdentifier}<br />姓名：{fields.userName}<br />本次购气量：{fields.orderGas}<br />本次支付金额：{fields.orderPayment}<br />详情：{fields.orderDetail}<br />地址：{selectedRows[0].userAddress}</p>
                              <br /><br /><p style={{color:"red"}}>发票打印信息：</p>
                              <div id="billDetails">
                                <div style={{color:"black"}}>
                                  <Row>
                                    <Col>&nbsp;</Col>
                                  </Row>
                                  <Row>
                                    <Col>&nbsp;</Col>
                                  </Row>
                                  <Row>
                                    <Col span={4}>&nbsp;</Col>
                                    <Col>{`${Y  }-${ M  }-${  D}`}</Col>
                                  </Row>
                                  <Row>
                                    <Col>&nbsp;</Col>
                                  </Row>
                                  <Row>
                                    <Col>&nbsp;</Col>
                                  </Row>
                                  <Row>
                                    <Col span={11}>用户编号：{selectedRows[0].userId}</Col>
                                    <Col>用户名称：{selectedRows[0].userName}</Col>
                                  </Row>
                                  <Row>
                                    <Col span={18}>用户地址：{selectedRows[0].userAddress}</Col>
                                  </Row>
                                  <Row>
                                    <Col>纳税人识别号：{serialNumber}</Col>
                                  </Row>
                                  <Row>
                                    <Col span={8}>本次购买气量(单位：方)：{fields.orderGas}</Col>
                                    <Col>本次充值金额(单位：元)：{fields.orderPayment}</Col>
                                  </Row>
                                  <Row>
                                    <Col>&nbsp;</Col>
                                  </Row>
                                  <Row>
                                    <Col>详&nbsp;情：{fields.orderDetail}</Col>
                                  </Row>
                                  <Row>
                                    <Col>&nbsp;</Col>
                                  </Row>
                                  <Row>
                                    <Col span={2}>&nbsp;</Col>
                                    <Col span={13}>{data.rmbBig?data.rmbBig:""}</Col>
                                    <Col>{fields.orderPayment}</Col>
                                  </Row>
                                  <Row>
                                    <Col span={18}>&nbsp;</Col>
                                    <Col>{data.name?data.name:""}</Col>
                                  </Row>
                                </div>
                              </div>
                            </div>
                          ),
                          okText: '打印发票',
                          onOk: () => {
                            // 验证发票信息开始
                            const temp = window.document.getElementById('billDetails').innerHTML;
                            dispatch({
                              type: 'orderManagement/checkNewInvoicePrint',
                              payload: {
                                orderId: selectedRows[0].orderId,
                              },
                              callback: response3 => {
                                if (response3.data) {
                                  dispatch({
                                    type: 'orderManagement/findInvoice',
                                    payload: {
                                      orderId: data.orderId,
                                      userId: selectedRows[0].userId,
                                      printType: 1
                                    },
                                    callback: (response4) => {
                                      if (response4.status === 0) {
                                        dispatch({
                                          type: 'orderManagement/printInvoice',
                                          payload: {
                                            orderId: data.orderId,
                                            invoiceCode: response4.data.invoiceCode,
                                            invoiceNumber: response4.data.invoiceNumber,
                                            orderPayment:fields.orderPayment,
                                          },
                                          callback: response5 => {
                                            if (response5.status !== 0) {
                                              message.error(response5.message);
                                            }else{
                                              // 验证发票信息结束
                                              window.document.body.innerHTML = temp;
                                              window.print();
                                              window.location.reload();

                                            }
                                          }
                                        });
                                      } else {
                                        message.error(response4.message);
                                      }
                                    }
                                  });
                                } else {
                                  message.info(response3.message);
                                }
                              }
                            });
                          },
                          cancelText: '取消',
                          width:560,
                        });
                      }
                    });
                  }
                } else {
                  message.error(response2.message);
                }
              }
            })
          } else {
            message.error("充值成功，写卡失败，请前往订单管理页面重新写卡");
          }
        } else {
          message.error(response.message);
        }
      },
    });
  };

  handleNewCardPaymentEdit = fields => {
    this.handleNewCardPaymentFormVisible();
    if(!/^[0-9]+$/.test(fields.orderGas)){
      message.info("提交失败：充值气量须为纯数字");
      return;
    }
    if(fields.freeGas===0){
      message.info("提交失败：低保气量不能为0");
      return;
    }
    const { dispatch } = this.props;
    const { selectedRows, pageNum, pageSize } = this.state;
    this.handleSelectedRowsReset();
    dispatch({
      type: 'prePayment/edit',
      payload: fields,
      callback: (response) => {
        if (response.status === 0) {
          const { data } = response;
          const { iccardId, iccardPassword, orderGas, serviceTimes, flowNumber, orderId } = data;
          const wResult = OCX.writePCard(iccardId, iccardPassword, orderGas, serviceTimes, orderGas, flowNumber);
          if (wResult === '写卡成功') {
            dispatch({
              type: 'order/updateOrderStatus',
              payload: {
                orderId,
                orderStatus: 2
              },
              callback: (response2) => {
                if (response2.status === 0) {
                  console.log("充值成功,写卡成功");
                  // 创建当前日期
                  const nowDate = new Date();
                  const Y = nowDate.getFullYear();
                  const M = nowDate.getMonth()+1;
                  const D = nowDate.getDate();
                  dispatch({
                    type: 'prePayment/search',
                    payload: {
                      iccardIdentifier: selectedRows[0].iccardIdentifier,
                      pageNum,
                      pageSize
                    },
                  });
                  const modal = Modal.info();
                  // 若使用了优惠券和低保送气则减去优惠券和低保部分并打印发票
                  if(((fields.couponGas !== undefined || fields.couponGas !== '') && fields.freeGas!==0) && fields.orderGas> fields.couponGas+fields.freeGas){
                    // 使用发票打印时需要验证发票信息
                    modal.update({
                      title: "请输入纳税人识别号码",
                      content: <input name="number" />,
                      onOk: () => {
                        const serialNumber = document.getElementsByName("number")[0].value;
                        Modal.confirm({
                          title: '写卡成功，请打印发票',
                          content: (
                            <div>
                              <p style={{color:"red"}}>基本信息：</p>
                              <p>IC卡识别号：{fields.iccardIdentifier}<br />姓名：{fields.userName}<br />本次购气量：{fields.orderGas}<br />本次支付金额：{fields.orderPayment}<br />详情：{fields.orderDetail}<br />地址：{selectedRows[0].userAddress}</p>
                              <br /><br /><p style={{color:"red"}}>发票打印信息：</p>
                              <div id="billDetails">
                                <div style={{color:"black"}}>
                                  <Row>
                                    <Col>&nbsp;</Col>
                                  </Row>
                                  <Row>
                                    <Col>&nbsp;</Col>
                                  </Row>
                                  <Row>
                                    <Col span={4}>&nbsp;</Col>
                                    <Col>{`${Y  }-${ M  }-${  D}`}</Col>
                                  </Row>
                                  <Row>
                                    <Col>&nbsp;</Col>
                                  </Row>
                                  <Row>
                                    <Col>&nbsp;</Col>
                                  </Row>
                                  <Row>
                                    <Col span={11}>用户编号：{selectedRows[0].userId}</Col>
                                    <Col>用户名称：{selectedRows[0].userName}</Col>
                                  </Row>
                                  <Row>
                                    <Col span={18}>用户地址：{selectedRows[0].userAddress}</Col>
                                  </Row>
                                  <Row>
                                    <Col>纳税人识别号：{serialNumber}</Col>
                                  </Row>
                                  <Row>
                                    <Col span={8}>本次购买气量(单位：方)：{fields.orderGas-fields.couponGas-fields.freeGas}</Col>
                                    <Col>本次充值金额(单位：元)：{fields.orderPayment}</Col>
                                  </Row>
                                  <Row>
                                    <Col>&nbsp;</Col>
                                  </Row>
                                  <Row>
                                    <Col>详&nbsp;情：{fields.orderDetail}</Col>
                                  </Row>
                                  <Row>
                                    <Col>&nbsp;</Col>
                                  </Row>
                                  <Row>
                                    <Col span={2}>&nbsp;</Col>
                                    <Col span={13}>{data.rmbBig?data.rmbBig:""}</Col>
                                    <Col>{fields.orderPayment}</Col>
                                  </Row>
                                  <Row>
                                    <Col span={18}>&nbsp;</Col>
                                    <Col>{data.name?data.name:""}</Col>
                                  </Row>
                                </div>
                              </div>
                            </div>
                          ),
                          okText: '打印发票',
                          onOk: () => {
                            //验证发票信息开始
                            const temp = window.document.getElementById('billDetails').innerHTML;
                            dispatch({
                              type: 'orderManagement/checkNewInvoicePrint',
                              payload: {
                                orderId: selectedRows[0].orderId,
                              },
                              callback: response3 => {
                                if (response3.data) {
                                  dispatch({
                                    type: 'orderManagement/findInvoice',
                                    payload: {
                                      orderId: data.orderId,
                                      userId: selectedRows[0].userId,
                                      printType: 1
                                    },
                                    callback: (response4) => {
                                      if (response4.status === 0) {
                                        dispatch({
                                          type: 'orderManagement/printInvoice',
                                          payload: {
                                            orderId: data.orderId,
                                            invoiceCode: response4.data.invoiceCode,
                                            invoiceNumber: response4.data.invoiceNumber,
                                            orderPayment:fields.orderPayment,
                                          },
                                          callback: response5 => {
                                            if (response5.status !== 0) {
                                              message.error(response5.message);
                                            }else{
                                              //验证发票信息结束
                                              window.document.body.innerHTML = temp;
                                              window.print();
                                              window.location.reload();

                                            }
                                          }
                                        });
                                      } else {
                                        message.error(response4.message);
                                      }
                                    }
                                  });
                                } else {
                                  message.info(response3.message);
                                }
                              }
                            });
                          },
                          cancelText: '取消',
                          width:560,
                        });
                      }
                    });
                  }
                  // 只使用低保送气量，且大于充值气量时
                  if(((fields.couponGas === undefined || fields.couponGas === '')&& fields.freeGas!==0) && fields.orderGas> fields.freeGas){
                    // 使用发票打印时需要验证发票信息
                    modal.update({
                      title: "请输入纳税人识别号码",
                      content: <input name="number" />,
                      onOk: () => {
                        const serialNumber = document.getElementsByName("number")[0].value;
                        Modal.confirm({
                          title: '写卡成功，请打印发票',
                          content: (
                            <div>
                              <p style={{color:"red"}}>基本信息：</p>
                              <p>IC卡识别号：{fields.iccardIdentifier}<br />姓名：{fields.userName}<br />本次购气量：{fields.orderGas}<br />本次支付金额：{fields.orderPayment}<br />详情：{fields.orderDetail}<br />地址：{selectedRows[0].userAddress}</p>
                              <br /><br /><p style={{color:"red"}}>发票打印信息：</p>
                              <div id="billDetails">
                                <div style={{color:"black"}}>
                                  <Row>
                                    <Col>&nbsp;</Col>
                                  </Row>
                                  <Row>
                                    <Col>&nbsp;</Col>
                                  </Row>
                                  <Row>
                                    <Col span={4}>&nbsp;</Col>
                                    <Col>{`${Y  }-${ M  }-${  D}`}</Col>
                                  </Row>
                                  <Row>
                                    <Col>&nbsp;</Col>
                                  </Row>
                                  <Row>
                                    <Col>&nbsp;</Col>
                                  </Row>
                                  <Row>
                                    <Col span={11}>用户编号：{selectedRows[0].userId}</Col>
                                    <Col>用户名称：{selectedRows[0].userName}</Col>
                                  </Row>
                                  <Row>
                                    <Col span={18}>用户地址：{selectedRows[0].userAddress}</Col>
                                  </Row>
                                  <Row>
                                    <Col>纳税人识别号：{serialNumber}</Col>
                                  </Row>
                                  <Row>
                                    <Col span={8}>本次购买气量(单位：方)：{fields.orderGas-fields.freeGas}</Col>
                                    <Col>本次充值金额(单位：元)：{fields.orderPayment}</Col>
                                  </Row>
                                  <Row>
                                    <Col>&nbsp;</Col>
                                  </Row>
                                  <Row>
                                    <Col>详&nbsp;情：{fields.orderDetail}</Col>
                                  </Row>
                                  <Row>
                                    <Col>&nbsp;</Col>
                                  </Row>
                                  <Row>
                                    <Col span={2}>&nbsp;</Col>
                                    <Col span={13}>{data.rmbBig?data.rmbBig:""}</Col>
                                    <Col>{fields.orderPayment}</Col>
                                  </Row>
                                  <Row>
                                    <Col span={18}>&nbsp;</Col>
                                    <Col>{data.name?data.name:""}</Col>
                                  </Row>
                                </div>
                              </div>
                            </div>
                          ),
                          okText: '打印发票',
                          onOk: () => {
                            //验证发票信息开始
                            const temp = window.document.getElementById('billDetails').innerHTML;
                            dispatch({
                              type: 'orderManagement/checkNewInvoicePrint',
                              payload: {
                                orderId: selectedRows[0].orderId,
                              },
                              callback: response3 => {
                                if (response3.data) {
                                  dispatch({
                                    type: 'orderManagement/findInvoice',
                                    payload: {
                                      orderId: data.orderId,
                                      userId: selectedRows[0].userId,
                                      printType: 1
                                    },
                                    callback: (response4) => {
                                      if (response4.status === 0) {
                                        dispatch({
                                          type: 'orderManagement/printInvoice',
                                          payload: {
                                            orderId: data.orderId,
                                            invoiceCode: response4.data.invoiceCode,
                                            invoiceNumber: response4.data.invoiceNumber,
                                            orderPayment:fields.orderPayment,
                                          },
                                          callback: response5 => {
                                            if (response5.status !== 0) {
                                              message.error(response5.message);
                                            }else{
                                              window.document.body.innerHTML = temp;
                                              window.print();
                                              window.location.reload();
                                            }
                                          }
                                        });
                                      } else {
                                        message.error(response4.message);
                                      }
                                    }
                                  });
                                } else {
                                  message.info(response3.message);
                                }
                              }
                            });
                            //验证发票信息结束
                          },
                          cancelText: '取消',
                          width:560,
                        });
                      }
                    });
                  }
                  // 只使用优惠券并且充值气量大于优惠券气量时
                  if(((fields.couponGas !== undefined || fields.couponGas !== '') && (fields.freeGas ===0 || fields.freeGas === undefined)) && fields.orderGas> fields.couponGas){
                    // 使用发票打印时需要验证发票信息
                    modal.update({
                      title: "请输入纳税人识别号码",
                      content: <input name="number" />,
                      onOk: () => {
                        const serialNumber = document.getElementsByName("number")[0].value;
                        Modal.confirm({
                          title: '写卡成功，请打印发票',
                          content: (
                            <div>
                              <p style={{color:"red"}}>基本信息：</p>
                              <p>IC卡识别号：{fields.iccardIdentifier}<br />姓名：{fields.userName}<br />本次购气量：{fields.orderGas}<br />本次支付金额：{fields.orderPayment}<br />详情：{fields.orderDetail}<br />地址：{selectedRows[0].userAddress}</p>
                              <br /><br /><p style={{color:"red"}}>发票打印信息：</p>
                              <div id="billDetails">
                                <div style={{color:"black"}}>
                                  <Row>
                                    <Col>&nbsp;</Col>
                                  </Row>
                                  <Row>
                                    <Col>&nbsp;</Col>
                                  </Row>
                                  <Row>
                                    <Col span={4}>&nbsp;</Col>
                                    <Col>{`${Y  }-${ M  }-${  D}`}</Col>
                                  </Row>
                                  <Row>
                                    <Col>&nbsp;</Col>
                                  </Row>
                                  <Row>
                                    <Col>&nbsp;</Col>
                                  </Row>
                                  <Row>
                                    <Col span={11}>用户编号：{selectedRows[0].userId}</Col>
                                    <Col>用户名称：{selectedRows[0].userName}</Col>
                                  </Row>
                                  <Row>
                                    <Col span={18}>用户地址：{selectedRows[0].userAddress}</Col>
                                  </Row>
                                  <Row>
                                    <Col>纳税人识别号：{serialNumber}</Col>
                                  </Row>
                                  <Row>
                                    <Col span={8}>本次购买气量(单位：方)：{fields.orderGas-fields.couponGas}</Col>
                                    <Col>本次充值金额(单位：元)：{fields.orderPayment}</Col>
                                  </Row>
                                  <Row>
                                    <Col>&nbsp;</Col>
                                  </Row>
                                  <Row>
                                    <Col>详&nbsp;情：{fields.orderDetail}</Col>
                                  </Row>
                                  <Row>
                                    <Col>&nbsp;</Col>
                                  </Row>
                                  <Row>
                                    <Col span={2}>&nbsp;</Col>
                                    <Col span={13}>{data.rmbBig?data.rmbBig:""}</Col>
                                    <Col>{fields.orderPayment}</Col>
                                  </Row>
                                  <Row>
                                    <Col span={18}>&nbsp;</Col>
                                    <Col>{data.name?data.name:""}</Col>
                                  </Row>
                                </div>
                              </div>
                            </div>
                          ),
                          okText: '打印发票',
                          onOk: () => {
                            //验证发票开始
                            const temp = window.document.getElementById('billDetails').innerHTML;
                            dispatch({
                              type: 'orderManagement/checkNewInvoicePrint',
                              payload: {
                                orderId: selectedRows[0].orderId,
                              },
                              callback: response3 => {
                                if (response3.data) {
                                  dispatch({
                                    type: 'orderManagement/findInvoice',
                                    payload: {
                                      orderId: data.orderId,
                                      userId: selectedRows[0].userId,
                                      printType: 1
                                    },
                                    callback: (response4) => {
                                      if (response4.status === 0) {
                                        dispatch({
                                          type: 'orderManagement/printInvoice',
                                          payload: {
                                            orderId: data.orderId,
                                            invoiceCode: response4.data.invoiceCode,
                                            invoiceNumber: response4.data.invoiceNumber,
                                            orderPayment:fields.orderPayment,
                                          },
                                          callback: response5 => {
                                            if (response5.status !== 0) {
                                              message.error(response5.message);
                                            }else{
                                              window.document.body.innerHTML = temp;
                                              window.print();
                                              window.location.reload();
                                            }
                                          }
                                        });
                                      } else {
                                        message.error(response4.message);
                                      }
                                    }
                                  });
                                } else {
                                  message.info(response3.message);
                                }
                              }
                            });
                            //验证发票结束
                          },
                          cancelText: '取消',
                          width:560,
                        });
                      }
                    });
                  }
                  // 若只单独使用了优惠券且与充值气量相等时则提示打印凭证
                  if(((fields.couponGas !== undefined || fields.couponGas !== '') && (fields.freeGas ===0 || fields.freeGas === undefined)) && fields.orderGas === `${fields.couponGas}`){
                    Modal.info({
                      title: '写卡成功，请打印凭证',
                      content: (
                        <div>
                          <p style={{color:"red"}}>基本信息：</p>
                          <p>IC卡识别号：{fields.iccardIdentifier}<br />姓名：{fields.userName}<br />本次购气量：{fields.orderGas}<br />本次支付金额：{fields.orderPayment}<br />详情：{fields.orderDetail}<br />地址：{selectedRows[0].userAddress}</p>
                          <br /><br /><p style={{color:"red"}}>凭证打印信息：</p>
                          <div id="billDetails">
                            <div style={{color:"black"}}>
                              <Row>
                                <Col>&nbsp;</Col>
                              </Row>
                              <Row>
                                <Col>&nbsp;</Col>
                              </Row>
                              <Row>
                                <Col span={4}>&nbsp;</Col>
                                <Col>{`${Y  }-${ M  }-${  D}`}</Col>
                              </Row>
                              <Row>
                                <Col>&nbsp;</Col>
                              </Row>
                              <Row>
                                <Col>&nbsp;</Col>
                              </Row>
                              <Row>
                                <Col span={11}>用户编号：{selectedRows[0].userId}</Col>
                                <Col>用户名称：{selectedRows[0].userName}</Col>
                              </Row>
                              <Row>
                                <Col span={18}>用户地址：{selectedRows[0].userAddress}</Col>
                              </Row>
                              <Row>
                                <Col>&nbsp;</Col>
                              </Row>
                              <Row>
                                <Col span={8}>本次购买气量(单位：方)：{fields.orderGas-fields.couponGas}</Col>
                                <Col>本次充值金额(单位：元)：{fields.orderPayment}</Col>
                              </Row>
                              <Row>
                                {fields.isLowIncome ? <Col span={8}>低保赠送气量(单位：方)：{fields.freeGas}</Col>: <Col>&nbsp;</Col>}
                              </Row>
                              <Row>
                                <Col>详&nbsp;情：{fields.orderDetail}</Col>
                              </Row>
                              <Row>
                                <Col>&nbsp;</Col>
                              </Row>
                              <Row>
                                <Col span={2}>&nbsp;</Col>
                                <Col span={13}>{data.rmbBig?data.rmbBig:""}</Col>
                                <Col>{fields.orderPayment}</Col>
                              </Row>
                              <Row>
                                <Col span={18}>&nbsp;</Col>
                                <Col>{data.name?data.name:""}</Col>
                              </Row>
                            </div>
                          </div>
                        </div>
                      ),
                      okText: '打印凭证',
                      onOk: () => {
                        const temp = window.document.getElementById('billDetails').innerHTML;
                        window.document.body.innerHTML = temp;
                        window.print();
                        window.location.reload();
                      },
                      cancelText: '取消',
                      width:560,
                    });
                  }
                  // 若只单独使用低保送气量且与充值气量相等则打印凭证
                  if(((fields.couponGas === undefined || fields.couponGas === '') && fields.freeGas!==0) && fields.orderGas === `${fields.freeGas}`){
                    Modal.info({
                      title: '写卡成功，请打印凭证',
                      content: (
                        <div>
                          <p style={{color:"red"}}>基本信息：</p>
                          <p>IC卡识别号：{fields.iccardIdentifier}<br />姓名：{fields.userName}<br />本次购气量：{fields.orderGas}<br />本次支付金额：{fields.orderPayment}<br />详情：{fields.orderDetail}<br />地址：{selectedRows[0].userAddress}</p>
                          <br /><br /><p style={{color:"red"}}>凭证打印信息：</p>
                          <div id="billDetails">
                            <div style={{color:"black"}}>
                              <Row>
                                <Col>&nbsp;</Col>
                              </Row>
                              <Row>
                                <Col>&nbsp;</Col>
                              </Row>
                              <Row>
                                <Col span={4}>&nbsp;</Col>
                                <Col>{`${Y  }-${ M  }-${  D}`}</Col>
                              </Row>
                              <Row>
                                <Col>&nbsp;</Col>
                              </Row>
                              <Row>
                                <Col>&nbsp;</Col>
                              </Row>
                              <Row>
                                <Col span={11}>用户编号：{selectedRows[0].userId}</Col>
                                <Col>用户名称：{selectedRows[0].userName}</Col>
                              </Row>
                              <Row>
                                <Col span={18}>用户地址：{selectedRows[0].userAddress}</Col>
                              </Row>
                              <Row>
                                <Col>&nbsp;</Col>
                              </Row>
                              <Row>
                                <Col span={8}>本次购买气量(单位：方)：{fields.orderGas-fields.freeGas}</Col>
                                <Col>本次充值金额(单位：元)：{fields.orderPayment}</Col>
                              </Row>
                              <Row>
                                {fields.isLowIncome ? <Col span={8}>低保赠送气量(单位：方)：{fields.freeGas}</Col>: <Col>&nbsp;</Col>}
                              </Row>
                              <Row>
                                <Col>详&nbsp;情：{fields.orderDetail}</Col>
                              </Row>
                              <Row>
                                <Col>&nbsp;</Col>
                              </Row>
                              <Row>
                                <Col span={2}>&nbsp;</Col>
                                <Col span={13}>{data.rmbBig?data.rmbBig:""}</Col>
                                <Col>{fields.orderPayment}</Col>
                              </Row>
                              <Row>
                                <Col span={18}>&nbsp;</Col>
                                <Col>{data.name?data.name:""}</Col>
                              </Row>
                            </div>
                          </div>
                        </div>
                      ),
                      okText: '打印凭证',
                      onOk: () => {
                        window.document.body.innerHTML = window.document.getElementById('billDetails').innerHTML;
                        window.print();
                        window.location.reload();
                      },
                      cancelText: '取消',
                      width:560,
                    });
                  }
                  // 若使用低保送气量与优惠券且与充值气量相等则打印凭证
                  if(((fields.couponGas !== undefined || fields.couponGas !== '')&& fields.freeGas!==0) && fields.orderGas === `${fields.couponGas + fields.freeGas}`){
                    Modal.info({
                      title: '写卡成功，请打印凭证',
                      content: (
                        <div>
                          <p style={{color:"red"}}>基本信息：</p>
                          <p>IC卡识别号：{fields.iccardIdentifier}<br />姓名：{fields.userName}<br />本次购气量：{fields.orderGas}<br />本次支付金额：{fields.orderPayment}<br />详情：{fields.orderDetail}<br />地址：{selectedRows[0].userAddress}</p>
                          <br /><br /><p style={{color:"red"}}>凭证打印信息：</p>
                          <div id="billDetails">
                            <div style={{color:"black"}}>
                              <Row>
                                <Col>&nbsp;</Col>
                              </Row>
                              <Row>
                                <Col>&nbsp;</Col>
                              </Row>
                              <Row>
                                <Col span={4}>&nbsp;</Col>
                                <Col>{`${Y  }-${ M  }-${  D}`}</Col>
                              </Row>
                              <Row>
                                <Col>&nbsp;</Col>
                              </Row>
                              <Row>
                                <Col>&nbsp;</Col>
                              </Row>
                              <Row>
                                <Col span={11}>用户编号：{selectedRows[0].userId}</Col>
                                <Col>用户名称：{selectedRows[0].userName}</Col>
                              </Row>
                              <Row>
                                <Col span={18}>用户地址：{selectedRows[0].userAddress}</Col>
                              </Row>
                              <Row>
                                <Col>&nbsp;</Col>
                              </Row>
                              <Row>
                                <Col span={8}>本次购买气量(单位：方)：{fields.orderGas-fields.couponGas - fields.freeGas}</Col>
                                <Col>本次充值金额(单位：元)：{fields.orderPayment}</Col>
                              </Row>
                              <Row>
                                {fields.isLowIncome ? <Col span={8}>低保赠送气量(单位：方)：{fields.freeGas}</Col>: <Col>&nbsp;</Col>}
                              </Row>
                              <Row>
                                <Col>详&nbsp;情：{fields.orderDetail}</Col>
                              </Row>
                              <Row>
                                <Col>&nbsp;</Col>
                              </Row>
                              <Row>
                                <Col span={2}>&nbsp;</Col>
                                <Col span={13}>{data.rmbBig?data.rmbBig:""}</Col>
                                <Col>{fields.orderPayment}</Col>
                              </Row>
                              <Row>
                                <Col span={18}>&nbsp;</Col>
                                <Col>{data.name?data.name:""}</Col>
                              </Row>
                            </div>
                          </div>
                        </div>
                      ),
                      okText: '打印凭证',
                      onOk: () => {
                        window.document.body.innerHTML = window.document.getElementById('billDetails').innerHTML;
                        window.print();
                        window.location.reload();
                      },
                      cancelText: '取消',
                      width:560,
                    });
                  }
                  // 不使用优惠充值
                  if(fields.couponGas === undefined && (fields.freeGas === undefined || fields.freeGas === 0)) {
                    // 使用发票打印时需要验证发票信息
                    modal.update({
                      title: "请输入纳税人识别号码",
                      content: <input name="number" />,
                      onOk: () => {
                        const serialNumber = document.getElementsByName("number")[0].value;
                        Modal.confirm({
                          title: '写卡成功，请打印发票',
                          content: (
                            <div>
                              <p style={{color:"red"}}>基本信息：</p>
                              <p>IC卡识别号：{fields.iccardIdentifier}<br />姓名：{fields.userName}<br />本次购气量：{fields.orderGas}<br />本次支付金额：{fields.orderPayment}<br />详情：{fields.orderDetail}<br />地址：{selectedRows[0].userAddress}</p>
                              <br /><br /><p style={{color:"red"}}>发票打印信息：</p>
                              <div id="billDetails">
                                <div style={{color:"black"}}>
                                  <Row>
                                    <Col>&nbsp;</Col>
                                  </Row>
                                  <Row>
                                    <Col>&nbsp;</Col>
                                  </Row>
                                  <Row>
                                    <Col span={4}>&nbsp;</Col>
                                    <Col>{`${Y  }-${ M  }-${  D}`}</Col>
                                  </Row>
                                  <Row>
                                    <Col>&nbsp;</Col>
                                  </Row>
                                  <Row>
                                    <Col>&nbsp;</Col>
                                  </Row>
                                  <Row>
                                    <Col span={11}>用户编号：{selectedRows[0].userId}</Col>
                                    <Col>用户名称：{selectedRows[0].userName}</Col>
                                  </Row>
                                  <Row>
                                    <Col span={18}>用户地址：{selectedRows[0].userAddress}</Col>
                                  </Row>
                                  <Row>
                                    <Col>纳税人识别号：{serialNumber}</Col>
                                  </Row>
                                  <Row>
                                    <Col span={8}>本次购买气量(单位：方)：{fields.orderGas}</Col>
                                    <Col>本次充值金额(单位：元)：{fields.orderPayment}</Col>
                                  </Row>
                                  <Row>
                                    <Col>&nbsp;</Col>
                                  </Row>
                                  <Row>
                                    <Col>详&nbsp;情：{fields.orderDetail}</Col>
                                  </Row>
                                  <Row>
                                    <Col>&nbsp;</Col>
                                  </Row>
                                  <Row>
                                    <Col span={2}>&nbsp;</Col>
                                    <Col span={13}>{data.rmbBig?data.rmbBig:""}</Col>
                                    <Col>{fields.orderPayment}</Col>
                                  </Row>
                                  <Row>
                                    <Col span={18}>&nbsp;</Col>
                                    <Col>{data.name?data.name:""}</Col>
                                  </Row>
                                </div>
                              </div>
                            </div>
                          ),
                          okText: '打印发票',
                          onOk: () => {
                            //发票验证开始
                            const temp = window.document.getElementById('billDetails').innerHTML;
                            dispatch({
                              type: 'orderManagement/checkNewInvoicePrint',
                              payload: {
                                orderId: selectedRows[0].orderId,
                              },
                              callback: response3 => {
                                if (response3.data) {
                                  dispatch({
                                    type: 'orderManagement/findInvoice',
                                    payload: {
                                      orderId: data.orderId,
                                      userId: selectedRows[0].userId,
                                      printType: 1
                                    },
                                    callback: (response4) => {
                                      if (response4.status === 0) {
                                        dispatch({
                                          type: 'orderManagement/printInvoice',
                                          payload: {
                                            orderId: data.orderId,
                                            invoiceCode: response4.data.invoiceCode,
                                            invoiceNumber: response4.data.invoiceNumber,
                                            orderPayment:fields.orderPayment,
                                          },
                                          callback: response5 => {
                                            if (response5.status !== 0) {
                                              message.error(response5.message);
                                            }else{
                                              window.document.body.innerHTML = temp;
                                              window.print();
                                              window.location.reload();
                                            }
                                          }
                                        });
                                      } else {
                                        message.error(response4.message);
                                      }
                                    }
                                  });
                                } else {
                                  message.info(response3.message);
                                }
                              }
                            });
                            //发票验证结束
                          },
                          cancelText: '取消',
                          width:560,
                        });
                      }
                    });
                  }
                } else {
                  message.error(response2.message);
                }
              }
            })
          } else {
            message.error("充值成功，写卡失败，请前往订单管理页面重新写卡");
          }
        } else {
          message.error(response.message);
        }
      },
    });
  };

  // 加购验证
  handleAddGasFormVisible = flag => {
    if (flag) {
      const { selectedRows } = this.state;
      const result = OCX.readCard();
      if (result[0] !== 'S') {
        message.error("读卡失败");
        return;
      }
      if (result[1] !== '1') {
        message.info('请使用密码传递卡');
        return;
      }
      if (result[2] !== selectedRows[0].iccardIdentifier) {
        message.info("该卡不是与该用户绑定的卡");
        return;
      }
      if (result[4] !== 0) {
        Modal.confirm({
          title: '是否继续充值',
          content: '卡内已有未圈存的气量,确认加购充值吗？',
          okText: '继续充值',
          onOk: () => {
            this.setState({
              addGasPaymentModalVisible: !!flag,
            });
          },
          cancelText: '取消',
        });
      } else {
        this.setState({
          addGasPaymentModalVisible: !!flag,
        });
      }
    } else {
      this.setState({
        addGasPaymentModalVisible: !!flag,
      });
    }
  };

  // 加购回调
  handleAddGasEdit = fields => {
    this.handleAddGasFormVisible();
    if(!/^[0-9]+$/.test(fields.orderGas)){
      message.info("提交失败：充值气量须为纯数字");
      return;
    }
    const { dispatch } = this.props;
    const { selectedRows, pageNum, pageSize } = this.state;
    this.handleSelectedRowsReset();
    const result = OCX.readCard();
    if (result[0] !== 'S') {
      message.error("读卡失败");
      return;
    }
    // 获取卡内气量
    const cardGas = result[4]
      dispatch({
        type: 'prePayment/addGas',
        payload: fields,
        callback: (response) => {
          if (response.status === 0) {
            const { data } = response;
            const { iccardId, iccardPassword, orderGas, flowNumber, orderId, serviceTimes } = data;
            const initResult = OCX.initCard(iccardPassword)
            if (initResult === 'S') {
              const writePCardResult = OCX.writePCard(iccardId, iccardPassword, Number(fields.orderGas)+Number(cardGas), serviceTimes, Number(fields.orderGas)+Number(cardGas), flowNumber);
              if (writePCardResult === '写卡成功') {
                dispatch({
                  type: 'order/updateOrderStatus',
                  payload: {
                    orderId,
                    orderStatus: 2
                  },
                  callback: (response2) => {
                    if (response2.status === 0) {
                      // 创建当前日期
                      const nowDate = new Date();
                      const Y = nowDate.getFullYear();
                      const M = nowDate.getMonth()+1;
                      const D = nowDate.getDate();
                      dispatch({
                        type: 'prePayment/search',
                        payload: {
                          iccardIdentifier: selectedRows[0].iccardIdentifier,
                          pageNum,
                          pageSize
                        },
                      });
                      const modal = Modal.info();
                        modal.update({
                          title: "请输入纳税人识别号码",
                          content: <input name="number" />,
                          onOk: () => {
                            const serialNumber = document.getElementsByName("number")[0].value;
                            Modal.confirm({
                              title: '写卡成功，请打印发票',
                              content: (
                                <div>
                                  <br /><br /><p style={{color:"red"}}>发票打印信息：</p>
                                  <div id="billDetails">
                                    <div style={{color:"black"}}>
                                      <Row>
                                        <Col>&nbsp;</Col>
                                      </Row>
                                      <Row>
                                        <Col>&nbsp;</Col>
                                      </Row>
                                      <Row>
                                        <Col span={4}>&nbsp;</Col>
                                        <Col>{`${Y  }-${ M  }-${  D}`}</Col>
                                      </Row>
                                      <Row>
                                        <Col>&nbsp;</Col>
                                      </Row>
                                      <Row>
                                        <Col>&nbsp;</Col>
                                      </Row>
                                      <Row>
                                        <Col span={11}>用户编号：{selectedRows[0].userId}</Col>
                                        <Col>用户名称：{selectedRows[0].userName}</Col>
                                      </Row>
                                      <Row>
                                        <Col span={18}>用户地址：{selectedRows[0].userAddress}</Col>
                                      </Row>
                                      <Row>
                                        <Col>纳税人识别号：{serialNumber}</Col>
                                      </Row>
                                      <Row>
                                        <Col span={8}>本次购买气量(单位：方)：{Number(fields.orderGas)+Number(cardGas)}</Col>
                                        <Col>本次充值金额(单位：元)：{fields.orderPayment}</Col>
                                      </Row>
                                      <Row>
                                        <Col>&nbsp;</Col>
                                      </Row>
                                      <Row>
                                        <Col>详&nbsp;情：{fields.orderDetail}</Col>
                                      </Row>
                                      <Row>
                                        <Col>&nbsp;</Col>
                                      </Row>
                                      <Row>
                                        <Col span={2}>&nbsp;</Col>
                                        <Col span={13}>{data.rmbBig?data.rmbBig:""}</Col>
                                        <Col>{fields.orderPayment}</Col>
                                      </Row>
                                      <Row>
                                        <Col span={18}>&nbsp;</Col>
                                        <Col>{data.name?data.name:""}</Col>
                                      </Row>
                                    </div>
                                  </div>
                                </div>
                              ),
                              okText: '打印发票',
                              onOk: () => {
                                //验证发票开始
                                const temp = window.document.getElementById('billDetails').innerHTML;
                                // 使用发票打印时需要验证发票信息
                                dispatch({
                                  type: 'orderManagement/checkNewInvoicePrint',
                                  payload: {
                                    orderId: selectedRows[0].orderId,
                                  },
                                  callback: response3 => {
                                    if (response3.data) {
                                      dispatch({
                                        type: 'orderManagement/findInvoice',
                                        payload: {
                                          orderId: data.orderId,
                                          userId: selectedRows[0].userId,
                                          printType: 1
                                        },
                                        callback: (response4) => {
                                          if (response4.status === 0) {
                                            dispatch({
                                              type: 'orderManagement/printInvoice',
                                              payload: {
                                                orderId: data.orderId,
                                                invoiceCode: response4.data.invoiceCode,
                                                invoiceNumber: response4.data.invoiceNumber,
                                                orderPayment:fields.orderPayment,
                                              },
                                              callback: response5 => {
                                                if (response5.status !== 0) {
                                                  message.error(response5.message);
                                                }else{
                                                  // 验证发票结束
                                                  window.document.body.innerHTML = temp;
                                                  window.print();
                                                  window.location.reload();

                                                }
                                              }
                                            });
                                          } else {
                                            message.error(response4.message);
                                          }
                                        }
                                      });
                                    } else {
                                      message.info(response3.message);
                                    }
                                  }
                                });
                              },
                              cancelText: '取消',
                              width:560,
                            });
                          }
                        });
                    } else {
                      message.error(response2.message);
                    }
                  }
                })
              } else {
                message.error("充值成功，写卡失败，请前往订单管理页面重新写卡");
              }
            }else{
              message.error("初始化失败");
            }
          } else {
            message.error(response.message);
          }
        },
      });
  };

  handleSelectedRowsReset = () => {
    this.setState({
      selectedRows: []
    });
  };

  handleStandardTableChange = (pagination) => {
    const { dispatch } = this.props;
    const { formValues, pageNum, pageSize } = this.state;
    if (pageNum !== pagination.current || pageSize !== pagination.pageSize) {
      this.handleSelectedRowsReset();
    }
    const params = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
    };
    this.setState({
      pageNum: pagination.current,
      pageSize: pagination.pageSize
    });
    dispatch({
      type: 'account/fetch',
      payload: params,
    });
  };

  identifyCard = () => {
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    const result = OCX.readCard();
    if (result[0] !== 'S') {
      message.error("读卡失败");
      return "读卡失败";
    }
    dispatch({
      type: 'prePayment/search',
      payload: {
        iccardIdentifier: result[2],
        pageNum,
        pageSize
      },
    });
    return '';
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginLeft: 0, marginRight: 0, marginBottom: 8 }}>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('userName')(<Input placeholder="用户名称" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('iccardId')(<Input placeholder="IC卡号" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('iccardIdentifier')(<Input placeholder="IC卡识别号" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            <span className={styles.submitButtons}>
              <Button type="primary" icon="search" onClick={this.handleSearch}>
                查询
              </Button>
              <Button icon="sync" style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  };

  render() {
    const {
      prePayment: { data },
      loading,
    } = this.props;
    const { selectedRows, prePaymentModalVisible, newCardPaymentModalVisible, addGasPaymentModalVisible } = this.state;
    return (
      <PageHeaderWrapper className="recharge-prePayment">
        <Card bordered={false}>
          <div className={styles.Common}>
            <div className={styles.CommonForm}>{this.renderForm()}</div>
            <div className={styles.CommonOperator}>
              <Authorized authority="recharge:pre:record">
                <Button icon="scan" onClick={() => this.identifyCard()}>识别IC卡</Button>
              </Authorized>
              <Authorized authority="recharge:pre:update">
                <Button icon="edit" disabled={selectedRows.length !== 1} onClick={() => this.handlePrePaymentFormVisible(true)}>预付费充值</Button>
              </Authorized>
              <Authorized authority="recharge:pre:new">
                <Button icon="edit" disabled={selectedRows.length !== 1} onClick={() => this.handleNewCardPaymentFormVisible(true)}>发卡充值</Button>
              </Authorized>
              <Button icon="edit" disabled={selectedRows.length !== 1} onClick={() => this.handleAddGasFormVisible(true)}>补气加购充值</Button>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              rowKey='userId'
            />
            <OCX />
          </div>
        </Card>
        {selectedRows.length === 1 ? (
          <PrePaymentForm
            handleEdit={this.handleEdit}
            handleCancel={this.handlePrePaymentFormVisible}
            modalVisible={prePaymentModalVisible}
            selectedData={selectedRows[0]}
          />) : null
        }
        {selectedRows.length === 1 ? (
          <NewCardPayment
            handleEdit={this.handleNewCardPaymentEdit}
            handleCancel={this.handleNewCardPaymentFormVisible}
            modalVisible={newCardPaymentModalVisible}
            selectedData={selectedRows[0]}
          />) : null
        }
        {selectedRows.length === 1 ? (
          <AddGasPaymentForm
            handleEdit={this.handleAddGasEdit}
            handleCancel={this.handleAddGasFormVisible}
            modalVisible={addGasPaymentModalVisible}
            selectedData={selectedRows[0]}
          />) : null
        }

      </PageHeaderWrapper>
    );
  }
}

export default PrePayment;
