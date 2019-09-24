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
 * 补气加购充值调用
 * @param params
 * @returns {Promise<Object>}
 */

export async function addGasPayment(params) {
  return request('/api/prePayment/addGas.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function readCardFillGas(params) {
  return request('/api/account/readCard.do', {
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

export async function queryCoupon(params) {
  return request('/api/coupon/listData.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function addCoupon(params) {
  return request('/api/coupon/add.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function updateCoupon(params) {
  return request('/api/coupon/edit.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function deleteCoupon(params) {
  return request('/api/coupon/delete.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function searchCoupon(params) {
  return request('/api/coupon/search.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function getCouponPayment(params) {
  return request('/api/coupon/getCouponPayment.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}
