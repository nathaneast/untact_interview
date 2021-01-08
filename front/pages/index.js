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
    (state) => state.post,
  );
  const [modal, setModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const onClickStartPost = useCallback((postId) => {
    setModal(true);
    setSelectedPostId(postId);
  });

  useEffect(() => {
    function onScroll() {
      if (
        window.pageYOffset + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 100
      ) {
        if (hasMorePosts && !loadPostsLoading) {
          const lastId = mainPosts[mainPosts.length - 1]?._id;
          dispatch({
            type: LOAD_POSTS_REQUEST,
            data: {
              category: {
                name: selectedCategory,
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
  }, [mainPosts, hasMorePosts, loadPostsLoading, selectedCategory]);

  const onSelectCategory = useCallback((e) => {
    if (e.target.tagName === 'LI' && selectedCategory !== e.target.dataset.name) {
      dispatch({
        type: LOAD_POSTS_REQUEST,
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
  }, [selectedCategory]);

  console.log(selectedCategory, 'selectedCategory');
  // console.log(mainPosts, 'Home');
  return (
    <>
      <AppLayout>
        <nav>
          카테고리
          <ul onClick={onSelectCategory}>
            <li data-name="all">All</li>
            <li data-name="frontEnd">FrontEnd</li>
            <li data-name="backEnd">BackEnd</li>
            <li data-name="others">others</li>
          </ul>
        </nav>
        <section>
          {mainPosts.map((post) => (
            <PostCard
              key={post._id}
              postId={post._id}
              post={post}
              onClick={onClickStartPost}
              mode={'post'}
            />
          ))}
        </section>
      </AppLayout>
      {modal && (
        <StartPostModal
          postId={selectedPostId}
          isLogin={Boolean(me)}
          resetPost={() => setSelectedPostId('')}
          modal={modal}
          onModal={() => setModal(false)}
        />
      )}
    </>
  );
};

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
    context.store.dispatch({
      type: LOAD_POSTS_REQUEST,
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

export default Home;
