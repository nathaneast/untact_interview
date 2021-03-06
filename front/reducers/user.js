import produce from '../util/produce';

export const initialState = {
  me: null,
  userInfo: null,
  signUpLoading: false,
  signUpError: null,
  signUpDone: false,
  logInLoading: false,
  logInError: null,
  logInDone: false,
  clearLogInErrorLoading: false,
  clearLogInErrorError: null,
  clearLogInErrorDone: false,
  logOutLoading: false,
  logOutError: null,
  logOutDone: false,
  loadMyInfoLoading: false,
  loadMyInfoError: null,
  loadMyInfoDone: false,
  loadUserInfoLoading: false,
  loadUserInfoError: null,
  loadUserInfoDone: false,
};

export const LOAD_MY_INFO_REQUEST = 'LOAD_MY_INFO_REQUEST';
export const LOAD_MY_INFO_SUCCESS = 'LOAD_MY_INFO_SUCCESS';
export const LOAD_MY_INFO_FAILURE = 'LOAD_MY_INFO_FAILURE';

export const LOAD_USER_INFO_REQUEST = 'LOAD_USER_INFO_REQUEST';
export const LOAD_USER_INFO_SUCCESS = 'LOAD_USER_INFO_SUCCESS';
export const LOAD_USER_INFO_FAILURE = 'LOAD_USER_INFO_FAILURE';

export const LOG_OUT_REQUEST = 'LOG_OUT_REQUEST';
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';
export const LOG_OUT_FAILURE = 'LOG_OUT_FAILURE';

export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';

export const CLEAR_LOGIN_ERROR_REQUEST = 'CLEAR_LOGIN_ERROR_REQUEST';
export const CLEAR_LOGIN_ERROR_SUCCESS = 'CLEAR_LOGIN_ERROR_SUCCESS';
export const CLEAR_LOGIN_ERROR_FAILURE = 'CLEAR_LOGIN_ERROR_FAILURE';

export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';

const reducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case LOAD_USER_INFO_REQUEST:
        draft.loadUserInfoLoading = true;
        draft.loadUserInfoError = null;
        draft.loadUserInfoDone = false;
        break;
      case LOAD_USER_INFO_SUCCESS:
        draft.loadUserInfoLoading = false;
        draft.loadUserInfoDone = true;
        draft.userInfo = action.data;
        break;
      case LOAD_USER_INFO_FAILURE:
        draft.loadUserInfoLoading = false;
        draft.loadUserInfoError = action.error;
        break;
      case LOAD_MY_INFO_REQUEST:
        draft.loadMyInfoLoading = true;
        draft.loadMyInfoError = null;
        draft.loadMyInfoDone = false;
        break;
      case LOAD_MY_INFO_SUCCESS:
        draft.loadMyInfoLoading = false;
        draft.loadMyInfoDone = true;
        draft.me = action.data;
        break;
      case LOAD_MY_INFO_FAILURE:
        draft.loadMyInfoLoading = false;
        draft.loadMyInfoError = action.error;
        break;
      case LOG_OUT_REQUEST:
        draft.logOutLoading = true;
        draft.logOutError = null;
        draft.logOutDone = false;
        break;
      case LOG_OUT_SUCCESS:
        draft.logOutLoading = false;
        draft.logOutDone = true;
        draft.me = null;
        break;
      case LOG_OUT_FAILURE:
        draft.logOutLoading = false;
        draft.logOutError = action.error;
        break;
      case LOG_IN_REQUEST:
        draft.logInLoading = true;
        draft.logInError = null;
        draft.logInDone = false;
        break;
      case LOG_IN_SUCCESS:
        draft.logInLoading = false;
        draft.logInDone = true;
        draft.me = action.data;
        break;
      case LOG_IN_FAILURE:
        draft.logInLoading = false;
        draft.logInError = action.error;
        break;
      case CLEAR_LOGIN_ERROR_REQUEST:
        draft.clearLogInErrorLoading = true;
        draft.clearLogInErrorError = null;
        draft.clearLogInErrorDone = false;
        break;
      case CLEAR_LOGIN_ERROR_SUCCESS:
        draft.clearLogInErrorLoading = false;
        draft.clearLogInErrorDone = true;
        draft.logInError = null;
        break;
      case CLEAR_LOGIN_ERROR_FAILURE:
        draft.clearLogInErrorLoading = false;
        draft.clearLogInErrorError = action.error;
        break;
      case SIGN_UP_REQUEST:
        draft.signUpLoading = true;
        draft.signUpError = null;
        draft.signUpDone = false;
        break;
      case SIGN_UP_SUCCESS:
        draft.signUpLoading = false;
        draft.signUpDone = true;
        break;
      case SIGN_UP_FAILURE:
        draft.signUpLoading = false;
        draft.signUpError = action.error;
        break;
      default:
        break;
    }
  });
};

export default reducer;
