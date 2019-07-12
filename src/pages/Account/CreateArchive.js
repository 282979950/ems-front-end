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
import DictSelect from '../System/components/DictSelect';
import DistTreeSelect from '../System/components/DistTreeSelect';
import CreateArchiveAddForm from './components/CreateArchiveAddForm';
import CreateArchiveEditForm from './components/CreateArchiveEditForm';

const { confirm } = Modal;
@connect(({ createArchive, dic, loading }) => ({
  createArchive,
  dic,
  loading: loading.models.createArchive,
}))
@Form.create()
class CreateArchive extends PureComponent {
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
      title: '户号',
      dataIndex: 'userId',
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
      title: '用户状态',
      dataIndex: 'userStatusName',
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    dispatch({
      type: 'createArchive/fetch',
      payload: {
        pageNum,
        pageSize
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
      type: 'createArchive/fetch',
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

    form.setFieldsValue({
      'userId': form.getFieldValue('userId') && form.getFieldValue('userId').trim(),
      'userAddress': form.getFieldValue('userAddress') && form.getFieldValue('userAddress').trim()
    });
    form.validateFields((err, fieldsValue) => {
      if (err) {
        message.error(err.userId.errors[0].message)
        return;
      };
      this.setState({
        formValues: fieldsValue,
        pageNum: 1,
        pageSize: 10
      });
      dispatch({
        type: 'createArchive/search',
        payload: {
          ...fieldsValue,
          pageNum: 1,
          pageSize: 10,
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
      type: 'createArchive/add',
      payload: fields,
      callback: (response) => {
        if (response.status === 0) {
          message.success('新增成功');
          dispatch({
            type: 'createArchive/fetch',
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
      type: 'createArchive/edit',
      payload: fields,
      callback: (response) => {
        if (response.status === 0) {
          message.success('编辑成功');
          dispatch({
            type: 'createArchive/fetch',
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
      type: 'createArchive/search',
      payload: params,
    });
  };

  showDeleteConfirm = (selectedRows) => {
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    const _ = this;
    if(selectedRows.some(ele => ele.userStatus === 2 || ele.userStatus === 3 || ele.userStatus === 4)) {
      message.warn('已挂表的用户不用删除！');
      return;
    }
    confirm({
      title: '删除用户',
      content: `确认删除选中的${selectedRows.length}个用户档案信息？`,
      onOk() {
        const ids = [];
        selectedRows.forEach(row => {
          ids.push(row.userId);
        });
        dispatch({
          type: 'createArchive/delete',
          payload: {
            ids
          },
          callback: (response) => {
            if (response.status === 0) {
              message.success(response.message);
              _.handleSelectedRowsReset();
              dispatch({
                type: 'createArchive/fetch',
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
      onCancel() { },
    });
  };

  handleValidation = (rule, value, callback) => {
    if (Number(value) > 2147483647) {
      callback('户号太大，请重新输入')
    }

    // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
    callback()
  }

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginLeft: 0, marginRight: 0, marginBottom: 8 }}>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('userId', {
              rules: [{
                pattern: /^[0-9]+$/,
                message: '户号只能为整数',
              }, {
                max: 10,
                message: '户号不能超过10个数字',
              }, {
                validator: this.handleValidation
              }]
            })(<Input placeholder="户号" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('userDistId')(<DistTreeSelect placeholder="用户区域" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('userAddress')(<Input placeholder="用户地址" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('userType')(<DictSelect placeholder="用户类型" category="user_type" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('userGasType')(<DictSelect placeholder="用气类型" category="user_gas_type" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('userStatus')(<DictSelect placeholder="用户状态" category="user_status" />)}
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
      createArchive: { data },
      loading,
    } = this.props;
    const { selectedRows, addModalVisible, editModalVisible } = this.state;
    return (
      <PageHeaderWrapper className="account-createArchive">
        <Card bordered={false}>
          <div className={styles.Common}>
            <div className={styles.CommonForm}>{this.renderForm()}</div>
            <div className={styles.CommonOperator}>
              <Authorized authority="account:createArchive:create">
                <Button icon="plus" onClick={() => this.handleAddModalVisible(true)}>新建</Button>
              </Authorized>
              <Authorized authority="account:createArchive:update">
                <Button icon="edit" disabled={selectedRows.length !== 1} onClick={() => this.handleEditModalVisible(true)}>编辑</Button>
              </Authorized>
              <Authorized authority="account:createArchive:delete">
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
              rowKey='userId'
            />
          </div>
        </Card>
        <CreateArchiveAddForm
          handleAdd={this.handleAdd}
          handleCancel={this.handleAddModalVisible}
          modalVisible={addModalVisible}
        />
        {selectedRows.length === 1 ? (
          <CreateArchiveEditForm
            handleEdit={this.handleEdit}
            handleCancel={this.handleEditModalVisible}
            modalVisible={editModalVisible}
            selectedData={selectedRows[0]}
          />) : null
        }
      </PageHeaderWrapper>
    );
  }
}

export default CreateArchive;
