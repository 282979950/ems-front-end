import {
  queryFillGas,
  searchFillGas,
  editFillGas,
  redCardFillGas,
  getServiceTimesByUserId,
  getFlowNum,
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
      if (response.status === 0) {
        yield put({
          type: 'save',
          payload: response.data,
        });
        if (callback) callback();
      } else {
        handleRequestException(response)
      }
    },
    *search({ payload, callback }, { call, put }) {
      const response = yield call(searchFillGas, payload);
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
    *edit({ payload, callback }, { call }) {
      const response = yield call(editFillGas, payload);
      if (response.status === 0) {
        if (callback) callback();
      } else {
        handleRequestException(response)
      }
    },
    *redCard({ payload, callback }, { call }) {
      const response = yield call(redCardFillGas, payload);
      if (response.status === 0) {
        if (callback) callback(response);
      } else {
        handleRequestException(response)
      }
    },
    *getServiceTimesByUserId({ payload, callback }, { call }) {
      const response = yield call(getServiceTimesByUserId, payload);
      if (response.status === 0) {
        if (callback) callback(response);
      } else {
        handleRequestException(response)
      }
    },
    *getFlowNum({ payload, callback }, { call }) {
      const response = yield call(getFlowNum, payload);
      if (response.status === 0) {
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
