import { queryInvoice, querySpecificInvoice } from '../../../services/invoice';
import { handleRequestException } from '../../../utils/request';

export default {
  namespace: 'invoiceSearch',

  state: {
    data: [],
    treeData: []
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryInvoice, payload);
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
      const response = yield call(querySpecificInvoice, payload);
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
