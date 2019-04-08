import { request } from '../utils/request';

/**
 * 用户信息查询
 */
export async function queryUserQuery(params) {
  return request('/api/userQuery/listData.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

/**
 * 用户变更信息查询
 */
export async function queryUserModifyHistory(params) {
  return request('/api/userQuery/historyQuery.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}
