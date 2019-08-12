import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, message, Table, DatePicker } from 'antd';
import styles from '../Common.less';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import StandardTable from '../../components/StandardTable';
import DescriptionList from '../../components/DescriptionList';
import ExportJsonExcel from 'js-export-excel';

const { Description } = DescriptionList;
@connect(({ operatorDataQuery, loading }) => ({
  operatorDataQuery,
  loading: loading.models.operatorDataQuery,
}))
@Form.create()
class OperatorDataQuery extends PureComponent {
  state = {
    selectedRows: [],
    formValues: [],
    pageNum: 1,
    pageSize: 10,
    visible: false
  };

  columns = [{
    dataIndex: 'empId',
    title: '操作员编号'
  }, {
    dataIndex: 'empName',
    title: '操作员名称'
  }, {
    dataIndex: 'createTime',
    title: '创建时间'
  }, {
    dataIndex: 'userName',
    title: '用户名称'
  }, {
    dataIndex: 'userPhone',
    title: '用户电话'
  }, {
    dataIndex: 'userIdcard',
    title: '用户身份证号码'
  }, {
    dataIndex: 'userAddress',
    title: '用户住址'
  }];

  componentDidMount() {
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    dispatch({
      type: 'operatorDataQuery/fetch',
      payload: {
        pageNum,
        pageSize,
      },
    });
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
      type: 'operatorDataQuery/search',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      pageNum: 1,
      pageSize: 10,
    });
    dispatch({
      type: 'operatorDataQuery/fetch',
      payload: {
        pageNum: 1,
        pageSize: 10,
      },
    });
  };

  handleSearch = () => {
    const { dispatch, form } = this.props;
    const { pageNum, pageSize } = this.state;

    form.setFieldsValue({ 'empName': form.getFieldValue('empName') && form.getFieldValue('empName').trim() });
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
        type: 'operatorDataQuery/search',
        payload: {
          ...fieldsValue,
          pageNum,
          pageSize,
          startDate: fieldsValue.startDate ? fieldsValue.startDate.format('YYYY-MM-DD') : null,
          endDate: fieldsValue.endDate ? fieldsValue.endDate.format('YYYY-MM-DD') : null,
        },
      });
    });
  };

  showDownload = () => {
    const { dispatch, form } = this.props;
    form.setFieldsValue({
      'empName': form.getFieldValue('empName') && form.getFieldValue('empName').trim()
    });
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        formValues: fieldsValue
      });
      dispatch({
        type: 'operatorDataQuery/exportOperatorDataQuery',
        payload: {
          ...fieldsValue,
          startDate: fieldsValue.startDate ? fieldsValue.startDate.format('YYYY-MM-DD') : null,
          endDate: fieldsValue.endDate ? fieldsValue.endDate.format('YYYY-MM-DD') : null,
        },
        callback: (response) => {
          const dataList = response.data.list;
          const option = {
            fileName: '操作员日常数据导出',// 文件名
            datas: [
              {
                sheetData: dataList,
                sheetName: 'sheet',// 表名
                columnWidths: [10, 7, 12, 12, 12, 8, 8, 8, 8, 10, 10, 8, 8, 10],
                sheetFilter: ['empId', 'empName', 'createTime', 'userName', 'userPhone', 'userIdcard', 'userAddress', 'baseOrderPayment', 'baseOrderGas', 'launchOrderPayment', 'launchOrderGas', 'replacementOrderPayment', 'replacementOrderGas', 'cardCost'],// 列过滤
                sheetHeader: ['操作员编号', '操作员名称', '创建时间', '用户名称', '用户电话', '用户身份证号码', '用户住址', '基本金额', '基本气量', '发起预冲账金额', '发起预冲账气量', '补卡金额', '补卡气量', '补卡工本费'],// 第一行标题
              },
            ]
          };
          const toExcel = new ExportJsonExcel(option);
          toExcel.saveExcel();
        }
      });
    });
  }

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

  expandedRowRender = (record) => {
    const { baseOrderPayment, baseOrderGas, launchOrderPayment, launchOrderGas, replacementOrderPayment, replacementOrderGas, cardCost } = record;
    return (
      <DescriptionList size="small" title={null} col={3}>
        <Description term="基本金额">{baseOrderPayment}</Description>
        <Description term="基本气量">{baseOrderGas}</Description>
        <Description term="发起预冲账金额">{launchOrderPayment}</Description>
        <Description term="发起预冲账气量">{launchOrderGas}</Description>
        <Description term="补卡金额">{replacementOrderPayment}</Description>
        <Description term="补卡气量">{replacementOrderGas}</Description>
        <Description term="补卡工本费">{cardCost}</Description>
      </DescriptionList>
    );
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
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator("empName")(<Input placeholder="操作人" />)}
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
  }

  render() {
    const {
      operatorDataQuery: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;
    return (
      <PageHeaderWrapper className="queryStats-operatorDataQuery">
        <Card bordered={false}>
          <div className={styles.Common}>
            <div className={styles.CommonForm}>{this.renderForm()}</div>
            <div className={styles.CommonOperator}>
              <Button icon="download" onClick={() => this.showDownload()}>数据导出</Button>
            </div>
            <div style={{fontSize:'16px',margin:"10px",color:"blue",fontWeight:"bold"}}>累计基本购气量：{data.countBaseOrderGas?data.countBaseOrderGas:0}&nbsp;&nbsp;&nbsp;&nbsp;累计发起预冲账气量：{data.countLaunchOrderGas?data.countLaunchOrderGas:0}&nbsp;&nbsp;&nbsp;&nbsp;累计补卡购气量：{data.countReplacementOrderGas?data.countReplacementOrderGas:0}&nbsp;&nbsp;&nbsp;&nbsp;累计补卡工本费：{data.countCardCost?data.countCardCost:0}&nbsp;&nbsp;&nbsp;&nbsp;共：{data.rowNumber?data.rowNumber:0} 条记录</div>
            <Table
              columns={this.columns}
              selectedRows={selectedRows}
              rowKey='orderId'
              pagination={false}
              loading={loading}
              dataSource={data.list}
              scroll={{ x: 1500, y: 460 }}
              onSelectRow={this.handleSelectRows}
              expandedRowRender={this.expandedRowRender}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default OperatorDataQuery;
