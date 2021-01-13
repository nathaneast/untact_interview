import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const ModalOverlay = styled.div`
  background-color: rgba(0, 0, 0, 0.6);
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const ModalContents = styled.div`
  background-color: white;
  padding: 25px 100px;
  text-align: center;
  position: relative;
  border-radius: 10px;
  width: 40%;
  height: auto;
  margin-top: 10%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
`;

const Modal = ({ children, onCancelModal }) => {
  const onClick = useCallback((e) => {
    e.target === e.currentTarget ? onCancelModal() : '';
  }, [onCancelModal]);

  return (
    <ModalContainer>
      <ModalOverlay onClick={onClick}>
        <ModalContents>{children}</ModalContents>
      </ModalOverlay>
    </ModalContainer>
  );
};

Modal.propTypes = {
  onCancelModal: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default Modal;
