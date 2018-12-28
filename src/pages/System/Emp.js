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
  Modal, Badge,
} from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import DescriptionList from '../../components/DescriptionList';
import Authorized from '../../utils/Authorized';
import styles from './Emp.less';
import EmpAddForm from './components/EmpAddForm';
import EmpEditForm from './components/EmpEditForm';
import Exception403 from '../Exception/403';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const { confirm } = Modal;
const { Description } = DescriptionList;
@connect(({ emp, dist, org, role, dic, loading }) => ({
  emp,
  dist,
  org,
  role,
  dic,
  loading: loading.models.emp,
}))
@Form.create()
class Emp extends PureComponent {
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
      title: '工号',
      dataIndex: 'empNumber',
    },
    {
      title: '姓名',
      dataIndex: 'empName',
    },
    {
      title: '登录名',
      dataIndex: 'empLoginName',
    },
    {
      title: '邮箱',
      dataIndex: 'empEmail',
    },
    {
      title: '电话',
      dataIndex: 'empPhone',
    },
    {
      title: '手机',
      dataIndex: 'empMobile',
    },
    {
      title: '登录标记',
      dataIndex: 'empLoginFlagName',
      render: text =>
        text === '是' ? (
          <Badge status="success" text="正常" />
        ) : (
          <Badge status="error" text="禁用" />
        )
    }
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    dispatch({
      type: 'emp/fetch',
      payload: {
        pageNum,
        pageSize
      }
    });
    dispatch({
      type: 'dist/fetch'
    });
    dispatch({
      type: 'org/fetch'
    });
    dispatch({
      type: 'role/fetch'
    });
    dispatch({
      type: 'dic/fetch',
      payload: {
        category: 'emp_type'
      }
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'dist/fetch',
      payload: {},
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = () => {
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        formValues: fieldsValue,
      });
      dispatch({
        type: 'dist/search',
        payload: fieldsValue,
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
    dispatch({
      type: 'dist/add',
      payload: fields,
      callback: (response) => {
        if (response.status === 0) {
          message.success('新增成功');
          dispatch({
            type: 'dist/fetch'
          });
        }
      }
    });
  };

  handleEdit = fields => {
    this.handleEditModalVisible();
    const { dispatch } = this.props;
    dispatch({
      type: 'dist/edit',
      payload: fields,
      callback: (response) => {
        if (response.status === 0) {
          message.success('编辑成功');
          dispatch({
            type: 'dist/fetch'
          });
        }
      }
    });
  };

  handleSelectedRowsReset = () => {
    this.setState({
      selectedRows: []
    });
  };

  handleStandardTableChange = (pagination) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const params = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
    };

    dispatch({
      type: 'emp/fetch',
      payload: params,
    });
  };

  showDeleteConfirm = (selectedRows) => {
    const { dispatch } = this.props;
    const _ = this;
    confirm({
      title: '删除区域',
      content: `确认删除选中的${selectedRows.length}个区域？`,
      onOk() {
        const ids = [];
        selectedRows.forEach(row => {
          ids.push(row.distId);
        });
        dispatch({
          type: 'dist/delete',
          payload: {
            ids
          },
          callback: (response) => {
            if (response.status === 0) {
              message.success(response.message);
              _.handleSelectedRowsReset();
              dispatch({
                type: 'dist/fetch'
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

  expandedRowRender = (record) => {
    const { roleName, orgName, distName, empAddress, empTypeName, empManagementDistId } = record;
    return (
      <DescriptionList size="small" title={null} col={3}>
        <Description term="所属机构">{orgName}</Description>
        <Description term="所属区域">{distName}</Description>
        <Description term="用户角色">{roleName}</Description>
        <Description term="地址">{empAddress}</Description>
        <Description term="用户类型">{empTypeName}</Description>
        <Description term="负责区域">{empManagementDistId}</Description>
      </DescriptionList>
    );
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginLeft: 0, marginRight: 0, marginBottom: 8}}>
          <Col md={4} sm={12} style={{ paddingLeft: 0, paddingRight: 8}}>
            {getFieldDecorator('distName')(<Input placeholder="区域名称" />)}
          </Col>
          <Col md={4} sm={12} style={{ paddingLeft: 0, paddingRight: 8}}>
            {getFieldDecorator('distCode')(<Input placeholder="区域编码" />)}
          </Col>
          <Col md={4} sm={12} style={{ paddingLeft: 0, paddingRight: 8}}>
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
      emp: { data },
      dic,
      dist,
      org,
      role,
      loading,
    } = this.props;
    const distData = dist.data;
    const orgData = org.data;
    const roleData = role.data;
    const empTypeData = dic.dicData;
    const { selectedRows, addModalVisible, editModalVisible } = this.state;
    return (
      <PageHeaderWrapper className="antd-pro-pages-system-dist">
        <Card bordered={false}>
          <div className={styles.Emp}>
            <div className={styles.EmpForm}>{this.renderForm()}</div>
            <div className={styles.EmpOperator}>
              <Authorized authority="sys:emp:create">
                <Button icon="plus" onClick={() => this.handleAddModalVisible(true)}>新建</Button>
              </Authorized>
              <Authorized authority="sys:emp:update">
                <Button icon="edit" disabled={selectedRows.length !== 1} onClick={() => this.handleEditModalVisible(true)}>编辑</Button>
              </Authorized>
              <Authorized authority="sys:emp:delete">
                <Button icon="delete" disabled={selectedRows.length === 0} onClick={() => this.showDeleteConfirm(selectedRows)}>删除</Button>
              </Authorized>
            </div>
            <Authorized
              authority="sys:emp:detail"
              noMatch={
                <StandardTable
                  selectedRows={selectedRows}
                  loading={loading}
                  data={data}
                  columns={this.columns}
                  onSelectRow={this.handleSelectRows}
                  onChange={this.handleStandardTableChange}
                  rowKey='empId'
                />
              }
            >
              <StandardTable
                selectedRows={selectedRows}
                loading={loading}
                data={data}
                columns={this.columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
                expandedRowRender={this.expandedRowRender}
                rowKey='empId'
              />
            </Authorized>
          </div>
        </Card>
        <EmpAddForm
          handleAdd={this.handleAdd}
          handleCancel={this.handleAddModalVisible}
          modalVisible={addModalVisible}
          distData={distData}
          orgData={orgData}
          roleData={roleData}
          empTypeData={empTypeData}
        />
        {/* {selectedRows.length === 1 ? ( */}
        {/* <EmpEditForm */}
        {/* handleEdit={this.handleEdit} */}
        {/* handleCancel={this.handleEditModalVisible} */}
        {/* modalVisible={editModalVisible} */}
        {/* distTypeOptions={dicData} */}
        {/* treeSelectData={data} */}
        {/* selectedData={selectedRows[0]} */}
        {/* />) : null */}
        {/* } */}
      </PageHeaderWrapper>
    );
  }
}

export default Emp;
