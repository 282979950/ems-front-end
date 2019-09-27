import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, message, Tag, Modal } from 'antd';
import styles from '../Common.less';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import StandardTable from '../../components/StandardTable';
import DictSelect from '../System/components/DictSelect';
import FillGasEditForm from './components/FillGasEditForm';
import OCX from '../../components/OCX';

@connect(({ fillGas, orderManagement, loading }) => ({
  fillGas,
  orderManagement,
  loading: loading.models.fillGas,
}))
@Form.create()
class FillGas extends PureComponent {
  state = {
    editModalVisible: false,
    selectedRows: [],
    pageNum: 1,
    pageSize: 10,
  };

  columns = [
    {
      dataIndex: 'repairOrderId',
      title: '维修单编号'
    },
    {
      dataIndex: 'userId',
      title: '户号'
    },
    {
      dataIndex: 'fillGasOrderStatus',
      title: '补气单状态',
      render: status => {
        switch (status) {
          case 0:
            return <Tag color='volcano'>待处理</Tag>;
          case 1:
            return <Tag color='green'>已处理</Tag>;
          case 2:
            return <Tag color='gray'>已撤销</Tag>;
          default:
            return <Tag color='gray'>已撤销</Tag>;
        }
      },
    },
    {
      dataIndex: 'fillGasOrderTypeName',
      title: '订单类型'
    },
    {
      dataIndex: 'userName',
      title: '用户名称'
    },
    {
      dataIndex: 'userPhone',
      title: '用户手机'
    },
    {
      dataIndex: 'userAddress',
      title: '用户地址'
    },
    {
      dataIndex: 'gasCount',
      title: '历史购气总量'
    },
    {
      dataIndex: 'stopCodeCount',
      title: '历史表止码'
    },
    {
      dataIndex: 'remarks',
      title: '备注'
    }];

