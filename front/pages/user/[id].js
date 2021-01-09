import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { END } from 'redux-saga';
import axios from 'axios';

import wrapper from '../../store/configureStore';
import { LOAD_MY_INFO_REQUEST } from '../../reducers/user';
import { LOAD_USER_POSTS_REQUEST } from '../../reducers/post';
import AppLayout from '../../components/AppLayout';
import PostCardList from '../../components/PostCardList';

const User = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const {
    mainPosts,
    feedbackPosts,
    hasMorePosts,
    loadUserPostsLoading,
    loadUserPostsDone,
  } = useSelector((state) => state.post);

  const [selectedCategory, setSelectedCategory] = useState('myPost');
  const router = useRouter();
  const userId = useRef(router.asPath.split('/user/')[1]);

  useEffect(() => {
    function onScroll() {
      if (
        window.pageYOffset + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 100
      ) {
        if (hasMorePosts && !loadUserPostsLoading) {
          dispatch({
            type: LOAD_USER_POSTS_REQUEST,
            data: {
              userId: userId.current,
              lastId: mainPosts[mainPosts.length - 1]?._id,
              category: selectedCategory,
              isSame: true,
            },
          });
        }
      }
    }
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [mainPosts, hasMorePosts, loadUserPostsLoading, selectedCategory]);

  const onSelectCategory = useCallback(
    (e) => {
      if (
        e.target.tagName === 'LI' &&
        selectedCategory !== e.target.dataset.name
      ) {
        dispatch({
          type: LOAD_USER_POSTS_REQUEST,
          data: {
            userId: userId.current,
            lastId: null,
            category: e.target.dataset.name,
            isSame: false,
          },
        });
        setSelectedCategory(e.target.dataset.name);
      }
    },
    [selectedCategory],
  );

  // console.log(mainPosts, 'User mainPosts');
  // console.log(userId, 'User userId');
  // console.log(router.asPath, 'router.pathname');

  return (
    <AppLayout>
      <article>
        <label>user Profile</label>
        <div>
          <span>userName: {me.nickname}</span>
        </div>
        <div>
          <span>email: {me.email}</span>
        </div>
      </article>
      <nav>
        <ul onClick={onSelectCategory}>
          <li data-name="myPost">myPost</li>
          {me._id === userId.current ? (
            <li data-name="feedback">feedback</li>
          ) : (
            ''
          )}
          <li data-name="star">star</li>
        </ul>
      </nav>
      <section>
          <PostCardList
            posts={selectedCategory === 'feedback' ? feedbackPosts : mainPosts}
            me={me}
            isFeedbackPost={selectedCategory === 'feedback' ? true : false}
          />
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
      type: LOAD_USER_POSTS_REQUEST,
      data: {
        userId: context.params.id,
        lastId: null,
        category: 'myPost',
        isSame: false,
      },
    });
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
  },
);

export default User;
