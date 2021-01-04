import produce from '../util/produce';

export const initialState = {
  mainPosts: [],
  singlePost: '',
  // feedbackPost: '',
  hasMorePosts: true,
  postLoading: false,
  postError: null,
  postDone: false,
  loadPostsLoading: false,
  loadPostsError: null,
  loadPostsDone: false,
  uploadPostLoading: false,
  uploadPostError: null,
  uploadPostDone: false,
  loadPostLoading: false,
  loadPostError: null,
  loadPostDone: false,
  uploadFeedbackPostLoading: false,
  uploadFeedbackPostError: null,
  uploadFeedbackPostDone: false,
};

export const UPLOAD_FEEDBACK_POST_REQUEST = 'UPLOAD_FEEDBACK_POST_REQUEST';
export const UPLOAD_FEEDBACK_POST_SUCCESS = 'UPLOAD_FEEDBACK_POST_SUCCESS';
export const UPLOAD_FEEDBACK_POST_FAILURE = 'UPLOAD_FEEDBACK_POST_FAILURE';

export const UPLOAD_POST_REQUEST = 'UPLOAD_POST_REQUEST';
export const UPLOAD_POST_SUCCESS = 'UPLOAD_POST_SUCCESS';
export const UPLOAD_POST_FAILURE = 'UPLOAD_POST_FAILURE';

export const LOAD_POST_REQUEST = 'LOAD_POST_REQUEST';
export const LOAD_POST_SUCCESS = 'LOAD_POST_SUCCESS';
export const LOAD_POST_FAILURE = 'LOAD_POST_FAILURE';

export const LOAD_POSTS_REQUEST = 'LOAD_POSTS_REQUEST';
export const LOAD_POSTS_SUCCESS = 'LOAD_POSTS_SUCCESS';
export const LOAD_POSTS_FAILURE = 'LOAD_POSTS_FAILURE';

export const LOAD_USER_POSTS_REQUEST = 'LOAD_USER_POSTS_REQUEST';
export const LOAD_USER_POSTS_SUCCESS = 'LOAD_USER_POSTS_SUCCESS';
export const LOAD_USER_POSTS_FAILURE = 'LOAD_USER_POSTS_FAILURE';

const reducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case LOAD_POSTS_REQUEST:
        draft.loadPostsLoading = true;
        draft.loadPostsError = null;
        draft.loadPostsDone = false;
        break;
      case LOAD_POSTS_SUCCESS:
        draft.loadPostsLoading = false;
        draft.loadPostsDone = true;
        draft.mainPosts = action.data.isSame
          ? draft.mainPosts.concat(action.data.result)
          : action.data.result;
        draft.hasMorePosts = action.data.result.length === 5;
        break;
      case LOAD_POSTS_FAILURE:
        draft.loadPostsLoading = false;
        draft.loadPostsError = action.error;
        break;
      case UPLOAD_POST_REQUEST:
        draft.uploadPostLoading = true;
        draft.uploadPostError = null;
        draft.uploadPostDone = false;
        break;
      case UPLOAD_POST_SUCCESS:
        draft.uploadPostLoading = false;
        draft.uploadPostDone = true;
        break;
      case UPLOAD_POST_FAILURE:
        draft.uploadPostLoading = false;
        draft.uploadPostError = action.error;
        break;
      case LOAD_POST_REQUEST:
        draft.loadPostLoading = true;
        draft.loadPostError = null;
        draft.loadPostDone = false;
        break;
      case LOAD_POST_SUCCESS:
        draft.loadPostLoading = false;
        draft.loadPostDone = true;
        draft.singlePost = action.data;
        break;
      case LOAD_POST_FAILURE:
        draft.loadPostLoading = false;
        draft.loadPostError = action.error;
        break;
      case UPLOAD_FEEDBACK_POST_REQUEST:
        draft.uploadFeedbackPostLoading = true;
        draft.uploadFeedbackPostError = null;
        draft.uploadFeedbackPostDone = false;
        break;
      case UPLOAD_FEEDBACK_POST_SUCCESS:
        draft.uploadFeedbackPostLoading = false;
        draft.uploadFeedbackPostDone = true;
        break;
      case UPLOAD_FEEDBACK_POST_FAILURE:
        draft.uploadFeedbackPostLoading = false;
        draft.uploadFeedbackPostError = action.error;
        break;
      default:
        break;
    }
  });
};

export default reducer;
