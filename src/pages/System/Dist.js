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
} from 'antd';
import TreeTable from '@/components/TreeTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './Dist.less';
import DistAddForm from './components/DistAddForm';
import DistEditForm from './components/DistEditForm';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ dist, dic, loading }) => ({
  dist,
  dic,
  loading: loading.models.dist,
}))
@Form.create()
class Dist extends PureComponent {
  state = {
    addModalVisible: false,
    editModalVisible: false,
    selectedRows: [],
    formValues: {},
  };

  columns = [
    {
      title: '区域名称',
      dataIndex: 'distName',
    },
    {
      title: '区域编码',
      dataIndex: 'distCode',
    },
    {
      title: '区域类别',
      dataIndex: 'distCategoryName',
    },
    {
      title: '区域地址',
      dataIndex: 'distAddress',
    },
    {
      title: '父级区域',
      dataIndex: 'distParentName'
    }
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dist/fetch'
    });
    dispatch({
      type: 'dic/fetch',
      payload: {
        category: 'dist_type'
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
      type: 'dist/fetch',
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
      type: 'dist/fetch',
      payload: {},
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'dist/fetch',
        payload: values,
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
    const { dispatch } = this.props;
    dispatch({
      type: 'dist/add',
      payload: {
        fields
      },
    });
    message.success('新增成功');
    this.handleModalVisible();
  };

  handleEdit = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dist/edit',
      payload: {
        fields
      },
    });
    message.success('编辑成功');
    this.handleModalVisible();
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginLeft: 0, marginRight: 0, marginBottom: 8}}>
          <Col md={4} sm={12} style={{ paddingLeft: 0, paddingRight: 8}}>
            {getFieldDecorator('name')(<Input placeholder="区域名称" />)}
          </Col>
          <Col md={4} sm={12} style={{ paddingLeft: 0, paddingRight: 8}}>
            {getFieldDecorator('status')(<Input placeholder="区域编码" />)}
          </Col>
          <Col md={4} sm={12} style={{ paddingLeft: 0, paddingRight: 8}}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit" icon="search">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset} icon="sync">
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
      dist: { data },
      dic : { dicData },
      loading,
    } = this.props;
    const { selectedRows, addModalVisible, editModalVisible } = this.state;
    return (
      <PageHeaderWrapper className="antd-pro-pages-system-dist">
        <Card bordered={false}>
          <div className={styles.Dist}>
            <div className={styles.DistForm}>{this.renderForm()}</div>
            <div className={styles.DistOperator}>
              <Button icon="plus" onClick={() => this.handleAddModalVisible(true)}>新建</Button>
              <Button icon="edit" disabled={selectedRows.length !== 1} onClick={() => this.handleEditModalVisible(true)}>编辑</Button>
              <Button icon="delete" disabled={selectedRows.length === 0}>删除</Button>
            </div>
            <TreeTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleTreeTableChange}
              size='small'
              rowKey='distId'
            />
          </div>
        </Card>
        <DistAddForm
          handleAdd={this.handleAdd}
          handleCancel={this.handleAddModalVisible}
          modalVisible={addModalVisible}
          distTypeOptions={dicData}
          treeSelectData={data}
        />
        {selectedRows.length === 1 ? (
          <DistEditForm
            handleAdd={this.handleEdit}
            handleCancel={this.handleEditModalVisible}
            modalVisible={editModalVisible}
            distTypeOptions={dicData}
            treeSelectData={data}
            selectedData={selectedRows[0]}
          />) : null
        }
      </PageHeaderWrapper>
    );
  }
}

export default Dist;