  componentDidMount() {
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    dispatch({
      type: 'fillGas/fetch',
      payload: {
        pageNum,
        pageSize,
      },
    })
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
      type: 'fillGas/search',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      pageNum: 1,
      pageSize: 10
    });
    dispatch({
      type: 'fillGas/fetch',
      payload: {
        pageNum: 1,
        pageSize: 10
      },
    });
  };

  handleSearch = () => {
    const { dispatch, form } = this.props;
    const { pageNum, pageSize } = this.state;

    form.setFieldsValue({
      'repairOrderId': form.getFieldValue('repairOrderId') && form.getFieldValue('repairOrderId').trim(),
      'userId': form.getFieldValue('userId') && form.getFieldValue('userId').trim(),
      'userName': form.getFieldValue('userName') && form.getFieldValue('userName').trim(),
    });
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        formValues: fieldsValue,
      });
      dispatch({
        type: 'fillGas/search',
        payload: {
          ...fieldsValue,
          pageNum,
          pageSize
        },
      });
    });
  };

  handleEditModalVisible = flag => {
    const { selectedRows } = this.state;
    const cardInfo = OCX.readCard();
    if(cardInfo === '写卡器连接错误.') {
      message.error('写卡器连接错误');
      return;
    }
    if(cardInfo === 'IC卡未插入写卡器.') {
      message.error('IC卡未插入写卡器');
      return;
    }

    if(cardInfo === '卡类型不正确.') {
      message.error('卡片识别异常，请确认卡片已正常插入');
      return;
    }

    if(cardInfo[2] !== selectedRows[0].cardIdentifier) {
      message.error('IC卡与用户不对应');
      return;
    }

    if (!flag) {
      this.setState({
        editModalVisible: !!flag,
      });
      return;
    }
    if (selectedRows[0].fillGasOrderStatus === 1) {
      message.warning('补气单已处理');
      return;
    }
    if (selectedRows[0].fillGasOrderStatus === 2) {
      message.warning('补气单已撤销');
      return;
    }
    this.setState({
      editModalVisible: !!flag,
    })
  };

  handleEdit = (fields) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    const result = OCX.readCard();
    selectedRows[0].fillMoney = fields.fillMoney;
    selectedRows[0].leftMoney = fields.leftMoney;
    selectedRows[0].remarks = fields.remarks;

    this.handleEditModalVisible();
    this.handleSelectedRowsReset();

    if (result[0] === 'S') {
      dispatch({
        type: 'fillGas/readCard',
        payload: { cardId: result[2] },
        callback: (response) => {
          const password = response.data.cardPassword;
          const icCardId = response.data.cardId;
          switch (selectedRows[0].fillGasOrderType) {
            case 1:
              dispatch({
                type: 'fillGas/getServiceTimesByUserId',
                payload: {
                  userId: selectedRows[0].userId
                },
                callback: (response2) => {
                  const serviceTimes = response2.data;
                  dispatch({
                    type: 'fillGas/getFlowNum',
                    callback: (response3) => {
                      const flowNum = response3.data;
                      const isFirstOrder = selectedRows[0].needFillGas === (selectedRows[0].gasCount - selectedRows[0].stopCodeCount);

                      if (isFirstOrder) {
                        // 初始化IC卡
                        if (result[1] !== '0') {
                          const initResult = OCX.initCard(password);
                          if (initResult === 'S') {
                            // 获取流水号 获取维修次数
                            const writePCardResult = OCX.writePCard(icCardId, password, selectedRows[0].fillGas, serviceTimes, selectedRows[0].fillGas, flowNum);
                            if (writePCardResult === '写卡成功') {
                              // 更新订单状态，生成新订单，
                              this.editFillGasOrder(selectedRows);
                            } else {
                              message.error(writePCardResult);
                            }
                          } else {
                            message.error('初始化失败');
                          }
                        } else {
                          const writePCardResult = OCX.writePCard(icCardId, password, selectedRows[0].fillGas, serviceTimes, selectedRows[0].fillGas, flowNum);
                          if (writePCardResult === '写卡成功') {
                            // 更新订单状态，生成新订单，
                            this.editFillGasOrder(selectedRows);
                          } else {
                            message.error(writePCardResult);
                          }
                        }
                      } else {
                        if (result[1] === '0') {
                          const writePCardResult = OCX.writePCard(icCardId, password, selectedRows[0].fillGas, serviceTimes, selectedRows[0].fillGas, flowNum);
                          if (writePCardResult === '写卡成功') {
                            const writeUCardResult = OCX.writeUCard(icCardId, password, selectedRows[0].fillGas, serviceTimes, flowNum);
                            if (writeUCardResult === '写卡成功') {
                              this.editFillGasOrder(selectedRows);
                            } else {
                              message.error(writeUCardResult);
                            }
                          } else {
                            message.error(writePCardResult);
                          }
                        } else {
                          // 写一般充值卡
                          const writeUCardResult = OCX.writeUCard(icCardId, password, selectedRows[0].fillGas, serviceTimes, flowNum);
                          if (writeUCardResult === '写卡成功') {
                            this.editFillGasOrder(selectedRows);
                          } else {
                            message.error(writeUCardResult);
                          }
                        }
                      }
                    }
                  });
                }
              });
              break;
            case 2:
              // 初始化IC卡
              if (result[1] === '0') {
                  this.editFillGasOrder(selectedRows);
              } else {
                const initResult2 = OCX.initCard(password);
                if (initResult2 === 'S') {
                  this.editFillGasOrder(selectedRows);
                } else {
                  message.error("初始化失败");
                }
              }
              break;
            default:
              break;
          }
        }
      });
    } else {
      message.error(result);
    }
  };

  editFillGasOrder = (selectedRows) => {
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    dispatch({
      type: 'fillGas/edit',
      payload: selectedRows[0],
      callback: (response) => {
        // 创建当前日期
        const nowDate = new Date();
        const Y = nowDate.getFullYear();
        const M = nowDate.getMonth()+1;
        const D = nowDate.getDate();
        if(selectedRows[0].fillGasOrderType === 1){
          // message.success('处理补气单成功');
          Modal.info({
            title: '处理补气单成功，请打印凭证',
            content: (
              <div>
                <p style={{color:"red"}}>处理补气单成功</p>
                <br /><br /><p style={{color:"red"}}>补气打印信息：</p>
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
                      <Col span={11}>用户编号：{selectedRows[0].userId?selectedRows[0].userId:""}</Col>
                      <Col>用户名称：{selectedRows[0].userName?selectedRows[0].userName:""}</Col>
                    </Row>
                    <Row>
                      <Col span={6}>用户地址：{selectedRows[0].userAddress?selectedRows[0].userAddress:""}</Col>
                    </Row>
                    <Row>
                      <Col>&nbsp;</Col>
                    </Row>
                    <Row>
                      <Col span={8}>补气量(单位：方)：{selectedRows[0].fillGas?selectedRows[0].fillGas:""}</Col>
                    </Row>
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
                      <Col span={2}>&nbsp;</Col>
                    </Row>
                    <Row>
                      <Col span={18}>&nbsp;</Col>
                      {response.data.loginName?response.data.loginName:""}
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
        if(selectedRows[0].fillGasOrderType !== 1){
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
                    orderId: response.data.orderId,
                    userId: selectedRows[0].userId,
                    printType: 1
                  },
                  callback: (response4) => {
                    if (response4.status === 0) {
                      dispatch({
                        type: 'orderManagement/printInvoice',
                        payload: {
                          orderId: response.data.orderId,
                          invoiceCode: response4.data.invoiceCode,
                          invoiceNumber: response4.data.invoiceNumber,
                          orderPayment:selectedRows[0].fillMoney,
                        },
                        callback: response5 => {
                          if (response5.status === 0) {
                            const modal = Modal.info();
                            modal.update({
                              title: "请输入纳税人识别号码",
                              content: <input name="number" />,
                              onOk: () => {
                                const serialNumber = document.getElementsByName("number")[0].value;
                                Modal.info({
                                  title: '操作成功，请打印发票',
                                  content: (
                                    <div>
                                      <p style={{color:"red"}}>处理补缴单成功,打印后可前往预付费充值页面做【发卡充值】</p>
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
                                            <Col span={11}>用户编号：{response.data.data.userId?response.data.data.userId:""}</Col>
                                            <Col>用户名称：{response.data.data.userName?response.data.data.userName:""}</Col>
                                          </Row>
                                          <Row>
                                            <Col span={11}>用户地址：{response.data.data.userAddress?response.data.data.userAddress:""}</Col>
                                          </Row>
                                          <Row>
                                            <Col>纳税人识别号：{serialNumber}</Col>
                                          </Row>
                                          <Row>
                                            <Col span={8}>实补气量(单位：方)：{response.data.data.fillGas?response.data.data.fillGas:""}</Col>
                                            <Col>实补金额(单位：元)：{response.data.data.fillMoney?response.data.data.fillMoney:""}</Col>
                                          </Row>
                                          <Row>
                                            <Col>&nbsp;</Col>
                                          </Row>
                                          <Row>
                                            <Col>发票类别：超用补缴</Col>
                                          </Row>
                                          <Row>
                                            <Col>&nbsp;</Col>
                                          </Row>
                                          <Row>
                                            <Col span={2}>&nbsp;</Col>
                                            <Col span={13}>{response.data.rmbBig?response.data.rmbBig:""}</Col>
                                            <Col>{response.data.data.fillMoney?response.data.data.fillMoney:""}</Col>
                                          </Row>
                                          <Row>
                                            <Col span={18}>&nbsp;</Col>
                                            <Col>{response.data.name?response.data.name:""}</Col>
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
                            });
                          } else {
                            message.error(response5.message);
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
        }
        dispatch({
          type: 'fillGas/fetch',
          payload: {
            pageNum,
            pageSize
          }
        });
      }
    });
  };

  handleDisabled = selectedRows => selectedRows.length !== 1 || selectedRows[0].fillGasOrderStatusName !== '未处理';

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginLeft: 0, marginRight: 0, marginBottom: 8 }}>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('repairOrderId')(<Input placeholder="维修单编号" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('userName')(<Input placeholder="用户姓名" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('userId')(<Input placeholder="户号" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('fillGasOrderType')(<DictSelect placeholder="补气单类型" category="fill_gas_order_type" />)}
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
  }

  render() {
    const {
      fillGas: { data },
      loading,
    } = this.props;
    const { selectedRows, editModalVisible } = this.state;

    return (
      <PageHeaderWrapper className="repairorder-fillGas">
        <Card bordered={false}>
          <div className={styles.Common}>
            <div className={styles.CommonForm}>{this.renderForm()}</div>
            <div className={styles.CommonOperator}>
              <Button icon="edit" disabled={this.handleDisabled(selectedRows)} onClick={() => this.handleEditModalVisible(true)}>补气补缴</Button>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              rowKey="id"
            />
            <OCX />
          </div>
        </Card>
        {selectedRows.length === 1 ? (
          <FillGasEditForm
            handleEdit={this.handleEdit}
            handleCancel={this.handleEditModalVisible}
            modalVisible={editModalVisible}
            selectedData={selectedRows[0]}
          />
        ) : null}
      </PageHeaderWrapper>
    )
  }
}
export default FillGas;
