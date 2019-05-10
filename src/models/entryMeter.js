import { queryEntryMeter, addEntryMeter, deleteEntryMeter, editEntryMeter, searchEntryMeter, getMeterByMeterCode } from '../services/account';
import { handleRequestException } from '../utils/request';

export default {
  namespace: 'entryMeter',

  state: {
    data: [],
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryEntryMeter, payload);
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
    *add({ payload, callback }, { call }) {
      const response = yield call(addEntryMeter, payload);
      if (callback) callback(response);
    },
    *delete({ payload, callback }, { call }) {
      const response = yield call(deleteEntryMeter, payload);
      if (callback) callback(response);
    },
    *edit({ payload, callback }, { call }) {
      const response = yield call(editEntryMeter, payload);
      if (callback) callback(response);
    },
    *search({ payload, callback }, { call, put }) {
      const response = yield call(searchEntryMeter, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
      if (callback) callback();
    },
    *getMeterByMeterCode({ payload, callback }, { call }) {
      const response = yield call(getMeterByMeterCode, payload);
      if (response.status === 0) {
        if (callback) callback(response);
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
    }
  },
};
