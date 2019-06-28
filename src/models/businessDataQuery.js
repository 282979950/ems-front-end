import { businessDataQuery, businessDataQuerySearch } from '../services/queryStats';
import { handleRequestException } from '../utils/request';

export default {
  namespace: 'businessDataQuery',

  state: {
    data: [],
  },
  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(businessDataQuery, payload);
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
      const response = yield call(businessDataQuerySearch, payload);
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
        data: action.payload,
      };
    },
  },
}
