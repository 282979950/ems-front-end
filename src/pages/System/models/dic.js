import {  queryDict,deleteDict, addDict, editDict, queryListDict,searchDict } from '../../../services/system';
import { handleRequestException } from '../../../utils/request';

export default {
  namespace: 'dic',

  state: {
    data: [],
    dicData: {}
  },

  effects: {
    *fetch({ payload ,callback}, { call, put }) {
      const response = yield call(queryListDict, payload);
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
      const response = yield call(addDict, payload);
      if (callback) callback(response);

    },
    *delete({ payload, callback }, { call}) {
      const response = yield call(deleteDict, payload);
      if (callback) callback(response);
    },
    *edit({ payload, callback }, { call}) {
      const response = yield call(editDict, payload);
      if (callback) callback(response);
    },
    *search({ payload, callback }, { call, put }) {
      const response = yield call(searchDict, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
      if (callback) callback();
    },
    // 获取加载的字典项列表(其他页面需用到的数据字典项显示,根据类型)
    *fetchByType({ payload }, { call, put }) {
      const response = yield call(queryDict, payload);
      yield put({
        type: 'saveByType',
        payload: response.data
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload
      };
    },
    saveByType(state, action) {
      return {
        ...state,
        dicData: action.payload
      };
    },
  },
};
