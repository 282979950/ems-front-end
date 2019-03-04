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
  Modal
} from 'antd';
import TreeTable from '@/components/TreeTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './Common.less';
import OrgAddForm from './components/OrgAddForm';
import OrgEditForm from './components/OrgEditForm';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const { confirm } = Modal;

/* eslint react/no-multi-comp:0 */
@connect(({ org, dic, loading }) => ({
  org,
  dic,
  loading: loading.models.org,
}))
@Form.create()
class Org extends PureComponent {
  state = {
    addModalVisible: false,
    editModalVisible: false,
    selectedRows: [],
    formValues: {},
  };

  columns = [
    {
      title: '机构名称',
      dataIndex: 'orgName',
    },
    {
      title: '机构代码',
      dataIndex: 'orgCode',
    },
    {
      title: '机构类别',
      dataIndex: 'orgCategoryName',
    },
    {
      title: '父级机构',
      dataIndex: 'orgParentName'
    }
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'org/fetch'
    });
    dispatch({
      type: 'dic/fetch',
      payload: {
        category: 'org_type'
      }
    });
  }

  handleTreeTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'org/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'org/fetch',
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
        type: 'org/search',
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

  // 新增时后台消息返回并提示
  handleAdd = fields => {
    this.handleAddModalVisible();
    const { dispatch } = this.props;
    dispatch({
      type: 'org/add',
      payload: fields,
      callback: (response) => {
        if (response.status === 0) {
          message.success(response.message);

        }else{
          message.error(response.message);

        }
        dispatch({
          type: 'org/fetch'
        });
      }
    });
  };

  // 数据修改时后台消息返回并提示
  handleEdit = fields => {
    this.handleEditModalVisible();
    const { dispatch } = this.props;
    dispatch({
      type: 'org/edit',
      payload: fields,
      callback: (response) => {
        if (response.status === 0) {
          message.success('编辑成功');

        }else{
          message.error(response.message);
        }
        dispatch({
          type: 'org/fetch'
        });
      }
    });
  };

  handleSelectedRowsReset = () => {
    this.setState({
      selectedRows: []
    });
  };

  showDeleteConfirm = (selectedRows) => {
    const { dispatch } = this.props;
    const _ = this;
    confirm({
      title: '机构删除',
      content: `确认删除选中的${selectedRows.length}个机构？`,
      onOk() {
        const ids = [];
        selectedRows.forEach(row => {
          ids.push(row.orgId);
        });
        dispatch({
          type: 'org/delete',
          payload: {
            ids
          },
          callback: (response) => {
            if (response.status === 0) {
              message.success(response.message);
              _.handleSelectedRowsReset();
              dispatch({
                type: 'org/fetch'
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
          <Col md={4} sm={12} style={{ paddingLeft: 0, paddingRight: 8}}>
            {getFieldDecorator('orgName')(<Input placeholder="机构名称" />)}
          </Col>
          <Col md={4} sm={12} style={{ paddingLeft: 0, paddingRight: 8}}>
            {getFieldDecorator('orgCode')(<Input placeholder="机构代码" />)}
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
      org: { data },
      dic : { dicData },
      loading,
    } = this.props;
    const { selectedRows, addModalVisible, editModalVisible } = this.state;
    return (
      <PageHeaderWrapper className="antd-pro-pages-system-dist">
        <Card bordered={false}>
          <div className={styles.Common}>
            <div className={styles.CommonForm}>{this.renderForm()}</div>
            <div className={styles.CommonOperator}>
              <Button icon="plus" onClick={() => this.handleAddModalVisible(true)}>新建</Button>
              <Button icon="edit" disabled={selectedRows.length !== 1} onClick={() => this.handleEditModalVisible(true)}>编辑</Button>
              <Button icon="delete" disabled={selectedRows.length === 0} onClick={() => this.showDeleteConfirm(selectedRows)}>删除</Button>
            </div>
            <TreeTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleTreeTableChange}
              size='small'
              rowKey='orgId'
            />
          </div>
        </Card>
        <OrgAddForm
          handleAdd={this.handleAdd}
          handleCancel={this.handleAddModalVisible}
          modalVisible={addModalVisible}
          orgTypeOptions={dicData}
          treeSelectData={data}
        />
        {selectedRows.length === 1 ? (
          <OrgEditForm
            handleEdit={this.handleEdit}
            handleCancel={this.handleEditModalVisible}
            modalVisible={editModalVisible}
            orgTypeOptions={dicData}
            treeSelectData={data}
            selectedData={selectedRows[0]}
          />) : null
        }
      </PageHeaderWrapper>
    );
  }
}

export default Org;
