import { stringify } from 'qs';
import { request } from '../utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/currentUser');
}


export async function login(params) {
  return request(`/api/login?${stringify(params)}`, {
    method: 'POST'
  });
}

export async function logout() {
  return request('/api/logout', {
    method: 'POST'
  });
}
