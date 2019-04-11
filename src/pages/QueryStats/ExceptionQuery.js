import React, { PureComponent, Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, message, Modal, Pagination, InputNumber, Radio } from 'antd';
import styles from '../Common.less';
import DistTreeSelect from '../System/components/DistTreeSelect';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import StandardTable from '../../components/StandardTable';
import ExportJsonExcel from 'js-export-excel'

const RadioGroup = Radio.Group;
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
    visible: false,
    choice: 1,
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

  handleExportShow = () => {
    this.setState({
      visible: true
    });
  };

  handleCancel = (e) => {
    this.setState({
      visible: false
    });
  }

  handleExport = (e) => {
    const { dispatch } = this.props;
    const { choice, pageNum, pageSize } = this.state;

    this.setState({
      visible: false
    });
    let type = 'exceptionQuery/export';
    let payload = {};

    if (choice == 1) {
      type = 'exceptionQuery/exportWithPageInfo'
      payload = {
        pageNum: pageNum,
        pageSize: pageSize
      }
    }

    dispatch({
      type: type,
      payload: payload,
      callback: (response) => {
        let data = ""
        if (choice == 1) {
          data = response.data.list;
        } else {
          data = response.data;
        }
        let option = {};
        option.fileName = '异常用户查询';// 文件名
        option.datas = [
          {
            sheetData: data,
            sheetName: 'sheet',// 表名
            columnWidths: [10, 5, 5, 8, 8, 8],
            sheetFilter: ['userId', 'userName', 'iccardId', 'iccardIdentifier', 'userPhone', 'userDistName'],// 列过滤
            sheetHeader: ['用户编号', '用户名', 'IC卡卡号', 'IC卡识别号', '用户手机号', '用户区域'],// 第一行标题
          },
        ];
        const toExcel = new ExportJsonExcel(option); //new
        toExcel.saveExcel();
      }
    });

  }

  handleChange = (e) => {
    this.setState({
      choice: e.target.value,
    });
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
          <Col md={1} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            <Button shape="circle" icon="download" onClick={this.handleExportShow} />
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('userDistId')(<DistTreeSelect placeholder="用户区域" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('userAddress')(<Input placeholder="用户地址" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('notBuyDayCount')(<InputNumber placeholder="未购气天数(天)" min={1} decimalSeparator={'10000'} style={{"width":"100%"}}/>)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('monthAveGas')(<InputNumber placeholder="月购气量(立方)" min={0} style={{"width":"100%"}}/>)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('monthAvePayment')(<InputNumber placeholder="月均购气金额(元)" min={0} style={{"width":"100%"}}/>)}
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
        <Modal title='下载' visible={this.state.visible} onOk={this.handleExport} onCancel={this.handleCancel}>
          <RadioGroup onChange={this.handleChange} value={this.state.choice}>
            <Radio name='choice' value={1}>当前页</Radio>
            <Radio name='choice' value={2}>全部</Radio>
          </RadioGroup>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default ExceptionQuery;