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
} from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../Common.less';
import Authorized from '../../utils/Authorized';
import DictSelect from '../System/components/DictSelect';


const { confirm } = Modal;
/* eslint react/no-multi-comp:0 */
@connect(({ preStrike, loading }) => ({
  preStrike,
  loading: loading.models.preStrike,
}))
@Form.create()
class PreStrike extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
    pageNum: 1,
    pageSize: 10,
  };

  columns = [
    {
      title: '用户姓名',
      dataIndex: 'userName',
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
      title: '实际充值金额(单位:元)',
      dataIndex: 'orderPayment'
    },
    {
      title: '充值气量(单位:方)',
      dataIndex: 'orderGas'
    },
    {
      title: '订单类型',
      dataIndex: 'orderTypeName'
    },
    {
      title: '充值时间',
      dataIndex: 'orderCreateTime'
    },
    {
      title: '账务状态',
      dataIndex: 'accountStateName'
    },
    {
      title: '用户地址',
      dataIndex: 'userAddress'
    },
    {
      title: '账务发起时间',
      dataIndex: 'orderStrikeTime'
    }
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    // dispatch({
    //   type: 'preStrike/fetch',
    //   payload: {
    //     pageNum,
    //     pageSize
    //   }
    // });
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
      type: 'preStrike/search',
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
      type: 'preStrike/fetch',
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

    form.setFieldsValue({
      'userName': form.getFieldValue('userName') && form.getFieldValue('userName').trim(),
      'userTypeName': form.getFieldValue('userTypeName') && form.getFieldValue('userTypeName').trim()
    });
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        formValues: fieldsValue,
      });
      if (JSON.stringify(fieldsValue) === "{}") {
        message.info('请输入搜索条件');
        return;
      }
      dispatch({
        type: 'preStrike/search',
        payload: {
          ...fieldsValue,
          pageNum,
          pageSize
        },
      });
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
      title: '预冲账发起',
      content: '确认对该笔记录发起预冲账处理？',
      onOk() {
        if (selectedRows[0].accountState !== undefined) {
          message.success("该笔记录已发起过预冲账申请无法再次发起");
          return;
        }
        dispatch({
          type: 'preStrike/edit',
          payload: {
            ...selectedRows[0]
          },
          callback: (response) => {
            if (response.status === 0) {
              message.success(response.message);
              _.handleSelectedRowsReset();
              dispatch({
                type: 'preStrike/search',
                payload: {
                  userName: selectedRows[0].userName,
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
          <Col md={4} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('userName')(<Input placeholder="用户姓名" />)}
          </Col>
          <Col md={4} sm={12} style={{ paddingLeft: 0, paddingRight: 8}}>
            {getFieldDecorator('userType')(<DictSelect placeholder="用户类型" category="user_type" />)}
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
      preStrike: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;
    return (
      <PageHeaderWrapper className="antd-pro-pages-system-dist">
        <Card bordered={false}>
          <div className={styles.Common}>
            <div className={styles.CommonForm}>{this.renderForm()}</div>
            <div className={styles.CommonOperator}>
              <Button icon="form" disabled={selectedRows.length !== 1} onClick={() => this.showDeleteConfirm(selectedRows)}>处理</Button>
            </div>
            <Authorized>
              <StandardTable
                selectedRows={selectedRows}
                loading={loading}
                data={data}
                columns={this.columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
                rowKey='orderId'
              />
            </Authorized>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default PreStrike;
