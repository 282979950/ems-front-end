import {
  queryFillGas,

} from '../../../services/repairOrder';
import { handleRequestException } from '../../../utils/request';


export default {
  namespace: 'fillGas',
  state: {
    data: [],
    repairOrderUser: [],
    newCardParam: [],
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryFillGas, payload);
      console.log(response)
      if (response.status === 0) {
        yield put({
          type: 'save',
          payload: response.data ? response.data : [],
        })
        if (callback) callback();
      } else {
        handleRequestException(response)
      }
    },
    *search({ payload, callback }, { call, put }) {
      const response = yield call(queryFillGas, payload);
      console.log(response)
      if (response.status === 0) {
        yield put({
          type: 'save',
          payload: response.data,
        })
        if (callback) callback();
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
