import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, message, Modal, Tag } from 'antd';
import styles from '../Common.less';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import StandardTable from '../../components/StandardTable';
import DictSelect from '../System/components/DictSelect';
import InputAddForm from './components/InputAddForm';
import InputCardForm from './components/InputCardForm';
import RepairOrderCardHistory from "./components/RepairOrderCardHistory";
import DescriptionList from '../../components/DescriptionList';

const {confirm} = Modal;
const { Description } = DescriptionList;
@connect(({ input, loading }) => ({
  input,
  loading: loading.models.input,
}))
@Form.create()
class Inputs extends PureComponent {
  state = {
    addModalVisible: false,
    cardModalVisible: false,
    selectedRows: [],
    formValues: {},
    pageNum: 1,
    pageSize: 10,
    cardPassword: '',
    historyData:null,
    historyModalVisible:false,
  };

  columns = [
    {
      title: '维修单编号',
      dataIndex: 'repairOrderId',
    },
    {
      title: '维修单状态',
      dataIndex: 'repairOrderStatus',
      render: status => {
        switch (status) {
          case 1:
            return <Tag color='volcano'>待处理</Tag>;
          case 2:
            return <Tag color='orange'>处理中</Tag>;
          case 3:
            return <Tag color='geekblue'>无需处理</Tag>;
          case 4:
            return <Tag color='green'>已处理</Tag>;
          case 5:
            return <Tag color='gray'>已撤销</Tag>;
          default:
            return <Tag color='gray'>已撤销</Tag>;
        }
      },
    },
    {
      title: 'IC卡号',
      dataIndex: 'userId',
    },
    {
      title: '用户名称',
      dataIndex: 'userName',
    },
    {
      title: '维修类型',
      dataIndex: 'repairTypeName',
    },
    {
      title: '维修故障类型',
      dataIndex: 'repairFaultTypeName',
    },
    {
      title: '维修结果',
      dataIndex: 'repairResultTypeName',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
  ];

  componentDidMount() {

  }

  handleSelectedRowsReset = () => {
    this.setState({
      selectedRows: []
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      pageNum: 1,
      pageSize: 10
    });
    // dispatch({
    //   type: 'input/fetch',
    //   payload: {
    //     pageNum: 1,
    //     pageSize: 10
    //   },
    // });
  };

  handleSearch = () => {
    const { dispatch, form } = this.props;
    const { pageNum, pageSize } = this.state;

    form.setFieldsValue({
      'repairOrderId': form.getFieldValue('repairOrderId') && form.getFieldValue('repairOrderId').trim(),
      'userId': form.getFieldValue('userId') && form.getFieldValue('userId').trim(),
      'empName': form.getFieldValue('empName') && form.getFieldValue('empName').trim()
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
        type: 'input/search',
        payload: {
          ...fieldsValue,
          pageNum,
          pageSize
        },
      });
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleAddModalVisible = flag => {
    this.setState({
      addModalVisible: !!flag
    });
  };

  isLatestOrHas = (tip, callback) => {
    const { selectedRows } = this.state;
    const { dispatch } = this.props;

    const { repairOrderStatus } = selectedRows[0];
    if (repairOrderStatus === 2 || repairOrderStatus === 4 || repairOrderStatus === 5) {
      message.warning(tip);
    } else {
      dispatch({
        type: 'input/hasFillGasOrderResolved',
        payload: {
          userId: selectedRows[0].userId,
          repairOrderId: selectedRows[0].repairOrderId,
        },
        callback: (response2) => {
          if (response2.data) {
            message.warning(tip);
          } else if (callback) {
            callback(response2);
          }
        }
      });
    }
  };

  getBindNewCardParamByUserId = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    const { userId } = selectedRows[0];

    dispatch({
      type: 'input/getBindNewCardParamByUserId',
      payload: {
        userId,
      },
      callback: (response2) => {
        this.setState({
          cardModalVisible: true,
          cardPassword: response2.data.cardPassword,
        });
      },
    });

  };

  handleCardModalVisible = flag => {
    const { selectedRows } = this.state;
    const tip = '该维修单的补气单或超用单已被处理，不能绑定新卡';
    if (!flag) {
      this.setState({
        cardModalVisible: false,
      });
      return;
    }
    if (selectedRows[0].repairType !== 0 && selectedRows[0].repairType !== 6 && selectedRows[0].repairType !== 7
      && selectedRows[0].repairResultType !== 4 && selectedRows[0].repairResultType !== 9) {
      message.warning('该订单不需要补气，不需要绑定新卡');
      return;
    }
    this.isLatestOrHas(tip, this.getBindNewCardParamByUserId);
  };

  handleAdd = (fields, form) => {
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    dispatch({
      type: 'input/add',
      payload: fields,
      callback: (response) => {
        message.success(response.message);
        dispatch({
          type: 'input/search',
          payload: {
            userId: fields.userId,
            pageNum,
            pageSize
          },
        });
        this.handleAddModalVisible();
        form.resetFields();
      }
    });
  };

  handleCancel = () => {
    const { dispatch, form } = this.props;
    const { selectedRows, pageNum, pageSize } = this.state;
    const fieldsValue = form.getFieldsValue();
    const _ = this;
    if (new Date() - new Date(selectedRows[0].createTime) > 24 * 60 * 60 * 1000) {
      message.info('只能撤销当天的维修单');
    } else {
      Modal.confirm({
        title: '撤销维修单',
        content: `是否撤销维修单：${selectedRows[0].repairOrderId}`,
        onOk() {
          dispatch({
            type: 'input/cancel',
            payload: selectedRows[0],
            callback: (response) => {
              message.success(response.message);
              _.handleSelectedRowsReset();
              form.resetFields();
              dispatch({
                type: 'input/search',
                payload: {
                  userId: selectedRows[0].userId,
                  pageNum,
                  pageSize
                },
              });
            }
          });
        },
        onCancel() {
        },
      });
    }
  };

  handleCard = (fields, form) => {
    const { dispatch } = this.props;
    const { pageNum, pageSize, cardPassword } = this.state;
    const _ = this;

    confirm({
      title: '将清除该卡片剩余气量，请确认是否补卡?',
      onOk() {
        dispatch({
          type: 'input/bindNewCard',
          payload: {
            ...fields,
            cardPassword
          },
          callback: (response) => {
            message.success(response.message);
            _.handleCardModalVisible();
            _.handleSelectedRowsReset();
            form.resetFields();
            // dispatch({
            //   type: 'input/fetch',
            //   payload: {
            //     pageNum,
            //     pageSize
            //   },
            // });
          }
        });
      },
      onCancel() {
        _.handleCardModalVisible();
      },
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
      type: 'input/search',
      payload: params,
    });
  };

  handleHistoryModalVisible = flag => {
    this.setState({
      historyModalVisible: !!flag
    });
  };

  editHistoryData = flag =>{
    this.setState({
      historyData: flag
    });
  };
  /*
   *历史记录查询，点击触发(补卡操作)
   *
   */

  showHistory = (selectedRows,flag) => {
    const { dispatch } = this.props;
    const _ = this;
    dispatch({
      type: 'input/cardHistory',
      payload: {
        userId:  selectedRows[0].userId
      },
      callback: (response) => {
        if (response.status === 0) {
          _.handleHistoryModalVisible(flag);
          _.editHistoryData(response.data);
        } else {
          message.error(response.message);
        }
      }
    });
  };

  expandedRowRender = (record) => {
    const { oldMeterCode, oldMeterStopCode, newMeterCode, newMeterStopCode } = record;
    return (
      <DescriptionList size="small" title={null} col={6}>
        <Description term="旧表编号">{oldMeterCode}</Description>
        <Description term="旧表止码">{oldMeterStopCode}</Description>
        <Description term="新表编号">{newMeterCode}</Description>
        <Description term="新表止码">{newMeterStopCode}</Description>
      </DescriptionList>
    );
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form layout='inline'>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginLeft: 0, marginRight: 0, marginBottom: 8 }}>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator("userId")(<Input placeholder="IC卡号" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator("repairOrderId")(<Input placeholder="维修单编号" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('repairType')(<DictSelect placeholder="维修类型" category="repair_type" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator("empName")(<Input placeholder="维修员姓名" />)}
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
    )
  }

