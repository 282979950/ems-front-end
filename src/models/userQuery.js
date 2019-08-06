import {
  queryUserQuery,
  queryUserModifyHistory,
  queryUserAddHistory,
  queryUserFillHistory,
  queryUserCardHistory,
  queryUserRepairHistory,
  queryUserSearch,
  queryHistoryStrikeNucleus,
  queryExportUser,
  queryUserMeterType
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
          type: 'userRechargeHistory',
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
          type: 'fillsHistory',
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
          type: 'CardHistory',
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
          type: 'repairHistory',
          payload: response.data,
        });
        if (callback) callback();
      } else {
        handleRequestException(response);
      }
    },
    *fetchStrikeNucleusHistory({ payload, callback }, { call, put }) {
      const response = yield call(queryHistoryStrikeNucleus, payload);
      if (response.status === 0) {
        yield put({
          type: 'strikeNucleusHistory',
          payload: response.data,
        });
        if (callback) callback();
      } else {
        handleRequestException(response);
      }
    },
    *fetchqueryUserMeterType({ payload, callback }, { call, put }) {
      const response = yield call(queryUserMeterType, payload);
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
    *exportUserQuery({ payload, callback }, { call }) {
      const response = yield call(queryExportUser, payload);
      if (response.status === 0) {
        if (callback) callback(response);
      } else {
        handleRequestException(response);
      }
    },
    *exportModifyHistory({ payload, callback }, { call }) {
      const response = yield call(queryUserModifyHistory, payload);
      if (response.status === 0) {
        if (callback) callback(response);
      } else {
        handleRequestException(response);
      }
    },
    *exportAddHistory({ payload, callback }, { call }) {
      const response = yield call(queryUserAddHistory, payload);
      if (response.status === 0) {
        if (callback) callback(response);
      } else {
        handleRequestException(response);
      }
    },
    *exportFillHistory({ payload, callback }, { call }) {
      const response = yield call(queryUserFillHistory, payload);
      if (response.status === 0) {
        if (callback) callback(response);
      } else {
        handleRequestException(response);
      }
    },
    *exportCardHistory({ payload, callback }, { call }) {
      const response = yield call(queryUserCardHistory, payload);
      if (response.status === 0) {
        if (callback) callback(response);
      } else {
        handleRequestException(response);
      }
    },
    *exportRepairHistory({ payload, callback }, { call }) {
      const response = yield call(queryUserRepairHistory, payload);
      if (response.status === 0) {
        if (callback) callback(response);
      } else {
        handleRequestException(response);
      }
    },
    *exportStrikeNucleusHistory({ payload, callback }, { call }) {
      const response = yield call(queryHistoryStrikeNucleus, payload);
      if (response.status === 0) {
        if (callback) callback(response);
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
    userRechargeHistory(state, action) {
      return {
        ...state,
        userRecharge: action.payload
      };
    },
    fillsHistory(state, action) {
      return {
        ...state,
        fillGas: action.payload
      };
    },
    CardHistory(state, action) {
      return {
        ...state,
        userCard: action.payload
      };
    },
    repairHistory(state, action) {
      return {
        ...state,
        userRepair: action.payload
      };
    },
    strikeNucleusHistory(state, action) {
      return {
        ...state,
        userStrikeNucleus: action.payload
      };
    },
  },
};
