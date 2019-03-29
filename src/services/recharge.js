import { request } from '../utils/request';
/**
 * 预付费充值
 */

export async function editCreateAccount(params) {
  return request('/api/prePayment/edit.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function searchPrePayment(params) {
  return request('/api/prePayment/search.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

/**
 * 预付费充值
 */
export async function queryReplaceCard(params) {
  return request('/api/replaceCard/listData.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function editReplaceCard(params) {
  return request('/api/replaceCard/edit.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function searchReplaceCard(params) {
  return request('/api/replaceCard/search.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function searchReplaceCardHistory(params) {
  return request('/api/replaceCard/history.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}
