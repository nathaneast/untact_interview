import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { useRouter } from 'next/router';

const StartSessionModal = ({ postId, resetPost, onModal, isLogin, modal }) => {
  const router = useRouter();

  // not login 텍스트 에러로 처리하기
  const onStart = useCallback(() => {
    if (isLogin) {
      router.push(`/session/${postId}`);
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
    <Modal visible={modal} onCancel={onCalcel} onOk={onStart}>
      <p>세션을 시작 하시겠습니까 ?</p>
    </Modal>
  );
};

StartSessionModal.propTypes = {
  postId: PropTypes.string.isRequired,
  resetPost: PropTypes.func.isRequired,
  onModal: PropTypes.func.isRequired,
  isLogin: PropTypes.bool.isRequired,
  modal: PropTypes.bool.isRequired,
};

export default StartSessionModal;
