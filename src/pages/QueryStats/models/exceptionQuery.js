import { queryExceptionQuery, exportExceptionQuery, exportWithPageInfoExceptionQuery } from '../../../services/queryStats';
import { handleRequestException } from '../../../utils/request';

export default {
  namespace: 'exceptionQuery',

  state: {
    data: [],
  },
  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryExceptionQuery, payload);
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
    *export({ payload, callback }, { call, put }) {
      const response = yield call(exportExceptionQuery, payload);
      console.log(response)
      if (callback) callback(response);
    },
    *exportWithPageInfo({ payload, callback }, { call, put }) {
      const response = yield call(exportWithPageInfoExceptionQuery, payload);
      if (callback) callback(response);
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