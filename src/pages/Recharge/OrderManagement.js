import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Input, Button, Form, message } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import styles from '../Common.less';
import OCX from '../../components/OCX';

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
    {
      title: '订单生成员工',
      dataIndex: 'orderCreateEmpName',
    },
    {
      title: '订单生成时间',
      dataIndex: 'orderCreateTime',
    },
    {
      title: '发票代码',
      dataIndex: 'invoiceCode',
    },
    {
      title: '发票号码',
      dataIndex: 'invoiceNumber',
    },
    {
      title: '发票状态',
      dataIndex: 'invoiceStatusName',
    },
    {
      title: '发票打印员工',
      dataIndex: 'invoicePrintEmpName',
    },
    {
      title: '发票打印时间',
      dataIndex: 'invoicePrintTime',
    },
    {
      title: '发票作废员工',
      dataIndex: 'invoiceCancelEmpName',
    },
    {
      title: '发票作废时间',
      dataIndex: 'invoiceCancelTime',
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
      type: 'orderManagement/search',
      payload: params,
    });
  };

  handleSearch = () => {
    const { dispatch, form } = this.props;
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
        iccardId: result[3],
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
    }
    if (selectedRows[0].orderStatus === 2) {
      message.error('该订单已写卡成功，不能补写')
    }

    const { dispatch } = this.props;
    const { orderId, orderStatus } = selectedRows[0];
    dispatch({
      type: 'orderManagement/write',
      payload: {
        orderId,
        orderStatus,
      },
      callback: (response) => {
        if (response.status === 0) {
          message.success('写卡成功');
          dispatch({
            type: 'orderManagement/fetch',
            payload: {
              pageNum,
              pageSize
            }
          });
        } else {
          message.warning(response.message);
        }
      }
    });
  }

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
              <Button icon="scan" onClick={() => this.identifyCard()}>识别IC卡</Button>
              <Button icon="file-text" onClick={() => this.writeCard()}>写卡</Button>
              <Button icon="plus" onClick={() => this.handleAddModalVisible(true)}>发票打印</Button>
              <Button icon="file-text" onClick={() => this.handleAssignModalVisible(true)}>原票补打</Button>
              <Button icon="plus" onClick={() => this.handleAddModalVisible(true)}>新票补打</Button>
              <Button icon="file-text" onClick={() => this.handleAssignModalVisible(true)}>发票作废</Button>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              rowKey='orderId'
            />
          </div>
          <OCX />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default OrderManagement;
