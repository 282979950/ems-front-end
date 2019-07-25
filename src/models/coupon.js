import { queryCoupon, addCoupon, updateCoupon, deleteCoupon, searchCoupon, getCouponPayment } from '../services/recharge';
import { handleRequestException } from '../utils/request';

export default {
  namespace: 'coupon',

  state: {
    data: [],
  },
  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryCoupon, payload);
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
      const response = yield call(addCoupon, payload);
      if (callback) callback(response);

    },
    *edit({ payload, callback }, { call }) {
      const response = yield call(updateCoupon, payload);
      if (callback) callback(response);
    },
    *delete({ payload, callback }, { call }) {
      const response = yield call(deleteCoupon, payload);
      if (callback) callback(response);
    },
    *search({ payload, callback }, { call, put }) {
      const response = yield call(searchCoupon, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
      if (callback) callback();
    },
    *getCouponPayment({ payload, callback }, { call }) {
      const response = yield call(getCouponPayment, payload);
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
        data: action.payload,
      };
    },
  },
};
