import { request } from '../utils/request';

/**
 * 用户信息查询
 */
export default async function queryUserQuery(params) {
  return request('/api/userQuery/listData.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}