  render() {
    const {
      input: { data },
      input: { newCardParam },
      loading,
    } = this.props;
    const { addModalVisible, cardModalVisible, selectedRows,historyData,historyModalVisible } = this.state;
    return (
      <PageHeaderWrapper className="repairorder-input">
        <Card bordered={false}>
          <div className={styles.Common}>
            <div className={styles.CommonForm}>{this.renderForm()}</div>
            <div className={styles.CommonOperator}>
              <Button icon="plus" onClick={() => this.handleAddModalVisible(true)}>新建</Button>
              <Button icon="delete" disabled={!(selectedRows.length === 1 && selectedRows[0] && (selectedRows[0].repairOrderStatus === 1 || selectedRows[0].repairOrderStatus === 3))} onClick={this.handleCancel}>撤销</Button>
              <Button icon="snippets" disabled={selectedRows.length !== 1} onClick={() => this.handleCardModalVisible(true)}>新卡补卡</Button>
              <Button icon="schedule" disabled={selectedRows.length !== 1} onClick={() => this.showHistory(selectedRows,true)}>维修单历史补卡记录</Button>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              expandedRowRender={this.expandedRowRender}
              rowKey="repairOrderId"
            />
          </div>
        </Card>
        <InputAddForm
          handleAdd={this.handleAdd}
          handleCancel={this.handleAddModalVisible}
          modalVisible={addModalVisible}
        />
        {selectedRows.length === 1 ? (
          <InputCardForm
            handleCard={this.handleCard}
            handleCancel={this.handleCardModalVisible}
            modalVisible={cardModalVisible}
            selectedData={newCardParam}
          />
        ) : null}
        {selectedRows.length === 1 ? (
          <RepairOrderCardHistory
            modalVisible={historyModalVisible}
            handleRemoveModalVisible={this.handleHistoryModalVisible}
            historyData={historyData}
            selectedRows={selectedRows}
          />) : null
        }
      </PageHeaderWrapper>
    )
  }
}
export default Inputs;
