import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

import { SAVE_PLAY_POST_REQUEST } from '../../reducers/post';

const StartPostModal = ({ post, resetPost, onModal, isLogin }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const onStart = useCallback(() => {
    if (isLogin) {
      dispatch({
        type: SAVE_PLAY_POST_REQUEST,
        data: post,
      });
      router.push(`/post/${post._id}`);
    } else {
      alert('로그인 후에 이용 가능 합니다.');
    }
    onModal();
    resetPost();
  });

  const onCalcel = useCallback(() => {
    onModal();
    resetPost();
  });

  return (
    <Modal visible={true} onCancel={onCalcel} onOk={onStart}>
      <p>세션을 시작 하시겠습니까 ?</p>
    </Modal>
  );
};

StartPostModal.propTypes = {
  post: PropTypes.object.isRequired,
  resetPost: PropTypes.func.isRequired,
  onModal: PropTypes.func.isRequired,
  isLogin: PropTypes.bool.isRequired,
};

export default StartPostModal;
