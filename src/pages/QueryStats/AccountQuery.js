import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, Modal, DatePicker, Radio } from 'antd';
import ExportJsonExcel from 'js-export-excel'
import styles from '../Common.less';
import DistTreeSelect from '../System/components/DistTreeSelect';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import StandardTable from '../../components/StandardTable';

const RadioGroup = Radio.Group;
@connect(({ accountQuery, dic, loading }) => ({
  accountQuery,
  dic,
  loading: loading.models.accountQuery,
}))
@Form.create()
class AccountQuery extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
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
    {
      title: '开户人',
      dataIndex: 'openByName',
    }, {
      title: '开户时间',
      dataIndex: 'openTime',
    }
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

    form.setFieldsValue({ 'userAddress': form.getFieldValue('userAddress') && form.getFieldValue('userAddress').trim() });
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
    const { choice, pageNum, pageSize } = this.state;

    this.setState({
      visible: false
    });
    let type = 'accountQuery/export';
    let payload = {};

    if (choice === 1) {
      type = 'accountQuery/exportWithPageInfo'
      payload = {
        pageNum,
        pageSize
      }
    }

    dispatch({
      type,
      payload,
      callback: (response) => {
        let data = response.data;
        if (choice === 1) {
          data = response.data.list;
        }
        const option = {
          fileName: '开户信息查询',// 文件名
          datas: [
            {
              sheetData: data,
              sheetName: 'sheet',// 表名
              columnWidths: [10, 5, 5, 8],
              sheetFilter: ['userId', 'userName', 'userDistName', 'userAddress', 'userTypeName', 'userGasTypeName'],// 列过滤
              sheetHeader: ['用户编码', '用户名', '用户区域', '用户地址', '用户类型', '用气类型'],// 第一行标题
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
            {getFieldDecorator('startDate')(<DatePicker placeholder="开户起始日期" style={{ "width": "100%" }} />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('endDate')(<DatePicker placeholder="开户终止日期" style={{ "width": "100%" }} />)}
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
  };

  render() {
    const {
      accountQuery: { data },
      loading,
    } = this.props;
    const { selectedRows, visible, choice } = this.state;
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
  };
}
export default AccountQuery;
