import { stringify } from 'qs';
import { request } from '@/utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}


export async function queryDist() {
  return request('/api/dist/listData.do');
}

export async function deleteDist(params) {
  return request('/api/dist/delete.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function addDist(params) {
  return request('/api/dist/add.do', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function editDist(params) {
  return request('/api/dist/edit.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function searchDist(params) {
  return request('/api/dist/search.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function queryDict(params) {
  if (params) {
    return request(`/api/dic/dictByType.do?${stringify(params)}`);
  }
  return request('/api/dic/listData.do');
}

export async function removeDict(params) {
  return request('/api/dic', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function addDict(params) {
  return request('/api/dic', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateDict(params) {
  return request('/api/dic', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function fakeAccountLogin(params) {
  return request('/api/login', {
    method: 'POST',
    body: params,
  });
}

export async function fakeAccountLogout() {
  return request('/api/logout', {
    method: 'POST'
  });
}

export async function queryNotices() {
  return request('/api/notices');
}
