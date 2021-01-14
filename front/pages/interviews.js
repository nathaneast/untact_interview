import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { END } from 'redux-saga';
import axios from 'axios';
import styled from 'styled-components';

import { LOAD_SESSION_POSTS_REQUEST } from '../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import AppLayout from '../components/AppLayout';
import wrapper from '../store/configureStore';
import SessionCardList from '../components/SessionCardList';

const Container = styled.div`
  height: 100%;
  background-color: blue;
`;

const Menu = styled.ul`
  display: flex;
  list-style-type: none;
  justify-content: space-around;
  padding: 0px;
  margin: 30px;
  width: 450px;
`;

const MenuItem = styled.li`
  font-size: 17px;
  font-weight: bolder;
  color: #34495e;
  cursor: pointer;
`;

const Interviews = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const { sessionPosts, hasMorePosts, loadPostsLoading } = useSelector(
    (state) => state.post,
  );
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    function onScroll() {
      if (
        window.pageYOffset + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 100
      ) {
        if (hasMorePosts && !loadPostsLoading) {
          dispatch({
            type: LOAD_SESSION_POSTS_REQUEST,
            data: {
              category: {
                name: selectedCategory,
                isSame: true,
              },
              lastId: sessionPosts[sessionPosts.length - 1]?._id,
            },
          });
        }
      }
    }
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [sessionPosts, hasMorePosts, loadPostsLoading, selectedCategory]);

  const onSelectCategory = useCallback(
    (e) => {
      if (
        e.target.tagName === 'LI' &&
        selectedCategory !== e.target.dataset.name
      ) {
        dispatch({
          type: LOAD_SESSION_POSTS_REQUEST,
          data: {
            category: {
              name: e.target.dataset.name,
              isSame: false,
            },
            lastId: null,
          },
        });
        setSelectedCategory(e.target.dataset.name);
      }
    },
    [selectedCategory],
  );

  // console.log(me, 'home me');
  // console.log(sessionPosts, 'Interviews, sessionPosts ');

  return (
    <Container>
    <AppLayout>
      <Menu onClick={onSelectCategory}>
        <MenuItem id="all" data-name="all">All</MenuItem>
        <MenuItem data-name="frontEnd">FrontEnd</MenuItem>
        <MenuItem data-name="backEnd">BackEnd</MenuItem>
        <MenuItem data-name="others">others</MenuItem>
      </Menu>
      <SessionCardList posts={sessionPosts} meId={me?._id} />
    </AppLayout>
    </Container>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    // console.log('context Interviews', context);
    const cookie = context.req ? context.req.headers.cookie : '';
    axios.defaults.headers.Cookie = '';
    if (context.req && cookie) {
      axios.defaults.headers.Cookie = cookie;
    }
    context.store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });
    context.store.dispatch({
      type: LOAD_SESSION_POSTS_REQUEST,
      data: {
        category: {
          name: 'all',
          isSame: false,
        },
        lastId: null,
      },
    });
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
  },
);

export default Interviews;
