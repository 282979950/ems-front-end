/* eslint-disable no-param-reassign */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, DatePicker, message, Modal } from 'antd';
import styles from '../Common.less';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import StandardTable from '../../components/StandardTable';
import Authorized from '../../utils/Authorized';
import CouponAddForm from './components/CouponAddForm';
import CouponEditForm from './components/CouponEditForm';
import CouponProcessingForm from './components/CouponProcessingForm';

const { confirm } = Modal;
@connect(({ coupon, dic, loading }) => ({
  coupon,
  dic,
  loading: loading.models.coupon,
}))
@Form.create()
class Coupon extends PureComponent {
  state = {
    selectedRows: [],
    addModalVisible: false,
    editModalVisible: false,
    processingModalVisible: false,
    formValues: {},
    pageNum: 1,
    pageSize: 10,
  };

  columns = [
    {
      title: '优惠券编号',
      dataIndex: 'couponNumber',
    },
    {
      title: '抵扣卷面值（气量）',
      dataIndex: 'couponGas',
    },
    {
      title: '优惠券状态',
      dataIndex: 'couponStatusName',
    },
    {
      title: '优惠券创建人',
      dataIndex: 'createName',
    },
    {
      title: '创建日期',
      dataIndex: 'createTime',
    }
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    dispatch({
      type: 'coupon/fetch',
      payload: {
        pageNum,
        pageSize,
      },
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      pageNum: 1,
      pageSize: 10,
    });
    dispatch({
      type: 'coupon/fetch',
      payload: {
        pageNum: 1,
        pageSize: 10,
      },
    });
  };

