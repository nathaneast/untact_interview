import { all, call, fork, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import Router from 'next/router';

import {
  UPLOAD_POST_FAILURE,
  UPLOAD_POST_REQUEST,
  UPLOAD_POST_SUCCESS,
  UPLOAD_FEEDBACK_POST_REQUEST,
  UPLOAD_FEEDBACK_POST_SUCCESS,
  UPLOAD_FEEDBACK_POST_FAILURE,
  LOAD_POST_REQUEST,
  LOAD_POST_SUCCESS,
  LOAD_POST_FAILURE,
  LOAD_POSTS_REQUEST,
  LOAD_POSTS_SUCCESS,
  LOAD_POSTS_FAILURE,
  LOAD_USER_POSTS_REQUEST,
  LOAD_USER_POSTS_SUCCESS,
  LOAD_USER_POSTS_FAILURE,
} from '../reducers/post';

function loadUserPostsAPI(data) {
  return axios.get(`/posts/${data.userId}`, {
    params: {
      lastId: data.lastId,
    },
  });
}

function* loadUserPosts(action) {
  try {
    const result = yield call(loadUserPostsAPI, action.data);
    console.log('loadUserPosts', result);
    yield put({
      type: LOAD_USER_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_USER_POSTS_FAILURE,
      error: err.response.data,
    });
  }
}

function loadPostsAPI(data) {
  return axios.get('/posts', {
    params: {
      lastId: data.lastId,
      category: data.category.name,
      // isSame: data.category.isSame,
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

function uploadFeedbackPostAPI(data) {
  return axios.post('/feedbackPost', data);
}

function* uploadFeedbackPost(action) {
  try {
    const result = yield call(uploadFeedbackPostAPI, action.data);
    console.log('uploadFeedbackPost', result);
    yield put({
      type: UPLOAD_FEEDBACK_POST_SUCCESS,
      data: result.data,
    });
    yield call(Router.push, '/');
  } catch (err) {
    console.error(err);
    yield put({
      type: UPLOAD_FEEDBACK_POST_FAILURE,
      error: err.response.data,
    });
    yield call(Router.push, '/');
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

function loadPostAPI(data) {
  return axios.get(`/post/${data}`);
}

function* loadPost(action) {
  try {
    const result = yield call(loadPostAPI, action.data);
    console.log('loadPost', result);
    yield put({
      type: LOAD_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchLoadUserPosts() {
  yield takeLatest(LOAD_USER_POSTS_REQUEST, loadUserPosts);
}

function* watchLoadPosts() {
  yield takeLatest(LOAD_POSTS_REQUEST, loadPosts);
}

function* watchLoadPost() {
  yield takeLatest(LOAD_POST_REQUEST, loadPost);
}

function* watchUploadFeedbackPost() {
  yield takeLatest(UPLOAD_FEEDBACK_POST_REQUEST, uploadFeedbackPost);
}

function* watchUploadPost() {
  yield takeLatest(UPLOAD_POST_REQUEST, uploadPost);
}

export default function* userSaga() {
  yield all([
    fork(watchLoadPosts),
    fork(watchUploadPost),
    fork(watchLoadPost),
    fork(watchUploadFeedbackPost),
    fork(watchLoadUserPosts),
  ]);
}
