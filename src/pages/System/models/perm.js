import { queryPerm, deletePerm, addPerm, editPerm, searchPerm, queryAllMenus } from '../../../services/system';
import { handleRequestException } from '../../../utils/request';

export default {
  namespace: 'perm',

  state: {
    data: [],
    allMenus: []
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryPerm, payload);
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
    *add({ payload, callback }, { call }) {
      const response = yield call(addPerm, payload);
      if (callback) callback(response);
    },
    *delete({ payload, callback }, { call }) {
      const response = yield call(deletePerm, payload);
      if (callback) callback(response);
    },
    *edit({ payload, callback }, { call }) {
      const response = yield call(editPerm, payload);
      if (callback) callback(response);
    },
    *search({ payload, callback }, { call, put }) {
      const response = yield call(searchPerm, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
      if (callback) callback();
    },
    *fetchAllMenus({ payload, callback }, { call, put }) {
      const response = yield call(queryAllMenus, payload);
      if (response.status === 0) {
        yield put({
          type: 'saveAllMenus',
          payload: response.data,
        });
        if (callback) callback();
      } else {
        handleRequestException(response);
      }
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload
      };
    },
    saveAllMenus(state, action) {
      return {
        ...state,
        allMenus: action.payload
      };
    },
  },
};
