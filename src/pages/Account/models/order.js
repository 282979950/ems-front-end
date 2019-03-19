import { updateOrderStatus } from '../../../services/order';

export default {
  namespace: 'order',

  state: {
    data: [],
  },

  effects: {
    *updateOrderStatus({ payload, callback }, { call }) {
      const response = yield call(updateOrderStatus, payload);
      if (callback) callback(response);
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
