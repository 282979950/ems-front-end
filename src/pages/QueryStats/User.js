import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Input, Button, Tooltip } from 'antd';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import StandardTable from '../../components/StandardTable';
import style from './User.less'
import UserInfoQueryModal from './components/UserInfoQueryModal';

@connect(({ userQuery, loading }) => ({
  userQuery,
  loading: loading.models.emp,
}))

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
      pageNum: 1,
      pageSize: 10,
      UserInfoQueryModalVisible: false,
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
    const { pageNum, pageSize } = this.state;
    if (pageNum !== pagination.current || pageSize !== pagination.pageSize) {
      this.handleSelectedRowsReset();
    }
    const params = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize
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

  handleReplaceCardHistoryFormVisible = flag => {
    if (flag) {
      const { dispatch } = this.props;
      const { selectedRows } = this.state;
      console.log('123')
      dispatch({
        type: 'userQuery/fetchModifyHistory',
        payload: {
          userId: selectedRows[0].userId,
          pageNum: 1,
          pageSize: 10
        },
        callback: () => {
          this.setState({
            UserInfoQueryModalVisible: !!flag,
          });
        }
      });
    } else {
      this.setState({
        UserInfoQueryModalVisible: !!flag,
      });
    }
  };

  handleOnClick = (param) => () => {
    switch (param) {
      case 'editHistory':
        this.handleReplaceCardHistoryFormVisible(true)
        break;
      default:
        console.log('123')
        break;
    }
  }

  render() {
    const {
      userQuery: { data, history },
      loading,
    } = this.props;
    console.log(data)
    console.log(history)
    const { selectedRows, UserInfoQueryModalVisible } = this.state
    return (
      <PageHeaderWrapper className="antd-pro-pages-system-dist">
        <Card bordered={false}>
          <div className={style.userInfoQuery}>
            <Row gutter={16}>
              <Col className="gutter-row" span={1}>
                <div className="gutter-box"><Tooltip title="变更信息"><Button onClick={this.handleOnClick('editHistory')} type="primary" icon="edit" /></Tooltip></div>
              </Col>
              <Col className="gutter-row" span={1}>
                <div className="gutter-box"><Tooltip title="充值信息"><Button type="primary" icon="edit" /></Tooltip></div>
              </Col>
              <Col className="gutter-row" span={1}>
                <div className="gutter-box"><Tooltip title="补气信息"><Button type="primary" icon="edit" /></Tooltip></div>
              </Col>
              <Col className="gutter-row" span={1}>
                <div className="gutter-box"><Tooltip title="卡信息"><Button type="primary" icon="edit" /></Tooltip></div>
              </Col>
              <Col className="gutter-row" span={1}>
                <div className="gutter-box"><Tooltip title="维修信息"><Button type="primary" icon="edit" /></Tooltip></div>
              </Col>
              <Col className="gutter-row" span={1}>
                <div className="gutter-box"><Tooltip title="链接"><Button type="primary" icon="edit" /></Tooltip></div>
              </Col>
              <Col className="gutter-row" span={8}>
                <div className="gutter-box"><Input placeholder="用户编号" /></div>
              </Col>
              <Col className="gutter-row" span={8}>
                <div className="gutter-box"><Input placeholder="用户名称" /></div>
              </Col>
              <Col className="gutter-row" span={1}>
                <div className="gutter-box"><Tooltip title="搜索"><Button type="primary" icon="search" /></Tooltip></div>
              </Col>
              <Col className="gutter-row" span={1}>
                <div className="gutter-box"><Tooltip title="删除"><Button type="primary" icon="close" /></Tooltip></div>
              </Col>
            </Row>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              rowKey='userInfoId'
            />
          </div>
        </Card>
        {selectedRows.length === 1 ? (
          <UserInfoQueryModal
            handleReplaceCardHistoryFormVisible={this.handleReplaceCardHistoryFormVisible}
            modalVisible={UserInfoQueryModalVisible}
            historyData={history}
          />) : null
        }
      </PageHeaderWrapper>
    );
  }
}

export default User;