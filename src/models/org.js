import { queryOrg, deleteOrg, addOrg, editOrg, searchOrg, loadOrgTreeData } from '../services/system';
import { handleRequestException } from '../utils/request';

export default {
  namespace: 'org',

  state: {
    data: [],
    treeData: []
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryOrg, payload);
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
      const response = yield call(addOrg, payload);
      if (callback) callback(response);
    },
    *delete({ payload, callback }, { call }) {
      const response = yield call(deleteOrg, payload);
      if (callback) callback(response);
    },
    *edit({ payload, callback }, { call }) {
      const response = yield call(editOrg, payload);
      if (callback) callback(response);
    },
    *search({ payload, callback }, { call, put }) {
      const response = yield call(searchOrg, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
      if (callback) callback();
    },
    *loadTreeData({ payload, callback }, { call, put }) {
      const response = yield call(loadOrgTreeData, payload);
      yield put({
        type: 'saveTreeData',
        payload: response.data,
      });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload
      };
    },
    saveTreeData(state, action) {
      return {
        ...state,
        treeData: action.payload
      };
    },
  },
};
