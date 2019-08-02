import {
  queryAccount,
  createAccount,
  bindCard,
  getOrderPayment,
  initCard,
  addArchive,
  deleteArchive,
  installMeter,
  editAccount,
  checkFreeGasFlag
} from '../services/account';
import { handleRequestException } from '../utils/request';

export default {
  namespace: 'account',

  state: {
    data: []
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryAccount, payload);
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
      const response = yield call(addArchive, payload);
      if (response.status === 0) {
        if (callback) callback();
      } else {
        handleRequestException(response);
      }
    },
    *delete({ payload, callback }, { call }) {
      const response = yield call(deleteArchive, payload);
      if (callback) callback(response);
    },
    *installMeter({ payload, callback }, { call }) {
      const response = yield call(installMeter, payload);
      if (response.status === 0) {
        if (callback) callback();
      } else {
        handleRequestException(response);
      }
    },
    *createAccount({ payload, callback }, { call }) {
      const response = yield call(createAccount, payload);
      if (response.status === 0) {
        if (callback) callback(response);
      } else {
        handleRequestException(response);
      }
    },
    *bindCard({ payload, callback }, { call }) {
      const response = yield call(bindCard, payload);
      if (response.status === 0) {
        if (callback) callback(response);
      } else {
        handleRequestException(response);
      }
    },
    *edit({ payload, callback }, { call }) {
      const response = yield call(editAccount, payload);
      if (response.status === 0) {
        if (callback) callback(response);
      } else {
        handleRequestException(response);
      }
    },
    *getOrderPayment({ payload, callback }, { call }) {
      const response = yield call(getOrderPayment, payload);
      if (response.status === 0) {
        if (callback) callback(response);
      } else {
        handleRequestException(response);
      }
    },
    *initCard({ payload, callback }, { call }) {
      const response = yield call(initCard, payload);
      if (response.status === 0) {
        if (callback) callback(response);
      } else {
        handleRequestException(response);
      }
    },
    *checkFreeGasFlag({ payload, callback }, { call }) {
      const response = yield call(checkFreeGasFlag, payload);
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
  },
};
