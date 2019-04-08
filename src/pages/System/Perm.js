import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  message,
  Modal,
} from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import Authorized from '../../utils/Authorized';
import styles from '../Common.less';
import PermAddForm from './components/PermAddForm';
import PermEditForm from './components/PermEditForm';

const { confirm } = Modal;
@connect(({ perm, dist, org, loading }) => ({
  perm,
  dist,
  org,
  loading: loading.models.perm,
}))
@Form.create()
class Perm extends PureComponent {
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
      title: '权限名称',
      dataIndex: 'permName',
    },
    {
      title: '权限标题',
      dataIndex: 'permCaption',
    },
    {
      title: '父级权限标题',
      dataIndex: 'permParentCaption',
    },
    {
      title: '按钮权限',
      dataIndex: 'isButton',
      render: text => text ? '是' : '否',
    },
    {
      title: '备注',
      dataIndex: 'remarks',
    }
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    dispatch({
      type: 'perm/fetch',
      payload: {
        pageNum,
        pageSize
      }
    });
    dispatch({
      type: 'perm/fetchAllMenus'
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
      type: 'perm/fetch',
      payload: {
        pageNum: 1,
        pageSize: 10
      },
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
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
        type: 'perm/search',
        payload: {
          ...fieldsValue,
          pageNum,
          pageSize
        },
      });
    });
  };

  handleAddModalVisible = flag => {
    this.setState({
      addModalVisible: !!flag
    });
  };

  handleEditModalVisible = flag => {
    this.setState({
      editModalVisible: !!flag,
    });
  };

  handleAdd = fields => {
    this.handleAddModalVisible();
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    dispatch({
      type: 'perm/add',
      payload: fields,
      callback: (response) => {
        if (response.status === 0) {
          message.success('新增成功');
          dispatch({
            type: 'perm/fetch',
            payload: {
              pageNum,
              pageSize
            }
          });
        } else {
          message.error(response.message);
        }
      }
    });
  };

  handleEdit = fields => {
    this.handleEditModalVisible();
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    this.handleSelectedRowsReset();
    dispatch({
      type: 'perm/edit',
      payload: fields,
      callback: (response) => {
        if (response.status === 0) {
          message.success('编辑成功');
          dispatch({
            type: 'perm/fetch',
            payload: {
              pageNum,
              pageSize,
            },
          });
        } else {
          message.error(response.message);
        }
      },
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
      type: 'perm/search',
      payload: params,
    });
  };

  showDeleteConfirm = (selectedRows) => {
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    const _ = this;
    confirm({
      title: '删除权限',
      content: `确认删除选中的${selectedRows.length}个权限？`,
      onOk() {
        const ids = [];
        selectedRows.forEach(row => {
          ids.push(row.permId);
        });
        dispatch({
          type: 'perm/delete',
          payload: {
            ids
          },
          callback: (response) => {
            if (response.status === 0) {
              message.success(response.message);
              _.handleSelectedRowsReset();
              dispatch({
                type: 'perm/fetch',
                payload: {
                  pageNum,
                  pageSize
                }
              });
            } else {
              message.error(response.message);
            }
          }
        });
      },
      onCancel() {},
    });
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginLeft: 0, marginRight: 0, marginBottom: 8}}>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8}}>
            {getFieldDecorator('permName')(<Input placeholder="权限名称" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8}}>
            {getFieldDecorator('permCaption')(<Input placeholder="权限标题" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8}}>
            {getFieldDecorator('menuName')(<Input placeholder="菜单名称" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8}}>
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
    console.log(this.props)
    const {
      perm: { data, allMenus },
      loading,
    } = this.props;
    const { selectedRows, addModalVisible, editModalVisible } = this.state;
    return (
      <PageHeaderWrapper className="system-perm">
        <Card bordered={false}>
          <div className={styles.Common}>
            <div className={styles.CommonForm}>{this.renderForm()}</div>
            <div className={styles.CommonOperator}>
              <Authorized authority="sys:perm:create">
                <Button icon="plus" onClick={() => this.handleAddModalVisible(true)}>新建</Button>
              </Authorized>
              <Authorized authority="sys:perm:update">
                <Button icon="edit" disabled={selectedRows.length !== 1} onClick={() => this.handleEditModalVisible(true)}>编辑</Button>
              </Authorized>
              <Authorized authority="sys:perm:delete">
                <Button icon="delete" disabled={selectedRows.length === 0} onClick={() => this.showDeleteConfirm(selectedRows)}>删除</Button>
              </Authorized>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              expandedRowRender={this.expandedRowRender}
              rowKey='permId'
            />
          </div>
        </Card>
        <PermAddForm
          handleAdd={this.handleAdd}
          handleCancel={this.handleAddModalVisible}
          modalVisible={addModalVisible}
          treeSelectData={allMenus}
        />
        {selectedRows.length === 1 ? (
          <PermEditForm
            handleEdit={this.handleEdit}
            handleCancel={this.handleEditModalVisible}
            modalVisible={editModalVisible}
            treeSelectData={allMenus}
            selectedData={selectedRows[0]}
          />) : null
        }
      </PageHeaderWrapper>
    );
  }
}

export default Perm;
