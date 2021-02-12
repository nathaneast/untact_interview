import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { END } from 'redux-saga';
import Head from 'next/head';
import axios from 'axios';

import {
  UserBoard,
  Profile,
  Avatar,
  UserInfo,
  CategoryWrapper,
  Category,
  CategoryItem,
} from '../../styles/user';
import wrapper from '../../store/configureStore';
import { LOAD_MY_INFO_REQUEST, LOAD_USER_INFO_REQUEST } from '../../reducers/user';
import { LOAD_USER_POSTS_REQUEST } from '../../reducers/post';
import AppLayout from '../../components/AppLayout';
import SessionCardList from '../../components/session/SessionCardList';
import FeedbackCardList from '../../components/feedback/FeedbackCardList';
import NonePostMessageCard from '../../components/NonePostMessageCard';

const User = () => {
  const { me, userInfo } = useSelector((state) => state.user);
  const {
    hasMorePosts,
    feedbackPosts,
    sessionPosts,
    loadUserPostsLoading,
  } = useSelector((state) => state.post);

  const [selectedCategory, setSelectedCategory] = useState('writePosts');

  const router = useRouter();
  const userId = useRef(router.asPath.split('/user/')[1]);
  const dispatch = useDispatch();

  const isSelectedFeedback = useCallback(() => (
    selectedCategory === 'feedback'
  ), [selectedCategory]);

  useEffect(() => {
    function onScroll() {
      if (
        window.pageYOffset + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 100
      ) {
        if (hasMorePosts && !loadUserPostsLoading) {
          const anyPostLastId = isSelectedFeedback()
            ? feedbackPosts[feedbackPosts.length - 1]?._id
            : sessionPosts[sessionPosts.length - 1]?._id;
          dispatch({
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
        }
      }
    }
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [
    feedbackPosts,
    sessionPosts,
    hasMorePosts,
    loadUserPostsLoading,
    selectedCategory,
  ]);

  const extractClickedDateset = useCallback((target) => {
    let categoryDataset;
    if (target.tagName === 'LI') {
      categoryDataset = target.dataset.name;
    } else if (target.tagName === 'BUTTON') {
      categoryDataset = target.parentNode.dataset.name;
    } else if (target.tagName === 'SPAN') {
      categoryDataset = target.parentNode.parentNode.dataset.name;
    }
    return categoryDataset;
  });

  const onSelectCategory = useCallback(
    (e) => {
      const clickedCategory = extractClickedDateset(e.target);
      if (selectedCategory !== clickedCategory) {
        dispatch({
          type: LOAD_USER_POSTS_REQUEST,
          data: {
            category: {
              name: clickedCategory,
              isSame: false,
            },
            userId: userId.current,
            lastId: null,
          },
        });
        setSelectedCategory(clickedCategory);
      }
    },
    [selectedCategory],
  );

  const isNonePosts = useCallback(
    () => (
      isSelectedFeedback()
        ? feedbackPosts.length === 0
        : sessionPosts.length === 0
    ), [feedbackPosts, sessionPosts],
  );

  return (
    <AppLayout>
      <UserBoard>
        {userInfo && (
          <>
            <Head>
              <title>{userInfo.nickname}님의 프로필</title>
              <meta name="description" content={`${userInfo.nickname}님의 프로필`} />
              <meta property="og:title" content={`${userInfo.nickname}님의 프로필`} />
              <meta property="og:description" content={`${userInfo.nickname}님의 프로필`} />
              <meta property="og:url" content={`http://untact-interview.site/user/${userInfo._id}`} />
            </Head>
            <Profile>
              <Avatar>
                <div>
                  <span>{userInfo.email[0]}</span>
                </div>
              </Avatar>
              <UserInfo>
                <div>
                  <span>email: {userInfo.email}</span>
                </div>
                <div>
                  <span>nickname: {userInfo.nickname}</span>
                </div>
                <div>
                  <span>createdAt: {userInfo.createdAt.split('T')[0]}</span>
                </div>
              </UserInfo>
            </Profile>
          </>
        )}
        <CategoryWrapper>
          <Category onClick={onSelectCategory}>
            <CategoryItem data-name="writePosts">
              <button>
                <span>작성한 인터뷰</span>
              </button>
            </CategoryItem>
            {me && me._id === userId.current && (
              <CategoryItem data-name="feedback">
                <button>
                  <span>피드백</span>
                </button>
              </CategoryItem>
            )}
            <CategoryItem data-name="star">
              <button>
                <span>스타 인터뷰</span>
              </button>
            </CategoryItem>
          </Category>
        </CategoryWrapper>
      </UserBoard>
      {isNonePosts() ? (
        <NonePostMessageCard />
      ) : isSelectedFeedback() ? (
        feedbackPosts && <FeedbackCardList posts={feedbackPosts} />
      ) : (
        sessionPosts && <SessionCardList posts={sessionPosts} meId={me?._id} />
      )}
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
