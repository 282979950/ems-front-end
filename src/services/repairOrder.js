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

/*
 *补气补缴结算
 */
export async function queryFillGas(params) {
  return request('/api/fillGas/listData.do', {
    method: 'POST',
    body: {
      ...params,
    }
  })
}

export async function searchFillGas(params) {
  return request('/api/fillGas/search.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function editFillGas(params) {
  return request('/api/fillGas/edit.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function redCardFillGas(params) {
  return request('/api/account/redCard.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function getServiceTimesByUserId(params) {
  return request('/api/fillGas/getServiceTimesByUserId.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function getFlowNum(params) {
  return request('/api/fillGas/getFlowNum.do', {
    method: 'POST',
    body: {
      ...params
    },
  });
}
