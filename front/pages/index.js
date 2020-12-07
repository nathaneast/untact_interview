import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import AppLayout from '../components/AppLayout';
import StartPostModal from '../components/modal/StartPostModal';
import PostCard from '../components/PostCard';

const Home = () => {
  const { me } = useSelector((state) => state.user);
  const { mainPosts } = useSelector((state) => state.post);
  const [modal, setModal] = useState(false);
  const [selectPost, setSelectPost] = useState('');

  return (
    <>
      <AppLayout>
        <div>소개 헤더</div>
        <div>카테고리</div>
        {mainPosts.map((post) => (
          <PostCard
            key={post.email}
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
