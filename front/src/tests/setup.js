import configureStore from 'redux-mock-store';

export const initialState = {
  user: {
    me: {
      email: 'nathan@nathan.com',
      nickname: 'nathan',
      _id: 'nathan_id',
    },
  },
  posts: [
    {
      _id: 'post1_id',
      title: 'title1',
      creator: {
        _id: 'koko_id',
        email: 'koko@koko.com',
        nickname: 'koko',
      },
      questions: ['q1', 'q2', 'q3', 'q4', 'q5'],
      desc: 'desc',
      category: 'frontEnd',
      star: [],
    },
  ],
};

export const mockStore = configureStore();
export const store = mockStore({ initialState });

export const mockRouter = {
  basePath: "",
  pathname: "/",
  route: "/",
  asPath: "/",
  push: jest.fn((url) => url),
};
