import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 600px;
  border-radius: 12px;
  padding: 15px;
  margin: 10px 0px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
`;

const Item = styled.div`
  margin: 5px 10px;
  & span {
    display: block;
    font-size: 15px;
    font-weight: bolder;
    color: black;
  }
  & p {
    padding-left: 20px;
    margin: 2px 0px;
    color: #353b48;
  }
  & textarea {
    color: #2f3640;
    border-radius: 10px;
    margin-top: 10px;
  }
`;

const FeedbackFormCard = ({
  question,
  answer,
  FeedbackNumber,
  onChange,
  writeMode,
  feedback,
}) => (
  <Container>
    <Item>
      <span>{FeedbackNumber}번 질문: </span>
      <p>{question}</p>
    </Item>
    <Item>
      <span>나의 답변: </span>
      <p>{answer}</p>
    </Item>
    <Item>
      <span>피드백: </span>
      {writeMode ? (
        <textarea
          rows="3"
          cols="80"
          name={`feedback_${FeedbackNumber}`}
          onChange={onChange}
        />
      ) : (
        <p>{feedback}</p>
      )}
    </Item>
  </Container>
);

FeedbackFormCard.propTypes = {
  question: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired,
  FeedbackNumber: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  writeMode: PropTypes.bool.isRequired,
  feedback: PropTypes.string,
};

FeedbackFormCard.defaultProps = {
  feedback: null,
};

export default FeedbackFormCard;
