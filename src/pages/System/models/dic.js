import {  queryDict,deleteDict, addDict, editDict, queryListDict,searchDict } from '../../../services/system';
import { handleRequestException } from '../../../utils/request';

export default {
  namespace: 'dic',

  state: {
    data: [],
    dicData: {
      dist_type: [],
      org_type: [],
      emp_type: []
    }
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
      const { category } = payload;
      yield put({
        type: 'saveByType',
        payload: {
          category,
          data: response.data
        }
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
      const {
        payload : {
          category,
          data
        }
      } = action;
      switch (category) {
        case 'dist_type':
          return {
            ...state,
            dicData: {
              dist_type: data
            },
          };
        case 'org_type':
          return {
            ...state,
            dicData: {
              org_type: data
            },
          };
        case 'emp_type':
          return {
            ...state,
            dicData: {
              emp_type: data
            },
          };
        default:
          return null;
      }
    },
  },
};
