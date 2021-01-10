import produce from '../util/produce';

export const initialState = {
  mainPosts: [],
  feedbackPosts: [],
  singlePost: '',
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
  loadFeedbackPostLoading: false,
  loadFeedbackPostError: null,
  loadFeedbackPostDone: false,
  uploadFeedbackPostLoading: false,
  uploadFeedbackPostError: null,
  uploadFeedbackPostDone: false,
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

export const UPLOAD_POST_REQUEST = 'UPLOAD_POST_REQUEST';
export const UPLOAD_POST_SUCCESS = 'UPLOAD_POST_SUCCESS';
export const UPLOAD_POST_FAILURE = 'UPLOAD_POST_FAILURE';

export const LOAD_POST_REQUEST = 'LOAD_POST_REQUEST';
export const LOAD_POST_SUCCESS = 'LOAD_POST_SUCCESS';
export const LOAD_POST_FAILURE = 'LOAD_POST_FAILURE';

export const LOAD_FEEDBACK_POST_REQUEST = 'LOAD_FEEDBACK_POST_REQUEST';
export const LOAD_FEEDBACK_POST_SUCCESS = 'LOAD_FEEDBACK_POST_SUCCESS';
export const LOAD_FEEDBACK_POST_FAILURE = 'LOAD_FEEDBACK_POST_FAILURE';

export const LOAD_POSTS_REQUEST = 'LOAD_POSTS_REQUEST';
export const LOAD_POSTS_SUCCESS = 'LOAD_POSTS_SUCCESS';
export const LOAD_POSTS_FAILURE = 'LOAD_POSTS_FAILURE';

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
        draft.hasMorePosts = action.data.result.length === 5;
        if (action.data.category === 'feedback') {
          draft.feedbackPosts = action.data.isSame
            ? draft.feedbackPosts.concat(action.data.result)
            : action.data.result;
        } else {
          draft.mainPosts = action.data.isSame
            ? draft.mainPosts.concat(action.data.result)
            : action.data.result;
        }
        break;
      case LOAD_USER_POSTS_FAILURE:
        draft.loadUserPostsLoading = false;
        draft.loadUserPostsError = action.error;
        break;
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
      case ON_STAR_POST_REQUEST:
        draft.onStarPostLoading = true;
        draft.onStarPostError = null;
        draft.onStarPostDone = false;
        break;
      case ON_STAR_POST_SUCCESS:
        draft.onStarPostLoading = false;
        draft.onStarPostDone = true;
        const post = draft.mainPosts.find((v) => v._id === action.data.postId);
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
