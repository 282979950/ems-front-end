import {  queryPreStrike, editPreStrike, searchPreStrike } from '../services/system';
import { handleRequestException } from '../utils/request';

export default {
  namespace: 'preStrike',

  state: {
    data: []
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryPreStrike, payload);
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
    *edit({ payload, callback }, { call }) {
      const response = yield call(editPreStrike, payload);
      if (callback) callback(response);

    },
    *search({ payload, callback }, { call, put }) {
      const response = yield call(searchPreStrike, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
      if (callback) callback();
    }
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
