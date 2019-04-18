import { request } from '../utils/request';

/**
 * 开户信息查询
 */

export async function queryAccountQuery(params) {
  return request('/api/accountQuery/search.do', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function exportAccountQuery(params) {
  return request('/api/accountQuery/export.do', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function exportWithPageInfoAccountQuery(params) {
  return request('/api/accountQuery/exportWithPageInfo.do', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/**
 * 异常用户查询
 */

export async function queryExceptionQuery(params) {
  return request('/api/exceptionQuery/search.do', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function exportExceptionQuery(params) {
  return request('/api/exceptionQuery/export.do', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function exportWithPageInfoExceptionQuery(params) {
  return request('/api/exceptionQuery/exportWithPageInfo.do', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/**
 * IC卡查询
 */

export async function searchCardQuery(params) {
  return request('/api/cardQuery/search.do', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}