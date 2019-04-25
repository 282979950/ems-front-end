import { queryRole, addRole, deleteRole, editRole, searchRole, getAllRole } from '../../../services/system';
import { handleRequestException } from '../../../utils/request';

export default {
  namespace: 'role',

  state: {
    data: [],
    dataAll: [],
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryRole, payload);
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
      const response = yield call(addRole, payload);
      if (callback) callback(response);
    },
    *delete({ payload, callback }, { call }) {
      const response = yield call(deleteRole, payload);
      if (callback) callback(response);
    },
    *edit({ payload, callback }, { call }) {
      const response = yield call(editRole, payload);
      if (callback) callback(response);
    },
    *search({ payload, callback }, { call, put }) {
      const response = yield call(searchRole, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
      if (callback) callback();
    },
    *getAllRole({ payload, callback }, { call, put }) {
      const response = yield call(getAllRole, payload);
      yield put({
        type: 'saveAll',
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
    saveAll(state, action) {
      return {
        ...state,
        dataAll: action.payload
      };
    },
  },
};
