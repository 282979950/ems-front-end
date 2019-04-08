import React, { PureComponent, Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, message, Modal, Pagination,InputNumber } from 'antd';
import styles from '../Common.less';
import DistTreeSelect from '../System/components/DistTreeSelect';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import StandardTable from '../../components/StandardTable';

@connect(({ exceptionQuery, dic, loading }) => ({
  exceptionQuery,
  dic,
  loading: loading.models.exceptionQuery,
}))
@Form.create()
class ExceptionQuery extends PureComponent {
  state = {
    adModalVisible: false,
    editModalVisble: false,
    selectedRows: [],
    formValues: [],
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
      title: 'IC卡卡号',
      dataIndex: 'iccardId',
    },
    {
      title: 'IC卡识别号',
      dataIndex: 'iccardIdentifier',
    },
    {
      title: '用户手机号',
      dataIndex: 'userPhone',
    },
    {
      title: '用户区域',
      dataIndex: 'userDistName',
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    dispatch({
      type: 'exceptionQuery/fetch',
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
      type: 'exceptionQuery/fetch',
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
        type: 'exceptionQuery/fetch',
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
      type: 'exceptionQuery/fetch',
      payload: params,
    });
  };

  handleExport = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'exceptionQuery/export',
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
            {getFieldDecorator('userDistId')(<DistTreeSelect placeholder="用户区域" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('userAddress')(<Input placeholder="用户地址" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('notBuyDayCount')(<InputNumber placeholder="未购气天数(天)" min={1} decimalSeparator={'10000'} />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('monthAveGas')(<InputNumber placeholder="月购气量(立方)" min={0}/>)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('monthAvePayment')(<InputNumber placeholder="月均购气金额(元)" min={0}/>)}
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
      exceptionQuery: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;
    return (
      <PageHeaderWrapper className="querystats-exceptionquery">
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

export default ExceptionQuery;
