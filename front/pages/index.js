import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import AppLayout from '../components/AppLayout';
import StartPostModal from '../components/modal/StartPostModal';
import PostCard from '../components/PostCard';
// import { LOAD_POST_REQUEST } from '../reducers/post';

const Home = () => {
  const { me } = useSelector((state) => state.user);
  const { mainPosts } = useSelector((state) => state.post);
  const [modal, setModal] = useState(false);
  const [selectPost, setSelectPost] = useState('');
  const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch({
  //     type: LOAD_POST_REQUEST,
  //   });
  // }, []);

  return (
    <>
      <AppLayout>
        <div>소개 헤더</div>
        <div>
          카테고리
          <ul>
            <li>All</li>
            <li>FrontEnd</li>
            <li>BackEnd</li>
            <li>others</li>
          </ul>
        </div>
        {mainPosts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onModal={() => setModal((prev) => !prev)}
            startPost={setSelectPost}
          />
        ))}
      </AppLayout>
      {modal && (
        <StartPostModal
          post={selectPost}
          isLogin={Boolean(me)}
          resetPost={() => setSelectPost('')}
          onModal={() => setModal((prev) => !prev)}
        />
      )}
    </>
  );
};

export default Home;
