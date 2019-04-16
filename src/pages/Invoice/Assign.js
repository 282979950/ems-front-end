import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Input, Button, Form, message } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import styles from '../Common.less';
import InvoiceAddForm from './components/InvoiceAddForm';
import InvoiceAssignForm from './components/InvoiceAssignForm';

@connect(({ invoice, loading }) => ({
  invoice,
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
      title: '生成员工',
      dataIndex: 'createByName',
    },
    {
      title: '发票生成时间',
      dataIndex: 'invoiceGenerateTime',
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      selectedRows: [],
      formValues: {},
      pageNum: 1,
      pageSize: 10,
      addModalVisible: false,
      assignModalVisible: false,
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state
    dispatch({
      type: 'invoice/fetch',
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
      type: 'invoice/fetch',
      payload: params,
    });
  };

  handleAddModalVisible = flag => {
    this.setState({
      addModalVisible: !!flag
    });
  };

  handleAssignModalVisible = flag => {
    this.setState({
      assignModalVisible: !!flag
    });
  };

  handleAdd = fields => {
    this.handleAddModalVisible();
    const { dispatch } = this.props;
    dispatch({
      type: 'invoice/add',
      payload: fields,
      callback: (response) => {
        if (response.status === 0) {
          message.success('新增成功');
          dispatch({
            type: 'invoice/fetch'
          });
        } else {
          message.warning(response.message);
        }
      }
    });
  };

  handleAssign = fields => {
    this.handleAssignModalVisible();
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state
    dispatch({
      type: 'invoice/assign',
      payload: fields,
      callback: (response) => {
        if (response.status === 0) {
          message.success('分配成功');
          dispatch({
            type: 'invoice/fetch',
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

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      pageNum: 1,
      pageSize: 10
    });
    dispatch({
      type: 'invoice/fetch',
      payload: {
        pageNum: 1,
        pageSize: 10,
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
            {getFieldDecorator('userId')(<Input placeholder="发票代码" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('userName')(<Input placeholder="发票号码" />)}
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
      invoice: { data },
      loading,
    } = this.props;
    const { addModalVisible, assignModalVisible, selectedRows } = this.state;
    return (
      <PageHeaderWrapper className="antd-pro-pages-system-dist">
        <Card bordered={false}>
          <div className={styles.Common}>
            <div className={styles.CommonForm}>{this.renderForm()}</div>
            <div className={styles.CommonOperator}>
              <Button icon="plus" onClick={() => this.handleAddModalVisible(true)}>发票录入</Button>
              <Button icon="file-text" onClick={() => this.handleAssignModalVisible(true)}>发票分配</Button>
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
        <InvoiceAddForm
          handleAdd={this.handleAdd}
          handleCancel={this.handleAddModalVisible}
          modalVisible={addModalVisible}
          treeSelectData={null}
        />
        <InvoiceAssignForm
          handleAdd={this.handleAssign}
          handleCancel={this.handleAssignModalVisible}
          modalVisible={assignModalVisible}
          treeSelectData={null}
        />
      </PageHeaderWrapper>
    );
  }
}

export default InvoiceAssign;
