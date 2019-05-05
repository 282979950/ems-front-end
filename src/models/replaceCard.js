import { queryReplaceCard, editReplaceCard, searchReplaceCard, searchReplaceCardHistory} from '../services/recharge';
import { handleRequestException } from '../utils/request';

export default {
  namespace: 'replaceCard',

  state: {
    data: [],
    history: []
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryReplaceCard, payload);
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
      const response = yield call(editReplaceCard, payload);
      if (callback) callback(response);
    },
    *search({ payload, callback }, { call, put }) {
      const response = yield call(searchReplaceCard, payload);
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
    *searchHistory({ payload, callback }, { call, put }) {
      const response = yield call(searchReplaceCardHistory, payload);
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
