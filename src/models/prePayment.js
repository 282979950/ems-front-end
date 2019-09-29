import { searchPrePayment, editCreateAccount, addGasPayment, readCardFillGas, syncCard, messageMeterPayment } from '../services/recharge';
import { handleRequestException } from '../utils/request';

export default {
  namespace: 'prePayment',

  state: {
    data: []
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(searchPrePayment, payload);
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
      const response = yield call(editCreateAccount, payload);
      if (callback) callback(response);
    },
    *search({ payload, callback }, { call, put }) {
      const response = yield call(searchPrePayment, payload);
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
    *addGas({ payload, callback }, { call }) {
      const response = yield call(addGasPayment, payload);
      if (callback) callback(response);
    },
    *syncCard({ payload, callback }, { call }) {
      const response = yield call(syncCard, payload);
      if (callback) callback(response);
    },
    *readCard({ payload, callback }, { call }) {
      const response = yield call(readCardFillGas, payload);
      if (response.status === 0) {
        if (callback) callback(response);
      } else {
        handleRequestException(response)
      }
    },
    *messageMeterPayment({ payload, callback }, { call }) {
      const response = yield call(messageMeterPayment, payload);
      if (response.status === 0) {
        if (callback) callback(response);
      } else {
        handleRequestException(response)
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
