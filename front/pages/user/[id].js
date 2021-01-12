import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { END } from 'redux-saga';
import axios from 'axios';

import wrapper from '../../store/configureStore';
import { LOAD_MY_INFO_REQUEST, LOAD_USER_INFO_REQUEST } from '../../reducers/user';
import { LOAD_USER_POSTS_REQUEST } from '../../reducers/post';
import AppLayout from '../../components/AppLayout';
import SessionCardList from '../../components/SessionCardList';
import FeedbackCardList from '../../components/FeedbackCardList';

const User = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const {
    sessionPosts,
    feedbackPosts,
    hasMorePosts,
    loadUserPostsLoading,
  } = useSelector((state) => state.post);
  const {
    userInfo,
  } = useSelector((state) => state.user);

  const [selectedCategory, setSelectedCategory] = useState('writePosts');
  const router = useRouter();
  const userId = useRef(router.asPath.split('/user/')[1]);

  const loadSameCategoryPosts = useCallback(() => {
    const anyPostLastId =
      selectedCategory === 'feedback'
        ? feedbackPosts[feedbackPosts.length - 1]?._id
        : sessionPosts[sessionPosts.length - 1]?._id;
    return dispatch({
      type: LOAD_USER_POSTS_REQUEST,
      data: {
        category: {
          name: selectedCategory,
          isSame: true,
        },
        userId: userId.current,
        lastId: anyPostLastId,
      },
    });
  }, [selectedCategory, sessionPosts, feedbackPosts]);

  useEffect(() => {
    function onScroll() {
      if (
        window.pageYOffset + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 100
      ) {
        if (hasMorePosts && !loadUserPostsLoading) {
          loadSameCategoryPosts();
        }
      }
    }
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [sessionPosts, feedbackPosts, hasMorePosts, loadUserPostsLoading, selectedCategory]);

  const onSelectCategory = useCallback(
    (e) => {
      if (
        e.target.tagName === 'LI' &&
        selectedCategory !== e.target.dataset.name
      ) {
        dispatch({
          type: LOAD_USER_POSTS_REQUEST,
          data: {
            category: {
              name: e.target.dataset.name,
              isSame: false,
            },
            userId: userId.current,
            lastId: null,
          },
        });
        setSelectedCategory(e.target.dataset.name);
      }
    },
    [selectedCategory],
  );

  console.log(sessionPosts, 'UserPage sessionPosts');
  console.log(feedbackPosts, 'UserPage feedbackPosts');

  return (
    <AppLayout>
      <article>
        <label>user Profile</label>
        {userInfo && (
          <>
            <div>
              <span>name: {userInfo.nickname}</span>
            </div>
            <div>
              <span>email: {userInfo.email}</span>
            </div>
          </>
        )}
      </article>
      <nav>
        <ul onClick={onSelectCategory}>
          <li data-name="writePosts">writePosts</li>
          {me && me._id === userId.current ? (
            <li data-name="feedback">feedback</li>
          ) : (
            ''
          )}
          <li data-name="star">star</li>
        </ul>
      </nav>
      <section>
        {selectedCategory === 'feedback' ? (
          <FeedbackCardList posts={feedbackPosts} />
        ) : (
          <SessionCardList posts={sessionPosts} meId={me?._id} />
        )}
      </section>
    </AppLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    const cookie = context.req ? context.req.headers.cookie : '';
    axios.defaults.headers.Cookie = '';
    if (context.req && cookie) {
      axios.defaults.headers.Cookie = cookie;
    }
    context.store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });
    context.store.dispatch({
      type: LOAD_USER_INFO_REQUEST,
      data: {
        userId: context.params.id,
      },
    });
    context.store.dispatch({
      type: LOAD_USER_POSTS_REQUEST,
      data: {
        category: {
          name: 'writePosts',
          isSame: false,
        },
        userId: context.params.id,
        lastId: null,
      },
    });
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
  },
);

export default User;
