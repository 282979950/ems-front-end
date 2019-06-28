import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, message } from 'antd';
import styles from '../Common.less';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import StandardTable from '../../components/StandardTable';


@connect(({ businessDataQuery, loading }) => ({
  businessDataQuery,
  loading: loading.models.businessDataQuery,
}))
@Form.create()
class BusinessDataQuery extends PureComponent {
  state = {
    selectedRows: [],
    formValues: [],
    pageNum: 1,
    pageSize: 10,
    visible: false
  };

  columns = [{
    dataIndex: 'userId',
    title: '用户编号'
  }, {
    dataIndex: 'icCard',
    title: '充值次数'
  }, {
    dataIndex: 'createTime',
    title: '最后一次充值'
  }, {
    dataIndex: 'orderGas',
    title: '累计充值气量'
  }, {
    dataIndex: 'orderPayment',
    title: '累计充值金额'
  }];

  componentDidMount() {
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    dispatch({
      type: 'businessDataQuery/fetch',
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
      type: 'businessDataQuery/fetch',
      payload: {
        pageNum: 1,
        pageSize: 10,
      },
    });
  };

  handleSearch = () => {
    const { dispatch, form } = this.props;
    const { pageNum, pageSize } = this.state;

    form.setFieldsValue({ 'userId': form.getFieldValue('userId') && form.getFieldValue('userId').trim() });
    form.validateFields((err, fieldsValue) => {
      if (err) {
        Object.keys(err).map(key => {
          message.error(err[key].errors[0].message);
        });
        return;
      }
      this.setState({
        formValues: fieldsValue,
      });
      dispatch({
        type: 'businessDataQuery/search',
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

  handleCancel = () => {
    this.setState({
      visible: false
    });
  };

  print= () =>{
    window.document.body.innerHTML = window.document.getElementById('billDetails').innerHTML;
    window.print();
    window.location.reload();
  }

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
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('userId')(<Input placeholder="用户编号" />)}
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
      businessDataQuery: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;
    return (
      <PageHeaderWrapper className="queryStats-businessDataQuery">
        <Card bordered={false}>
          <div className={styles.Common}>
            <div className={styles.CommonForm}>{this.renderForm()}</div>
            <div className={styles.CommonOperator}>
              <Button icon="reconciliation" onClick={this.print} style={{marginRight: '5px'}}>数据打印</Button>
            </div>
            <div id="billDetails">
              <StandardTable
                selectedRows={selectedRows}
                loading={loading}
                data={data}
                columns={this.columns}
                onSelectRow={this.handleSelectRows}
                rowKey='userId'
              />
            </div>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default BusinessDataQuery;
