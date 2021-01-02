import React from 'react';
import PropTypes from 'prop-types';

const FeedbackCard = ({ question, answer, feedbackIndex, onChange }) => (
  <article>
    <h1>피드백 넘버 {feedbackIndex + 1}</h1>
    <article>
      <h2>질문</h2>
      <p>{question}</p>
    </article>
    <article>
      <h2>나의 답변</h2>
      <p>{answer}</p>
    </article>
    <article>
      <h2>피드백</h2>
      <input
        type="text"
        name={`feedback_${feedbackIndex}`}
        onChange={onChange}
      />
    </article>
  </article>
);

// FeedbackCard.propTypes = {
//   question: PropTypes.object.isRequired,
//   answer: PropTypes.func.isRequired,
//   feedbackNumber: PropTypes.func.isRequired,
//   onChange: PropTypes.func.isRequired,
// };

export default FeedbackCard;
