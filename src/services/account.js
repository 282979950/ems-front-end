import { request } from '../utils/request';

/**
 * 表具入库
 */
export async function queryEntryMeter(params) {
  return request('/api/entryMeter/listData.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function deleteEntryMeter(params) {
  return request('/api/entryMeter/delete.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function addEntryMeter(params) {
  return request('/api/entryMeter/add.do', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function editEntryMeter(params) {
  return request('/api/entryMeter/edit.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function searchEntryMeter(params) {
  return request('/api/entryMeter/search.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function getAllMeterTypes() {
  return request('/api/entryMeter//getAllMeterTypes.do', {
    method: 'POST'
  });
}

/**
 * 用户建档
 */
export async function queryCreateArchive(params) {
  return request('/api/createArchive/listData.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function deleteCreateArchive(params) {
  return request('/api/createArchive/delete.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function addCreateArchive(params) {
  return request('/api/createArchive/add.do', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function editCreateArchive(params) {
  return request('/api/createArchive/edit.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function searchCreateArchive(params) {
  return request('/api/createArchive/search.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

/**
 * 用户建档
 */
export async function queryInstallMeter(params) {
  return request('/api/installMeter/listData.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function editInstallMeter(params) {
  return request('/api/installMeter/edit.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function searchInstallMeter(params) {
  return request('/api/installMeter/search.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

/**
 * 用户开户
 */
export async function queryCreateAccount(params) {
  return request('/api/account/listData.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function editCreateAccount(params) {
  return request('/api/account/edit.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function searchCreateAccount(params) {
  return request('/api/account/search.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function getOrderPayment(params) {
  return request('/api/gasPrice/calAmount.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}
