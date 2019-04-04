import queryUserQuery from '../../../services/stats';
import { handleRequestException } from '../../../utils/request';

export default {
  namespace: 'userQuery',

  state: {
    data: [],
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryUserQuery, payload);
      if (response.status === 0) {
        yield put({
          type: 'save',
          payload: response.data,
        });
        if (callback) callback();
      } else {
        handleRequestException(response);
      }
    },
    /* *add({ payload, callback }, { call }) {
      const response = yield call(addEmp, payload);
      if (callback) callback(response);
    },
    *delete({ payload, callback }, { call }) {
      const response = yield call(deleteEmp, payload);
      if (callback) callback(response);
    },
    *edit({ payload, callback }, { call }) {
      const response = yield call(editEmp, payload);
      if (callback) callback(response);
    },
    *search({ payload, callback }, { call, put }) {
      const response = yield call(searchEmp, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
      if (callback) callback();
    }, */
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload
      };
    },
  },
};
