import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { END } from 'redux-saga';
import axios from 'axios';

import AppLayout from '../components/AppLayout';
import StartPostModal from '../components/modal/StartPostModal';
import PostCard from '../components/PostCard';
import { LOAD_POSTS_REQUEST } from '../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import wrapper from '../store/configureStore';

const Home = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector(
    (state) => state.post
  );
  const [modal, setModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState('');
  const [beforeCategory, setBeforeCategory] = useState('all');
  const [selectCategory, setSelectCategory] = useState('all');

  useEffect(() => {
    function onScroll() {
      if (
        window.pageYOffset + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 100
      ) {
        if (beforeCategory !== selectCategory) {
          dispatch({
            type: LOAD_POSTS_REQUEST,
            data: {
              category: {
                name: selectCategory,
                isSame: false,
              },
              lastId: null,
            },
          });
          setBeforeCategory(selectCategory);
          return;
        }
        if (
          beforeCategory === selectCategory &&
          hasMorePosts &&
          !loadPostsLoading
        ) {
          const lastId = mainPosts[mainPosts.length - 1]?._id;
          dispatch({
            type: LOAD_POSTS_REQUEST,
            data: {
              category: {
                name: selectCategory,
                isSame: true,
              },
              lastId,
            },
          });
        }
      }
    }
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [mainPosts, hasMorePosts, loadPostsLoading]);

  const onSelectCategory = useCallback((e) => {
    if (e.target.tagName === 'UL') {
      return;
    }
    setSelectCategory(e.target.dataset.name);
  });

  console.log(beforeCategory, selectCategory, '//// beforeCate, selectCate');

  return (
    <>
      <AppLayout>
        <div>소개 헤더</div>
        <div>
          카테고리
          <ul onClick={onSelectCategory}>
            <li data-name='all'>All</li>
            <li data-name='frontEnd'>FrontEnd</li>
            <li data-name='backEnd'>BackEnd</li>
            <li data-name='others'>others</li>
          </ul>
        </div>
        {mainPosts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onModal={() => setModal((prev) => !prev)}
            startPost={setSelectedPostId}
          />
        ))}
      </AppLayout>
      {modal && (
        <StartPostModal
          postId={selectedPostId}
          isLogin={Boolean(me)}
          resetPost={() => setSelectedPostId('')}
          modal={modal}
          onModal={() => setModal((prev) => !prev)}
        />
      )}
    </>
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
      type: LOAD_POSTS_REQUEST,
      data: {
        category: {
          name: 'all',
          isSame: true,
        },
        lastId: null,
      },
    });
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
  }
);

export default Home;