  handleSearch = () => {
    const { dispatch, form } = this.props;
    const { pageNum, pageSize } = this.state;

    form.setFieldsValue({ 'couponNumber': form.getFieldValue('couponNumber') && form.getFieldValue('couponNumber').trim() });
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        formValues: fieldsValue,
      });
      dispatch({
        type: 'coupon/search',
        payload: {
          ...fieldsValue,
          startDate: fieldsValue.startDate ? fieldsValue.startDate.format('YYYY-MM-DD') : null,
          endDate: fieldsValue.endDate ? fieldsValue.endDate.format('YYYY-MM-DD') : null,
          pageNum,
          pageSize,
        },
      });
    });
  };

  // 新增时后台消息返回并提示
  handleAdd = fields => {
    this.handleAddModalVisible();
    const { pageNum, pageSize } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'coupon/add',
      payload: fields,
      callback: (response) => {
        if (response.status === 0) {
          message.success(response.message);

        } else {
          message.error(response.message);

        }
        dispatch({
          type: 'coupon/fetch',
          payload: {
            pageNum,
            pageSize,
          }
        });
      }
    });
  };

  // 数据修改时后台消息返回并提示
  handleEdit = fields => {
    this.handleEditModalVisible();
    const { pageNum, pageSize } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'coupon/edit',
      payload: fields,
      callback: (response) => {
        if (response.status === 0) {
          message.success('修改成功');
          this.handleSelectedRowsReset();
        } else {
          message.error(response.message);
        }
        dispatch({
          type: 'coupon/fetch',
          payload: {
            pageNum,
            pageSize,
          }
        });
      }
    });
  };

  // 购气劵处理
  Processing = fields => {
    // 若开放时点击收回则设置字段值为收回状态
    if(fields.couponStatus===1){
      fields.couponStatus =2;
    }else if(fields.couponStatus===2){
      fields.couponStatus =1;
    }

    this.handleProcessingModalVisible();
    const { pageNum, pageSize } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'coupon/edit',
      payload: fields,
      callback: (response) => {
        if (response.status === 0) {
          message.success('修改成功');
          this.handleSelectedRowsReset();
        } else {
          message.error(response.message);
        }
        dispatch({
          type: 'coupon/fetch',
          payload: {
            pageNum,
            pageSize,
          }
        });
      }
    });
  };

  showDeleteConfirm = (selectedRows) => {
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    const _ = this;
    confirm({
      title: '购气劵销毁',
      content: `确认销毁选中的${selectedRows[0].couponNumber}数据？`,
      onOk() {
        dispatch({
          type: 'coupon/delete',
          payload: {
            ...selectedRows[0]
          },
          callback: (response) => {
            if (response.status === 0) {
              message.success(response.message);
              _.handleSelectedRowsReset();
              dispatch({
                type: 'coupon/fetch',
                payload: {
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

  handleEditModalVisible = flag => {
    this.setState({
      editModalVisible: !!flag,
    });
  };

  handleProcessingModalVisible = flag => {
    this.setState({
      processingModalVisible: !!flag,
    });
  };

  handleAddModalVisible = flag => {
    this.setState({
      addModalVisible: !!flag
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSelectedRowsReset = () => {
    this.setState({
      selectedRows: [],
    });
  };

  handleStandardTableChange = pagination => {
    const { dispatch,form } = this.props;
    const { formValues, pageNum, pageSize } = this.state;
    if (pageNum !== pagination.current || pageSize !== pagination.pageSize) {
      this.handleSelectedRowsReset();
    }

    const params = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      startDate: form.getFieldValue('startDate') ? form.getFieldValue('startDate').format('YYYY-MM-DD'):null,
      endDate: form.getFieldValue('endDate') ? form.getFieldValue('endDate').format('YYYY-MM-DD'):null,
    };
    this.setState({
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    });
    dispatch({
      type: 'coupon/search',
      payload: params,
    });
  };




  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form layout="inline">
        <Row
          gutter={{ md: 8, lg: 24, xl: 48 }}
          style={{ marginLeft: 0, marginRight: 0, marginBottom: 8 }}
        >
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('couponNumber')(<Input placeholder="优惠券编号" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('startDate')(<DatePicker placeholder="起始日期" style={{ "width": "100%" }} />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('endDate')(<DatePicker placeholder="终止日期" style={{ "width": "100%" }} />)}
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
      coupon: { data },
      loading,
    } = this.props;
    const { selectedRows, addModalVisible, editModalVisible, processingModalVisible } = this.state;
    return (
      <PageHeaderWrapper className="recharge-coupon">
        <Card bordered={false}>
          <div className={styles.Common}>
            <div className={styles.CommonForm}>{this.renderForm()}</div>
            <div className={styles.CommonOperator}>
              <Authorized authority="recharge:coupon:create">
                <Button icon="plus" onClick={() => this.handleAddModalVisible(true)}>新增</Button>
              </Authorized>
              <Authorized authority="recharge:coupon:update">
                <Button icon="edit" disabled={selectedRows.length !== 1} onClick={() => this.handleEditModalVisible(true)}>修改</Button>
              </Authorized>
              <Button icon="form" disabled={selectedRows.length !== 1} onClick={() => this.handleProcessingModalVisible(true)}>处理</Button>
              <Authorized authority="recharge:coupon:delete">
                <Button icon="close-square" disabled={selectedRows.length !== 1} onClick={() => this.showDeleteConfirm(selectedRows)}>销毁</Button>
              </Authorized>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              rowKey='id'
            />
          </div>
        </Card>
        <CouponAddForm
          handleAdd={this.handleAdd}
          handleCancel={this.handleAddModalVisible}
          modalVisible={addModalVisible}
        />
        {selectedRows.length === 1 ? (
          <CouponEditForm
            handleEdit={this.handleEdit}
            handleCancel={this.handleEditModalVisible}
            modalVisible={editModalVisible}
            selectedData={selectedRows[0]}
          />) : null
        }
        {selectedRows.length === 1 ? (
          <CouponProcessingForm
            Processing={this.Processing}
            handleCancel={this.handleProcessingModalVisible}
            modalVisible={processingModalVisible}
            selectedData={selectedRows[0]}
          />) : null
        }
      </PageHeaderWrapper>
    );
  };
}
export default Coupon;
