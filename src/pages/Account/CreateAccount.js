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
  message,
} from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import Authorized from '../../utils/Authorized';
import styles from '../Common.less';
import DictSelect from '../System/components/DictSelect';
import DistTreeSelect from '../System/components/DistTreeSelect';
import OCX from '../../components/OCX';
import CreateAccountForm from './components/CreateAccountForm';

@connect(({ account, order, loading }) => ({
  account,
  order,
  loading: loading.models.account,
}))
@Form.create()
class CreateAccount extends PureComponent {
  state = {
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
      title: '用户区域',
      dataIndex: 'userDistName',
    },
    {
      title: '用户地址',
      dataIndex: 'userAddress',
    },
    {
      title: '用户类型',
      dataIndex: 'userTypeName',
    },
    {
      title: '用气类型',
      dataIndex: 'userGasTypeName',
    },
    {
      title: '用户状态',
      dataIndex: 'userStatusName',
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
    });
    form.validateFields((err, fieldsValue) => {
      if (err) {
        message.error(err.userId.errors[0].message)
        return;
      };
      this.setState({
        formValues: fieldsValue,
        pageNum: 1,
        pageSize: 10
      });
      dispatch({
        type: 'account/search',
        payload: {
          ...fieldsValue,
          pageNum: 1,
          pageSize: 10,
        },
      });
    });
  };

  handleEditModalVisible = flag => {
    this.setState({
      editModalVisible: !!flag,
    });
  };

  handleEdit = fields => {
    this.handleEditModalVisible();
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    this.handleSelectedRowsReset();
    dispatch({
      type: 'account/edit',
      payload: fields,
      callback: (response) => {
        if (response.status === 0) {
          console.log('录入开户信息成功');
          const { data } = response;
          const { iccardId, iccardPassword, orderGas, serviceTimes, flowNumber, orderId } = data;
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
                  console.log("开户首单充值成功");
                  const Info = Modal.info({
                    title: '已开户首单充值成功',
                    content:
                      <div>
                        <span>姓名：{fields.userName}</span><br />
                        <span>手机：{fields.userPhone}</span><br />
                        <span>ic卡识别号：{fields.iccardIdentifier}</span><br />
                        <span>本次充值气量：{fields.orderGas}</span><br />
                        <span>本次充值金额：{fields.orderPayment}</span>
                      </div>
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
          } else {
            message.error("充值成功，写卡失败，请前往订单页面写卡");
          }
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
      type: 'account/search',
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

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginLeft: 0, marginRight: 0, marginBottom: 8 }}>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
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
            {getFieldDecorator('userGasType')(<DictSelect placeholder="用气类型" category="user_gas_type" />)}
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
    const { selectedRows, editModalVisible } = this.state;
    return (
      <PageHeaderWrapper className="account-createAccount">
        <Card bordered={false}>
          <div className={styles.Common}>
            <div className={styles.CommonForm}>{this.renderForm()}</div>
            <div className={styles.CommonOperator}>
              <Authorized authority="account:createArchive:update">
                <Button icon="edit" disabled={selectedRows.length !== 1} onClick={() => this.handleEditModalVisible(true)}>编辑</Button>
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
        {selectedRows.length === 1 ? (
          <CreateAccountForm
            handleEdit={this.handleEdit}
            handleCancel={this.handleEditModalVisible}
            modalVisible={editModalVisible}
            selectedData={selectedRows[0]}
            getCardIdentifier={this.getCardIdentifier}
          />) : null
        }
      </PageHeaderWrapper>
    );
  }
}

export default CreateAccount;
