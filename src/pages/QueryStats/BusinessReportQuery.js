import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, message, DatePicker } from 'antd';
import styles from '../Common.less';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import StandardTable from '../../components/StandardTable';
import OrgTreeSelect from '../System/components/OrgTreeSelect';


@connect(({ businessReportQuery, loading }) => ({
  businessReportQuery,
  loading: loading.models.businessReportQuery,
}))
@Form.create()
class BusinessReportQuery extends PureComponent {
  state = {
    selectedRows: [],
    pageNum: 1,
    pageSize: 10
  };

  columns = [{
    title: '营业月报表',
    children: [
        {
          title: '序号',
          width:'6%',
          render:(text,record,index)=>`${index+1}`
        },{
          dataIndex: 'orderDate',
          title: '充值日期',
          width:'16%',
        }, {
          dataIndex: 'orderTimes',
          title: '充值次数',
          width:'10%',
        }, {
          dataIndex: 'orderGas',
          title: '总购气量',
          width:'10%',
        }, {
          dataIndex: 'orderPayment',
          title: '总金额',
          width:'10%',
        }
      ],
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    // dispatch({
    //   type: 'businessReportQuery/fetch',
    //   payload: {
    //     pageNum,
    //     pageSize
    //   },
    // });
  }

  handleStandardTableChange = (pagination) => {
    const { dispatch,form } = this.props;
    const { formValues, pageNum, pageSize } = this.state;
    if (pageNum !== pagination.current || pageSize !== pagination.pageSize) {
      this.handleSelectedRowsReset();
    }
    const params = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      startDate: form.getFieldValue('startDate') ? form.getFieldValue('startDate').format('YYYY-MM-DD'):null,
      endDate: form.getFieldValue('endDate') ? form.getFieldValue('endDate').format('YYYY-MM-DD'):null,
      ...formValues,
    };
    this.setState({
      pageNum: pagination.current,
      pageSize: pagination.pageSize
    });
    dispatch({
      type: 'businessReportQuery/search',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      pageNum: 1,
      pageSize: 10,
    });
    dispatch({
      type: 'businessReportQuery/fetch',
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
      if (err) {
        Object.keys(err).map(key => {
          message.error(err[key].errors[0].message);
        });
        return;
      }
      dispatch({
        type: 'businessReportQuery/search',
        payload: {
          ...fieldsValue,
          startDate: fieldsValue.startDate ? fieldsValue.startDate.format('YYYY-MM-DD') : null,
          endDate: fieldsValue.endDate ? fieldsValue.endDate.format('YYYY-MM-DD') : null,
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
          <Col md={4} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('empOrgId')(
              <OrgTreeSelect placeholder="所属营业厅" />
            )}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator("empName")(<Input placeholder="操作人" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('startDate')(<DatePicker placeholder="充值开始日期" style={{ "width": "100%" }} />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('endDate')(<DatePicker placeholder="充值截止日期" style={{ "width": "100%" }} />)}
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
      businessReportQuery: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;
    return (
      <PageHeaderWrapper className="queryStats-businessReportQuery">
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
                onChange={this.handleStandardTableChange}
                rowKey='createTime'
                bordered
                disableCheckBox
              />
            </div>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default BusinessReportQuery;
