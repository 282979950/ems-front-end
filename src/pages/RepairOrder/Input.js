import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, message, Modal, Pagination } from 'antd';
import styles from '../Common.less';
import DistTreeSelect from '../System/components/DistTreeSelect';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import StandardTable from '../../components/StandardTable';
import DictSelect from '../System/components/DictSelect';
import InputAddForm from './components/InputAddForm';
import InputEditForm from './components/InputEditForm';
import InputCardForm from './components/InputCardForm';

@connect(({ input, loading }) => ({
  input,
  loading: loading.models.accountQuery,
}))
@Form.create()
class Inputs extends PureComponent {
  state = {
    addModalvisible: false,
    editModalVisible: false,
    cardModalVisible: false,
    selectedRows: [],
    formValues: {},
    pageNum: 1,
    pageSize: 10,
    // data: [],
  }
  columns = [
    {
      title: '维修单编号',
      dataIndex: 'repairOrderId',
    },
    {
      title: '户号',
      dataIndex: 'userId',
    },
    {
      title: '用户名称',
      dataIndex: 'userName',
    },
    {
      title: '用户手机',
      dataIndex: 'userPhone',
    },
    {
      title: '用户地址',
      dataIndex: 'userAddress',
    },
    {
      title: '维修类型',
      dataIndex: 'repairResultTypeName',
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    dispatch({
      type: 'input/fetch',
      payload: {
        pageNum,
        pageSize,
      },
    })
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
      type: 'input/fetch',
      payload: {
        pageNum: 1,
        pageSize: 10
      },
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



  handleEditModalVisible = flag => {
    const { selectedRows } = this.state;
    const latestTip = '该维修单不是最新的，不能编辑';
    const hasTip = '该维修单的补气单或超用单已被处理，不能编辑';
    if (!flag) {
      this.setState({
        editModalVisible: false,
      })
      return;
    }
    this.isLatestOrHas(latestTip, hasTip, this.handleEditShow)
  };

  handleEditShow = () => {
    this.setState({
      editModalVisible: true,
    })
  }

  isLatestOrHas = (latestTip, hasTip, callback) => {
    const { selectedRows } = this.state;
    const { dispatch } = this.props;

    dispatch({
      type: 'input/isLatestFillGasOrder',
      payload: {
        id: selectedRows[0].id,
        userId: selectedRows[0].userId
      },
      callback: (response) => {
        if (!response.data) {
          message.warning(latestTip);
          return;
        } else {
          dispatch({
            type: 'input/hasFillGasOrderResolved',
            payload: {
              userId: selectedRows[0].userId,
              repairOrderId: selectedRows[0].repairOrderId,
            },
            callback: (response) => {
              if (response.data) {
                message.warning(hasTip);
                return;
              } else {
                if (callback) callback(response);
              }
            }
          })
        }
      }
    })
  }

  getBindNewCardParamByUserId = (response) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    const userId = selectedRows[0].userId;
    
    dispatch({
      type: 'input/getBindNewCardParamByUserId',
      payload: {
        userId: userId
      },
      callback: (response) => {
        this.setState({
          cardModalVisible: true,
        })
      }
    })

  }

  handleCardModalVisible = flag => {
    const { selectedRows } = this.state;
    const latestTip = '该维修单不是最新的，不能绑定新卡';
    const hasTip = '该维修单的补气单或超用单已被处理，不能绑定新卡';

    if (!flag) {
      this.setState({
        cardModalVisible: false,
      })
      return;
    }

    // if (selectedRows[0].repairType !== 0 && selectedRows[0].repairType !== 6 && selectedRows[0].repairType !== 7
    //   && selectedRows[0].repairResultType !== 4 && selectedRows[0].repairResultType !== 9) {
    //   message.warning("该订单不需要补气，不需要绑定新卡");
    //   return;
    // }

    this.isLatestOrHas(latestTip, hasTip, this.getBindNewCardParamByUserId)

    // if (flag) {
    //   dispatch({
    //     type: 'input/getBindNewCardParamByUserId',
    //     payload: {
    //       userId: userId
    //     },
    //     callback: (response) => {
    //       if (response.status === 0) {
    //         this.setState({
    //           cardModalVisible: !!flag,
    //         })
    //       }
    //     }
    //   })
    // } else {
    //   this.setState({
    //     cardModalVisible: !!flag,
    //   })
    // }
  }

  handleAdd = (fields, form) => {
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    dispatch({
      type: 'input/add',
      payload: fields,
      callback: (response) => {
        if (response.status === 0) {
          message.success(response.message);
          dispatch({
            type: 'input/fetch',
            payload: {
              pageNum,
              pageSize
            },
          });
          this.handleAddModalVisible();
          form.resetFields();
        }
      }
    });
  }

  handleEdit = fields => {
    this.handleEditModalVisible();
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    dispatch({
      type: 'input/edit',
      payload: fields,
      callback: (response) => {
        if (response.status === 0) {
          message.success('编辑成功');
          dispatch({
            type: 'input/fetch',
            payload: {
              pageNum,
              pageSize
            },
          });
          this.handleEditModalVisible();
        }
      }
    });
  };

  handleCard = fields => {
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    dispatch({
      type: 'input/bindNewCard',
      payload: fields,
      callback: (response) => {
        if (response.status === 0) {
          message.success('补卡成功');
          dispatch({
            type: 'input/fetch',
            payload: {
              pageNum,
              pageSize
            },
          });
          this.handleCardModalVisible();
        }
      }
    });
  }

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form layout='inline'>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginLeft: 0, marginRight: 0, marginBottom: 8 }}>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator("repairOrderId")(<Input placeholder="维修单编号" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator("userId")(<Input placeholder="户号" />)}
          </Col>
          <Col md={3} sm={12} style={{ paddingLeft: 0, paddingRight: 8 }}>
            {getFieldDecorator('repairResultType')(<DictSelect placeholder="维修类型" category="repair_type" />)}
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
    const { addModalVisible, editModalVisible, cardModalVisible, selectedRows } = this.state;
    return (
      <PageHeaderWrapper className="repairorder-input">
        <Card bordered={false}>
          <div className={styles.Common}>
            <div className={styles.CommonForm}>{this.renderForm()}</div>
            <div className={styles.CommonOperator}>
              <Button icon="plus" onClick={() => this.handleAddModalVisible(true)}>新建</Button>
              <Button icon="edit" disabled={selectedRows.length !== 1} onClick={() => this.handleEditModalVisible(true)}>编辑</Button>
              <Button icon="snippets" disabled={selectedRows.length !== 1} onClick={() => this.handleCardModalVisible(true)}>补卡</Button>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChage={this.handleStandardTableChange}
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
          <InputEditForm
            handleEdit={this.handleEdit}
            handleCancel={this.handleEditModalVisible}
            modalVisible={editModalVisible}
            // treeSelectData={data}
            selectedData={selectedRows[0]}
          />
        ) : null}
        {selectedRows.length === 1 ? (
          <InputCardForm
            handleCard={this.handleCard}
            handleCancel={this.handleCardModalVisible}
            modalVisible={cardModalVisible}
            // treeSelectData={data}
            selectedData={newCardParam}
          />
        ) : null}
      </PageHeaderWrapper>
    )
  }
}
export default Inputs;