import { queryDict, deleteDict, addDict, editDict, queryListDict, searchDict } from '../services/system';
import { handleRequestException } from '../utils/request';

export default {
  namespace: 'dic',

  state: {
    data: [],
    dicData: {
      dist_type: [],
      org_type: [],
      emp_type: [],
      meter_direction: [],
      user_type: [],
      user_gas_type: [],
      user_status: [],
      card_cost: [],
      fill_gas_order_type: [],
      repair_type: [],
      gas_equipment_type: [],
      repair_fault_type: [],
      repair_result_type: []
    }
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
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
    *delete({ payload, callback }, { call }) {
      const response = yield call(deleteDict, payload);
      if (callback) callback(response);
    },
    *edit({ payload, callback }, { call }) {
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
      if (response.status === 0) {
        const { category } = payload;
        yield put({
          type: 'saveByType',
          payload: {
            category,
            data: response.data
          }
        });
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
    saveByType(state, action) {
      const {
        payload: {
          category,
          data
        }
      } = action;
      const { dicData } = state;
      switch (category) {
        case 'dist_type':
          return {
            ...state,
            dicData: {
              ...dicData,
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
              ...dicData,
              emp_type: data
            },
          };
        case 'meter_direction':
          return {
            ...state,
            dicData: {
              ...dicData,
              meter_direction: data
            },
          };
        case 'user_type':
          return {
            ...state,
            dicData: {
              ...dicData,
              user_type: data
            },
          };
        case 'user_gas_type':
          return {
            ...state,
            dicData: {
              ...dicData,
              user_gas_type: data
            },
          };
        case 'user_status':
          return {
            ...state,
            dicData: {
              ...dicData,
              user_status: data
            },
          };
        case 'card_cost':
          return {
            ...state,
            dicData: {
              ...dicData,
              card_cost: data
            },
          };
        case 'repair_type':
          return {
            ...state,
            dicData: {
              ...dicData,
              repair_type: data
            },
          };
        case 'gas_equipment_type':
          return {
            ...state,
            dicData: {
              ...dicData,
              gas_equipment_type: data
            },
          };
        case 'repair_fault_type':
          return {
            ...state,
            dicData: {
              ...dicData,
              repair_fault_type: data
            },
          };
        case 'repair_result_type':
          return {
            ...state,
            dicData: {
              ...dicData,
              repair_result_type: data
            },
          };
        case 'fill_gas_order_type':
          return {
            ...state,
            dicData: {
              ...dicData,
              fill_gas_order_type: data
            },
          };
        default:
          return null;
      }
    },
  },
};
