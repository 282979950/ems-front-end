import { queryEmpDict } from '../services/invoice';
import { handleRequestException } from '../utils/request';

export default {
  namespace: 'empDic',

  state: {
    data: [],
    dicData: {
      dist_type: []
    }
  },

  effects: {
    *fetch({ callback}, { call, put }) {
      const response = yield call(queryEmpDict);
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
  },
};
