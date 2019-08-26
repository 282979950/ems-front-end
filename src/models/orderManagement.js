import {
  queryAllOrder,
  querySearchOrder,
  queryUpdateOrderStatus,
  queryFindInvoice,
  queryPrintInvoice,
  getRmbBig,
  queryNullInvoice,
  checkNewInvoicePrint
} from '../services/orderManagement';
import { handleRequestException } from '../utils/request';

export default {
  namespace: 'orderManagement',

  state: {
    data: [],
    history: []
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryAllOrder, payload);
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
    *search({ payload, callback }, { call, put }) {
      const response = yield call(querySearchOrder, payload);
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
    *updateOrderStatus({ payload, callback }, { call }) {
      const response = yield call(queryUpdateOrderStatus, payload);
      if (callback) callback(response);
    },
    *findInvoice({ payload, callback }, { call }) {
      const response = yield call(queryFindInvoice, payload);
      if (callback) callback(response);
    },
    *checkNewInvoicePrint({ payload, callback }, { call }) {
      const response = yield call(checkNewInvoicePrint, payload);
      if (response.status === 0) {
        if (callback) callback(response);
      } else {
        handleRequestException(response);
      }
    },
    *printInvoice({ payload, callback }, { call }) {
      const response = yield call(queryPrintInvoice, payload);
      if (callback) callback(response);
    },
    *invalidate({ payload, callback }, { call }) {
      const response = yield call(queryNullInvoice, payload);
      if (callback) callback(response);
    },
    *getRmbBig({ payload, callback }, { call }) {
      const response = yield call(getRmbBig, payload);
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
    saveHistory(state, action) {
      return {
        ...state,
        history: action.payload
      };
    },
  },
};
