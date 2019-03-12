import { request } from '../utils/request';

/**
 * 表具入库
 */
export async function queryEntryMeter(params) {
  return request(`/api/entryMeter/listData.do?pageNum=${params.pageNum}&pageSize=${params.pageSize}`);
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
  return request('/api/entryMeter//getAllMeterTypes.do');
}
