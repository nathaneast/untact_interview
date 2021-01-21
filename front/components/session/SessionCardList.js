import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { ON_STAR_POST_REQUEST } from '../../reducers/post';
import SessionCard from './SessionCard';
import Modal from '../modal/Modal';
import GuideMessage from '../modal/GuideMessage';
import ConfirmMessage from '../modal/ConfirmMessage';

const Container = styled.section`
  display: grid;
  grid-gap: 15px;
  grid-template-columns: repeat(2, 1fr);
`;

const SessionCardList = ({ posts, meId }) => {
  const [isModal, setIsModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();

  const onStartSession = useCallback(() => {
    router.push(`/session/${selectedPostId}`);
  });

  const onClickStartSession = useCallback((postId) => {
    setIsModal(true);
    setSelectedPostId(postId);
  });

  const onClickRedirectUser = useCallback((userId) => {
    router.push(`/user/${userId}`);
  });

  const onCancelModal = useCallback(() => {
    setSelectedPostId('');
    setIsModal(false);
  });

  const onStarHandler = useCallback(
    (postId) => {
      if (!meId) {
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
    },
    [meId],
  );

  const isStarUser = useCallback((staredUsers) => {
    if (!meId) {
      return false;
    }
    return staredUsers.some((user) => user === meId);
  });

  console.log(meId, '세션카드리스트 meId ');

  return (
    <>
      <Container>
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
            onClick={onClickStartSession}
            moveUserProfile={onClickRedirectUser}
            isStarUser={isStarUser}
            onStarHandler={onStarHandler}
          />
        ))}
      </Container>
      {isModal && (
        (meId ? (
          <Modal onCancelModal={onCancelModal}>
            <ConfirmMessage
              onCancel={onCancelModal}
              onOk={onStartSession}
              message={'인터뷰를 진행 하시겠습니까?'}
            />
          </Modal>
        ) : (
          <Modal onCancelModal={onCancelModal}>
            <GuideMessage
              onOk={onCancelModal}
              message={'로그인 후에 이용 가능 합니다.'}
            />
          </Modal>
        )))}
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
