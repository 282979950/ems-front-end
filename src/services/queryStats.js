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


/**
 * 营业数据查询
 */

export async function businessDataQuery(params) {
  return request('/api/businessDataQuery/listData.do', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}


/**
 * 营业数据查询（头部筛选）
 */

export async function businessDataQuerySearch(params) {
  return request('/api/businessDataQuery/search.do', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}


/**
 * 营业报表数据查询
 */

export async function businessReportDataQuery(params) {
  return request('/api/businessReportQuery/listData.do', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}


/**
 * 营业数据查询（头部筛选）
 */

export async function businessReportDataQuerySearch(params) {
  return request('/api/businessReportQuery/search.do', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/**
 * 操作员日常数据查询
 */

export async function operatorDataQuery(params) {
  return request('/api/operatorDataQuery/listData.do', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/**
 * 操作员日常数据查询
 */

export async function operatorDataQuerySearch(params) {
  return request('/api/operatorDataQuery/search.do', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
