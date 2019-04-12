import { request } from '../utils/request'
/*
 *维修单录入
 */
export async function queryInput(params) {
  return request('/api/input/listData.do', {
    method: 'POST',
    body: {
      ...params,
    }
  })
}

export async function addInput(params) {
  return request('/api/input/add.do', {
    method: 'POST',
    body: {
      ...params,
    }
  })
}

export async function searchInput(params) {
  return request('/api/input/search.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function editInput(params) {
  return request('/api/input/edit.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function bindNewCardInput(params) {
  return request('/api/input/bindNewCard.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function getBindNewCardParamByUserIdInput(params) {
  return request('/api/input/getBindNewCardParamByUserId.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function getRepairOrderUserByIdInput(params) {
  return request('/api/input/getRepairOrderUserById.do', {
    method: 'POST',
    body: {
      ...params,
    }
  })
}

export async function isLatestFillGasOrder(params) {
  return request('/api/input/isLatestFillGasOrder.do', {
    method: 'POST',
    body: {
      ...params,
    }
  })
}

export async function hasFillGasOrderResolved(params) {
  return request('/api/input/hasFillGasOrderResolved.do', {
    method: 'POST',
    body: {
      ...params,
    }
  })
}