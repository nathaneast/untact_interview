import { all, call, fork, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import Router from 'next/router';

import {
  LOG_IN_FAILURE,
  LOG_IN_REQUEST,
  LOG_IN_SUCCESS,
  CLEAR_LOGIN_ERROR_FAILURE,
  CLEAR_LOGIN_ERROR_REQUEST,
  CLEAR_LOGIN_ERROR_SUCCESS,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  SIGN_UP_FAILURE,
  LOG_OUT_REQUEST,
  LOG_OUT_SUCCESS,
  LOG_OUT_FAILURE,
  LOAD_MY_INFO_REQUEST,
  LOAD_MY_INFO_SUCCESS,
  LOAD_MY_INFO_FAILURE,
  LOAD_USER_INFO_REQUEST,
  LOAD_USER_INFO_SUCCESS,
  LOAD_USER_INFO_FAILURE,
} from '../reducers/user';

function loadUserInfoAPI(data) {
  return axios.get(`/user/${data.userId}`);
}

function* loadUserInfo(action) {
  try {
    const result = yield call(loadUserInfoAPI, action.data);
    console.log('saga loadUserInfo', result);
    yield put({
      type: LOAD_USER_INFO_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_USER_INFO_FAILURE,
      error: err.response.data,
    });
  }
}

function loadMyInfoAPI() {
  return axios.get('/user');
}

function* loadMyInfo() {
  try {
    const result = yield call(loadMyInfoAPI);
    console.log('saga loadMyInfo', result);
    yield put({
      type: LOAD_MY_INFO_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_MY_INFO_FAILURE,
      error: err.response.data,
    });
  }
}

function logOutAPI() {
  return axios.post('/user/logout');
}

function* logOut() {
  try {
    const result = yield call(logOutAPI);
    console.log('saga logOut', result);
    yield put({
      type: LOG_OUT_SUCCESS,
      data: result.data,
    });
    yield call(Router.push, '/');
  } catch (err) {
    console.error(err);
    yield put({
      type: LOG_OUT_FAILURE,
      error: err.response.data,
    });
  }
  yield call(Router.push, '/');
}

function signUpAPI(data) {
  return axios.post('/user', data);
}

function* signUp(action) {
  try {
    const result = yield call(signUpAPI, action.data);
    console.log('saga signUp', result);
    yield put({
      type: SIGN_UP_SUCCESS,
      data: result.data,
    });
    yield call(Router.push, '/');
  } catch (err) {
    console.error(err);
    yield put({
      type: SIGN_UP_FAILURE,
      error: err.response.data,
    });
  }
}

function* clearLoginError() {
  try {
    console.log('clearLoginError');
    yield put({
      type: CLEAR_LOGIN_ERROR_SUCCESS,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: CLEAR_LOGIN_ERROR_FAILURE,
      error: err.response.data,
    });
  }
}

function logInAPI(data) {
  return axios.post('/user/login', data);
}

function* logIn(action) {
  try {
    const result = yield call(logInAPI, action.data);
    console.log('saga logIn', result);
    yield put({
      type: LOG_IN_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOG_IN_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchLoadUserInfo() {
  yield takeLatest(LOAD_USER_INFO_REQUEST, loadUserInfo);
}

function* watchLoadMyInfo() {
  yield takeLatest(LOAD_MY_INFO_REQUEST, loadMyInfo);
}

function* watchLogOut() {
  yield takeLatest(LOG_OUT_REQUEST, logOut);
}

function* watchSignUp() {
  yield takeLatest(SIGN_UP_REQUEST, signUp);
}

function* watchClearLogInError() {
  yield takeLatest(CLEAR_LOGIN_ERROR_REQUEST, clearLoginError);
}

function* watchLogIn() {
  yield takeLatest(LOG_IN_REQUEST, logIn);
}

export default function* userSaga() {
  yield all([
    fork(watchLoadUserInfo),
    fork(watchLoadMyInfo),
    fork(watchLogOut),
    fork(watchSignUp),
    fork(watchClearLogInError),
    fork(watchLogIn),
  ]);
}
