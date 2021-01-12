import React from 'react';
import { END } from 'redux-saga';
import axios from 'axios';
import styled from 'styled-components';

import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import AppLayout from '../components/AppLayout';
import wrapper from '../store/configureStore';

// const IntroContents = styled.div`
//   background-color: #34495e;
//   width: 800px;
//   height: 300px;
//   margin: 15px 0px 30px;
//   border-radius: 15px;
// `;

const Home = () => (
    <AppLayout>
      <h1>홈</h1>
      <button>시작하기</button>
    </AppLayout>
);

export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    // console.log('context Home', context);
    const cookie = context.req ? context.req.headers.cookie : '';
    axios.defaults.headers.Cookie = '';
    if (context.req && cookie) {
      axios.defaults.headers.Cookie = cookie;
    }
    context.store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
  },
);

export default Home;
