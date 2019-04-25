/* eslint-disable react/no-unused-state */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  message
} from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../Common.less';
import LockAccountEditForm from './components/LockAccountEditForm';
import Authorized from '../../utils/Authorized';
import LockAccountHistory from './components/LockAccountHistory';

/* eslint react/no-multi-comp:0 */
@connect(({ lockAccount, loading }) => ({
  lockAccount,
  loading: loading.models.lockAccount,
}))
@Form.create()
class LockAccount extends PureComponent {
  state = {
    editModalVisible: false,
    removeModalVisible: false,
    selectedRows: [],
    historyData: null,
    historyModalVisible: false,
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
      title: '用户名称',
      dataIndex: 'userName',
    },
    {
      title: '用户区域',
      dataIndex: 'distName',
    },
    {
      title: 'IC卡编号',
      dataIndex: 'iccardId'
    },
    {
      title: '锁定状态',
      dataIndex: 'lockStatus'
    },
    {
      title: '解锁/锁定原因',
      dataIndex: 'lastLockReason'
    }
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    dispatch({
      type: 'lockAccount/fetch',
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
      type: 'lockAccount/search',
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
      type: 'lockAccount/fetch',
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

  editHistoryData = flag => {
    this.setState({
      historyData: flag
    });
  };

  handleSelectHistoryModalVisible = flag => {
    this.setState({
      historyModalVisible: !!flag
    });
  };

  handleRemoveModalVisible = flag => {
    this.setState({
      removeModalVisible: !!flag
    });
  };

  handleSearch = () => {
    const { dispatch, form } = this.props;
    const { pageNum, pageSize } = this.state;

    form.setFieldsValue({
      'userName': form.getFieldValue('userName') && form.getFieldValue('userName').trim(),
      'iccardId': form.getFieldValue('iccardId') && form.getFieldValue('iccardId').trim()
    });
    form.validateFields((err, fieldsValue) => {
      if (err) {
        Object.keys(err).map(key => {
          message.error(err[key].errors[0].message)
        });
        return;
      }
      this.setState({
        formValues: fieldsValue,
      });
      dispatch({
        type: 'lockAccount/search',
        payload: {
          ...fieldsValue,
          pageNum,
          pageSize
        },
      });
    });
  };

  handleEditModalVisible = flag => {
    this.setState({
      editModalVisible: !!flag,
    });
  };

  // 数据修改时后台消息返回并提示(锁定/解锁操作)
  handleEdit = fields => {
    this.handleEditModalVisible();
    const { pageNum, pageSize } = this.state;
    const { dispatch } = this.props;
    this.handleSelectedRowsReset();
    dispatch({
      type: 'lockAccount/edit',
      payload: fields,
      callback: (response) => {
        if (response.status === 0) {
          message.success(response.message);

        } else {
          message.error(response.message);
        }
        dispatch({
          type: 'lockAccount/fetch',
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

  /*
   *历史记录查询，点击触发
   *
   */
  showHistory = (selectedRows, flag) => {
    const { dispatch } = this.props;
    const _ = this;
    dispatch({
      type: 'lockAccount/historyLockAccount',
      payload: {
        userId: selectedRows[0].userId
      },
      callback: (response) => {
        if (response.status === 0) {
          // 若未查询到数据则提示
          if (response.data === null) {
            message.error(response.message);
          } else {
            _.handleSelectHistoryModalVisible(flag);
            _.editHistoryData(response.data);
          }
        } else {
          message.error(response.message);
        }
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
          <Col md={4} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('userName')(<Input placeholder="用户名称" />)}
          </Col>
          <Col md={4} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('iccardId', {
              rules: [{
                pattern: /^[0-9]+$/,
                message: 'IC卡编号只能为整数',
              }, {
                max: 10,
                message: 'IC卡编号不能超过10个数字',
              }]
            })(<Input placeholder="IC卡编号" />)}
          </Col>
          <Col md={4} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
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
      lockAccount: { data },
      loading,
    } = this.props;
    const { selectedRows, editModalVisible, historyModalVisible, historyData } = this.state;
    return (
      <PageHeaderWrapper className="antd-pro-pages-system-dist">
        <Card bordered={false}>
          <div className={styles.Common}>
            <div className={styles.CommonForm}>{this.renderForm()}</div>
            <div className={styles.CommonOperator}>
              <Button icon="unlock" disabled={selectedRows.length !== 1} onClick={() => this.handleEditModalVisible(true)}>锁定/解锁</Button>
              <Button icon="clock-circle" disabled={selectedRows.length !== 1} onClick={() => this.showHistory(selectedRows, true)}>操作记录</Button>
            </div>
            <Authorized>
              <StandardTable
                selectedRows={selectedRows}
                loading={loading}
                data={data}
                columns={this.columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
                rowKey='userId'
              />
            </Authorized>
          </div>
        </Card>
        {selectedRows.length === 1 ? (
          <LockAccountEditForm
            handleEdit={this.handleEdit}
            handleCancel={this.handleEditModalVisible}
            modalVisible={editModalVisible}
            selectedData={selectedRows[0]}
          />) : null
        }
        {selectedRows.length === 1 ? (
          <LockAccountHistory
            modalVisible={historyModalVisible}
            handleRemoveModalVisible={this.handleSelectHistoryModalVisible}
            historyData={historyData}
            selectedRows={selectedRows}
          />) : null
        }
      </PageHeaderWrapper>
    );
  }
}

export default LockAccount;
