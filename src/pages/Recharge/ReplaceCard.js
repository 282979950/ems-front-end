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
import StandardTable from '../../components/StandardTable';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import Authorized from '../../utils/Authorized';
import styles from '../Common.less';
import OCX from '../../components/OCX';
import ReplaceCardForm from './components/ReplaceCardForm';
import ReplaceCardHistoryForm from './components/ReplaceCardHistoryForm';

@connect(({ replaceCard, loading }) => ({
  replaceCard,
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
      title: '户号',
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
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    dispatch({
      type: 'replaceCard/fetch',
      payload: {
        pageNum,
        pageSize
      }
    });
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
    this.handleReplaceCardFormVisible();
    const { dispatch } = this.props;
    const { selectedRows, pageNum, pageSize } = this.state;
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
                    // 补卡充值-若使用了优惠券则减去优惠券部分并打印发票
                    if((fields.couponGas !== undefined || fields.couponGas !== '') && fields.orderGas> fields.couponGas){
                      Modal.confirm({
                        title: '操作成功已补卡，是否打印发票',
                        // content: (<p>IC卡号：{selectedRows[0].iccardId}<br />姓名：{selectedRows[0].userName}<br />购气总量：{selectedRows[0].totalOrderGas}<br />地址：{selectedRows[0].userAddress}</p>),
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
                                  <Col span={6}>用户地址：{selectedRows[0].userAddress}</Col>
                                </Row>
                                <Row>
                                  <Col>&nbsp;</Col>
                                </Row>
                                <Row>
                                  <Col span={8}>本次购买气量(单位：方)：{fields.orderGas-fields.couponGas}</Col>
                                  {fields.isLowIncome ? <Col span={8}>低保赠送气量(单位：方)：{fields.freeGas}</Col>: null}
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
                          window.document.body.innerHTML = window.document.getElementById('billDetails').innerHTML;
                          window.print();
                          window.location.reload();
                        },
                        cancelText: '取消',
                        width:560,
                      });
                    }
                    // 补卡充值-若只单独使用了优惠券则提示打印凭证
                    if((fields.couponGas !== undefined || fields.couponGas !== '') && fields.orderGas === `${fields.couponGas}`){
                      Modal.confirm({
                        title: '操作成功已补卡，是否打印凭证',
                        // content: (<p>IC卡号：{selectedRows[0].iccardId}<br />姓名：{selectedRows[0].userName}<br />购气总量：{selectedRows[0].totalOrderGas}<br />地址：{selectedRows[0].userAddress}</p>),
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
                                  <Col span={6}>用户地址：{selectedRows[0].userAddress}</Col>
                                </Row>
                                <Row>
                                  <Col>&nbsp;</Col>
                                </Row>
                                <Row>
                                  <Col span={8}>本次购买气量(单位：方)：{fields.orderGas-fields.couponGas}</Col>
                                  {fields.isLowIncome ? <Col span={8}>低保赠送气量(单位：方)：{fields.freeGas}</Col>: null}
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
                    // 补卡充值-不使用优惠券充值
                    if(fields.couponGas === undefined) {
                      Modal.confirm({
                        title: '操作成功已补卡，是否打印发票',
                        // content: (<p>IC卡号：{selectedRows[0].iccardId}<br />姓名：{selectedRows[0].userName}<br />购气总量：{selectedRows[0].totalOrderGas}<br />地址：{selectedRows[0].userAddress}</p>),
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
                                  <Col span={6}>用户地址：{selectedRows[0].userAddress}</Col>
                                </Row>
                                <Row>
                                  <Col>&nbsp;</Col>
                                </Row>
                                <Row>
                                  <Col span={8}>本次购买气量(单位：方)：{fields.orderGas}</Col>
                                  {fields.isLowIncome ? <Col span={8}>低保赠送气量(单位：方)：{fields.freeGas}</Col>: null}
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
                          window.document.body.innerHTML = window.document.getElementById('billDetails').innerHTML;
                          window.print();
                          window.location.reload();
                        },
                        cancelText: '取消',
                        width:560,
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
            {getFieldDecorator('userId')(<Input placeholder="户号" />)}
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
