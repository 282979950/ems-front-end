import { routerRedux } from 'dva/router';
import { login , logout} from '../services/user';
import { getPageQuery,setLoginStatus, removeLoginStatus } from '../utils/utils';
import { reloadAuthorized } from '../utils/Authorized';

export default {
  namespace: 'login',

  state: {},

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);
      // 登录成功
      if (response && response.status === 0) {
        setLoginStatus(response.status);
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      } else {
        setLoginStatus(response.status);
      }
    },

    *logout(payload, { call, put }) {
      const response = yield call(logout, payload);
      if (response.status === 0) {
        removeLoginStatus();
        reloadAuthorized();
        yield put(
          routerRedux.push({
            pathname: '/user/login'
          })
        );
      }
    },
  }
};
