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
  DatePicker
} from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import Authorized from '../../utils/Authorized';
import styles from '../Common.less';
import DictSelect from '../System/components/DictSelect';
import EntryMeterAddForm from './components/EntryMeterAddForm';
import EntryMeterEditForm from './components/EntryMeterEditForm';

const { confirm } = Modal;
const { MonthPicker } = DatePicker;
@connect(({ entryMeter, dic, loading }) => ({
  entryMeter,
  dic,
  loading: loading.models.entryMeter,
}))
@Form.create()
class EntryMeter extends PureComponent {
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
      title: '表具编码',
      dataIndex: 'meterCode',
    },
    {
      title: '表具止码',
      dataIndex: 'meterStopCode',
    },
    {
      title: '表具类型',
      dataIndex: 'meterCategory',
    },
    {
      title: '表具型号',
      dataIndex: 'meterType',
    },
    {
      title: '表向',
      dataIndex: 'meterDirectionName',
    },
    {
      title: '生产日期',
      dataIndex: 'meterProdDate',
    },
    {
      title: '入库日期',
      dataIndex: 'meterEntryDate',
    },
    {
      title: '表具状态',
      dataIndex: 'meterStatusName',
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    dispatch({
      type: 'entryMeter/fetch',
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
      type: 'entryMeter/fetch',
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

    form.setFieldsValue({'meterCode': form.getFieldValue('meterCode') && form.getFieldValue('meterCode').trim()});
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        formValues: fieldsValue,
        pageNum: 1,
        pageSize: 10
      });
      dispatch({
        type: 'entryMeter/search',
        payload: {
          ...fieldsValue,
          meterProdDate: fieldsValue.meterProdDate ? fieldsValue.meterProdDate.format('YYYY-MM') : null,
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
      type: 'entryMeter/add',
      payload: fields,
      callback: (response) => {
        if (response.status === 0) {
          message.success('新增成功');
          dispatch({
            type: 'entryMeter/fetch',
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
      type: 'entryMeter/edit',
      payload: fields,
      callback: (response) => {
        if (response.status === 0) {
          message.success('编辑成功');
          dispatch({
            type: 'entryMeter/fetch',
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
    const { dispatch,form } = this.props;
    const { formValues, pageNum, pageSize } = this.state;
    if (pageNum !== pagination.current || pageSize !== pagination.pageSize) {
      this.handleSelectedRowsReset();
    }
    const params = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      meterProdDate: form.getFieldValue('meterProdDate') ? form.getFieldValue('meterProdDate').format('YYYY-MM'):null,
    };
    this.setState({
      pageNum: pagination.current,
      pageSize: pagination.pageSize
    });
    dispatch({
      type: 'entryMeter/search',
      payload: params,
    });
  };

  showDeleteConfirm = (selectedRows) => {
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    const _ = this;

    let isDel = false;
    selectedRows.some((option) => {
      if (option.meterStatus === 2) {
        message.warning("已挂表的用户不用删除！")
        isDel = true;
        return true;
      }
    })
    if (isDel) {
      return;
    }

    confirm({
      title: '删除用户',
      content: `确认删除选中的${selectedRows.length}个入库表具信息？`,
      onOk() {
        const ids = [];
        selectedRows.forEach(row => {
          ids.push(row.meterId);
        });
        dispatch({
          type: 'entryMeter/delete',
          payload: {
            ids
          },
          callback: (response) => {
            if (response.status === 0) {
              message.success(response.message);
              _.handleSelectedRowsReset();
              dispatch({
                type: 'entryMeter/fetch',
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

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginLeft: 0, marginRight: 0, marginBottom: 8 }}>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('meterCode')(<Input placeholder="表具编码" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('meterDirection')(<DictSelect placeholder="表向" category="meter_direction" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('meterProdDate')(<MonthPicker placeholder="生产日期" />)}
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
      entryMeter: { data },
      loading,
    } = this.props;
    const { selectedRows, addModalVisible, editModalVisible } = this.state;
    return (
      <PageHeaderWrapper className="account-entryMeter">
        <Card bordered={false}>
          <div className={styles.Common}>
            <div className={styles.CommonForm}>{this.renderForm()}</div>
            <div className={styles.CommonOperator}>
              <Authorized authority="account:entryMeter:create">
                <Button icon="plus" onClick={() => this.handleAddModalVisible(true)}>新建</Button>
              </Authorized>
              <Authorized authority="account:entryMeter:update">
                <Button icon="edit" disabled={selectedRows.length !== 1} onClick={() => this.handleEditModalVisible(true)}>编辑</Button>
              </Authorized>
              <Authorized authority="account:entryMeter:delete">
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
              rowKey='meterId'
            />
          </div>
        </Card>
        <EntryMeterAddForm
          handleAdd={this.handleAdd}
          handleCancel={this.handleAddModalVisible}
          modalVisible={addModalVisible}
        />
        {selectedRows.length === 1 ? (
          <EntryMeterEditForm
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

export default EntryMeter;
