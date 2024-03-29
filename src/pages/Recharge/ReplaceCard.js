import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  message, Modal,
} from 'antd';
import router from 'umi/router';
import StandardTable from '../../components/StandardTable';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import Authorized from '../../utils/Authorized';
import styles from '../Common.less';
import OCX from '../../components/OCX';
import ReplaceCardForm from './components/ReplaceCardForm';
import ReplaceCardHistoryForm from './components/ReplaceCardHistoryForm';

@connect(({ replaceCard, orderManagement, loading }) => ({
  replaceCard,
  orderManagement,
  loading: loading.models.replaceCard,
}))
@Form.create()
class ReplaceCard extends PureComponent {
  state = {
    replaceCardFormVisible: false,
    replaceCardHistoryFormVisible: false,
    selectedRows: [],
    formValues: {},
    pageNum: 1,
    pageSize: 10,
  };

  columns = [
    {
      title: 'IC卡号',
      dataIndex: 'userId',
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
  ];

  componentDidMount() {

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
      type: 'replaceCard/fetch',
      payload: {
        pageNum: 1,
        pageSize: 10,
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
      'userId': form.getFieldValue('userId') && form.getFieldValue('userId').trim(),
      'userName': form.getFieldValue('userName') && form.getFieldValue('userName').trim(),
      'iccardIdentifier': form.getFieldValue('iccardIdentifier') && form.getFieldValue('iccardIdentifier').trim(),
      'userPhone': form.getFieldValue('userPhone') && form.getFieldValue('userPhone').trim(),
      'userAddress': form.getFieldValue('userAddress') && form.getFieldValue('userAddress').trim()
    });
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        formValues: fieldsValue,
        pageNum: 1,
        pageSize: 10
      });
      dispatch({
        type: 'replaceCard/search',
        payload: {
          ...fieldsValue,
          pageNum: 1,
          pageSize: 10,
        },
      });
    });
  };

  handleReplaceCardFormVisible = flag => {
    this.setState({
      replaceCardFormVisible: !!flag,
    });
  };

  handleReplaceCardHistoryFormVisible = flag => {
    if (flag) {
      const { dispatch } = this.props;
      const { selectedRows } = this.state;
      dispatch({
        type: 'replaceCard/searchHistory',
        payload: {
          userId: selectedRows[0].userId
        },
        callback: () => {
          this.setState({
            replaceCardHistoryFormVisible: !!flag,
          });
        }
      });
    } else {
      this.setState({
        replaceCardHistoryFormVisible: !!flag,
      });
    }
  };

  handleEdit = fields => {
    const { dispatch } = this.props;
    const { selectedRows, pageNum, pageSize } = this.state;
    const result = OCX.readCard();
    if (result[0] !== 'S') {
      message.error("读卡失败");
      return;
    }
    // 学校工业用户，工业用户，金湘源.为商业用户(通过卡标识号码识别该卡为商业卡还是民用卡)
    if (selectedRows[0].userType === 9 || selectedRows[0].userType === 10 || selectedRows[0].userType === 11) {
      if (result[2].substring(6, 7) === '0') {
        message.info('该户为商业用户请分发【商业卡】');
        return;
      }
    }
    if (selectedRows[0].userType !== 9 && selectedRows[0].userType !== 10 && selectedRows[0].userType !== 11) {
      if (result[2].substring(6, 7) !== '0') {
        message.info('该户为民用用户请分发【民用卡】');
        return;
      }
    }
    this.handleReplaceCardFormVisible();
    if(!/^[0-9]+$/.test(fields.orderGas)){
      message.info("提交失败：充值气量须为纯数字");
      return;
    }
    if(fields.freeGas===0){
      message.info("提交失败：低保气量不能为0");
      return;
    }
    this.handleSelectedRowsReset();
    dispatch({
      type: 'replaceCard/edit',
      payload: fields,
      callback: (response) => {
        if (response.status === 0) {
          console.log('补卡充值成功，开始写卡');
          const { data } = response;
          const { iccardId, iccardPassword, orderGas, serviceTimes, flowNumber, orderId } = data;
          const wResult = OCX.writePCard(iccardId, iccardPassword, 0, serviceTimes, 0, flowNumber);
          if (wResult === '写卡成功') {
            const wResult2 = OCX.writeUCard(iccardId, iccardPassword, orderGas, serviceTimes, flowNumber);
            if (wResult2 === '写卡成功') {
              dispatch({
                type: 'order/updateOrderStatus',
                payload: {
                  orderId,
                  orderStatus: 2
                },
                callback: (response2) => {
                  if (response2.status === 0) {
                    console.log("操作成功已补卡");
                    // 创建当前日期
                    const nowDate = new Date();
                    const Y = nowDate.getFullYear();
                    const M = nowDate.getMonth()+1;
                    const D = nowDate.getDate();
                    dispatch({
                      type: 'replaceCard/fetch',
                      payload: {
                        pageNum,
                        pageSize
                      },
                    });
                    const modal = Modal.info();
                    // 补卡充值-若使用了优惠券和低保送气则减去优惠券和低保部分并打印发票
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
                                      {fields.cardCost ? <Col span={8}>本次补卡费用：{fields.cardCost}</Col>: <Col>&nbsp;</Col>}
                                    </Row>
                                    <Row>
                                      <Col span={2}>&nbsp;</Col>
                                      <Col span={13}>{data.rmbBig?data.rmbBig:""}</Col>
                                      <Col>{fields.orderPayment+fields.cardCost}</Col>
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
                    // 补卡充值-只使用低保送气量，且大于充值气量时
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
                                      {fields.cardCost ? <Col span={8}>本次补卡费用：{fields.cardCost}</Col>: <Col>&nbsp;</Col>}
                                    </Row>
                                    <Row>
                                      <p style={{height:2}} />
                                      <Col span={3}>&nbsp;</Col>
                                      <Col span={13}>{data.rmbBig?data.rmbBig:""}</Col>
                                      <Col>{fields.orderPayment+fields.cardCost}</Col>
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
                    // 补卡充值-只使用优惠券并且充值气量大于优惠券气量时
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
                                      {fields.cardCost ? <Col span={8}>本次补卡费用：{fields.cardCost}</Col>: <Col>&nbsp;</Col>}
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
                                      <Col>{fields.orderPayment+fields.cardCost}</Col>
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
                              //验证发偶爱信息结束
                            },
                            cancelText: '取消',
                            width:560,
                          });
                        }
                      });
                    }
                    // 补卡充值-若只单独使用了优惠券且与充值气量相等时则提示打印凭证
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
                                  {fields.isLowIncome ? <Col span={8}>低保赠送气量(单位：方)：{fields.freeGas}</Col>: <Col span={8}>&nbsp;</Col>}
                                  {fields.couponGas ? <Col>优惠券(单位：方)：{fields.couponGas}</Col>: <Col>&nbsp;</Col>}
                                </Row>
                                <Row>
                                  <Col>详&nbsp;情：{fields.orderDetail}</Col>
                                </Row>
                                <Row>
                                  {fields.cardCost ? <Col span={8}>本次补卡费用：{fields.cardCost}</Col>: <Col>&nbsp;</Col>}
                                </Row>
                                <Row>
                                  <Col span={2}>&nbsp;</Col>
                                  <Col span={13}>{data.rmbBig?data.rmbBig:""}</Col>
                                  <Col>{fields.orderPayment+fields.cardCost}</Col>
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
                          const temp = window.document.body.innerHTML;
                          window.document.body.innerHTML = window.document.getElementById('billDetails').innerHTML;
                          window.print();
                          window.document.body.innerHTML = temp;
                        },
                        cancelText: '取消',
                        width:560,
                      });
                    }
                    // 补卡充值-若只单独使用低保送气量且与充值气量相等则打印凭证
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
                                  {fields.isLowIncome ? <Col span={8}>低保赠送气量(单位：方)：{fields.freeGas}</Col>: <Col span={8}>&nbsp;</Col>}
                                  {fields.couponGas ? <Col>优惠券(单位：方)：{fields.couponGas}</Col>: <Col>&nbsp;</Col>}
                                </Row>
                                <Row>
                                  <Col>详&nbsp;情：{fields.orderDetail}</Col>
                                </Row>
                                <Row>
                                  {fields.cardCost ? <Col span={8}>本次补卡费用：{fields.cardCost}</Col>: <Col>&nbsp;</Col>}
                                </Row>
                                <Row>
                                  <Col span={2}>&nbsp;</Col>
                                  <Col span={13}>{data.rmbBig?data.rmbBig:""}</Col>
                                  <Col>{fields.orderPayment+fields.cardCost}</Col>
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
                    // 补卡充值-若使用低保送气量与优惠券且与充值气量相等则打印凭证
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
                                  {fields.isLowIncome ? <Col span={8}>低保赠送气量(单位：方)：{fields.freeGas}</Col>: <Col span={8}>&nbsp;</Col>}
                                  {fields.couponGas ? <Col>优惠券(单位：方)：{fields.couponGas}</Col>: <Col>&nbsp;</Col>}
                                </Row>
                                <Row>
                                  <Col>详&nbsp;情：{fields.orderDetail}</Col>
                                </Row>
                                <Row>
                                  {fields.cardCost ? <Col span={8}>本次补卡费用：{fields.cardCost}</Col>: <Col>&nbsp;</Col>}
                                </Row>
                                <Row>
                                  <Col span={2}>&nbsp;</Col>
                                  <Col span={13}>{data.rmbBig?data.rmbBig:""}</Col>
                                  <Col>{fields.orderPayment+fields.cardCost}</Col>
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
                    // 补卡充值-不使用优惠充值
                    if(fields.couponGas === undefined && (fields.freeGas === undefined || fields.freeGas === 0)) {
                      // 使用发票打印时需要验证发票信息);
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
                                      {fields.cardCost ? <Col span={8}>本次补卡费用：{fields.cardCost}</Col>: <Col>&nbsp;</Col>}
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
                                      <Col>{fields.orderPayment+fields.cardCost}</Col>
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
                              // 检查发票开始
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
                                              }else {
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
                              // 检查发票结束
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
              message.error("充值成功，写卡一般充值卡失败，请前往订单管理页面重新写卡");
            }
          } else {
            message.error("充值成功，写卡密码传递卡失败，请前往订单管理页面重新写卡");
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
      type: 'replaceCard/search',
      payload: params,
    });
  };

  getCardIdentifier = () => {
    const result = OCX.readCard();
    if (result[0] !== 'S') {
      return "读卡失败";
    }
    if (result[1] !== '0') {
      return "该卡片类型不是新卡";
    }
    return result[2];
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginLeft: 0, marginRight: 0, marginBottom: 8 }}>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('userId')(<Input placeholder="IC卡号" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('userName')(<Input placeholder="用户名称" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('iccardIdentifier')(<Input placeholder="IC卡识别号" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('userPhone')(<Input placeholder="手机" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('userAddress')(<Input placeholder="用户地址" />)}
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
      replaceCard: { data, history },
      loading,
    } = this.props;
    const { selectedRows, replaceCardFormVisible, replaceCardHistoryFormVisible } = this.state;
    return (
      <PageHeaderWrapper className="recharge-replaceCard">
        <Card bordered={false}>
          <div className={styles.Common}>
            <div className={styles.CommonForm}>{this.renderForm()}</div>
            <div className={styles.CommonOperator}>
              <Authorized authority="recharge:replaceCard:update">
                <Button icon="credit-card" disabled={selectedRows.length !== 1} onClick={() => this.handleReplaceCardFormVisible(true)}>补卡</Button>
              </Authorized>
              <Authorized authority="recharge:replaceCard:history">
                <Button icon="clock-circle" disabled={selectedRows.length !== 1} onClick={() => this.handleReplaceCardHistoryFormVisible(true)}>历史记录</Button>
              </Authorized>
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
          <ReplaceCardForm
            handleEdit={this.handleEdit}
            handleCancel={this.handleReplaceCardFormVisible}
            modalVisible={replaceCardFormVisible}
            selectedData={selectedRows[0]}
            getCardIdentifier={this.getCardIdentifier}
          />) : null
        }
        {selectedRows.length === 1 ? (
          <ReplaceCardHistoryForm
            handleReplaceCardHistoryFormVisible={this.handleReplaceCardHistoryFormVisible}
            modalVisible={replaceCardHistoryFormVisible}
            historyData={history}
          />) : null
        }
      </PageHeaderWrapper>
    );
  }
}

export default ReplaceCard;
