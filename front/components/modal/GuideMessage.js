import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ButtonDefault } from '../../styles/reStyled';

const Message = styled.div`
  & p {
    margin: 25px 0px;
    font-size: 17px;
    color: #34495e;
    font-weight: bolder;
  }
`;

const ButtonWrapper = styled.div`
  margin: 5px 0px;
`;

const Button = styled(ButtonDefault)`
  padding: 5px 26px;
`;

const GuideMessage = ({ onOk, message }) => (
  <article>
    <Message>
      <p>{message}</p>
    </Message>
    <ButtonWrapper>
      <Button onClick={onOk}>확인</Button>
    </ButtonWrapper>
  </article>
);

GuideMessage.propTypes = {
  onOk: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
};

export default GuideMessage;
