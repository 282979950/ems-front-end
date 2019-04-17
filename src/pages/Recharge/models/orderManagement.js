import { queryAllOrder, querySearchOrder } from '../../../services/orderManagement';
import { handleRequestException } from '../../../utils/request';

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
