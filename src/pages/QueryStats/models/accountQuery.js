import { queryAccountQuery, exportAccountQuery, exportWithPageInfoAccountQuery } from '../../../services/queryStats';
import { handleRequestException } from '../../../utils/request';

export default {
  namespace: 'accountQuery',

  state: {
    data: [],
  },
  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryAccountQuery, payload);
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
      const response = yield call(exportAccountQuery, payload);
      if (callback) callback(response);
    },
    *exportWithPageInfo({ payload, callback }, { call, put }) {
      const response = yield call(exportWithPageInfoAccountQuery, payload);
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
};
