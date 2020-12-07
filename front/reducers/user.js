import produce from '../util/produce';

export const initialState = {
  me: null,
  loading: null,
  error: null,
  done: null,
};

export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';

const reducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case LOG_IN_REQUEST:
        draft.loading = true;
        draft.error = null;
        draft.done = false;
        break;
      case LOG_IN_SUCCESS:
        draft.loading = false;
        draft.done = true;
        draft.me = action.data;
        break;
      case LOG_IN_FAILURE:
        draft.loading = false;
        draft.error = action.error;
        break;
      default:
        break;
    }
  });
};

export default reducer;
