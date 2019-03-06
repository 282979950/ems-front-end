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
import StandardTable from '../../components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './Dic.less';
import DicAddForm from './components/DicAddForm';
import DicEditForm from './components/DicEditForm';
import Authorized from '../../utils/Authorized';


const { confirm } = Modal;

/* eslint react/no-multi-comp:0 */
@connect(({ dic, loading }) => ({
  dic,
  loading: loading.models.dic,
}))
@Form.create()
class Dic extends PureComponent {
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
      title: '字典ID',
      dataIndex: 'dictId',
    },
    {
      title: '字典键',
      dataIndex: 'dictKey',
    },
    {
      title: '字典值',
      dataIndex: 'dictValue',
    },
    {
      title: '字典类型',
      dataIndex: 'dictCategory'
    },
    {
      title: '序号',
      dataIndex: 'dictSort'
    }
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    dispatch({
      type: 'dic/fetch',
      payload: {
        pageNum,
        pageSize
      }
    });
  }

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
      type: 'dic/search',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'dic/fetch',
      payload: {
        pageNum,
        pageSize
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
        type: 'dic/search',
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

  // 新增时后台消息返回并提示
  handleAdd = fields => {
    this.handleAddModalVisible();
    const { pageNum, pageSize } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'dic/add',
      payload: fields,
      callback: (response) => {
        if (response.status === 0) {
          message.success(response.message);

        }else{
          message.error(response.message);

        }
        dispatch({
          type: 'dic/fetch',
          payload: {
            pageNum,
            pageSize,
          }
        });
      }
    });
  };

  // 数据修改时后台消息返回并提示
  handleEdit = fields => {
    this.handleEditModalVisible();
    const { pageNum, pageSize } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'dic/edit',
      payload: fields,
      callback: (response) => {
        if (response.status === 0) {
          message.success('编辑成功');

        }else{
          message.error(response.message);
        }
        dispatch({
          type: 'dic/fetch',
          payload: {
            pageNum,
            pageSize,
          }
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
    const { pageNum, pageSize } = this.state;
    const _ = this;
    confirm({
      title: '字典删除',
      content: `确认删除选中的${selectedRows.length}个字典数据？`,
      onOk() {
        const ids = [];
        selectedRows.forEach(row => {
          ids.push(row.dictId);
        });
        dispatch({
          type: 'dic/delete',
          payload: {
            ids
          },
          callback: (response) => {
            if (response.status === 0) {
              message.success(response.message);
              _.handleSelectedRowsReset();
              dispatch({
                type: 'dic/fetch',
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
          <Col md={4} sm={12} style={{ paddingLeft: 0, paddingRight: 8}}>
            {getFieldDecorator('dictCategory')(<Input placeholder="字典类型" />)}
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
      dic: { data },
      loading,
    } = this.props;
    const { selectedRows, addModalVisible, editModalVisible } = this.state;
    return (
      <PageHeaderWrapper className="antd-pro-pages-system-dist">
        <Card bordered={false}>
          <div className={styles.Dic}>
            <div className={styles.DicForm}>{this.renderForm()}</div>
            <div className={styles.DicOperator}>
              <Button icon="plus" onClick={() => this.handleAddModalVisible(true)}>新建</Button>
              <Button icon="edit" disabled={selectedRows.length !== 1} onClick={() => this.handleEditModalVisible(true)}>编辑</Button>
              <Button icon="delete" disabled={selectedRows.length === 0} onClick={() => this.showDeleteConfirm(selectedRows)}>删除</Button>
            </div>
            <Authorized>
              <StandardTable
                selectedRows={selectedRows}
                loading={loading}
                data={data}
                columns={this.columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
                rowKey='dictId'
              />
            </Authorized>
          </div>
        </Card>
        <DicAddForm
          handleAdd={this.handleAdd}
          handleCancel={this.handleAddModalVisible}
          modalVisible={addModalVisible}
        />
        {selectedRows.length === 1 ? (
          <DicEditForm
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

export default Dic;
