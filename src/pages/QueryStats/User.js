import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Input, Button, Form } from 'antd';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import StandardTable from '../../components/StandardTable';
import styles from '../Common.less';
import Authorized from '../../utils/Authorized';
import UserInfoModifyHistoryModal from './components/UserInfoModifyHistoryModal';
import UserInfoAddHistoryModal from './components/UserInfoAddHistoryModal';
import UserInfoFillHistoryModal from './components/UserInfoFillHistoryModal';
import UserInfoCardHistoryModal from './components/UserInfoCardHistoryModal';
import UserInfoRepairHistoryModal from './components/UserInfoRepairHistoryModal';

@connect(({ userQuery, loading }) => ({
  userQuery,
  loading: loading.models.emp,
}))
@Form.create()

class User extends Component {

  columns = [
    {
      title: '用户编号',
      dataIndex: 'userId',
    },
    {
      title: '用户名称',
      dataIndex: 'userName',
    },
    {
      title: '用户手机号码',
      dataIndex: 'userPhone',
    },
    {
      title: '用户身份证号',
      dataIndex: 'userIdcard',
    },
    {
      title: '用户地址',
      dataIndex: 'userAddress',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    }
  ];

  constructor(props) {
    super(props);
    this.state = {
      selectedRows: [],
      formValues: {},
      pageNum: 1,
      pageSize: 10,
      userInfoQueryModalVisible: false,
      userInfoType: '',
    }
  };

  componentDidMount() {
    const { dispatch } = this.props;  // this.props里面就含有dispatch
    const { pageNum, pageSize } = this.state;
    dispatch({
      type: 'userQuery/fetch',
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
      type: 'userQuery/fetch',
      payload: params,
    });
  };

  handleReplaceCardHistoryFormVisible = (flag, type) => {
    if (flag && type === 'editHistory') {
      const { dispatch } = this.props;
      const { selectedRows } = this.state;
      dispatch({
        type: 'userQuery/fetchModifyHistory',
        payload: {
          userId: selectedRows[0].userId
        },
        callback: () => {
          this.setState({
            userInfoQueryModalVisible: !!flag,
            userInfoType: 'editHistory'
          });
        }
      });
    } else if (flag && type === 'addHistory') {
      const { dispatch } = this.props;
      const { selectedRows } = this.state;
      dispatch({
        type: 'userQuery/fetchAddHistory',
        payload: {
          userId: selectedRows[0].userId
        },
        callback: () => {
          this.setState({
            userInfoQueryModalVisible: !!flag,
            userInfoType: 'addHistory'
          });
        }
      });
    } else if (flag && type === 'fillHistory') {
      const { dispatch } = this.props;
      const { selectedRows } = this.state;
      dispatch({
        type: 'userQuery/fetchFillHistory',
        payload: {
          userId: selectedRows[0].userId
        },
        callback: () => {
          this.setState({
            userInfoQueryModalVisible: !!flag,
            userInfoType: 'fillHistory'
          });
        }
      });
    } else if (flag && type === 'cardHistory') {
      const { dispatch } = this.props;
      const { selectedRows } = this.state;
      dispatch({
        type: 'userQuery/fetchCardHistory',
        payload: {
          userId: selectedRows[0].userId
        },
        callback: () => {
          this.setState({
            userInfoQueryModalVisible: !!flag,
            userInfoType: 'cardHistory'
          });
        }
      });
    } else if (flag && type === 'repairHistory') {
      const { dispatch } = this.props;
      const { selectedRows } = this.state;
      dispatch({
        type: 'userQuery/fetchRepairHistory',
        payload: {
          userId: selectedRows[0].userId
        },
        callback: () => {
          this.setState({
            userInfoQueryModalVisible: !!flag,
            userInfoType: 'repairHistory'
          });
        }
      });
    }
    else {
      this.setState({
        userInfoQueryModalVisible: !!flag,
      });
    }
  };

