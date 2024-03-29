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

/**
 * 用户查询充值记录表
 */
export async function queryUserAddHistory(params) {
  return request('/api/userQuery/historyOrderQuery.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

/**
 * 用户补气信息查看
 */
export async function queryUserFillHistory(params) {
  return request('/api/userQuery/historyFillGasOrder.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

/**
 * 卡信息查看
 */
export async function queryUserCardHistory(params) {
  return request('/api/userQuery/historyUserCard.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

/**
 * 维修信息查看
 */
export async function queryUserRepairHistory(params) {
  return request('/api/userQuery/historyRepairOrder.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

/**
 * 条件查询
 */
export async function queryUserSearch(params) {
  return request('/api/userQuery/search.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

/**
 * 表具信息查看
 */
export async function queryUserMeterType(params) {
  return request('/api/userQuery/userMeterType.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

/**
 * 审核的冲账记录查看
 */
export async function queryHistoryStrikeNucleus(params) {
  return request('/api/userQuery/historyUserStrike.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

/**
 * 数据导出
 */
export async function queryExportUser(params) {
  return request('/api/userQuery/ExportUserQuery.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}
