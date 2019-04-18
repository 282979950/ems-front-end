import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Button, message, } from 'antd';
import styles from '../Common.less';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import StandardTable from '../../components/StandardTable';
import OCX from '../../components/OCX';

@connect(({ loading }) => ({
	loading: loading.models.cardQuery,
}))
@Form.create()
class CardQuery extends PureComponent {
	state = {
		selectedRows: [],
		pageNum: 1,
		pageSize: 10,
		data: [],
	}
	columns = [{
		dataIndex: 'userId',
		title: '用户编号'
	}, {
		dataIndex: 'iccardId',
		title: 'IC卡号'
	}, {
		dataIndex: 'iccardIdentifier',
		title: '卡识别号'
	}, {
		dataIndex: 'userName',
		title: '客户姓名'
	}, {
		dataIndex: 'userPhone',
		title: '客户电话'
	}, {
		dataIndex: 'userAddress',
		title: '客户地址'
	}, {
		dataIndex: 'cardOrderGas',
		title: '卡内气量'
	}, {
		dataIndex: 'totalOrderGas',
		title: '购气总量'
	}, {
		dataIndex: 'totalOrderTimes',
		title: '购气次数'
	}];

	getCardIdentifier = () => {
		const { dispatch } = this.props;
		let result = OCX.readCard();
		if (result === 'IC卡未插入写卡器.' || result === '卡类型不正确.' || result === '写卡器连接错误.') {
			message.error(result);
			return;
		}

		if (result[0] === 'S') {
			dispatch({
				type: 'cardQuery/search',
				payload: {
					iccardIdentifier: result[2],
					cardOrderGas: result[4]
				},
				callback: (response) => {
					message.success(response.message);
					let list = {
						list: response.data,
						total: response.data.length,
					}
					this.setState({
						data: list,
					})
				}
			})
		} else {
			message.error(result)
		}
	};

	handleSelectRows = rows => {
		this.setState({
			selectedRows: rows,
		});
	};

	render() {
		const { loading, } = this.props;
		const { selectedRows, data } = this.state;

		return (
			<PageHeaderWrapper className="repairorder-fillGas">
				<Card bordered={false}>
					<div className={styles.Common}>
						<div className={styles.CommonOperator}>
							<Button icon="read" onClick={this.getCardIdentifier}>识别IC卡</Button>
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
export default CardQuery;