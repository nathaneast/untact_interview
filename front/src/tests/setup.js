import configureStore from 'redux-mock-store';

const creator = {
  _id: 'koko_id',
  email: 'koko@koko.com',
  nickname: 'koko',
};

const sessionPostMock = {
  _id: 'sessionPost_id',
  creator,
  title: 'title1',
  questions: ['q1', 'q2', 'q3', 'q4', 'q5'],
  desc: 'desc',
  category: 'frontEnd',
  star: ['koko_id'],
};

export const feedbackPostMock = {
  _id: 'feedPost_id',
  creator,
  desc: 'desc',
  timeStamps: [{}, {}, {}, {}, {}],
  feedbacks: ['f1', 'f2', 'f3', 'f4', 'f5'],
  sessionPost: { ...sessionPostMock }
};

export const initialState = {
  user: {
    me: {
      email: 'nathan@nathan.com',
      nickname: 'nathan',
      _id: 'nathan_id',
    },
  },
  post: {
    posts: [sessionPostMock],
    sessionPosts: [sessionPostMock],
    feedbackPosts: [feedbackPostMock],
    hasMorePosts: false,
    loadSessionPostsLoading: false,
  }
};

export const mockStore = configureStore();
export const store = mockStore(initialState);

export const mockRouter = {
  basePath: "",
  pathname: "/",
  route: "/",
  asPath: "/",
  push: jest.fn((url) => url),
};
