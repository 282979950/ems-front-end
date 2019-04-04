import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Icon, Input } from 'antd';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import StandardTable from '../../components/StandardTable';
import style from './User.less'

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

  render() {
    const {
      userQuery: {data},
      loading,
    } = this.props;
    const { selectedRows } = this.state
    return (
      <PageHeaderWrapper className="antd-pro-pages-system-dist">
        <Card bordered={false}>
          <div className={style.userInfoQuery}>
            <Row gutter={16}>
              <Col className="gutter-row" span={1}>
                <div className="gutter-box"><Icon type="edit" /></div>
              </Col>
              <Col className="gutter-row" span={1}>
                <div className="gutter-box">col-1</div>
              </Col>
              <Col className="gutter-row" span={1}>
                <div className="gutter-box">col-1</div>
              </Col>
              <Col className="gutter-row" span={1}>
                <div className="gutter-box">col-1</div>
              </Col>
              <Col className="gutter-row" span={1}>
                <div className="gutter-box">col-1</div>
              </Col>
              <Col className="gutter-row" span={1}>
                <div className="gutter-box">col-1</div>
              </Col>
              <Col className="gutter-row" span={8}>
                <div className="gutter-box"><Input placeholder="用户编号" /></div>
              </Col>
              <Col className="gutter-row" span={8}>
                <div className="gutter-box"><Input placeholder="用户名称" /></div>
              </Col>
              <Col className="gutter-row" span={1}>
                <div className="gutter-box">col-1</div>
              </Col>
              <Col className="gutter-row" span={1}>
                <div className="gutter-box">col-1</div>
              </Col>
            </Row>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              expandedRowRender={this.expandedRowRender}
              rowKey='userInfoId'
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default User;