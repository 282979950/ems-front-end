import { request } from '../utils/request';

export async function updateOrderStatus(params) {
  return request('/api/order/updateOrderStatus.do', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
