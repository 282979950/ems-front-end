import { request } from '../utils/request';

export async function queryDist() {
  return request('/api/dist/listData.do', {
    method: 'POST',
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

export async function loadDistTreeData() {
  return request('/api/dist/loadTreeData.do', {
    method: 'POST',
  });
}

export async function queryOrg() {
  return request('/api/org/listData.do', {
    method: 'POST',
  });
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

export async function loadOrgTreeData() {
  return request('/api/org/loadTreeData.do', {
    method: 'POST',
  });
}


export async function queryRole(params) {
  return request('/api/role/listData.do', {
    method: 'POST',
    body: {
      ...params,
    },
  });
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
  return request('/api/emp/listData.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
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
    return request('/api/dic/dictByType.do', {
      method: 'POST',
      body: {
        ...params
      },
    });
  }
  return request('/api/dic/listData.do', {
    method: 'POST',
  });
}

export async function deleteDict(params) {
  return request('/api/dic/delete.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function addDict(params) {
  return request('/api/dic/add.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function editDict(params) {
  return request('/api/dic/edit.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}
export async function searchDict(params) {
  return request('/api/dic/search.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}
export async function queryListDict(params) {
  return request('/api/dic/listData.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function loadDicListData(params) {
  return request('/api/dic/loadListData.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function queryPerm(params) {
  return request('/api/permission/listData.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function deletePerm(params) {
  return request('/api/permission/delete.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function addPerm(params) {
  return request('/api/permission/add.do', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function editPerm(params) {
  return request('/api/permission/edit.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function searchPerm(params) {
  return request('/api/permission/search.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function queryAllMenus() {
  return request('/api/permission/listAllMenus.do', {
    method: 'POST',
  });
}

export async function queryAllPerms() {
  return request('/api/permission/listAllPerms.do', {
    method: 'POST',
  });
}


export async function queryGasPrice(params) {
  return request('/api/gasPrice/listData.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function editGasPrice(params) {
  return request('/api/gasPrice/edit.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function queryUserChange(params) {
  return request(`/api/alter/listData.do?pageNum=${params.pageNum}&pageSize=${params.pageSize}`);
}

export async function deleteUserChange(params) {
  return request('/api/alter/userEliminationHead.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}
/*
 *账户过户
 */
export async function editUserChange(params) {
  return request('/api/alter/userChangeSettlement.do', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function searchUserChange(params) {
  return request('/api/alter/search.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}
export async function historyUserChange(params) {
  return request('/api/alter/userChangeList.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}
/*
 *账户锁定、解锁
 */
export async function queryLockAccount(params) {
  return request(`/api/lockAccount/listData.do?pageNum=${params.pageNum}&pageSize=${params.pageSize}`);
}
export async function searchLockAccount(params) {
  return request('/api/lockAccount/search.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}
export async function editLockAccount(params) {
  return request('/api/lockAccount/lock.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}
export async function historyLockAccount(params) {
  return request('/api/lockAccount/List.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}
/*
 *账务处理，预冲账
 */
  export async function queryPreStrike(params) {
  return request('/api/preStrike/listData.do',{
    method: 'POST',
    body: {
      ...params
    }
  });
}
export async function editPreStrike(params) {
  return request('/api/preStrike/edit.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}
export async function searchPreStrike(params) {
  return request('/api/preStrike/search.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}
/*
* 账务处理：冲账
*/
export async function queryStrikeNucleus(params) {
  return request('/api/strike/listData.do',{
    method: 'POST',
    body: {
      ...params
    }
  });
}

export async function editStrikeNucleus(params) {
  return request('/api/strike/edit.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function searchStrikeNucleus(params) {
  return request('/api/strike/search.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}
