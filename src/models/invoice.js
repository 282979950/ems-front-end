import { queryAllAssignInvoice, queryAddInvoice, queryAssignInvoice, querySearchInvoice, transfer, getInvoiceInfo } from '../services/invoice';
import { handleRequestException } from '../utils/request';

export default {
  namespace: 'invoice',

  state: {
    data: [],
    treeData: []
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryAllAssignInvoice, payload);
      if (response.status === 0) {
        yield put({
          type: 'save',
          payload: response.data,
        });
        if (callback) callback(response);
      } else {
        handleRequestException(response);
      }
    },
    *add({ payload, callback }, { call }) {
      const response = yield call(queryAddInvoice, payload);
      if (callback) callback(response);
    },
    *assign({ payload, callback }, { call }) {
      const response = yield call(queryAssignInvoice, payload);
      if (callback) callback(response);
    },
    *transfer({ payload, callback }, { call }) {
      const response = yield call(transfer, payload);
      if (callback) callback(response);
    },
    *getInvoiceInfo({ payload, callback }, { call }) {
      const response = yield call(getInvoiceInfo, payload);
      if (response.status === 0) {
        if (callback) callback(response);
      } else {
        handleRequestException(response);
      }
    },
    *search({ payload, callback }, { call, put }) {
      const response = yield call(querySearchInvoice, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload
      };
    },
    saveTreeData(state, action) {
      return {
        ...state,
        treeData: action.payload
      };
    },
  },
};
