import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import AppLayout from '../components/AppLayout';
import StartPostModal from '../components/modal/StartPostModal';
import PostCard from '../components/PostCard';
// import { LOAD_POST_REQUEST } from '../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';

const Home = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const { mainPosts } = useSelector((state) => state.post);
  const [modal, setModal] = useState(false);
  const [selectPost, setSelectPost] = useState('');

  const [beforeCategory, setBeforeCategory] = useState('frontEnd');
  const [selectCategory, setSelectCategory] = useState('frontEnd');

  // useEffect(() => {
  //   dispatch({
  //     type: LOAD_POST_REQUEST,
  //   });
  //   dispatch({
  //     type: LOAD_MY_INFO_REQUEST,
  //   });
  // }, []);

  const onSelectCategory = useCallback((e) => {
    console.log(e.target.tagName, 'e.target.tagName');
    if (e.target.tagName === 'UL') {
      return;
    }
    setSelectCategory(e.target.dataset.name.toLowerCase());
  });

  return (
    <>
      {selectCategory ? 1 : 2}
      <AppLayout>
        <div>소개 헤더</div>
        <div>
          카테고리
          <ul onClick={onSelectCategory}>
            <li data-name='All'>All</li>
            <li data-name='FrontEnd'>FrontEnd</li>
            <li data-name='BackEnd'>BackEnd</li>
            <li data-name='others'>others</li>
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

// 서버사이드 렌더링

export default Home;
