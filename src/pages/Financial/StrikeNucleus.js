/* eslint-disable no-unused-vars */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  message,
  Button,
} from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../Common.less';
import Authorized from '../../utils/Authorized';
import StrikeNucleusEditForm from "./components/StrikeNucleusEditForm";

/* eslint react/no-multi-comp:0 */
@connect(({ strikeNucleus, loading }) => ({
  strikeNucleus,
  loading: loading.models.strikeNucleus,
}))
@Form.create()
class StrikeNucleus extends PureComponent {
  state = {
    editModalVisible: false,
    selectedRows: [],
    formValues: {},
    pageNum: 1,
    pageSize: 10,
  };

  columns = [
    {
      title: '订单编号',
      dataIndex: 'orderId',
    },
    {
      title: '用户名称',
      dataIndex: 'userName',
    },
    {
      title: '充值气量单位(方)',
      dataIndex: 'nucleusGas',
    },
    {
      title: '充值金额',
      dataIndex: 'nucleusPayment'
    },
    {
      title: '发起人姓名',
      dataIndex: 'nucleusLaunchingPerson'
    },
    {
      title: '充值时间',
      dataIndex: 'rechargeTime'
    }
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    dispatch({
      type: 'strikeNucleus/fetch',
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
      type: 'strikeNucleus/search',
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
      type: 'strikeNucleus/fetch',
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

  handleEditModalVisible = flag => {
    this.setState({
      editModalVisible: !!flag,
    });
  };

  // 审批通过时后台消息返回并提示
  handleEditVia = fields => {
    this.handleEditModalVisible();
    const { pageNum, pageSize } = this.state;
    const { dispatch } = this.props;
    const flag = true;
    dispatch({
      type: 'strikeNucleus/edit',
      payload: {
        ...fields,
        flag
      },
      callback: (response) => {
        if (response.status === 0) {
          message.success('审核提交成功');

        }else{
          message.error(response.message);
        }
        dispatch({
          type: 'strikeNucleus/fetch',
          payload: {
            pageNum,
            pageSize,
          }
        });
      }
    });
  };

  // 审批不通过时后台消息返回并提示
  handleEditNotVia = fields => {
    this.handleEditModalVisible();
    const { pageNum, pageSize } = this.state;
    const { dispatch } = this.props;
    const flag = false;
    dispatch({
      type: 'strikeNucleus/edit',
      payload: {
        ...fields,
        flag
      },
      callback: (response) => {
        if (response.status === 0) {
          message.success('审核提交成功');

        }else{
          message.error(response.message);
        }
        dispatch({
          type: 'strikeNucleus/fetch',
          payload: {
            pageNum,
            pageSize,
          }
        });
      }
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
        type: 'strikeNucleus/search',
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


  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginLeft: 0, marginRight: 0, marginBottom: 8}}>
          <Col md={4} sm={12} style={{ paddingLeft: 0, paddingRight: 8}}>
            {getFieldDecorator('orderId')(<Input placeholder="订单编号" />)}
          </Col>
          <Col md={4} sm={12} style={{ paddingLeft: 0, paddingRight: 8}}>
            {getFieldDecorator('userName')(<Input placeholder="用户名称" />)}
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
      strikeNucleus: { data },
      loading,
    } = this.props;
    const { selectedRows,editModalVisible } = this.state;
    return (
      <PageHeaderWrapper className="antd-pro-pages-system-dist">
        <Card bordered={false}>
          <div className={styles.Common}>
            <div className={styles.CommonForm}>{this.renderForm()}</div>
            <div className={styles.CommonOperator}>
              <Button icon="schedule" disabled={selectedRows.length !== 1} onClick={() => this.handleEditModalVisible(true)}>审批</Button>
            </div>
            <Authorized>
              <StandardTable
                selectedRows={selectedRows}
                loading={loading}
                data={data}
                columns={this.columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
                rowKey='id'
              />
            </Authorized>
            {selectedRows.length === 1 ? (
              <StrikeNucleusEditForm
                handleEditVia={this.handleEditVia}
                handleEditNotVia={this.handleEditNotVia}
                handleCancel={this.handleEditModalVisible}
                modalVisible={editModalVisible}
                selectedData={selectedRows[0]}
              />) : null
            }
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default StrikeNucleus;
