import { all, call, fork, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import Router from 'next/router';

import {
  UPLOAD_POST_FAILURE,
  UPLOAD_POST_REQUEST,
  UPLOAD_POST_SUCCESS,
  SAVE_PLAY_POST_REQUEST,
  SAVE_PLAY_POST_SUCCESS,
  SAVE_PLAY_POST_FAILURE,
  LOAD_POSTS_REQUEST,
  LOAD_POSTS_SUCCESS,
  LOAD_POSTS_FAILURE,
} from '../reducers/post';

function loadPostsAPI(data) {
  return axios.get('/posts', {
    params: {
      lastId: data.lastId,
      category: data.category.name,
      isSame: data.category.isSame,
    },
  });
}

function* loadPosts(action) {
  try {
    const result = yield call(loadPostsAPI, action.data);
    console.log('loadPosts', result);
    yield put({
      type: LOAD_POSTS_SUCCESS,
      data: {
        result: result.data,
        isSame: action.data.category.isSame,
      },
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_POSTS_FAILURE,
      error: err.response.data,
    });
  }
}

function uploadPostAPI(data) {
  return axios.post('/post', data);
}

function* uploadPost(action) {
  try {
    const result = yield call(uploadPostAPI, action.data);
    console.log('uploadPost', result);
    yield put({
      type: UPLOAD_POST_SUCCESS,
      data: result.data,
    });
    yield call(Router.push, '/');
  } catch (err) {
    console.error(err);
    yield put({
      type: UPLOAD_POST_FAILURE,
      error: err.response.data,
    });
    yield call(Router.push, '/');
  }
}

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

function* watchLoadPosts() {
  yield takeLatest(LOAD_POSTS_REQUEST, loadPosts);
}

function* watchSavePlayPost() {
  yield takeLatest(SAVE_PLAY_POST_REQUEST, savePlayPost);
}

function* watchUploadPost() {
  yield takeLatest(UPLOAD_POST_REQUEST, uploadPost);
}

export default function* userSaga() {
  yield all([
    fork(watchLoadPosts),
    fork(watchUploadPost),
    fork(watchSavePlayPost),
  ]);
}
