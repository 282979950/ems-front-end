import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, message, Modal, Pagination } from 'antd';
import styles from '../Common.less';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import StandardTable from '../../components/StandardTable';
import DictSelect from '../System/components/DictSelect';
import FillGasEditForm from './components/FillGasEditForm'


@connect(({ fillGas, loading }) => ({
  fillGas,
  loading: loading.models.accountQuery,
}))
@Form.create()
class FillGas extends PureComponent {
  state = {
    editModalVisible: false,
    selectedRows: [],
    pageNum: 1,
    pageSize: 10,

  }
  columns = [
    {
      dataIndex: 'repairOrderId',
      title: '维修单编号'
    },
    {
      dataIndex: 'userId',
      title: '户号'
    },
    {
      dataIndex: 'fillGasOrderStatusName',
      title: '补气单状态'
    },
    {
      dataIndex: 'fillGasOrderTypeName',
      title: '订单类型'
    },
    {
      dataIndex: 'userName',
      title: '用户名称'
    },
    {
      dataIndex: 'userPhone',
      title: '用户手机'
    },
    {
      dataIndex: 'userAddress',
      title: '用户地址'
    },
    {
      dataIndex: 'gasCount',
      title: '历史购气总量'
    },
    {
      dataIndex: 'stopCodeCount',
      title: '历史表止码'
    },
    {
      dataIndex: 'remarks',
      title: '备注'
    }]

  componentDidMount() {
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    dispatch({
      type: 'fillGas/fetch',
      payload: {
        pageNum,
        pageSize,
      },
    })
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
      type: 'input/search',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      pageNum: 1,
      pageSize: 10
    });
    dispatch({
      type: 'fillGas/fetch',
      payload: {
        pageNum: 1,
        pageSize: 10
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
        type: 'fillGas/search',
        payload: {
          ...fieldsValue,
          pageNum,
          pageSize
        },
      });
    });
  };

  handleEditModalVisible = flag => {
    const { selectedRows } = this.state;
    if(!flag){
      this.setState({
        editModalVisible: !!flag,
      })
    }

    if (selectedRows[0].fillGasOrderStatus === 1) {
      message.warning('补气单已处理');
      return;
    }
    if (selectedRows[0].fillGasOrderStatus === 2) {
      message.warning('补气单已撤销');
      return;
    }

    // data.fillGasOrderType === 1 ? 'fillGas' : 'overuse'

    this.setState({
      editModalVisible: !!flag,
    })
  };

  handleEdit = (fields, form) => {
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    dispatch({
      type: 'input/edit',
      payload: fields,
      callback: (response) => {
        message.success(response.message);
        this.handleEditModalVisible();
        this.handleSelectedRowsReset();
        form.resetFields();
        dispatch({
          type: 'input/fetch',
          payload: {
            pageNum,
            pageSize
          },
        });
      }
    });
  };


  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginLeft: 0, marginRight: 0, marginBottom: 8 }}>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('repairOrderId')(<Input placeholder="维修单编号" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('userId')(<Input placeholder="户号" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('repairResultType')(<DictSelect placeholder="维修类型" category="repair_type" />)}
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
      fillGas: { data },
      loading,
    } = this.props;

    const { selectedRows, editModalVisible } = this.state;

    return (
      <PageHeaderWrapper className="repairorder-fillGas">
        <Card bordered={false}>
          <div className={styles.Common}>
            <div className={styles.CommonForm}>{this.renderForm()}</div>
            <div className={styles.CommonOperator}>
              <Button icon="edit" disabled={selectedRows.length !== 1} onClick={() => this.handleEditModalVisible(true)}>补气补缴</Button>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChage={this.handleStandardTableChange}
              expandedRowRender={this.expandedRowRender}
              rowKey="fillGasId"
            />
          </div>
        </Card>
        {selectedRows.length === 1 ? (
          <FillGasEditForm
            handleEdit={this.handleEdit}
            handleCancel={this.handleEditModalVisible}
            modalVisible={editModalVisible}
            selectedData={selectedRows[0]}
          />
        ) : null}
      </PageHeaderWrapper>
    )
  }
}
export default FillGas;