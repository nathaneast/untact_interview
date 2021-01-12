import { all, call, fork, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import Router from 'next/router';

import {
  UPLOAD_SESSION_POST_FAILURE,
  UPLOAD_SESSION_POST_REQUEST,
  UPLOAD_SESSION_POST_SUCCESS,
  UPLOAD_FEEDBACK_POST_REQUEST,
  UPLOAD_FEEDBACK_POST_SUCCESS,
  UPLOAD_FEEDBACK_POST_FAILURE,
  LOAD_SESSION_POST_REQUEST,
  LOAD_SESSION_POST_SUCCESS,
  LOAD_SESSION_POST_FAILURE,
  LOAD_FEEDBACK_POST_SUCCESS,
  LOAD_FEEDBACK_POST_REQUEST,
  LOAD_FEEDBACK_POST_FAILURE,
  LOAD_SESSION_POSTS_REQUEST,
  LOAD_SESSION_POSTS_SUCCESS,
  LOAD_SESSION_POSTS_FAILURE,
  LOAD_USER_POSTS_REQUEST,
  LOAD_USER_POSTS_SUCCESS,
  LOAD_USER_POSTS_FAILURE,
  ON_STAR_POST_REQUEST,
  ON_STAR_POST_SUCCESS,
  ON_STAR_POST_FAILURE,
} from '../reducers/post';

function onStarPostAPI(data) {
  console.log(data, 'onStarPostAPI');
  return axios.patch(`/sessionPost/${data.postId}/star`, {
    userId: data.userId,
  });
}

function* onStarPost(action) {
  try {
    const result = yield call(onStarPostAPI, action.data);
    console.log(result, 'onStarPost');
    yield put({
      type: ON_STAR_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: ON_STAR_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function loadUserPostsAPI(data) {
  return axios.get(`/posts/${data.userId}`, {
    params: {
      lastId: data.lastId,
      category: data.category.name,
    },
  });
}

function* loadUserPosts(action) {
  try {
    const result = yield call(loadUserPostsAPI, action.data);
    console.log(result, 'loadUserPosts');
    yield put({
      type: LOAD_USER_POSTS_SUCCESS,
      data: {
        result: result.data,
        isSame: action.data.category.isSame,
        category: action.data.category.name,
      },
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_USER_POSTS_FAILURE,
      error: err.response.data,
    });
  }
}

function loadSessionPostsAPI(data) {
  return axios.get('/posts', {
    params: {
      lastId: data.lastId,
      category: data.category.name,
    },
  });
}

function* loadSessionPosts(action) {
  try {
    const result = yield call(loadSessionPostsAPI, action.data);
    console.log('loadSessionPosts', result);
    yield put({
      type: LOAD_SESSION_POSTS_SUCCESS,
      data: {
        result: result.data,
        isSame: action.data.category.isSame,
      },
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_SESSION_POSTS_FAILURE,
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
    yield call(Router.push, '/interviews');
  } catch (err) {
    console.error(err);
    yield put({
      type: UPLOAD_FEEDBACK_POST_FAILURE,
      error: err.response.data,
    });
    yield call(Router.push, '/interviews');
  }
}

function uploadSessionPostAPI(data) {
  return axios.post('/sessionPost', data);
}

function* uploadSessionPost(action) {
  try {
    const result = yield call(uploadSessionPostAPI, action.data);
    console.log('uploadPost', result);
    yield put({
      type: UPLOAD_SESSION_POST_SUCCESS,
      data: result.data,
    });
    yield call(Router.push, '/interviews');
  } catch (err) {
    console.error(err);
    yield put({
      type: UPLOAD_SESSION_POST_FAILURE,
      error: err.response.data,
    });
    yield call(Router.push, '/interviews');
  }
}

function loadFeedbackPostAPI(data) {
  return axios.get(`/feedbackPost/${data.feedbackPostId}`);
}

function* loadFeedbackPost(action) {
  try {
    const result = yield call(loadFeedbackPostAPI, action.data);
    console.log('loadFeedbackPost', result);
    yield put({
      type: LOAD_FEEDBACK_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_FEEDBACK_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function loadSessionPostAPI(data) {
  return axios.get(`/sessionPost/${data}`);
}

function* loadSessionPost(action) {
  try {
    const result = yield call(loadSessionPostAPI, action.data);
    console.log('loadPost', result);
    yield put({
      type: LOAD_SESSION_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_SESSION_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchOnStarPost() {
  yield takeLatest(ON_STAR_POST_REQUEST, onStarPost);
}

function* watchLoadUserPosts() {
  yield takeLatest(LOAD_USER_POSTS_REQUEST, loadUserPosts);
}

function* watchLoadSessionPosts() {
  yield takeLatest(LOAD_SESSION_POSTS_REQUEST, loadSessionPosts);
}

function* watchLoadFeedbackPost() {
  yield takeLatest(LOAD_FEEDBACK_POST_REQUEST, loadFeedbackPost);
}

function* watchLoadSessionPost() {
  yield takeLatest(LOAD_SESSION_POST_REQUEST, loadSessionPost);
}

function* watchUploadFeedbackPost() {
  yield takeLatest(UPLOAD_FEEDBACK_POST_REQUEST, uploadFeedbackPost);
}

function* watchUploadSessionPost() {
  yield takeLatest(UPLOAD_SESSION_POST_REQUEST, uploadSessionPost);
}

export default function* userSaga() {
  yield all([
    fork(watchOnStarPost),
    fork(watchLoadUserPosts),
    fork(watchLoadSessionPosts),
    fork(watchUploadSessionPost),
    fork(watchLoadFeedbackPost),
    fork(watchUploadFeedbackPost),
    fork(watchLoadSessionPost),
  ]);
}
