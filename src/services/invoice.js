import { request } from '../utils/request';

/**
 * 发票管理-发票分配-获取列表
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

export async function transfer(params) {
  return request('/api/assign/transfer.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

/**
 * 获取加载的字典项列表(其他页面需用到的数据字典项显示,根据类型)
 */
export async function queryEmpDict() {
  return request('/api/emp/listDataByEmp.do', {
    method: 'POST',
  });
}

/**
 * 发票管理-发票分配-分配
 */
export async function queryAssignInvoice(params) {
  return request('/api/assign/assignment.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

/**
 * 发票管理-发票分配-查询特定的发票
 */
export async function querySearchInvoice(params) {
  return request('/api/assign/search.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

/**
 * 发票管理-发票查询-已分配后的发票编号
 */
export async function queryInvoice(params) {
  return request('/api/printCancel/listData.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function getInvoiceInfo(params) {
  return request('/api/assign/getInvoiceInfo.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function deleteInvoice(params) {
  return request('/api/assign/deleteInvoiceInfo.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}
/**
 * 发票管理-发票查询-特定的已分配的发票
 */
export async function querySpecificInvoice(params) {
  return request('/api/printCancel/search.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

/**
 * 发票管理-发票查询-注销未打印的发票
 */
export async function queryNullInvoice(params) {
  return request('/api/printCancel/cancel.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}
