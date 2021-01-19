import produce from '../util/produce';

export const initialState = {
  sessionPosts: [],
  feedbackPosts: [],
  singlePost: '',
  hasMorePosts: true,
  uploadSessionPostLoading: false,
  uploadSessionPostError: null,
  uploadSessionPostDone: false,
  loadSessionPostLoading: false,
  loadSessionPostError: null,
  loadSessionPostDone: false,
  uploadFeedbackPostLoading: false,
  uploadFeedbackPostError: null,
  uploadFeedbackPostDone: false,
  loadFeedbackPostLoading: false,
  loadFeedbackPostError: null,
  loadFeedbackPostDone: false,
  loadSessionPostsLoading: false,
  loadSessionPostsError: null,
  loadSessionPostsDone: false,
  loadUserPostsLoading: false,
  loadUserPostsError: null,
  loadUserPostsDone: false,
  onStarPostLoading: false,
  onStarPostError: null,
  onStarPostDone: false,
};

export const UPLOAD_FEEDBACK_POST_REQUEST = 'UPLOAD_FEEDBACK_POST_REQUEST';
export const UPLOAD_FEEDBACK_POST_SUCCESS = 'UPLOAD_FEEDBACK_POST_SUCCESS';
export const UPLOAD_FEEDBACK_POST_FAILURE = 'UPLOAD_FEEDBACK_POST_FAILURE';

export const UPLOAD_SESSION_POST_REQUEST = 'UPLOAD_SESSION_POST_REQUEST';
export const UPLOAD_SESSION_POST_SUCCESS = 'UPLOAD_SESSION_POST_SUCCESS';
export const UPLOAD_SESSION_POST_FAILURE = 'UPLOAD_SESSION_POST_FAILURE';

export const LOAD_SESSION_POST_REQUEST = 'LOAD_SESSION_POST_REQUEST';
export const LOAD_SESSION_POST_SUCCESS = 'LOAD_SESSION_POST_SUCCESS';
export const LOAD_SESSION_POST_FAILURE = 'LOAD_SESSION_POST_FAILURE';

export const LOAD_FEEDBACK_POST_REQUEST = 'LOAD_FEEDBACK_POST_REQUEST';
export const LOAD_FEEDBACK_POST_SUCCESS = 'LOAD_FEEDBACK_POST_SUCCESS';
export const LOAD_FEEDBACK_POST_FAILURE = 'LOAD_FEEDBACK_POST_FAILURE';

export const LOAD_SESSION_POSTS_REQUEST = 'LOAD_SESSION_POSTS_REQUEST';
export const LOAD_SESSION_POSTS_SUCCESS = 'LOAD_SESSION_POSTS_SUCCESS';
export const LOAD_SESSION_POSTS_FAILURE = 'LOAD_SESSION_POSTS_FAILURE';

export const LOAD_USER_POSTS_REQUEST = 'LOAD_USER_POSTS_REQUEST';
export const LOAD_USER_POSTS_SUCCESS = 'LOAD_USER_POSTS_SUCCESS';
export const LOAD_USER_POSTS_FAILURE = 'LOAD_USER_POSTS_FAILURE';

export const ON_STAR_POST_REQUEST = 'ON_STAR_POST_REQUEST';
export const ON_STAR_POST_SUCCESS = 'ON_STAR_POST_SUCCESS';
export const ON_STAR_POST_FAILURE = 'ON_STAR_POST_FAILURE';

const reducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case LOAD_USER_POSTS_REQUEST:
        draft.loadUserPostsLoading = true;
        draft.loadUserPostsError = null;
        draft.loadUserPostsDone = false;
        break;
      case LOAD_USER_POSTS_SUCCESS:
        draft.loadUserPostsLoading = false;
        draft.loadUserPostsDone = true;
        draft.hasMorePosts = action.data.result.length === 8;
        if (action.data.category.name === 'feedback') {
          draft.feedbackPosts = action.data.category.isSame
            ? draft.feedbackPosts.concat(action.data.result)
            : action.data.result;
        } else {
          draft.sessionPosts = action.data.category.isSame
            ? draft.sessionPosts.concat(action.data.result)
            : action.data.result;
        }
        break;
      case LOAD_USER_POSTS_FAILURE:
        draft.loadUserPostsLoading = false;
        draft.loadUserPostsError = action.error;
        break;
      case LOAD_SESSION_POSTS_REQUEST:
        draft.loadSessionPostsLoading = true;
        draft.loadSessionPostsError = null;
        draft.loadSessionPostsDone = false;
        break;
      case LOAD_SESSION_POSTS_SUCCESS:
        draft.loadSessionPostsLoading = false;
        draft.loadSessionPostsDone = true;
        draft.sessionPosts = action.data.category.isSame
          ? draft.sessionPosts.concat(action.data.result)
          : action.data.result;
        draft.hasMorePosts = action.data.result.length === 8;
        break;
      case LOAD_SESSION_POSTS_FAILURE:
        draft.loadSessionPostsLoading = false;
        draft.loadSessionPostsError = action.error;
        break;
      case LOAD_SESSION_POST_REQUEST:
        draft.loadSessionPostLoading = true;
        draft.loadSessionPostError = null;
        draft.loadSessionPostDone = false;
        break;
      case LOAD_SESSION_POST_SUCCESS:
        draft.loadSessionPostLoading = false;
        draft.loadSessionPostDone = true;
        draft.singlePost = action.data;
        break;
      case LOAD_SESSION_POST_FAILURE:
        draft.loadSessionPostLoading = false;
        draft.loadSessionPostError = action.error;
        break;
      case LOAD_FEEDBACK_POST_REQUEST:
        draft.loadFeedbackPostLoading = true;
        draft.loadFeedbackPostError = null;
        draft.loadFeedbackPostDone = false;
        break;
      case LOAD_FEEDBACK_POST_SUCCESS:
        draft.loadFeedbackPostLoading = false;
        draft.loadFeedbackPostDone = true;
        draft.singlePost = action.data;
        break;
      case LOAD_FEEDBACK_POST_FAILURE:
        draft.loadFeedbackPostLoading = false;
        draft.loadFeedbackPostError = action.error;
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
      case UPLOAD_SESSION_POST_REQUEST:
        draft.uploadSessionPostLoading = true;
        draft.uploadSessionPostError = null;
        draft.uploadSessionPostDone = false;
        break;
      case UPLOAD_SESSION_POST_SUCCESS:
        draft.uploadSessionPostLoading = false;
        draft.uploadSessionPostDone = true;
        break;
      case UPLOAD_SESSION_POST_FAILURE:
        draft.uploadSessionPostLoading = false;
        draft.uploadSessionPostError = action.error;
        break;
      case ON_STAR_POST_REQUEST:
        draft.onStarPostLoading = true;
        draft.onStarPostError = null;
        draft.onStarPostDone = false;
        break;
      case ON_STAR_POST_SUCCESS:
        draft.onStarPostLoading = false;
        draft.onStarPostDone = true;
        const post = draft.sessionPosts.find((v) => v._id === action.data.postId);
        post.star = action.data.star;
        break;
      case ON_STAR_POST_FAILURE:
        draft.onStarPostLoading = false;
        draft.onStarPostError = action.error;
        break;
      default:
        break;
    }
  });
};

export default reducer;
