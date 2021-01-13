import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ButtonNavy } from '../../styles/reStyled';

const Message = styled.div`
  & p {
    margin: 25px 0px;
    font-size: 17px;
    color: #34495e;
    font-weight: bolder;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 5px 0px;
`;

const Button = styled(ButtonNavy)`
  padding: 2px 22px;
  margin: 7px;
`;

const ConfirmMessage = ({ message, onCancel, onOk }) => (
  <article>
    <Message>
      <p>{message}</p>
    </Message>
    <ButtonWrapper>
      <div>
        <Button onClick={onOk}>확인</Button>
      </div>
      <div>
        <Button onClick={onCancel}>취소</Button>
      </div>
    </ButtonWrapper>
  </article>
);

ConfirmMessage.propTypes = {
  message: PropTypes.string.isRequired,
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ConfirmMessage;
