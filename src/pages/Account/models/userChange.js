import { editUserChange, deleteUserChange, queryUserChange, searchUserChange ,historyUserChange } from '../../../services/system';
import { handleRequestException } from '../../../utils/request';

export default {
  namespace: 'userChange',

  state: {
    data: []
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryUserChange, payload);
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
      const response = yield call(editUserChange, payload);
      if (callback) callback(response);

    },
    *delete({ payload, callback }, { call}) {
      const response = yield call(deleteUserChange, payload);
      if (callback) callback(response);
    },
    *search({ payload, callback }, { call, put }) {
      const response = yield call(searchUserChange, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
      if (callback) callback();
    },
    *historyRecord({ payload, callback }, { call}) {
      const response = yield call(historyUserChange, payload);
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
