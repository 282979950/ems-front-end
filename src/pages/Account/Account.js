import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Modal,
  message, Badge,
} from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import Authorized from '../../utils/Authorized';
import styles from '../Common.less';
import DictSelect from '../System/components/DictSelect';
import DistTreeSelect from '../System/components/DistTreeSelect';
import OCX from '../../components/OCX';
import CreateAccountForm from './components/CreateAccountForm';
import CreateArchiveAddForm from './components/CreateArchiveAddForm';
import InstallMeterEditForm from './components/InstallMeterEditForm';
import AccountForm from './components/AccountForm';
import BindCardForm from '@/pages/Account/components/BindCardForm';

@connect(({ account, order, loading }) => ({
  account,
  order,
  loading: loading.models.account,
}))
@Form.create()
class CreateAccount extends PureComponent {
  state = {
    createAccountModalVisible: false,
    archiveModalVisible: false,
    installMeterModalVisible: false,
    bindCardModalVisible: false,
    editModalVisible: false,
    selectedRows: [],
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
      title: '手机',
      dataIndex: 'userPhone',
    },
    // {
    //   title: '身份证号',
    //   dataIndex: 'userIdcard',
    // },
    // {
    //   title: '房产证号',
    //   dataIndex: 'userDeed',
    // },
    {
      title: '用户区域',
      dataIndex: 'userDistName',
    },
    {
      title: '地址',
      dataIndex: 'userAddress',
    },
    {
      title: '用户类型',
      dataIndex: 'userTypeName',
    },
    // {
    //   title: '用气类型',
    //   dataIndex: 'userGasTypeName',
    // },
    {
      title: '用户状态',
      dataIndex: 'userStatusName',
    },
    {
      title: '是否锁定',
      dataIndex: 'userLocked',
      render: text =>
        !text ? (
          <Badge status="success" text="正常" />
        ) : (
          <Badge status="error" text="已锁定" />
        )
    },
    {
      title: '表具编号',
      dataIndex: 'meterCode',
    },
    // {
    //   title: 'IC卡号',
    //   dataIndex: 'cardId',
    // },
    {
      title: 'IC卡识别号',
      dataIndex: 'cardIdentifier',
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    dispatch({
      type: 'account/fetch',
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
      type: 'account/fetch',
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

    form.setFieldsValue({
      'userId': form.getFieldValue('userId') && form.getFieldValue('userId').trim(),
      'userAddress': form.getFieldValue('userAddress') && form.getFieldValue('userAddress').trim(),
      'meterCode': form.getFieldValue('meterCode') && form.getFieldValue('meterCode').trim(),
      'cardIdentifier': form.getFieldValue('cardIdentifier') && form.getFieldValue('cardIdentifier').trim(),
    });
    form.validateFields((err, fieldsValue) => {
      if (err) {
        message.error(err.userId.errors[0].message);
        return;
      }
      this.setState({
        formValues: fieldsValue,
        pageNum: 1,
        pageSize: 10
      });
      dispatch({
        type: 'account/fetch',
        payload: {
          ...fieldsValue,
          pageNum: 1,
          pageSize: 10,
        },
      });
    });
  };

  handleAdd = fields => {
    this.handleArchiveModalVisible(false);
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    dispatch({
      type: 'account/add',
      payload: fields,
      callback: () => {
        message.success('新增成功');
        dispatch({
          type: 'account/fetch',
          payload: {
            pageNum,
            pageSize
          }
        });
      }
    });
  };

  handleCreateAccountModalVisible = flag => {
    this.setState({
      createAccountModalVisible: !!flag,
    });
  };

  handleCreateAccount = fields => {
    this.handleCreateAccountModalVisible();
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    this.handleSelectedRowsReset();
    dispatch({
      type: 'account/createAccount',
      payload: fields,
      callback: (response) => {
        if (response.status === 0) {
          message.success('开户成功');
          dispatch({
            type: 'account/fetch',
            payload: {
              pageNum,
              pageSize
            }
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
      type: 'account/fetch',
      payload: params,
    });
  };

  getCardIdentifier = () => {
    const result = OCX.readCard();
    if (result[0] !== 'S') {
      return "读卡失败";
    }
    if (result[1] !== '0') {
      return "只能使用新卡进行开户";
    }
    return result[2];
  };

  handleArchiveModalVisible = flag => {
    this.setState({
      archiveModalVisible: !!flag
    });
  };

  handleInstallMeterModalVisible = flag => {
    this.setState({
      installMeterModalVisible: !!flag
    });
  };

  handleInstallMeter = fields => {
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    this.handleSelectedRowsReset();
    dispatch({
      type: 'account/installMeter',
      payload: fields,
      callback: () => {
        message.success('挂表成功');
        this.handleInstallMeterModalVisible(false);
        dispatch({
          type: 'account/fetch',
          payload: {
            pageNum,
            pageSize,
          },
        });
      },
    });
  };

  handleBindCardModalVisible = (flag) => {
    this.setState({
      bindCardModalVisible: !!flag,
    });
  };

  handleBindCard = (fields) => {
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    this.handleSelectedRowsReset();
    const _ = this;
    dispatch({
      type: 'account/bindCard',
      payload: fields,
      callback: (response) => {
        _.handleBindCardModalVisible(false);
        message.success('发卡成功');
        const { iccardId, iccardPassword, orderGas, serviceTimes, flowNumber, orderId } = response.data;
        const wResult = OCX.writePCard(iccardId, iccardPassword, orderGas, serviceTimes, orderGas, flowNumber);
        if (wResult === '写卡成功') {
          dispatch({
            type: 'order/updateOrderStatus',
            payload: {
              orderId,
              orderStatus: 2
            },
            callback: (response2) => {
              if (response2.status === 0) {
                Modal.info({
                  title: '发卡',
                  content: (
                    <div>
                      <span>姓名：{fields.userName}</span><br />
                      <span>手机：{fields.userPhone}</span><br />
                      <span>ic卡识别号：{fields.iccardIdentifier}</span><br />
                      <span>本次充值气量：{fields.orderGas}</span><br />
                      <span>本次充值金额：{fields.orderPayment}</span>
                    </div>
                  )
                });
                dispatch({
                  type: 'account/fetch',
                  payload: {
                    pageNum,
                    pageSize
                  },
                });
              } else {
                message.error(response2.message);
              }
            }
          })
        }
      }
    })
  };

  handleEditModalVisible = flag => {
    this.setState({
      editModalVisible: !!flag,
    });
  };

  handleEdit = fields => {
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    this.handleSelectedRowsReset();
    dispatch({
      type: 'account/edit',
      payload: fields,
      callback: () => {
        message.success('编辑用户信息成功');
        this.handleEditModalVisible(false);
        dispatch({
          type: 'account/fetch',
          payload: {
            pageNum,
            pageSize,
          },
        });
      },
    });
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginLeft: 0, marginRight: 0, marginBottom: 8 }}>
          <Col md={2} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('userId', {
              rules: [{
                pattern: /^[0-9]+$/,
                message: '户号只能为整数',
              }, {
                max: 10,
                message: '户号不能超过10个数字',
              }]
            })(<Input placeholder="户号" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('userDistId')(<DistTreeSelect placeholder="用户区域" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('userAddress')(<Input placeholder="用户地址" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('userType')(<DictSelect placeholder="用户类型" category="user_type" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('userStatus')(<DictSelect placeholder="用户状态" category="user_status" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('meterCode')(<Input placeholder="表号" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('cardIdentifier')(<Input placeholder="IC卡识别号" />)}
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
      account: { data },
      loading,
    } = this.props;
    const { selectedRows, createAccountModalVisible, archiveModalVisible, installMeterModalVisible,bindCardModalVisible, editModalVisible } = this.state;
    return (
      <PageHeaderWrapper className="account-createAccount">
        <Card bordered={false}>
          <div className={styles.Common}>
            <div className={styles.CommonForm}>{this.renderForm()}</div>
            <div className={styles.CommonOperator}>
              <Authorized authority="account:createArchive:create">
                <Button icon="file-add" onClick={() => this.handleArchiveModalVisible(true)}>建档</Button>
              </Authorized>
              <Authorized authority="account:installMeter:update">
                <Button icon="dashboard" disabled={selectedRows.length !== 1 || selectedRows[0].userStatus !== 1} onClick={() => this.handleInstallMeterModalVisible(true)}>挂表</Button>
              </Authorized>
              <Authorized authority="account:createAccount:update">
                <Button icon="user-add" disabled={selectedRows.length !== 1 || selectedRows[0].userStatus !== 2} onClick={() => this.handleCreateAccountModalVisible(true)}>开户</Button>
              </Authorized>
              <Authorized authority="account:createAccount:update">
                <Button icon="credit-card" disabled={selectedRows.length !== 1 || selectedRows[0].userStatus !== 3} onClick={() => this.handleBindCardModalVisible(true)}>发卡</Button>
              </Authorized>
              <Authorized authority="account:createArchive:update">
                <Button icon="edit" disabled={selectedRows.length !== 1} onClick={() => this.handleEditModalVisible(true)}>编辑</Button>
              </Authorized>
              <Authorized authority="account:createArchive:delete">
                <Button icon="delete" disabled={selectedRows.length !== 1 || selectedRows[0].userStatus !== 1} onClick={() => this.showDeleteConfirm(selectedRows)}>删除</Button>
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
            <OCX />
          </div>
        </Card>
        <CreateArchiveAddForm
          handleAdd={this.handleAdd}
          handleCancel={this.handleArchiveModalVisible}
          modalVisible={archiveModalVisible}
        />
        {selectedRows.length === 1 && selectedRows[0].userStatus === 1 ? (
          <InstallMeterEditForm
            handleEdit={this.handleInstallMeter}
            handleCancel={this.handleInstallMeterModalVisible}
            modalVisible={installMeterModalVisible}
            selectedData={selectedRows[0]}
          />) : null
        }
        {selectedRows.length === 1 && selectedRows[0].userStatus === 2 ? (
          <CreateAccountForm
            handleEdit={this.handleCreateAccount}
            handleCancel={this.handleCreateAccountModalVisible}
            modalVisible={createAccountModalVisible}
            selectedData={selectedRows[0]}
            getCardIdentifier={this.getCardIdentifier}
          />) : null
        }
        {selectedRows.length === 1 && selectedRows[0].userStatus === 3 ? (
          <BindCardForm
            handleEdit={this.handleBindCard}
            handleCancel={this.handleBindCardModalVisible}
            modalVisible={bindCardModalVisible}
            selectedData={selectedRows[0]}
            getCardIdentifier={this.getCardIdentifier}
          />) : null
        }
        {selectedRows.length === 1 ? (
          <AccountForm
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

export default CreateAccount;