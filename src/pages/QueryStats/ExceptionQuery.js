import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, Modal, InputNumber, Radio, message } from 'antd';
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
    selectedRows: [],
    formValues: {},
    pageNum: 1,
    pageSize: 10,
    visible: false,
    choice: 1,
  };

  columns = [{
    dataIndex: 'userId',
    title: 'IC卡号'
  }, {
    dataIndex: 'userName',
    title: '用户名'
  }, {
    dataIndex: 'userPhone',
    title: '用户手机号'
  }, {
    dataIndex: 'meterCode',
    title: '表号'
  }, {
    dataIndex: 'userAddress',
    title: '用户地址'
  }, {
    dataIndex: 'currentTotalOrderGas',
    title: '当前表购气总量'
  }, {
    dataIndex: 'totalOrderGas',
    title: '购气总量'
  }, {
    dataIndex: 'monthAveGas',
    title: '月均购气量'
  }, {
    dataIndex: 'notBuyDayCount',
    title: '未购气天数'
  }, {
    dataIndex: 'startBuyDay',
    title: '初次购气日期'
  }, {
    dataIndex: 'endBuyDay',
    title: '最后购气日期'
  }];

  componentDidMount() {
  }

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      pageNum: 1,
      pageSize: 10,
    });
  };

  handleSearch = () => {
    const { dispatch, form } = this.props;
    const { pageNum, pageSize } = this.state;

    form.setFieldsValue({ 'userAddress': form.getFieldValue('userAddress') && form.getFieldValue('userAddress').trim() });
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
      if (JSON.stringify(fieldsValue) === "{}") {
        message.info('请输入搜索条件');
        return;
      }
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
    if (JSON.stringify(formValues) === "{}") {
      message.info('请输入搜索条件');
      return;
    }
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

  handleCancel = () => {
    this.setState({
      visible: false
    });
  };

  handleExport = () => {
    const { dispatch } = this.props;
    const { choice, pageNum, pageSize, formValues } = this.state;

    this.setState({
      visible: false
    });
    let type = 'exceptionQuery/export';
    let payload = {
      ...formValues
    };

    if (choice === 1) {
      type = 'exceptionQuery/exportWithPageInfo';
      payload = {
        ...formValues,
        pageNum,
        pageSize
      }
    }

    dispatch({
      type,
      payload,
      callback: (response) => {
        let dataList = response.data;
        if (choice === 1) {
          dataList = response.data.list;
        }
        const option = {
          fileName: '异常用户查询',// 文件名
          datas: [
            {
              sheetData: dataList,
              sheetName: 'sheet',// 表名
              columnWidths: [10, 5, 5, 8, 8, 8],
              sheetFilter: ['userId', 'userName', 'userPhone', 'meterCode', 'userAddress','currentTotalOrderGas', 'totalOrderGas', 'monthAveGas', 'notBuyDayCount', 'startBuyDay', 'endBuyDay', '', '', '', '', '', ''],// 列过滤
              sheetHeader: ['IC卡号', '用户名', '用户手机号', '表号', '用户地址', '当前表购气总量','购气总量', '月均购气量', '未购气天数', '初次购气日期', '最后购气日期'],// 第一行标题
            },
          ]
        };
        const toExcel = new ExportJsonExcel(option);
        toExcel.saveExcel();
      }
    });

  };

  handleChange = (e) => {
    this.setState({
      choice: e.target.value,
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
            <Button shape="circle" icon="download" onClick={this.handleExportShow} />
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('userId')(<Input placeholder="IC卡号" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('userDistId')(<DistTreeSelect placeholder="用户区域" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('userAddress')(<Input placeholder="用户地址" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('meterCode')(<Input placeholder="表具编号" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('notBuyDayCount', {
              rules: [{
                pattern: /^[0-9]+$/,
                message: '未购气天数(天)只能为整数',
              }]
            })(<InputNumber placeholder="未购气天数(天)" min={0} max={999999999} style={{ "width": "100%" }} />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('monthAveGas')(<InputNumber placeholder="月均购气量(立方)" min={0} style={{ "width": "100%" }} />)}
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
    const { selectedRows, visible, choice } = this.state;
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
              onChange={this.handleStandardTableChange}
              rowKey="userId"
            />
          </div>
        </Card>
        <Modal title='下载' visible={visible} onOk={this.handleExport} onCancel={this.handleCancel}>
          <RadioGroup onChange={this.handleChange} value={choice}>
            <Radio name='choice' value={1}>当前页</Radio>
            <Radio name='choice' value={2}>全部</Radio>
          </RadioGroup>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default ExceptionQuery;
