/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Input, Button, Form, message, DatePicker, Modal } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import styles from '../Common.less';
import OCX from '../../components/OCX';
import Authorized from '../../utils/Authorized';
import DescriptionList from '../../components/DescriptionList';

const { Description } = DescriptionList;
const { confirm } = Modal;
@connect(({ orderManagement, loading }) => ({
  orderManagement,
  loading: loading.models.orderManagement,
}))
@Form.create()

class OrderManagement extends Component {

  columns = [
    {
      title: '订单编号',
      dataIndex: 'orderId',
    },
    {
      title: '用户编号',
      dataIndex: 'userId',
    },
    {
      title: '用户名',
      dataIndex: 'userName',
    },
    {
      title: 'IC卡编号',
      dataIndex: 'iccardId',
    },
    {
      title: 'IC卡识别号',
      dataIndex: 'iccardIdentifier',
    },
    {
      title: '购气量',
      dataIndex: 'orderGas',
    },
    {
      title: '购气金额',
      dataIndex: 'orderPayment',
    },
    {
      title: '流水号',
      dataIndex: 'flowNumber',
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      selectedRows: [],
      formValues: {},
      pageNum: 1,
      pageSize: 10,
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state
    dispatch({
      type: 'orderManagement/fetch',
      payload: {
        pageNum,
        pageSize
      }
    });
  }

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSelectedRowsReset = () => {
    this.setState({
      selectedRows: []
    });
  };

  handleStandardTableChange = (pagination) => {
    const { dispatch,form } = this.props;
    const { formValues, pageNum, pageSize } = this.state;
    if (pageNum !== pagination.current || pageSize !== pagination.pageSize) {
      this.handleSelectedRowsReset();
    }
    const params = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      startDate: form.getFieldValue('startDate') ? form.getFieldValue('startDate').format('YYYY-MM-DD'):null,
      endDate: form.getFieldValue('endDate') ? form.getFieldValue('endDate').format('YYYY-MM-DD'):null,
    };
    this.setState({
      pageNum: pagination.current,
      pageSize: pagination.pageSize
    });
    dispatch({
      type: 'orderManagement/search',
      payload: params,
    });
  };

