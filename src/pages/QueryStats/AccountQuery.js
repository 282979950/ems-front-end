import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, message, Modal, DatePicker, Pagination } from 'antd';
import styles from '../Common.less';
import DistTreeSelect from '../System/components/DistTreeSelect';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import StandardTable from '../../components/StandardTable';

const { MonthPicker } = DatePicker;
@connect(({ accountQuery, dic, loading }) => ({
  accountQuery,
  dic,
  loading: loading.models.accountQuery,
}))
@Form.create()
class AccountQuery extends PureComponent {
  state = {
    addModalVisible: false,
    editModalVisible: false,
    selectedRows: [],
    formValues: {},
    pageNum: 1,
    pageSize: 10,
  };

  columns = [
    {
      title: '用户编号',
      dataIndex: 'userId',
    },
    {
      title: '用户名',
      dataIndex: 'userName',
    },
    {
      title: '用户区域',
      dataIndex: 'userDistName',
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
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    dispatch({
      type: 'accountQuery/fetch',
      payload: {
        pageNum,
        pageSize,
      },
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      pageNum: 1,
      pageSize: 10,
    });
    dispatch({
      type: 'accountQuery/fetch',
      payload: {
        pageNum: 1,
        pageSize: 10,
      },
    });
  };

  handleSearch = () => {
    const { dispatch, form } = this.props;
    const { pageNum, pageSize } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        formValues: fieldsValue,
      });
      dispatch({
        type: 'accountQuery/fetch',
        payload: {
          ...fieldsValue,
          pageNum,
          pageSize,
        },
      });
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSelectedRowsReset = () => {
    this.setState({
      selectedRows: [],
    });
  };

  handleStandardTableChange = pagination => {
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
      pageSize: pagination.pageSize,
    });
    dispatch({
      type: 'accountQuery/fetch',
      payload: params,
    });
  };

  handleExport = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'accountQuery/export',
      payload: {},
    });
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form layout="inline">
        <Row
          gutter={{ md: 8, lg: 24, xl: 48 }}
          style={{ marginLeft: 0, marginRight: 0, marginBottom: 8 }}
        >
          <Col md={1} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            <Button shape="circle" icon="download" onClick={this.handleExport} />
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('startDate')(<MonthPicker placeholder="开户起始日期" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('endDate')(<MonthPicker placeholder="开户终止日期" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('userDistId')(<DistTreeSelect placeholder="用户区域" />)}
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
  }
  render() {
    const {
      accountQuery: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;
    return (
      <PageHeaderWrapper className="querystats-accountquery">
        <Card bordered={false}>
          <div className={styles.Common}>
            <div className={styles.CommonForm}>{this.renderForm()}</div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChage={this.handleStandardTableChange}
              expandedRowRender={this.expandedRowRender}
              rowKey="AccountQueryId"
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default AccountQuery;
