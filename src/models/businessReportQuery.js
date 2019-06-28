import { businessReportDataQuery, businessReportDataQuerySearch } from '../services/queryStats';
import { handleRequestException } from '../utils/request';

export default {
  namespace: 'businessReportQuery',

  state: {
    data: [],
  },
  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(businessReportDataQuery, payload);
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
      const response = yield call(businessReportDataQuerySearch, payload);
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
