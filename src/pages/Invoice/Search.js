import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Input, Button, Form, message } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import styles from '../Common.less';
import Authorized from '../../utils/Authorized';
import EmpSelect from './components/EmpSelect'

@connect(({ invoiceSearch, loading }) => ({
  invoiceSearch,
  loading: loading.models.assign,
}))
@Form.create()

class InvoiceAssign extends Component {

  columns = [
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
      title: '所属员工',
      dataIndex: 'empName',
    },
    {
      title: '发票分配时间',
      dataIndex: 'invoiceAssignTime',
    },
    {
      title: '发票打印时间',
      dataIndex: 'invoicePrintTime',
    },
    {
      title: '作废人',
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
      type: 'invoiceSearch/fetch',
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
      type: 'invoiceSearch/search',
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
        type: 'invoiceSearch/search',
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
      type: 'invoiceSearch/fetch',
      payload: {
        pageNum: 1,
        pageSize: 10,
      }
    });
  }

  nullInvoice = () => {
    const { selectedRows, pageNum, pageSize } = this.state;
    
    const { dispatch } = this.props
    dispatch({
      type: 'invoiceSearch/invalidate',
      payload: {
        invoiceCode: selectedRows[0].invoiceCode,
        invoiceNumber: selectedRows[0].invoiceNumber
      },
      callback: (response) => {
        if (response.status === 0) {
          this.setState({
            selectedRows: []
          });
          dispatch({
            type: 'invoiceSearch/fetch',
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

  flag = (selectedRows) => {
    if (selectedRows[0] && selectedRows.length === 1 && selectedRows[0].invoiceStatusName === '已分配未打印') {
      return false;
    }
    return true;
  }

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginLeft: 0, marginRight: 0, marginBottom: 8 }}>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('invoiceCode')(<Input placeholder="发票代码" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('invoiceNumber')(<Input placeholder="发票号码" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('empId')(<EmpSelect placeholder="所属员工" />)}
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
      invoiceSearch: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;
    return (
      <PageHeaderWrapper className="antd-pro-pages-system-dist">
        <Card bordered={false}>
          <div className={styles.Common}>
            <div className={styles.CommonForm}>{this.renderForm()}</div>
            <div className={styles.CommonOperator}>
              {/* <Authorized authority="recharge:printCancel:cancel"> */}
              <Button icon="scan" disabled={this.flag(selectedRows)} onClick={() => this.nullInvoice()}>作废未绑定发票</Button>
              {/* </Authorized> */}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              rowKey='invoiceId'
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default InvoiceAssign;
