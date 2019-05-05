import {
  searchCardQuery,
} from '../services/queryStats';
import { handleRequestException } from '../utils/request';


export default {
  namespace: 'cardQuery',
  state: {
    data: [],
  },

  effects: {
    *search({ payload, callback }, { call, put }) {
      const response = yield call(searchCardQuery, payload);
      if (response.status === 0) {
        yield put({
          type: 'save',
          payload: response.data,
        })
        if (callback) callback(response);
      } else {
        handleRequestException(response)
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload
      }
    },

  }
}
