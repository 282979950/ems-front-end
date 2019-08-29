/* eslint-disable react/no-unused-state,no-fallthrough,prefer-destructuring,no-unused-vars */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Input, Button, Form, Tabs, Table, Modal, Tag, Select, message } from 'antd';
import ExportJsonExcel from 'js-export-excel';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import StandardTable from '../../components/StandardTable';
import styles from '../Common.less';
import UserMeterTypeModal from './components/UserMeterTypeModal';
import InputEditForm from '../RepairOrder/components/InputEditForm';
import DictSelect from '../System/components/DictSelect';
import OCX from '../../components/OCX';

const TabPane = Tabs.TabPane;
const { Option } = Select;
@connect(({ dic,userQuery, loading }) => ({
  dic,
  userQuery,
  loading: loading.models.emp,
}))
@Form.create()

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
      title: '购气次数',
      dataIndex: 'totalOrderTimes',
    },
    {
      title: '累计购气量',
      dataIndex: 'totalOrderGas',
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

  userChangeColumns = [
    {
      title: '用户名称',
      dataIndex: 'userChangeName',
    },
    {
      title: '用户电话',
      dataIndex: 'userChangePhone',
    },
    {
      title: '用户身份证号码',
      dataIndex: 'userChangeIdcard'
    },
    {
      title: '用户房产证号码',
      dataIndex: 'userChangeDeed'
    },
    {
      title: '旧用户名称',
      dataIndex: 'userOldName'
    },
    {
      title: '旧用户电话',
      dataIndex: 'userOldPhone'
    },
    {
      title: '旧用户身份证号码',
      dataIndex: 'userOldIdcard'
    },
    {
      title: '旧用户房产证号码',
      dataIndex: 'userOldDeed'
    },{
      title: '生成时间',
      dataIndex: 'createTime'
    },
  ];

  userRechargeColumns = [
    {
      title: '用户编号',
      dataIndex: 'userId',
    },
    {
      title: '实付金额',
      dataIndex: 'orderPayment',
    },
    {
      title: '充值气量',
      dataIndex: 'orderGas'
    },
    {
      title: '流水号',
      dataIndex: 'flowNumber'
    },
    {
      title: '应付金额',
      dataIndex: 'orderSupplement'
    },
    {
      title: '订单状态',
      dataIndex: 'orderStatusName'
    },
    {
      title: '订单类型',
      dataIndex: 'orderTypeName'
    },
    {
      title: '账务状态',
      dataIndex: 'accountStateName'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime'
    },
  ];

  fillGasColumns = [
    {
      title: '用户编号',
      dataIndex: 'userId',
    },
    {
      title: '订单类型',
      dataIndex: 'fillGasOrderTypeName',
    },
    {
      title: '历史购气总量',
      dataIndex: 'gasCount'
    },
    {
      title: '历史表止码',
      dataIndex: 'stopCodeCount'
    },
    {
      title: '应补气量',
      dataIndex: 'needFillGas'
    },
    {
      title: '实补气量',
      dataIndex: 'fillGas'
    },
    {
      title: '剩余气量',
      dataIndex: 'leftGas'
    },
    {
      title: '应补金额',
      dataIndex: 'needFillMoney'
    },
    {
      title: '实补金额',
      dataIndex: 'fillMoney'
    },
    {
      title: '剩余金额',
      dataIndex: 'leftMoney'
    },
    {
      title: '订单状态',
      dataIndex: 'fillGasOrderStatusName'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime'
    },
  ];

  userCardColumns = [
    {
      title: '用户编号',
      dataIndex: 'userId',
    },
    {
      title: 'IC卡卡号',
      dataIndex: 'cardId',
    },
    {
      title: '卡片状态',
      dataIndex: 'usable',
      render: status => status? "当前使用": "历史使用",
    },
    {
      title: 'IC卡识别号',
      dataIndex: 'cardIdentifier'
    },
    {
      title: '补卡工本费用',
      dataIndex: 'cardCost'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime'
    },
  ];

  userRepairColumns = [
    {
      title: '用户编号',
      dataIndex: 'userId',
    },
    {
      title: '维修单号',
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
      title: '维修类型',
      dataIndex: 'repairTypeName'
    },
    {
      title: '旧表编号',
      dataIndex: 'oldMeterCode'
    },
    {
      title: '旧表止码',
      dataIndex: 'oldMeterStopCode',
    },
    {
      title: '新表编号',
      dataIndex: 'newMeterCode'
    },
    {
      title: '新表止码',
      dataIndex: 'newMeterStopCode'
    },
    {
      title: '维修故障类型',
      dataIndex: 'repairFaultTypeName'
    },
    {
      title: '维修处理结果',
      dataIndex: 'repairResultTypeName'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime'
    },
  ];

  userStrikeNucleusColumns = [
    {
      title: '订单编号',
      dataIndex: 'orderId',
    },
    {
      title: '用户名称',
      dataIndex: 'userName',
    },
    {
      title: '审核状态',
      dataIndex: 'nucleusStatusName'
    },
    {
      title: '审核意见',
      dataIndex: 'nucleusOpinion'
    },
    {
      title: '发起人姓名',
      dataIndex: 'nucleusLaunchingPerson',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime'
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      selectedRows: [],
      formValues: {},
      pageNum: 1,
      pageSize: 10,
      key:"1",
      userInfoQueryModalVisible: false,
      userInfoType: '',
      editModalVisible:false,
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

  handleEditModalVisible = flag => {
    this.setState({
      editModalVisible: !!flag,
    });
  };

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
      type: 'userQuery/fetchUserSearch',
      payload: params,
    });
  };

  handleReplaceCardHistoryFormVisible = (flag, type) => {
    if (flag && type === 'editHistory') {
      const { dispatch } = this.props;
      const { selectedRows } = this.state;
      dispatch({
        type: 'userQuery/fetchModifyHistory',
        payload: {
          userId: selectedRows[0].userId
        },
        callback: () => {
          this.setState({
            userInfoQueryModalVisible: !!flag,
            userInfoType: 'editHistory'
          });
        }
      });
    } else if (flag && type === 'addHistory') {
      const { dispatch } = this.props;
      const { selectedRows } = this.state;
      dispatch({
        type: 'userQuery/fetchAddHistory',
        payload: {
          userId: selectedRows[0].userId
        },
        callback: () => {
          this.setState({
            userInfoQueryModalVisible: !!flag,
            userInfoType: 'addHistory'
          });
        }
      });
    } else if (flag && type === 'fillHistory') {
      const { dispatch } = this.props;
      const { selectedRows } = this.state;
      dispatch({
        type: 'userQuery/fetchFillHistory',
        payload: {
          userId: selectedRows[0].userId
        },
        callback: () => {
          this.setState({
            userInfoQueryModalVisible: !!flag,
            userInfoType: 'fillHistory'
          });
        }
      });
    } else if (flag && type === 'cardHistory') {
      const { dispatch } = this.props;
      const { selectedRows } = this.state;
      dispatch({
        type: 'userQuery/fetchCardHistory',
        payload: {
          userId: selectedRows[0].userId
        },
        callback: () => {
          this.setState({
            userInfoQueryModalVisible: !!flag,
            userInfoType: 'cardHistory'
          });
        }
      });
    } else if (flag && type === 'repairHistory') {
      const { dispatch } = this.props;
      const { selectedRows } = this.state;
      dispatch({
        type: 'userQuery/fetchRepairHistory',
        payload: {
          userId: selectedRows[0].userId
        },
        callback: () => {
          this.setState({
            userInfoQueryModalVisible: !!flag,
            userInfoType: 'repairHistory'
          });
        }
      });
    }else if (flag && type === 'strikeNucleusHistory') {
      const { dispatch } = this.props;
      const { selectedRows } = this.state;
      dispatch({
        type: 'userQuery/fetchStrikeNucleusHistory',
        payload: {
          userId: selectedRows[0].userId
        },
        callback: () => {
          this.setState({
            userInfoQueryModalVisible: !!flag,
            userInfoType: 'strikeNucleusHistory'
          });
        }
      });
    }
    else {
      this.setState({
        userInfoQueryModalVisible: !!flag,
      });
    }
  };

  showModalUserMeter = (selectedRows,flag) => {
      const { dispatch } = this.props;
      const _ = this;
      dispatch({
        type: 'userQuery/fetchqueryUserMeterType',
        payload: {
          userId: selectedRows[0].userId
        },
        callback: () => {
          this.setState({
            userInfoType: 'userMeterType'
          });
          _.handleEditModalVisible(flag);
        }
      });
  };

  handleOnClick = (param) => () => {
    switch (param) {
      case 'editHistory':
        this.handleReplaceCardHistoryFormVisible(true, 'editHistory')
        break;
      case 'addHistory':
        this.handleReplaceCardHistoryFormVisible(true, 'addHistory')
        break;
      case 'fillHistory':
        this.handleReplaceCardHistoryFormVisible(true, 'fillHistory')
        break;
      case 'cardHistory':
        this.handleReplaceCardHistoryFormVisible(true, 'cardHistory')
        break;
      case 'repairHistory':
        this.handleReplaceCardHistoryFormVisible(true, 'repairHistory')
        break;
      case 'strikeNucleusHistory':
        this.handleReplaceCardHistoryFormVisible(true, 'strikeNucleusHistory')
        break;
      default:
        break;
    }
  }

  handleSearch = () => {
    const { dispatch, form } = this.props;

    form.setFieldsValue({
      'userId': form.getFieldValue('userId') && form.getFieldValue('userId').trim(),
      'userName': form.getFieldValue('userName') && form.getFieldValue('userName').trim()
    });
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        formValues: fieldsValue,
        pageNum: 1,
        pageSize: 10
      });
      dispatch({
        type: 'userQuery/fetchUserSearch',
        payload: {
          ...fieldsValue,
          pageNum: 1,
          pageSize: 10,
        },
      });
    });
  }

  showDownload = () => {
    const { dispatch, form } = this.props;
    form.setFieldsValue({
      'userId': form.getFieldValue('userId') && form.getFieldValue('userId').trim(),
      'userName': form.getFieldValue('userName') && form.getFieldValue('userName').trim()
    });
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        formValues: fieldsValue
      });
      dispatch({
        type: 'userQuery/exportUserQuery',
        payload: {
          ...fieldsValue
        },
        callback: (response) => {
          const dataList = response.data;
          const option = {
            fileName: '用户信息查询',// 文件名
            datas: [
              {
                sheetData: dataList,
                sheetName: 'sheet',// 表名
                columnWidths: [10, 7, 12, 12, 12, 8, 8, 8],
                sheetFilter: ['userId', 'userName', 'userPhone', 'userIdcard', 'userAddress', 'totalOrderTimes', 'totalOrderGas', 'createTime'],// 列过滤
                sheetHeader: ['用户编号', '用户名称', '用户手机号码', '用户身份证号', '用户地址', '购气次数', '累计购气量', '创建时间'],// 第一行标题
              },
            ]
          };
          const toExcel = new ExportJsonExcel(option);
          toExcel.saveExcel();
        }
      });
    });
  }

  showModal = () => {
    this.handleReplaceCardHistoryFormVisible(true, 'editHistory')
    this.handleReplaceCardHistoryFormVisible(true, 'addHistory')
    this.handleReplaceCardHistoryFormVisible(true, 'fillHistory')
    this.handleReplaceCardHistoryFormVisible(true, 'cardHistory')
    this.handleReplaceCardHistoryFormVisible(true, 'repairHistory')
    this.handleReplaceCardHistoryFormVisible(true, 'strikeNucleusHistory')
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      pageNum: 1,
      pageSize: 10
    });
    dispatch({
      type: 'userQuery/fetch',
      payload: {
        pageNum: 1,
        pageSize: 10,
      },
    });
  }

  changeKey =(key)=> {
    console.log(key);
    this.setState({
      key
    });
  }

  // 选项卡数据导出
  createExcelContent = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    const { key } = this.state;
    if(key === '1'){
      dispatch({
        type: 'userQuery/exportModifyHistory',
        payload: {
          userId: selectedRows[0].userId
        },
        callback: (response) => {
          const dataList = response.data;
          if(dataList.length === 0)return;
          const option = {
            fileName: '变更信息导出',// 文件名
            datas: [
              {
                sheetData: dataList,
                sheetName: 'sheet',// 表名
                columnWidths: [10, 7, 12, 12, 12, 8, 8,10,10],
                sheetFilter: ['userChangeName', 'userChangePhone', 'userChangeIdcard', 'userChangeDeed', 'userOldName', 'userOldPhone','userOldIdcard','userOldDeed','createTime'],// 列过滤
                sheetHeader: ['用户名称', '用户电话', '用户身份证号码', '用户房产证号码', '旧用户名称', '旧用户电话','旧用户身份证号码','旧用户房产证号码','生成时间'],// 第一行标题
              },
            ]
          };
          const toExcel = new ExportJsonExcel(option);
          toExcel.saveExcel();
        }
      });
    }
    if(key === '2'){
      dispatch({
        type: 'userQuery/exportAddHistory',
        payload: {
          userId: selectedRows[0].userId
        },
        callback: (response) => {
          const dataList = response.data;
          if(dataList.length === 0)return;
          const option = {
            fileName: '充值信息导出',// 文件名
            datas: [
              {
                sheetData: dataList,
                sheetName: 'sheet',// 表名
                columnWidths: [7, 7, 7, 9, 8, 8, 8,8,8],
                sheetFilter: ['userId', 'orderPayment', 'orderGas', 'flowNumber', 'orderSupplement', 'orderStatusName','orderTypeName','accountStateName','createTime'],// 列过滤
                sheetHeader: ['用户编号', '实付金额', '充值气量', '流水号', '应付金额', '订单状态','订单类型','账务状态','创建时间'],// 第一行标题
              },
            ]
          };
          const toExcel = new ExportJsonExcel(option);
          toExcel.saveExcel();
        }
      });
    }
    if(key === '3'){
      dispatch({
        type: 'userQuery/exportFillHistory',
        payload: {
          userId: selectedRows[0].userId
        },
        callback: (response) => {
          const dataList = response.data;
          if(dataList.length === 0)return;
          const option = {
            fileName: '补气信息导出',// 文件名
            datas: [
              {
                sheetData: dataList,
                sheetName: 'sheet',// 表名
                columnWidths: [7, 7, 7, 9, 8, 8, 8 ,8 ,8 ,8 ,8 ,8],
                sheetFilter: ['userId', 'fillGasOrderTypeName', 'gasCount', 'stopCodeCount', 'needFillGas', 'fillGas','leftGas','needFillMoney','fillMoney','leftMoney','fillGasOrderStatusName','createTime'],// 列过滤
                sheetHeader: ['用户编号', '订单类型', '历史购气总量', '历史表止码', '应补气量', '实补气量','剩余气量','应补金额','实补金额','剩余金额','订单状态','创建时间'],// 第一行标题
              },
            ]
          };
          const toExcel = new ExportJsonExcel(option);
          toExcel.saveExcel();
        }
      });
    }
    if(key === '4'){
      dispatch({
        type: 'userQuery/exportCardHistory',
        payload: {
          userId: selectedRows[0].userId
        },
        callback: (response) => {
          const dataList = response.data;
          if(dataList.length === 0)return;
          const option = {
            fileName: '卡信息导出',// 文件名
            datas: [
              {
                sheetData: dataList,
                sheetName: 'sheet',// 表名
                columnWidths: [7, 7, 7, 9, 8, 8],
                sheetFilter: ['userId', 'cardId', 'usable', 'cardIdentifier', 'cardCost', 'createTime'],// 列过滤
                sheetHeader: ['用户编号', 'IC卡卡号', '卡片状态', 'IC卡识别号', '补卡工本费用', '创建时间'],// 第一行标题
              },
            ]
          };
          const toExcel = new ExportJsonExcel(option);
          toExcel.saveExcel();
        }
      });
    }
    if(key === '5'){
      dispatch({
        type: 'userQuery/exportRepairHistory',
        payload: {
          userId: selectedRows[0].userId
        },
        callback: (response) => {
          const dataList = response.data;
          if(dataList.length === 0)return;
          const option = {
            fileName: '维修信息导出',// 文件名
            datas: [
              {
                sheetData: dataList,
                sheetName: 'sheet',// 表名
                columnWidths: [7, 7, 7, 9, 8, 8, 7, 9, 8, 8],
                sheetFilter: ['userId', 'repairOrderId', 'repairTypeName', 'oldMeterCode', 'oldMeterStopCode', 'newMeterCode','newMeterStopCode','repairFaultTypeName','repairResultTypeName','createTime'],// 列过滤
                sheetHeader: ['用户编号', '维修单号', '维修类型', '旧表编号', '旧表止码', '新表编号','新表止码','维修故障类型','维修处理结果','创建时间'],// 第一行标题
              },
            ]
          };
          const toExcel = new ExportJsonExcel(option);
          toExcel.saveExcel();
        }
      });
    }
    if(key === '6'){
      dispatch({
        type: 'userQuery/exportStrikeNucleusHistory',
        payload: {
          userId: selectedRows[0].userId
        },
        callback: (response) => {
          const dataList = response.data;
          if(dataList.length === 0)return;
          const option = {
            fileName: '审核冲账信息导出',// 文件名
            datas: [
              {
                sheetData: dataList,
                sheetName: 'sheet',// 表名
                columnWidths: [7, 7, 7, 9, 8, 8],
                sheetFilter: ['orderId', 'userName', 'nucleusStatusName', 'nucleusOpinion', 'nucleusLaunchingPerson', 'createTime'],// 列过滤
                sheetHeader: ['订单编号', '用户名称', '审核状态', '审核意见', '发起人姓名', '创建时间'],// 第一行标题
              },
            ]
          };
          const toExcel = new ExportJsonExcel(option);
          toExcel.saveExcel();
        }
      });
    }
  }

  getCardIdentifier = () => {
    const { dispatch } = this.props;
    let result = OCX.readCard();
    if (result === 'IC卡未插入写卡器.' || result === '卡类型不正确.' || result === '写卡器连接错误.') {
      message.error(result);
      return;
    }
    if (result[0] === 'S') {
      dispatch({
        type: 'userQuery/fetchUserSearch',
        payload: {
          cardIdentifier: result[2],
          cardOrderGas: result[4],
          pageNum: 1,
          pageSize: 10,
        }
      })
    } else {
      message.error(result)
    }
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginLeft: 0, marginRight: 0, marginBottom: 8 }}>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('userId')(<Input placeholder="用户编号" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('userName')(<Input placeholder="用户名称" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('userType', {})(<DictSelect category="user_type" placeholder="用户类型" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('meterCode')(<Input placeholder="表具编号" />)}
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
      userQuery: { data, history, userRecharge, fillGas, userCard, userRepair, userStrikeNucleus },
      loading,
    } = this.props;
    const { selectedRows, userInfoQueryModalVisible, editModalVisible, handleEditModalVisible } = this.state;
    const operations = <Button onClick={this.createExcelContent}>Excel导出</Button>;
    return (
      <PageHeaderWrapper className="antd-pro-pages-system-dist">
        <Card bordered={false}>
          <div className={styles.Common}>
            <div className={styles.CommonForm}>{this.renderForm()}</div>
            <div className={styles.CommonOperator}>
              <Button icon="audit" disabled={selectedRows.length !== 1} onClick={() => this.showModal()}>基本信息</Button>
              <Button icon="clock-circle" disabled={selectedRows.length !== 1} onClick={() => this.showModalUserMeter(selectedRows,true)}>表具信息</Button>
              <Button icon="download" onClick={() => this.showDownload()}>数据导出</Button>
              <Button icon="read" onClick={this.getCardIdentifier}>识别IC卡</Button>
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
          <UserMeterTypeModal
            handleEditModalVisible={this.handleEditModalVisible}
            modalVisible={editModalVisible}
            selectedData={history}
          />
        ) : null}
        <Modal
          visible={userInfoQueryModalVisible}
          title="用户相关信息"
          onOk={this.handleOk}
          onCancel={() => this.handleReplaceCardHistoryFormVisible(false)}
          footer={null}
          width={1400}
        >
          <div style={{ overflow:"scroll", height:"400px", overflowX:'hidden' }}>
            <Tabs defaultActiveKey="1" onChange={this.changeKey} tabBarExtraContent={operations}>
              <TabPane tab="变更信息" key="1">
                <Table
                  dataSource={history}
                  columns={this.userChangeColumns}
                  pagination={false}
                  size='small'
                />
              </TabPane>
              <TabPane tab="充值信息" key="2">
                <Table
                  dataSource={userRecharge}
                  columns={this.userRechargeColumns}
                  pagination={false}
                  size='small'
                />
              </TabPane>
              <TabPane tab="补气信息" key="3">
                <Table
                  dataSource={fillGas}
                  columns={this.fillGasColumns}
                  pagination={false}
                  size='small'
                />
              </TabPane>
              <TabPane tab="卡信息" key="4">
                <Table
                  dataSource={userCard}
                  columns={this.userCardColumns}
                  pagination={false}
                  size='small'
                />
              </TabPane>
              <TabPane tab="维修信息" key="5">
                <Table
                  dataSource={userRepair}
                  columns={this.userRepairColumns}
                  pagination={false}
                  size='small'
                />
              </TabPane>
              <TabPane tab="审核冲账信息" key="6">
                <Table
                  dataSource={userStrikeNucleus}
                  columns={this.userStrikeNucleusColumns}
                  pagination={false}
                  size='small'
                />
              </TabPane>
            </Tabs>
          </div>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default User;
