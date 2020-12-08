import produce from '../util/produce';

export const initialState = {
  me: null,
  userLoading: null,
  userError: null,
  userDone: null,
};

export const LOG_OUT_REQUEST = 'LOG_OUT_REQUEST';
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';
export const LOG_OUT_FAILURE = 'LOG_OUT_FAILURE';

export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';

export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';

const reducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case LOG_OUT_REQUEST:
        draft.userLoading = true;
        draft.userError = null;
        draft.userDone = false;
        break;
      case LOG_OUT_SUCCESS:
        draft.userLoading = false;
        draft.userDone = true;
        draft.me = null;
        break;
      case LOG_OUT_FAILURE:
        draft.userLoading = false;
        draft.userError = action.error;
        break;
      case LOG_IN_REQUEST:
        draft.userLoading = true;
        draft.userError = null;
        draft.userDone = false;
        break;
      case LOG_IN_SUCCESS:
        draft.userLoading = false;
        draft.userDone = true;
        draft.me = action.data;
        break;
      case LOG_IN_FAILURE:
        draft.userLoading = false;
        draft.userError = action.error;
        break;
      case SIGN_UP_REQUEST:
        draft.userLoading = true;
        draft.userError = null;
        draft.userDone = false;
        break;
      case SIGN_UP_SUCCESS:
        draft.userLoading = false;
        draft.userDone = true;
        break;
      case SIGN_UP_FAILURE:
        draft.userLoading = false;
        draft.userError = action.error;
        break;
      default:
        break;
    }
  });
};

export default reducer;
