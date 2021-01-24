import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  margin: 7px 0px;
`;

const QuestionNumber = styled.div`
  display: flex;
  align-items: center;
  color: #fffff6;
  font-size: 17px;
  font-weight: bolder;
  margin: 5px;
`;

const QuestionInput = styled.div`
  & input {
    width: 580px;
    border-radius: 15px;
    height: 40px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
    font-size: 16px;
    color: #2f3640;
  }
`;

const SessionCard = ({ questionNumber, onChange }) => (
  <Container>
    <QuestionNumber>
      <label>{questionNumber}</label>
    </QuestionNumber>
    <QuestionInput>
      <input name={`question_${questionNumber}`} type="text" onChange={onChange} />
    </QuestionInput>
  </Container>
);

SessionCard.propTypes = {
  questionNumber: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default SessionCard;
