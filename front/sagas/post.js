import { all, call, fork, put, takeLatest, delay } from 'redux-saga/effects';
import axios from 'axios';

import {
  UPLOAD_POST_FAILURE,
  UPLOAD_POST_REQUEST,
  UPLOAD_POST_SUCCESS,
  SAVE_PLAY_POST_REQUEST,
  SAVE_PLAY_POST_SUCCESS,
  SAVE_PLAY_POST_FAILURE,
} from '../reducers/post';

function* savePlayPost(action) {
  try {
    yield put({
      type: SAVE_PLAY_POST_SUCCESS,
      data: action.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: SAVE_PLAY_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function uploadPostAPI(data) {
  return axios.post('/user/login', data);
}

function* uploadPost(action) {
  try {
    // const result = yield call(logInAPI, action.data);
    console.log('uploadPost');
    yield delay(1000);
    yield put({
      type: UPLOAD_POST_SUCCESS,
      data: action.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: UPLOAD_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchSavePlayPost() {
  yield takeLatest(SAVE_PLAY_POST_REQUEST, savePlayPost);
}

function* watchUploadPost() {
  yield takeLatest(UPLOAD_POST_REQUEST, uploadPost);
}

export default function* userSaga() {
  yield all([fork(watchUploadPost), fork(watchSavePlayPost)]);
}
