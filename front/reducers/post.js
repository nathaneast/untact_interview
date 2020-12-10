import produce from '../util/produce';

export const initialState = {
  mainPosts: [],
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
  savePlayPostLoading: false,
  savePlayPostError: null,
  savePlayPostDone: false,
};

export const UPLOAD_POST_REQUEST = 'UPLOAD_POST_REQUEST';
export const UPLOAD_POST_SUCCESS = 'UPLOAD_POST_SUCCESS';
export const UPLOAD_POST_FAILURE = 'UPLOAD_POST_FAILURE';

export const SAVE_PLAY_POST_REQUEST = 'SAVE_PLAY_POST_REQUEST';
export const SAVE_PLAY_POST_SUCCESS = 'SAVE_PLAY_POST_SUCCESS';
export const SAVE_PLAY_POST_FAILURE = 'SAVE_PLAY_POST_FAILURE';

export const LOAD_POSTS_REQUEST = 'LOAD_POSTS_REQUEST';
export const LOAD_POSTS_SUCCESS = 'LOAD_POSTS_SUCCESS';
export const LOAD_POSTS_FAILURE = 'LOAD_POSTS_FAILURE';

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
        // draft.mainPosts = draft.mainPosts.concat(action.data);
        break;
      case UPLOAD_POST_FAILURE:
        draft.uploadPostLoading = false;
        draft.uploadPostError = action.error;
        break;
      case SAVE_PLAY_POST_REQUEST:
        draft.savePlayPostLoading = true;
        draft.savePlayPostError = null;
        draft.savePlayPostDone = false;
        break;
      case SAVE_PLAY_POST_SUCCESS:
        draft.savePlayPostLoading = false;
        draft.savePlayPostDone = true;
        draft.singlePost = action.data;
        break;
      case SAVE_PLAY_POST_FAILURE:
        draft.savePlayPostLoading = false;
        draft.savePlayPostError = action.error;
        break;
      default:
        break;
    }
  });
};

export default reducer;
