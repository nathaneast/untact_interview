import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { END } from 'redux-saga';
import axios from 'axios';
import { useRouter } from 'next/router';

import wrapper from '../../store/configureStore';
import { LOAD_MY_INFO_REQUEST } from '../../reducers/user';
import { LOAD_USER_POSTS_REQUEST } from '../../reducers/post';
import StartPostModal from '../../components/modal/StartPostModal';
import PostCard from '../../components/PostCard';
import AppLayout from '../../components/AppLayout';

const User = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const { mainPosts, feedbackPosts, hasMorePosts, loadUserPostsLoading } = useSelector((state) => state.post);

  const [modal, setModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('myPost');

  const userId = useRef(window.location.pathname.split('/user/')[1]);
  const router = useRouter();

  const onClickStartPost = useCallback((postId) => {
    setModal(true);
    setSelectedPostId(postId);
  });

  const onClickRedirectFeedback = useCallback((postId) => {
    router.push(`/feedbackPost/${postId}`);
  });

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

  const onSelectCategory = useCallback((e) => {
    if (e.target.tagName === 'LI' && selectedCategory !== e.target.dataset.name) {
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
  }, [selectedCategory]);

  // console.log(mainPosts, 'User mainPosts');
  // console.log(userId, 'User userId');

  return (
    <>
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
          {selectedCategory === 'feedback' ? (
            feedbackPosts.map((post) => (
                <PostCard
                  key={post._id}
                  postId={post._id}
                  post={post.sessionPost}
                  onClick={onClickRedirectFeedback}
                  mode={'feedback'}
                />
            ))
          ) : (
            mainPosts.map((post) => (
                <PostCard
                  key={post._id}
                  postId={post._id}
                  post={post}
                  onClick={onClickStartPost}
                  mode={'post'}
                />
            ))
          )}
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
