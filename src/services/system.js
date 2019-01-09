import { stringify } from 'qs';
import { request } from '../utils/request';

export async function queryDist() {
  return request('/api/dist/listData.do');
}

export async function addDist(params) {
  return request('/api/dist/add.do', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function deleteDist(params) {
  return request('/api/dist/delete.do', {
    method: 'POST',
    body: {
      ...params
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
