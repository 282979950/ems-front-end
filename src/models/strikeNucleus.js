import { queryStrikeNucleus, editStrikeNucleus, searchStrikeNucleus  } from '../services/system';
import { handleRequestException } from '../utils/request';

export default {
  namespace: 'strikeNucleus',

  state: {
    data: []
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryStrikeNucleus, payload);
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
      const response = yield call(editStrikeNucleus, payload);
      if (callback) callback(response);

    },
    *search({ payload, callback }, { call, put }) {
      const response = yield call(searchStrikeNucleus, payload);
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
