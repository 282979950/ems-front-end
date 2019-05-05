import {
  queryUserQuery,
  queryUserModifyHistory,
  queryUserAddHistory,
  queryUserFillHistory,
  queryUserCardHistory,
  queryUserRepairHistory,
  queryUserSearch
} from '../services/stats';
import { handleRequestException } from '../utils/request';

export default {
  namespace: 'userQuery',

  state: {
    data: [],
    history: []
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
    *fetchModifyHistory({ payload, callback }, { call, put }) {
      const response = yield call(queryUserModifyHistory, payload);
      if (response.status === 0) {
        yield put({
          type: 'saveHistory',
          payload: response.data,
        });
        if (callback) callback();
      } else {
        handleRequestException(response);
      }
    },
    *fetchAddHistory({ payload, callback }, { call, put }) {
      const response = yield call(queryUserAddHistory, payload);
      if (response.status === 0) {
        yield put({
          type: 'saveHistory',
          payload: response.data,
        });
        if (callback) callback();
      } else {
        handleRequestException(response);
      }
    },
    *fetchFillHistory({ payload, callback }, { call, put }) {
      const response = yield call(queryUserFillHistory, payload);
      if (response.status === 0) {
        yield put({
          type: 'saveHistory',
          payload: response.data,
        });
        if (callback) callback();
      } else {
        handleRequestException(response);
      }
    },
    *fetchCardHistory({ payload, callback }, { call, put }) {
      const response = yield call(queryUserCardHistory, payload);
      if (response.status === 0) {
        yield put({
          type: 'saveHistory',
          payload: response.data,
        });
        if (callback) callback();
      } else {
        handleRequestException(response);
      }
    },
    *fetchRepairHistory({ payload, callback }, { call, put }) {
      const response = yield call(queryUserRepairHistory, payload);
      if (response.status === 0) {
        yield put({
          type: 'saveHistory',
          payload: response.data,
        });
        if (callback) callback();
      } else {
        handleRequestException(response);
      }
    },
    *fetchUserSearch({ payload, callback }, { call, put }) {
      const response = yield call(queryUserSearch, payload);
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
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload
      };
    },
    saveHistory(state, action) {
      return {
        ...state,
        history: action.payload
      };
    },
  },
};
