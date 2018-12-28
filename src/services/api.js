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

export async function queryOrg() {
  return request('/api/org/listData.do');
}

export async function deleteOrg(params) {
  return request('/api/org/delete.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function addOrg(params) {
  return request('/api/org/add.do', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function editOrg(params) {
  return request('/api/org/edit.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function searchOrg(params) {
  return request('/api/org/search.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function queryRole() {
  return request('/api/role/listData.do');
}

export async function deleteRole(params) {
  return request('/api/role/delete.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function addRole(params) {
  return request('/api/role/add.do', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function editRole(params) {
  return request('/api/role/edit.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function searchRole(params) {
  return request('/api/role/search.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function queryEmp(params) {
  return request(`/api/emp/listData.do?pageNum=${params.pageNum}&pageSize=${params.pageSize}`);
}

export async function deleteEmp(params) {
  return request('/api/emp/delete.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function addEmp(params) {
  return request('/api/emp/add.do', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function editEmp(params) {
  return request('/api/emp/edit.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function searchEmp(params) {
  return request('/api/emp/search.do', {
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
