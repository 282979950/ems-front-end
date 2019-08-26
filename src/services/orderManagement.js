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

/**
 * 写卡
 */
export async function queryUpdateOrderStatus(params) {
  return request('/api/order/updateOrderStatus.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

/**
 * 查找发票
 */
export async function queryFindInvoice(params) {
  return request('/api/findInvoice.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function checkNewInvoicePrint(params) {
  return request('/api/order/checkNewInvoicePrint.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

/**
 * 打印发票-改变发票状态
 */
export async function queryPrintInvoice(params) {
  return request('/api/print.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

/**
 * 发票作废
 */
export async function queryNullInvoice(params) {
  return request('/api/order/cancel.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

/**
 * 人民币查询
 */
export async function getRmbBig(params) {
  return request('/api/order/getRmbBig.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}
