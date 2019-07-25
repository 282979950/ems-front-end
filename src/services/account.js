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
  return request('/api/entryMeter/getAllMeterTypes.do', {
    method: 'POST'
  });
}

export async function getMeterByMeterCode(params) {
  return request('/api/entryMeter/getMeterByMeterCode.do', {
    method: 'POST',
    body: {
      ...params
    }
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

export async function addArchive(params) {
  return request('/api/createArchive/add.do', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function deleteArchive(params) {
  return request('/api/createArchive/delete.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function editArchive(params) {
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

export async function installMeter(params) {
  return request('/api/installMeter/edit.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function editAccount(params) {
  return request('/api/account/edit.do', {
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
export async function queryAccount(params) {
  return request('/api/account/listData.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function createAccount(params) {
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

export async function initCard(params) {
  return request('/api/account/initCard.do', {
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
