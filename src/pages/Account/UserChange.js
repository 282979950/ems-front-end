/* eslint-disable prefer-destructuring,no-unused-vars,react/no-unused-state,no-const-assign */
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
import StandardTable from '../../components/StandardTable/index';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../Common.less';
import UserChangeEditForm from "./components/UserChangeEditForm";
import UserChangeRemoveForm  from"./components/UserChangeRemoveForm";
import UserChangeHistoryRecord  from"./components/UserChangeHistoryRecord";
import Authorized from '../../utils/Authorized';


const { confirm } = Modal;

/* eslint react/no-multi-comp:0 */
@connect(({ dic,userChange, loading }) => ({
  dic,
  userChange,
  loading: loading.models.userChange,
}))
@Form.create()
class UserChange extends PureComponent {
  state = {
    editModalVisible: false,
    removeModalVisible:false,
    historyModalVisible:false,
    removeModalMsg: null,
    flage:null,
    OrderSupplement:null,
    userMoney:null,
    historyData:null,
    selectedRows: [],
    formValues: {},
    pageNum: 1,
    pageSize: 10,
  };

  columns = [
    {
      title: '用户编号',
      dataIndex: 'userId',
    },
    {
      title: '用户姓名',
      dataIndex: 'userName',
    },
    {
      title: '用户电话',
      dataIndex: 'userPhone',
    },
    {
      title: '区域名称',
      dataIndex: 'distName'
    },
    {
      title: '用户地址',
      dataIndex: 'userAddress'
    },
    {
      title: '身份证号',
      dataIndex: 'userIdcard'
    },
    {
      title: '房产证号',
      dataIndex: 'userDeed'
    },
    {
      title: '用户类型',
      dataIndex: 'userTypeName'
    },
    {
      title: '用气类型',
      dataIndex: 'userGasTypeName'
    },
    {
      title: '用户状态',
      dataIndex: 'userStatusName'
    }
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    const { pageNum, pageSize, userMoney } = this.state;
    dispatch({
      type: 'userChange/fetch',
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
      type: 'userChange/search',
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
      type: 'userChange/fetch',
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
        type: 'userChange/search',
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

  handleRemoveModalVisible = flag => {
    this.setState({
      removeModalVisible: !!flag
    });
  };

  handleSelectUserChangeHistoryModalVisible = flag => {
    this.setState({
      historyModalVisible: !!flag
    });
  };

  editHistoryData = flag =>{
    this.setState({
      historyData: flag
    });
  };

  // 数据修改时后台消息返回并提示
  handleEdit = fields => {
    this.handleEditModalVisible();
    const { pageNum, pageSize } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'userChange/edit',
      payload: fields,
      callback: (response) => {
        if (response.status === 0) {
          message.success(response.message);

        }else{
          message.error(response.message);
        }
        dispatch({
          type: 'userChange/fetch',
          payload: {
            pageNum,
            pageSize,
          }
        });
      }
    });
  };

  handleCleans = fields => {
    this.handleRemoveModalVisible(false);
    const { pageNum, pageSize } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'userChange/delete',
      payload: fields,
      callback: (response) => {
        if (response.status === 0) {
          message.success(response.message);
        }else{
          message.error(response.message);
        }
        dispatch({
          type: 'userChange/fetch',
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
      title: '销户',
      content: `确认对选中的${selectedRows.length}个账户销户？`,
      onOk() {
        const userMoney = 0;
        const OrderSupplement =0;
        const flage = 0;
        const selected =selectedRows[0]
        dispatch({
          type: 'userChange/delete',
          payload: {
            userMoney,
            OrderSupplement,
            flage,
            ...selected
          },
          callback: (response) => {
            // 直接销户不需要涉及退钱和补钱
            if(response.data === null){
              message.success(response.message);
              _.handleSelectedRowsReset();
              dispatch({
                type: 'userChange/fetch',
                payload: {
                  pageNum,
                  pageSize
                }
              });
            }else{
              // 获取第三个参数是否为空后台传递标识（number）data[2]补缴金额。1，用户超用补缴，2.燃气公司退钱，为空则不涉及金额问题
              console.log(response.data[0],response.data[2])
              if (response.status === 0) {
                if(response.data[2] && response.data[0]){
                  _.setState({
                    removeModalVisible :true,
                    removeModalMsg: response.message,
                    flage :response.data[2],
                    OrderSupplement :response.data[0],
                    selectedData:selectedRows[0]
                  });
                }
              } else {
                message.error(response.message);
              }
            }
          }
        });
      },
      onCancel() {},
    });
  };
  /*
   *历史记录查询，点击触发
   *
   */

  showHistoryRecord = (selectedRows,flag) => {
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    const _ = this;
    dispatch({
      type: 'userChange/historyRecord',
      payload: {
        userId:  selectedRows[0].userId
      },
      callback: (response) => {
        if (response.status === 0) {
          _.handleSelectUserChangeHistoryModalVisible(flag);
          _.editHistoryData(response.data);
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
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginLeft: 0, marginRight: 0, marginBottom: 8}}>
          <Col md={4} sm={12} style={{ paddingLeft: 0, paddingRight: 8}}>
            {getFieldDecorator('userName')(<Input placeholder="用户姓名" />)}
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
      userChange: { data },
      loading,
    } = this.props;
    const { selectedRows, editModalVisible ,removeModalVisible,historyModalVisible,historyData, removeModalMsg,flage,OrderSupplement,userMoney} = this.state;
    return (
      <PageHeaderWrapper className="antd-pro-pages-system-dist">
        <Card bordered={false}>
          <div className={styles.Common}>
            <div className={styles.CommonForm}>{this.renderForm()}</div>
            <div className={styles.CommonOperator}>
              <Button icon="schedule" disabled={selectedRows.length !== 1} onClick={() => this.handleEditModalVisible(true)}>账户过户</Button>
              <Button icon="close-square" disabled={selectedRows.length !== 1} onClick={() => this.showDeleteConfirm(selectedRows)}>账户销户</Button>
              <Button icon="schedule" disabled={selectedRows.length !== 1} onClick={() => this.showHistoryRecord(selectedRows,true)}>历史过户信息</Button>
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
          <UserChangeEditForm
            handleEdit={this.handleEdit}
            handleCancel={this.handleEditModalVisible}
            modalVisible={editModalVisible}
            selectedData={selectedRows[0]}
          />) : null
        }
        {selectedRows.length === 1 ? (
          <UserChangeRemoveForm
            handleCleans={this.handleCleans}
            modalVisible={removeModalVisible}
            handleRemoveModalVisible={this.handleRemoveModalVisible}
            selectedData={selectedRows[0]}
            msg={removeModalMsg}
            flage={flage}
            OrderSupplement={OrderSupplement}
            userMoney={userMoney}
          />) : null
        }
        {selectedRows.length === 1 ? (
          <UserChangeHistoryRecord
            modalVisible={historyModalVisible}
            handleRemoveModalVisible={this.handleSelectUserChangeHistoryModalVisible}
            historyData={historyData}
            selectedRows={selectedRows}
          />) : null
        }
      </PageHeaderWrapper>
    );
  }
}

export default UserChange;