  handleOnClick = (param) => () => {
    switch (param) {
      case 'editHistory':
        this.handleReplaceCardHistoryFormVisible(true, 'editHistory')
        break;
      case 'addHistory':
        this.handleReplaceCardHistoryFormVisible(true, 'addHistory')
        break;
      case 'fillHistory':
        this.handleReplaceCardHistoryFormVisible(true, 'fillHistory')
        break;
      case 'cardHistory':
        this.handleReplaceCardHistoryFormVisible(true, 'cardHistory')
        break;
      case 'repairHistory':
        this.handleReplaceCardHistoryFormVisible(true, 'repairHistory')
        break;
      default:
        break;
    }
  }

  handleSearch = () => {
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        formValues: fieldsValue,
        pageNum: 1,
        pageSize: 10
      });
      dispatch({
        type: 'userQuery/fetchUserSearch',
        payload: {
          ...fieldsValue,
          pageNum: 1,
          pageSize: 10,
        },
      });
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
      type: 'userQuery/fetch',
      payload: {
        pageNum: 1,
        pageSize: 10,
      },
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
            {getFieldDecorator('userId')(<Input placeholder="用户编号" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('userName')(<Input placeholder="用户名称" />)}
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
      userQuery: { data, history },
      loading,
    } = this.props;
    const { selectedRows, userInfoQueryModalVisible, userInfoType } = this.state
    return (
      <PageHeaderWrapper className="antd-pro-pages-system-dist">
        <Card bordered={false}>
          <div className={styles.Common}>
            <div className={styles.CommonForm}>{this.renderForm()}</div>
            <div className={styles.CommonOperator}>
              <Authorized authority="queryStats:userQuery:historyQuery">
                <Button icon="credit-card" disabled={selectedRows.length !== 1} onClick={this.handleOnClick('editHistory')}>变更信息</Button>
              </Authorized>
              <Authorized authority="queryStats:userQuery:historyOrderQuery">
                <Button icon="clock-circle" disabled={selectedRows.length !== 1} onClick={this.handleOnClick('addHistory')}>充值信息</Button>
              </Authorized>
              <Authorized authority="queryStats:userQuery:historyFillGasOrder">
                <Button icon="clock-circle" disabled={selectedRows.length !== 1} onClick={this.handleOnClick('fillHistory')}>补气信息</Button>
              </Authorized>
              <Authorized authority="queryStats:userQuery:historyUserCard">
                <Button icon="clock-circle" disabled={selectedRows.length !== 1} onClick={this.handleOnClick('cardHistory')}>卡信息</Button>
              </Authorized>
              <Authorized authority="queryStats:userQuery:historyRepairOrder">
                <Button icon="clock-circle" disabled={selectedRows.length !== 1} onClick={this.handleOnClick('repairHistory')}>维修信息</Button>
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
        {userInfoType === 'editHistory' && selectedRows.length === 1 ? (
          <UserInfoModifyHistoryModal
            handleReplaceCardHistoryFormVisible={this.handleReplaceCardHistoryFormVisible}
            modalVisible={userInfoQueryModalVisible}
            historyData={history}
          />) : null
        }
        {userInfoType === 'addHistory' && selectedRows.length === 1 ? (
          <UserInfoAddHistoryModal
            handleReplaceCardHistoryFormVisible={this.handleReplaceCardHistoryFormVisible}
            modalVisible={userInfoQueryModalVisible}
            historyData={history}
          />) : null
        }
        {userInfoType === 'fillHistory' && selectedRows.length === 1 ? (
          <UserInfoFillHistoryModal
            handleReplaceCardHistoryFormVisible={this.handleReplaceCardHistoryFormVisible}
            modalVisible={userInfoQueryModalVisible}
            historyData={history}
          />) : null
        }
        {userInfoType === 'cardHistory' && selectedRows.length === 1 ? (
          <UserInfoCardHistoryModal
            handleReplaceCardHistoryFormVisible={this.handleReplaceCardHistoryFormVisible}
            modalVisible={userInfoQueryModalVisible}
            historyData={history}
          />) : null
        }
        {userInfoType === 'repairHistory' && selectedRows.length === 1 ? (
          <UserInfoRepairHistoryModal
            handleReplaceCardHistoryFormVisible={this.handleReplaceCardHistoryFormVisible}
            modalVisible={userInfoQueryModalVisible}
            historyData={history}
          />) : null
        }
      </PageHeaderWrapper>
    );
  }
}

export default User;