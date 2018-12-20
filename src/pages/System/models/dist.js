import { queryDist, deleteDist, addDist, editDist } from '@/services/api';

export default {
  namespace: 'dist',

  state: {
    data: [],
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryDist, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *add({ payload, callback }, { call }) {
      const response = yield call(addDist, payload);
      if (callback) callback(response);
    },
    *delete({ payload, callback }, { call }) {
      const response = yield call(deleteDist, payload);
      if (callback) callback(response);
    },
    *edit({ payload, callback }, { call }) {
      const response = yield call(editDist, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: [action.payload],
      };
    },
  },
};
