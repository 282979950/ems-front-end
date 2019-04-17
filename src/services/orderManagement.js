import { request } from '../utils/request';

/**
 * 查询所有订单
 */
export async function queryAllOrder(params) {
  return request('/api/order/listData.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

/**
 * 查询指定订单
 */
export async function querySearchOrder(params) {
  return request('/api/order/search.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}