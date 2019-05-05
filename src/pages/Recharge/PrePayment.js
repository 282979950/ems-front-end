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
import StandardTable from '../../components/StandardTable';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import Authorized from '../../utils/Authorized';
import styles from '../Common.less';
import OCX from '../../components/OCX';
import PrePaymentForm from './components/PrePaymentForm';
import NewCardPayment from './components/NewCardPayment';

@connect(({ prePayment, loading }) => ({
  prePayment,
  loading: loading.models.prePayment,
}))
@Form.create()
class PrePayment extends PureComponent {
  state = {
    prePaymentModalVisible: false,
    newCardPaymentModalVisible: false,
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
    dispatch({
      type: 'prePayment/fetch',
      payload: {
        pageNum,
        pageSize,
      },
    })
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
    const { dispatch } = this.props;
    const { selectedRows, pageNum, pageSize } = this.state;
    this.handleSelectedRowsReset();
    dispatch({
      type: 'prePayment/edit',
      payload: fields,
      callback: (response) => {
        if (response.status === 0) {
          message.success('充值成功，开始写卡');
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
                  message.success("写卡成功");
                  dispatch({
                    type: 'prePayment/search',
                    payload: {
                      iccardIdentifier: selectedRows[0].iccardIdentifier,
                      pageNum,
                      pageSize
                    },
                  });
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
    const { dispatch } = this.props;
    const { selectedRows, pageNum, pageSize } = this.state;
    this.handleSelectedRowsReset();
    dispatch({
      type: 'prePayment/edit',
      payload: fields,
      callback: (response) => {
        if (response.status === 0) {
          message.success('充值成功，开始写卡');
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
                  message.success("写卡成功");
                  dispatch({
                    type: 'prePayment/search',
                    payload: {
                      iccardIdentifier: selectedRows[0].iccardIdentifier,
                      pageNum,
                      pageSize
                    },
                  });
                } else {
                  message.error(response2.message);
                }
              }
            })
          } else {
            message.error("充值成功，写卡失败，请前往订单管理页面重新写卡");
          }
        } else {
          message.error('充值失败,请重试');
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
    const { selectedRows, prePaymentModalVisible, newCardPaymentModalVisible } = this.state;
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
      </PageHeaderWrapper>
    );
  }
}

export default PrePayment;
