import { queryLockAccount, editLockAccount, searchLockAccount,historyLockAccount  } from '../../../services/system';
import { handleRequestException } from '../../../utils/request';

export default {
  namespace: 'lockAccount',

  state: {
    data: []
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryLockAccount, payload);
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
      const response = yield call(editLockAccount, payload);
      if (callback) callback(response);

    },
    *search({ payload, callback }, { call, put }) {
      const response = yield call(searchLockAccount, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
      if (callback) callback();
    },
    *historyLockAccount({ payload, callback }, { call}) {
      const response = yield call(historyLockAccount, payload);
      if (callback) callback(response);
    },
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
