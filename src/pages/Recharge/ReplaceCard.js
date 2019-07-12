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
import StandardTable from '../../components/StandardTable';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import Authorized from '../../utils/Authorized';
import styles from '../Common.less';
import OCX from '../../components/OCX';
import ReplaceCardForm from './components/ReplaceCardForm';
import ReplaceCardHistoryForm from './components/ReplaceCardHistoryForm';

@connect(({ replaceCard, loading }) => ({
  replaceCard,
  loading: loading.models.replaceCard,
}))
@Form.create()
class ReplaceCard extends PureComponent {
  state = {
    replaceCardFormVisible: false,
    replaceCardHistoryFormVisible: false,
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
      title: 'IC卡识别号',
      dataIndex: 'iccardIdentifier',
    },
    {
      title: '用户名称',
      dataIndex: 'userName',
    },
    {
      title: '手机',
      dataIndex: 'userPhone',
    },
    {
      title: '用户地址',
      dataIndex: 'userAddress',
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    dispatch({
      type: 'replaceCard/fetch',
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
      type: 'replaceCard/fetch',
      payload: {
        pageNum: 1,
        pageSize: 10,
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
      'userName': form.getFieldValue('userName') && form.getFieldValue('userName').trim(),
      'iccardIdentifier': form.getFieldValue('iccardIdentifier') && form.getFieldValue('iccardIdentifier').trim(),
      'userPhone': form.getFieldValue('userPhone') && form.getFieldValue('userPhone').trim(),
      'userAddress': form.getFieldValue('userAddress') && form.getFieldValue('userAddress').trim()
    });
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        formValues: fieldsValue,
        pageNum: 1,
        pageSize: 10
      });
      dispatch({
        type: 'replaceCard/search',
        payload: {
          ...fieldsValue,
          pageNum: 1,
          pageSize: 10,
        },
      });
    });
  };

  handleReplaceCardFormVisible = flag => {
    this.setState({
      replaceCardFormVisible: !!flag,
    });
  };

  handleReplaceCardHistoryFormVisible = flag => {
    if (flag) {
      const { dispatch } = this.props;
      const { selectedRows } = this.state;
      dispatch({
        type: 'replaceCard/searchHistory',
        payload: {
          userId: selectedRows[0].userId
        },
        callback: () => {
          this.setState({
            replaceCardHistoryFormVisible: !!flag,
          });
        }
      });
    } else {
      this.setState({
        replaceCardHistoryFormVisible: !!flag,
      });
    }
  };

  handleEdit = fields => {
    this.handleReplaceCardFormVisible();
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    this.handleSelectedRowsReset();
    dispatch({
      type: 'replaceCard/edit',
      payload: fields,
      callback: (response) => {
        if (response.status === 0) {
          console.log('补卡充值成功，开始写卡');
          const { data } = response;
          const { iccardId, iccardPassword, orderGas, serviceTimes, flowNumber, orderId } = data;
          const wResult = OCX.writePCard(iccardId, iccardPassword, 0, serviceTimes, 0, flowNumber);
          if (wResult === '写卡成功') {
            const wResult2 = OCX.writeUCard(iccardId, iccardPassword, orderGas, serviceTimes, flowNumber);
            if (wResult2 === '写卡成功') {
              dispatch({
                type: 'order/updateOrderStatus',
                payload: {
                  orderId,
                  orderStatus: 2
                },
                callback: (response2) => {
                  if (response2.status === 0) {
                    message.success("操作成功已补卡");
                    dispatch({
                      type: 'replaceCard/fetch',
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
              message.error("充值成功，写卡一般充值卡失败，请前往订单管理页面重新写卡");
            }
          } else {
            message.error("充值成功，写卡密码传递卡失败，请前往订单管理页面重新写卡");
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
      type: 'replaceCard/fetch',
      payload: params,
    });
  };

  getCardIdentifier = () => {
    const result = OCX.readCard();
    if (result[0] !== 'S') {
      return "读卡失败";
    }
    if (result[1] !== '0') {
      return "该卡片类型不是新卡";
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
            {getFieldDecorator('userId')(<Input placeholder="户号" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('userName')(<Input placeholder="用户名称" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('iccardIdentifier')(<Input placeholder="IC卡识别号" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('userPhone')(<Input placeholder="手机" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('userAddress')(<Input placeholder="用户地址" />)}
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
      replaceCard: { data, history },
      loading,
    } = this.props;
    const { selectedRows, replaceCardFormVisible, replaceCardHistoryFormVisible } = this.state;
    return (
      <PageHeaderWrapper className="recharge-replaceCard">
        <Card bordered={false}>
          <div className={styles.Common}>
            <div className={styles.CommonForm}>{this.renderForm()}</div>
            <div className={styles.CommonOperator}>
              <Authorized authority="recharge:replaceCard:update">
                <Button icon="credit-card" disabled={selectedRows.length !== 1} onClick={() => this.handleReplaceCardFormVisible(true)}>补卡</Button>
              </Authorized>
              <Authorized authority="recharge:replaceCard:history">
                <Button icon="clock-circle" disabled={selectedRows.length !== 1} onClick={() => this.handleReplaceCardHistoryFormVisible(true)}>历史记录</Button>
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
          <ReplaceCardForm
            handleEdit={this.handleEdit}
            handleCancel={this.handleReplaceCardFormVisible}
            modalVisible={replaceCardFormVisible}
            selectedData={selectedRows[0]}
            getCardIdentifier={this.getCardIdentifier}
          />) : null
        }
        {selectedRows.length === 1 ? (
          <ReplaceCardHistoryForm
            handleReplaceCardHistoryFormVisible={this.handleReplaceCardHistoryFormVisible}
            modalVisible={replaceCardHistoryFormVisible}
            historyData={history}
          />) : null
        }
      </PageHeaderWrapper>
    );
  }
}

export default ReplaceCard;
