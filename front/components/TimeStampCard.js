import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.article`
  margin: 15px 10px;
`;

const ContentsWrapper = styled.div`
  color: #34495e;
  padding: 0px 5px;
  & span {
    display:block;
    font-size: 20px;
    font-weight: bolder;
  }
  & p {
    padding: 5px;
    margin: 5px 0px;
  }
  &:hover {
    color: #FFFFF6;
    background-color: #34495e;
    border-radius: 5px;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  }
`;

const TimeStampCard = ({ text, time, onClick, answerNumber }) => (
  <Container>
    <ContentsWrapper onClick={() => onClick(time)}>
      <span>{answerNumber}.</span>
      <p>{text}</p>
    </ContentsWrapper>
  </Container>
);

TimeStampCard.propTypes = {
  text: PropTypes.string.isRequired,
  time: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  answerNumber: PropTypes.number.isRequired,
};

export default TimeStampCard;