  handleSearch = () => {
    const { dispatch, form } = this.props;

    form.setFieldsValue({
      'userName': form.getFieldValue('userName') && form.getFieldValue('userName').trim(),
      'iccardId': form.getFieldValue('iccardId') && form.getFieldValue('iccardId').trim(),
      'iccardIdentifier': form.getFieldValue('iccardIdentifier') && form.getFieldValue('iccardIdentifier').trim(),
      'invoiceCode': form.getFieldValue('invoiceCode') && form.getFieldValue('invoiceCode').trim(),
      'invoiceNumber': form.getFieldValue('invoiceNumber') && form.getFieldValue('invoiceNumber').trim()
    });
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        formValues: fieldsValue,
        pageNum: 1,
        pageSize: 10,
      });
      dispatch({
        type: 'orderManagement/search',
        payload: {
          ...fieldsValue,
          startDate: fieldsValue.startDate ? fieldsValue.startDate.format('YYYY-MM-DD') : null,
          endDate: fieldsValue.endDate ? fieldsValue.endDate.format('YYYY-MM-DD') : null,
          pageNum: 1,
          pageSize: 10,
        },
      });
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
      type: 'orderManagement/fetch',
      payload: {
        pageNum: 1,
        pageSize: 10,
      }
    });
  }

  identifyCard = () => {
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    const result = OCX.readCard();
    if (result[0] !== 'S') {
      return "读卡失败";
    }
    dispatch({
      type: 'orderManagement/search',
      payload: {
        iccardIdentifier: result[2],
        pageNum,
        pageSize
      },
    });
    return '';
  };

  writeCard = () => {
    const { selectedRows, pageNum, pageSize } = this.state;
    if (selectedRows.length === 0 || selectedRows.length >= 2) {
      message.error('请选择一条数据')
      return;
    }
    if (selectedRows[0].orderStatus === 2) {
      message.error('该订单已写卡成功，不能补写')
      return;
    }

    const { iccardId, iccardPassword, orderGas, serviceTimes, flowNumber, orderId } = selectedRows[0];
    const wResult = OCX.writeUCard(iccardId, iccardPassword, orderGas, serviceTimes, flowNumber);
    const { dispatch } = this.props;
    if (wResult === '写卡成功') {
      dispatch({
        type: 'orderManagement/updateOrderStatus',
        payload: {
          orderId,
          orderStatus: 2
        },
        callback: (response) => {
          if (response.status === 0) {
            message.success("写卡成功");
            this.setState({
              selectedRows: []
            });
            dispatch({
              type: 'orderManagement/fetch',
              payload: {
                pageNum,
                pageSize
              },
            });
          } else {
            message.error(response.message);
          }
        }
      })
    } else {
      message.error("写卡失败，请重试");
    }
  }

  printInvoice = () => {
    const { selectedRows, pageNum, pageSize } = this.state;

    if (selectedRows.length === 0 || selectedRows.length >= 2) {
      message.error('请选择一条数据');
      return;
    }

    if (selectedRows[0].invoiceStatusName !== undefined) {
      message.error('该订单已有打印记录，请选择补打');
      return;
    }

    const { dispatch } = this.props
    dispatch({
      type: 'orderManagement/findInvoice',
      payload: {
        orderId: selectedRows[0].orderId,
        userId: selectedRows[0].userId,
        printType: 1
      },
      callback: (response) => {
        const { data } = response;
        if (response.status === 0) {
          dispatch({
            type: 'orderManagement/printInvoice',
            payload: {
              orderId: selectedRows[0].orderId,
              invoiceCode: data.invoiceCode,
              invoiceNumber: data.invoiceNumber,
            },
            callback: response2 => {
              if (response2.status === 0) {
                message.success(response2.message);
                this.setState({
                  selectedRows: []
                });
                dispatch({
                  type: 'orderManagement/fetch',
                  payload: {
                    pageNum,
                    pageSize
                  }
                });
              } else {
                message.error(response2.message);
              }
            }
          });
        } else {
          message.error(response.message);
        }
      }
    })
  }

  reprintInvoice = () => {
    const { selectedRows, pageNum, pageSize } = this.state;

    if (selectedRows.length === 0 || selectedRows.length >= 2) {
      message.error('请选择一条数据');
      return;
    }

    if (selectedRows[0].invoiceStatusName === undefined) {
      message.error('该订单还没打印过，无法补打');
      return;
    }

    if (selectedRows[0].invoiceStatusName === '已作废') {
      message.error('该订单已作废过，无法原票补打');
      return;
    }

    const { dispatch } = this.props
    dispatch({
      type: 'orderManagement/findInvoice',
      payload: {
        orderId: selectedRows[0].orderId,
        userId: selectedRows[0].userId,
        printType: 2
      },
      callback: (response) => {
        const { data } = response;
        if (response.status === 0) {
          dispatch({
            type: 'orderManagement/printInvoice',
            payload: {
              orderId: selectedRows[0].orderId,
              invoiceCode: data.invoiceCode,
              invoiceNumber: data.invoiceNumber,
            },
            callback: response2 => {
              if (response2.status === 0) {
                message.success(response2.message);
                this.setState({
                  selectedRows: []
                });
                dispatch({
                  type: 'orderManagement/fetch',
                  payload: {
                    pageNum,
                    pageSize
                  }
                });
              } else {
                message.error(response2.message);
              }
            }
          });
        } else {
          message.error(response.message);
        }
      }
    })
  }

  reprintNewInvoice = () => {
    const { selectedRows, pageNum, pageSize } = this.state;

    if (selectedRows.length === 0 || selectedRows.length >= 2) {
      message.error('请选择一条数据');
      return;
    }

    if (selectedRows[0].invoiceStatusName === undefined) {
      message.error('该订单还没打印过，无法补打');
      return;
    }

    const { dispatch } = this.props
    dispatch({
      type: 'orderManagement/findInvoice',
      payload: {
        orderId: selectedRows[0].orderId,
        userId: selectedRows[0].userId,
        printType: 3
      },
      callback: (response) => {
        const { data } = response;
        if (response.status === 0) {
          dispatch({
            type: 'orderManagement/printInvoice',
            payload: {
              orderId: selectedRows[0].orderId,
              invoiceCode: data.invoiceCode,
              invoiceNumber: data.invoiceNumber,
            },
            callback: response2 => {
              if (response2.status === 0) {
                message.success(response2.message);
                this.setState({
                  selectedRows: []
                });
                dispatch({
                  type: 'orderManagement/fetch',
                  payload: {
                    pageNum,
                    pageSize
                  }
                });
              } else {
                message.error(response2.message);
              }
            }
          });
        } else {
          message.error(response.message);
        }
      }
    })
  }

  nullInvoice = () => {
    const { selectedRows, pageNum, pageSize } = this.state;

    if (selectedRows.length === 0 || selectedRows.length >= 2) {
      message.error('请选择一条数据');
      return;
    }

    if (selectedRows[0].invoiceStatusName === undefined) {
      message.error('该订单还没打印过，无法作废');
      return;
    }

    if (selectedRows[0].invoiceStatusName === '已作废') {
      message.error('该发票已作废过，无法再作废');
      return;
    }

    const { dispatch } = this.props
    dispatch({
      type: 'orderManagement/invalidate',
      payload: {
        orderId: selectedRows[0].orderId,
        userId: selectedRows[0].userId,
        invoiceCode: selectedRows[0].invoiceCode,
        invoiceNumber: selectedRows[0].invoiceNumber
      },
      callback: (response) => {
        if (response.status === 0) {
          message.success(response.message);
          this.setState({
            selectedRows: []
          });
          dispatch({
            type: 'orderManagement/fetch',
            payload: {
              pageNum,
              pageSize,
            }
          });
        } else {
          message.error(response.message);
        }
      }
    })
  }

  Printings = (selectedRows) =>{
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    dispatch({
      type: 'orderManagement/getRmbBig',
      payload: {
        orderGas:selectedRows[0].couponGas!== undefined ?selectedRows[0].orderGas-selectedRows[0].couponGas:selectedRows[0].orderGas
      },
      callback: (response) => {
        const { rmbBig } = response;
        // 创建当前日期
        const nowDate = new Date();
        const Y = nowDate.getFullYear();
        const M = nowDate.getMonth()+1;
        const D = nowDate.getDate();
        Modal.confirm({
          title: '确定打印凭证？',
          content: (
            <div>
              <br /><br /><p style={{color:"red"}}>凭证信息：</p>
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
                    <Col span={11}>本次购买气量(单位：方)：{selectedRows[0].couponGas!== undefined ?selectedRows[0].orderGas-selectedRows[0].couponGas:selectedRows[0].orderGas}</Col>
                    <Col>本次充值金额(单位：元)：{selectedRows[0].orderPayment}</Col>
                  </Row>
                  <Row>
                    <Col>&nbsp;</Col>
                  </Row>
                  <Row>
                    <Col>详&nbsp;情：{selectedRows[0].orderDetail}</Col>
                  </Row>
                  <Row>
                    <Col>&nbsp;</Col>
                  </Row>
                  <Row>
                    <Col span={2}>&nbsp;</Col>
                    <Col span={13}>{rmbBig}</Col>
                    <Col>{selectedRows[0].couponGas!== undefined ?selectedRows[0].orderGas-selectedRows[0].couponGas:selectedRows[0].orderGas}</Col>
                  </Row>
                  <Row>
                    <Col span={18}>&nbsp;</Col>
                    <Col>{selectedRows[0].orderCreateEmpName?selectedRows[0].orderCreateEmpName:""}</Col>
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
      },
    });

    dispatch({
      type: 'orderManagement/fetch',
      payload: {
        pageNum,
        pageSize
      },
    });

  }

  expandedRowRender = (record) => {
    const { orderCreateTime, invoiceCode, invoiceNumber, invoiceStatusName, invoicePrintEmpName, invoicePrintTime, invoiceCancelEmpName, invoiceCancelTime, orderCreateEmpName, orderDetail, couponGas, couponNumber } = record;
    return (
      <DescriptionList size="small" title={null} col={3}>
        <Description term="订单生成员工">{orderCreateEmpName}</Description>
        <Description term="订单生成时间">{orderCreateTime}</Description>
        <Description term="发票代码">{invoiceCode}</Description>
        <Description term="发票号码">{invoiceNumber}</Description>
        <Description term="发票状态">{invoiceStatusName}</Description>
        <Description term="发票打印员工">{invoicePrintEmpName}</Description>
        <Description term="发票打印时间">{invoicePrintTime}</Description>
        <Description term="发票作废员工">{invoiceCancelEmpName}</Description>
        <Description term="发票作废时间">{invoiceCancelTime}</Description>
        <Description term="订单详情">{orderDetail}</Description>
        <Description term="赠送气量或优惠券">{couponGas}</Description>
        <Description term="优惠券编号">{couponNumber}</Description>
      </DescriptionList>
    );
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
            {getFieldDecorator('iccardId')(<Input placeholder="IC卡编号" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('iccardIdentifier')(<Input placeholder="IC卡识别号" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('invoiceCode')(<Input placeholder="发票代码" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('invoiceNumber')(<Input placeholder="发票号码" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('startDate')(<DatePicker placeholder="开始日期" style={{ "width": "100%" }} />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('endDate')(<DatePicker placeholder="截止日期" style={{ "width": "100%" }} />)}
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
      orderManagement: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;
    return (
      <PageHeaderWrapper className="antd-pro-pages-system-dist">
        <Card bordered={false}>
          <div className={styles.Common}>
            <div className={styles.CommonForm}>{this.renderForm()}</div>
            <div className={styles.CommonOperator}>
              <Authorized authority="recharge:order:record">
                <Button icon="scan" onClick={() => this.identifyCard()}>识别IC卡</Button>
              </Authorized>
              <Authorized authority="recharge:order:writeCard">
                <Button icon="file-text" onClick={() => this.writeCard()}>写卡</Button>
              </Authorized>
              <Authorized authority="recharge:order:print">
                <Button icon="plus" onClick={() => this.printInvoice()}>发票打印</Button>
              </Authorized>
              <Authorized authority="recharge:order:old">
                <Button icon="file-text" onClick={() => this.reprintInvoice()}>原票补打</Button>
              </Authorized>
              <Authorized authority="recharge:order:new">
                <Button icon="plus" onClick={() => this.reprintNewInvoice()}>新票补打</Button>
              </Authorized>
              <Authorized authority="recharge:order:cancel">
                <Button icon="file-text" onClick={() => this.nullInvoice()}>发票作废</Button>
              </Authorized>
              <Authorized authority="recharge:order:cancel">
                <Button icon="file-text" onClick={() => this.Printings(selectedRows)}>打印凭证</Button>
              </Authorized>
            </div>
            <Authorized
              authority="sys:emp:detail"
              noMatch={
                <StandardTable
                  selectedRows={selectedRows}
                  loading={loading}
                  data={data}
                  columns={this.columns}
                  onSelectRow={this.handleSelectRows}
                  onChange={this.handleStandardTableChange}
                  rowKey='orderId'
                />
              }
            >
              <StandardTable
                selectedRows={selectedRows}
                loading={loading}
                data={data}
                columns={this.columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
                rowKey='orderId'
                expandedRowRender={this.expandedRowRender}
              />
            </Authorized>
          </div>
          <OCX />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default OrderManagement;
