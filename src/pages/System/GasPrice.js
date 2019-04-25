import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Button,
  message
} from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './GasPrice.less';
import DicEditForm from './components/GasPriceEditForm';
import Authorized from '../../utils/Authorized';



/* eslint react/no-multi-comp:0 */
@connect(({ gasPrice, loading }) => ({
  gasPrice,
  loading: loading.models.gasPrice,
}))
@Form.create()
class GasPrice extends PureComponent {
  state = {
    editModalVisible: false,
    selectedRows: [],
    formValues: {},
    pageNum: 1,
    pageSize: 10,
  };

  columns = [
    {
      title: '用户类型',
      dataIndex: 'userTypeName',
    },
    {
      title: '用气类型',
      dataIndex: 'userGasTypeName',
    },
    {
      title: '一阶梯气量',
      dataIndex: 'gasRangeOne',
    },
    {
      title: '一阶梯气价',
      dataIndex: 'gasPriceOne'
    },
    {
      title: '二阶梯气量(不含)',
      dataIndex: 'gasRangeTwo'
    },
    {
      title: '二阶梯气价',
      dataIndex: 'gasPriceTwo'
    },
    {
      title: '三阶梯气量(不含)',
      dataIndex: 'gasRangeThree'
    },
    {
      title: '三阶梯气价',
      dataIndex: 'gasPriceThree'
    },
    {
      title: '四阶梯气量(不含)',
      dataIndex: 'gasRangeFour'
    },
    {
      title: '四阶梯气价',
      dataIndex: 'gasPriceFour'
    }
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    dispatch({
      type: 'gasPrice/fetch',
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
      type: 'gasPrice/fetch',
      payload: params,
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

  // 数据修改时后台消息返回并提示
  handleEdit = fields => {
    this.handleEditModalVisible();
    const { pageNum, pageSize } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'gasPrice/edit',
      payload: fields,
      callback: (response) => {
        if (response.status === 0) {
          message.success('编辑成功');
        }else{
          message.error(response.message);
        }
        this.handleSelectedRowsReset();
        dispatch({
          type: 'gasPrice/fetch',
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


  render() {
    const {
      gasPrice: { data },
      loading,
    } = this.props;
    const { selectedRows,editModalVisible } = this.state;
    return (
      <PageHeaderWrapper className="antd-pro-pages-system-dist">
        <Card bordered={false}>
          <div className={styles.GasPrice}>
            <div className={styles.GasPriceOperator}>
              <Button icon="edit" disabled={selectedRows.length !== 1} onClick={() => this.handleEditModalVisible(true)}>编辑</Button>
            </div>
            <Authorized>
              <StandardTable
                selectedRows={selectedRows}
                loading={loading}
                data={data}
                columns={this.columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
                rowKey='gasPriceId'
              />
            </Authorized>
          </div>
        </Card>
        {selectedRows.length === 1 ? (
          <DicEditForm
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

export default GasPrice;
