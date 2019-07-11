import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Button, message } from 'antd';
import styles from '../Common.less';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import StandardTable from '../../components/StandardTable';
import OCX from '../../components/OCX';

@connect(({ account, loading }) => ({
  account,
  loading: loading.models.account,
}))

@Form.create()
class InitCard extends PureComponent {
  constructor(props) {
    super(props);
  }
  state = {
    selectedRows: [],
    pageNum: 1,
    pageSize: 10,
    data: [],
  }

  columns = [
    {
      dataIndex: 'executeResult',
      title: '执行结果'
    },
    {
      dataIndex: 'cardType',
      title: '卡类型'
    },
    {
      dataIndex: 'cardNumber',
      title: '卡序列号'
    },
    {
      dataIndex: 'cardId',
      title: 'IC卡编号'
    },
    {
      dataIndex: 'cardFillGas',
      title: '卡内气量(单位:0.1方)'
    }, {
      dataIndex: 'repairNumber',
      title: '维修次数'
    },
    {
      dataIndex: 'serialNumber',
      title: '流水号'
    },
  ];

  getCardIdentifier = () => {
    let result = OCX.readCard();
    if (result === 'IC卡未插入写卡器.' || result === '卡类型不正确.' || result === '写卡器连接错误.') {
      message.error(result);
      return;
    }
    //数据转换
    if (result[0] && result[0] === 'S') {
      result[0] = "读卡成功"
    } else {
      result[0] = "读卡失败"
    }
    if (result[1] && result[1] === '0') {
      result[1] = "新卡"
    } else if (result[1] && result[1] === '1') {
      result[1] = "密码传递卡"
    } else if (result[1] && result[1] === '2') {
      result[1] = "一般充值卡"
    }
    const data = [{
      executeResult: result[0],
      cardType: result[1],
      cardNumber: result[2],
      cardId: result[3],
      cardFillGas: result[4],
      repairNumber: result[5],
      serialNumber: result[6],
    }]

    let list = {
      list: data,
      total: data.length,
    }
    this.setState({
      data: list
    })
  }

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleInitCard = () => {
    const { dispatch } = this.props;
    const { data } = this.state;
    const readResult = OCX.readCard();
    if (readResult[1] && readResult[1] === '0') {
      message.info('卡片已被初始化，不需要再进行初始化操作');
      return;
    }
    dispatch({
      type: 'fillGas/readCard',
      payload: { cardId: data.list[0].cardNumber },
      callback: (response) => {
        const password = response.data.cardPassword;
        const result = OCX.initCard(password);
        if (result === 'S') {
          dispatch({
            type: 'account/initCard',
            payload: {
              cardId: data.list[0].cardId,
              result: result
            },
          });
          this.setState({
            data: [],
            selectedRows: [],
          });
          message.success("已成功初始化")
        } else if (result === 'ocx.ErrorDesc') {
          message.error("初始化失败")
        }
      }
    })
  };

  render() {
    const { loading, } = this.props;
    const { selectedRows, data } = this.state;

    return (
      <PageHeaderWrapper className="repairorder-initCard">
        <Card bordered={false}>
          <div className={styles.Common}>
            <div className={styles.CommonOperator}>
              <Button icon="read" onClick={this.getCardIdentifier}>识别IC卡</Button>
              <Button icon="edit" disabled={selectedRows.length !== 1} onClick={this.handleInitCard}>初始化卡</Button>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              rowKey="cardId"
            />
            <OCX />
          </div>
        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default InitCard;
