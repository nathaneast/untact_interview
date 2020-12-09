import produce from '../util/produce';

export const initialState = {
  mainPosts: [],
  singlePost: '',
  postLoading: null,
  postError: null,
  postDone: null,
};

export const UPLOAD_POST_REQUEST = 'UPLOAD_POST_REQUEST';
export const UPLOAD_POST_SUCCESS = 'UPLOAD_POST_SUCCESS';
export const UPLOAD_POST_FAILURE = 'UPLOAD_POST_FAILURE';

export const SAVE_PLAY_POST_REQUEST = 'SAVE_PLAY_POST_REQUEST';
export const SAVE_PLAY_POST_SUCCESS = 'SAVE_PLAY_POST_SUCCESS';
export const SAVE_PLAY_POST_FAILURE = 'SAVE_PLAY_POST_FAILURE';

export const LOAD_POST_REQUEST = 'LOAD_POST_REQUEST';
export const LOAD_POST_SUCCESS = 'LOAD_POST_SUCCESS';
export const LOAD_POST_FAILURE = 'LOAD_POST_FAILURE';

const reducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case LOAD_POST_REQUEST:
        draft.postLoading = true;
        draft.postError = null;
        draft.postDone = false;
        break;
      case LOAD_POST_SUCCESS:
        draft.postLoading = false;
        draft.postDone = true;
        draft.mainPosts = draft.mainPosts.concat(action.data);
        break;
      case LOAD_POST_FAILURE:
        draft.postLoading = false;
        draft.postError = action.error;
        break;
      case UPLOAD_POST_REQUEST:
        draft.postLoading = true;
        draft.postError = null;
        draft.postDone = false;
        break;
      case UPLOAD_POST_SUCCESS:
        draft.postLoading = false;
        draft.postDone = true;
        draft.mainPosts = draft.mainPosts.concat(action.data);
        break;
      case UPLOAD_POST_FAILURE:
        draft.postLoading = false;
        draft.postError = action.error;
        break;
      case SAVE_PLAY_POST_REQUEST:
        draft.postLoading = true;
        draft.postError = null;
        draft.postDone = false;
        break;
      case SAVE_PLAY_POST_SUCCESS:
        draft.postLoading = false;
        draft.postDone = true;
        draft.singlePost = action.data;
        break;
      case SAVE_PLAY_POST_FAILURE:
        draft.postLoading = false;
        draft.postError = action.error;
        break;
      default:
        break;
    }
  });
};

export default reducer;
