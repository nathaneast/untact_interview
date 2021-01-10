import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';

import { ON_STAR_POST_REQUEST } from '../reducers/post';
import StartSessionModal from './modal/StartSessionModal';
import SessionCard from './SessionCard';

const SessionCardList = ({ posts, meId }) => {
  const [modal, setModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();

  const onClickStartPost = useCallback((postId) => {
    setModal(true);
    setSelectedPostId(postId);
  });

  const onClickRedirectUser = useCallback((userId) => {
    router.push(`/user/${userId}`);
  });

  const onStarHandler = useCallback((postId) => {
    if (meId) {
      alert('로그인 후 star를 누르실 수 있습니다.');
      return;
    }
    dispatch({
      type: ON_STAR_POST_REQUEST,
      data: {
        userId: meId,
        postId,
      },
    });
  }, [meId]);

  const isStarUser = useCallback((staredUsers) => {
    if (!meId) {
      return false;
    }
    return staredUsers.some((user) => user === meId);
  });

  // console.log(posts, meId, isFeedbackPost, '포스트카드리스트 posts, meId, isFeedbackPost')

  return (
    <>
      <section>
        {posts.map((post) => (
          <SessionCard
            key={post._id}
            postId={post._id}
            userId={post.creator._id}
            isLogin={meId ? true : false}
            title={post.title}
            desc={post.desc}
            email={post.creator.email}
            star={post.star}
            onClick={onClickStartPost}
            moveUserProfile={onClickRedirectUser}
            isStarUser={isStarUser}
            onStarHandler={onStarHandler}
          />
        ))}
      </section>
      {modal && (
        <StartSessionModal
          postId={selectedPostId}
          isLogin={meId ? true : false}
          resetPost={() => setSelectedPostId('')}
          modal={modal}
          onModal={() => setModal(false)}
        />
      )}
    </>
  );
};

SessionCardList.propTypes = {
  meId: PropTypes.string,
  posts: PropTypes.array.isRequired,
};

SessionCardList.defaultProps = {
  meId: null,
};

export default SessionCardList;
