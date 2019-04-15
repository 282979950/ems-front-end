import { request } from '../utils/request';

/**
 * 用户信息查询
 */
export async function queryAllAssignInvoice(params) {
  return request('/api/assign/listData.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

/**
 * 新增发票
 */
export async function queryAddInvoice(params) {
  return request('/api/assign/add.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}