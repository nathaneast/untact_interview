import React from 'react';
import PropTypes from 'prop-types';

const FeedbackFormCard = ({
  question,
  answer,
  FeedbackNumber,
  onChange,
  writeMode,
  feedback,
}) => (
  <article>
    <h1>피드백 넘버 {FeedbackNumber}</h1>
    <article>
      질문
      <p>{question}</p>
    </article>
    <article>
      나의 답변
      <p>{answer}</p>
    </article>
    <article>
      피드백
      {writeMode ? (
        <input
          type="text"
          name={`feedback_${FeedbackNumber}`}
          onChange={onChange}
        />
      ) : (
        <p>{feedback}</p>
      )}
    </article>
  </article>
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
