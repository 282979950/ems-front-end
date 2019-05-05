import {
  queryInput,
  getRepairOrderUserByIdInput,
  addInput,
  searchInput,
  editInput,
  bindNewCardInput,
  getBindNewCardParamByUserIdInput,
  isLatestFillGasOrder,
  hasFillGasOrderResolved,
} from '../services/repairOrder';
import { handleRequestException } from '../utils/request';


export default {
  namespace: 'input',
  state: {
    data: [],
    repairOrderUser: [],
    newCardParam: [],
  },

  effects: {
    * fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryInput, payload);
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
    * search({ payload, callback }, { call, put }) {
      const response = yield call(searchInput, payload);
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
    * cardHistory({ payload, callback }, { call }) {
      const response = yield call(queryHistory, payload);
      if (callback) callback(response);
    },
    * add({ payload, callback }, { call }) {
      const response = yield call(addInput, payload);
      if (response.status === 0) {
        if (callback) callback(response);
      } else {
        handleRequestException(response);
      }
    },
    * edit({ payload, callback }, { call }) {
      const response = yield call(editInput, payload);
      if (response.status === 0) {
        if (callback) callback(response);
      } else {
        handleRequestException(response);
      }
    },
    * bindNewCard({ payload, callback }, { call }) {
      const response = yield call(bindNewCardInput, payload);
      if (response.status === 0) {
        if (callback) callback(response);
      } else {
        handleRequestException(response);
      }
    },
    * getRepairOrderUserById({ payload, callback }, { call, put }) {
      const response = yield call(getRepairOrderUserByIdInput, payload);
      if (response.status === 0) {
        yield put({
          type: 'saveRepairOrderUser',
          payload: response.data,
        });
        if (callback) callback(response);
      } else {
        handleRequestException(response);
      }
    },
    * getBindNewCardParamByUserId({ payload, callback }, { call, put }) {
      const response = yield call(getBindNewCardParamByUserIdInput, payload);
      if (response.status === 0) {
        yield put({
          type: 'saveNewCardParam',
          payload: response.data,
        });
        if (callback) callback(response);
      } else {
        handleRequestException(response);
      }
    },
    * isLatestFillGasOrder({ payload, callback }, { call }) {
      const response = yield call(isLatestFillGasOrder, payload);
      if (response.status === 0) {
        if (callback) callback(response);
      } else {
        handleRequestException(response);
      }
    },
    * hasFillGasOrderResolved({ payload, callback }, { call, put }) {
      const response = yield call(hasFillGasOrderResolved, payload);
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
        data: action.payload,
      };
    },
    saveRepairOrderUser(state, action) {
      return {
        ...state,
        repairOrderUser: action.payload,
      };
    },
    saveNewCardParam(state, action) {
      return {
        ...state,
        newCardParam: action.payload,
      };
    },
  },
};
