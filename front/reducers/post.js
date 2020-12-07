import produce from '../util/produce';

export const initialState = {
  mainPosts: [{
    postId: 'b123123',
    userId: 'b@b',
    title: 'test title',
    questions: ['test questions1', 'test questions2', 'test questions3', 'test questions4', 'test questions5'],
    desc: 'test1 desc',
    star: 10,
    createdAt: '2020-12-06',
  }],
  singlePost: '',
  loading: null,
  error: null,
  done: null,
};

export const UPLOAD_POST_REQUEST = 'UPLOAD_POST_REQUEST';
export const UPLOAD_POST_SUCCESS = 'UPLOAD_POST_SUCCESS';
export const UPLOAD_POST_FAILURE = 'UPLOAD_POST_FAILURE';

export const SAVE_PLAY_POST_REQUEST = 'SAVE_PLAY_POST_REQUEST';
export const SAVE_PLAY_POST_SUCCESS = 'SAVE_PLAY_POST_SUCCESS';
export const SAVE_PLAY_POST_FAILURE = 'SAVE_PLAY_POST_FAILURE';

const reducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case UPLOAD_POST_REQUEST:
        draft.loading = true;
        draft.error = null;
        draft.done = false;
        break;
      case UPLOAD_POST_SUCCESS:
        draft.loading = false;
        draft.done = true;
        draft.mainPosts.push(action.data);
        break;
      case UPLOAD_POST_FAILURE:
        draft.loading = false;
        draft.error = action.error;
        break;
      case SAVE_PLAY_POST_REQUEST:
        draft.loading = true;
        draft.error = null;
        draft.done = false;
        break;
      case SAVE_PLAY_POST_SUCCESS:
        draft.loading = false;
        draft.done = true;
        draft.singlePost = action.data;
        break;
      case SAVE_PLAY_POST_FAILURE:
        draft.loading = false;
        draft.error = action.error;
        break;
      default:
        break;
    }
  });
};

export default reducer;
