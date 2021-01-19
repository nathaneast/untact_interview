import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { END } from 'redux-saga';
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
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const {
    hasMorePosts,
  } = useSelector((state) => state.post);
  const { userInfo } = useSelector((state) => state.user);
  const {
    feedbackPosts,
    sessionPosts,
    loadUserPostsLoading,
    loadUserPostsDone,
  } = useSelector((state) => state.post);

  const [selectedMenu, setSelectedMenu] = useState('writePosts');
  // const [sessionMove, setSessionMove] = useState(false);
  // const [scrollLoading, setScrollLoading] = useState(false);

  const router = useRouter();
  const userId = useRef(router.asPath.split('/user/')[1]);

  // const loadSameCategoryPosts = useCallback(() => {
  //   // const anyPostLastId =
  //   //   selectedMenu === 'feedback'
  //   //     ? mainPosts[mainPosts.length - 1]?._id
  //   //     : mainPosts[mainPosts.length - 1]?._id;
  //   return dispatch({
  //     type: LOAD_USER_POSTS_REQUEST,
  //     data: {
  //       category: {
  //         name: selectedMenu,
  //         isSame: true,
  //       },
  //       userId: userId.current,
  //       lastId: mainPosts[mainPosts.length - 1]?._id,
  //     },
  //   });
  // }, [selectedMenu, mainPosts, mainPosts]);

  useEffect(() => {
    function onScroll() {
      if (
        window.pageYOffset + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 100
      ) {
        if (hasMorePosts && !loadUserPostsLoading) {
          // loadSameCategoryPosts();
          const anyPostLastId =
            selectedMenu === 'feedback'
              ? feedbackPosts[feedbackPosts.length - 1]?._id
              : sessionPosts[sessionPosts.length - 1]?._id;
          dispatch({
            type: LOAD_USER_POSTS_REQUEST,
            data: {
              category: {
                name: selectedMenu,
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
    selectedMenu,
  ]);

  const onSelectCategory = useCallback(
    (e) => {
      if (
        e.target.tagName === 'BUTTON' &&
        selectedMenu !== e.target.dataset.name
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
        // const con1 = selectedMenu === 'writePosts' && 
        // e.target.dataset.name === 'star';
        // const con2 = selectedMenu === 'star' && 
        // e.target.dataset.name === 'writePosts';
        // console.log(con1, con2, '세션메뉴끼리 이동 체크');
        // if (con1 && con2) {
        //   console.log(con1, con2, '세션메뉴끼리 이동 상태설정');
        //   setSessionMove(true);
        // }
        setSelectedMenu(e.target.dataset.name);
      }
    },
    [selectedMenu],
  );

  const isSelectedFeedback = useCallback(() => (
    selectedMenu === 'feedback'
  ), [selectedMenu]);

  const isNonePosts = useCallback(
    () => (
      isSelectedFeedback()
        ? feedbackPosts.length === 0
        : sessionPosts.length === 0
    ), [feedbackPosts, sessionPosts],
  );

  // const renderPosts = useCallback(() => {
  //   console.log('렌더 포스트 실행 !');
  //   const render = isSelectedFeedback() ? (
  //     <FeedbackCardList posts={mainPosts} />
  //   ) : (
  //     <SessionCardList posts={mainPosts} meId={me?._id} />
  //   );
  //   if (loadUserPostsDone && scrollLoading) {
  //     console.log('포스트받아오고 스크롤로딩 false');
  //     setScrollLoading(false);
  //   }
  //   console.log(render, 'render');
  //   return render;
  // }, [mainPosts, mainPosts, me, scrollLoading]);

  // const rednerSessionPosts = useCallback(() => {
  //   console.log('rednerSessionPosts !');
  //   if (sessionMove) {
  //     setSessionMove(false);
  //     return (
  //       loadUserPostsDone && (
  //         <SessionCardList posts={mainPosts} meId={me?._id} />
  //       )
  //     );
  //   } else {
  //     return <SessionCardList posts={mainPosts} meId={me?._id} />;
  //   }
  // }, [mainPosts, me]);

  // console.log(scrollLoading, 'scrollLoading');

  return (
    <AppLayout>
      <UserBoard>
        {userInfo && (
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
                <span>name: {userInfo.nickname}</span>
              </div>
              <div>
                <span>createdAt: {userInfo.createdAt.split('T')[0]}</span>
              </div>
            </UserInfo>
          </Profile>
        )}
        <CategoryWrapper>
          <Category onClick={onSelectCategory}>
            <CategoryItem>
              <button data-name="writePosts">writePosts</button>
            </CategoryItem>
            {me && me._id === userId.current ? (
              <CategoryItem>
                <button data-name="feedback">feedback</button>
              </CategoryItem>
            ) : (
              ''
            )}
            <CategoryItem>
              <button data-name="star">star</button>
            </CategoryItem>
          </Category>
        </CategoryWrapper>
      </UserBoard>
        {(isNonePosts() ? (
          <NonePostMessageCard />
        ) : (
          isSelectedFeedback() ? (
            feedbackPosts && <FeedbackCardList posts={feedbackPosts} />
          ) : (
            sessionPosts && <SessionCardList posts={sessionPosts} meId={me?._id} />
          )
        ))}
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
