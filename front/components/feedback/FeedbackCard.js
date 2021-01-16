import React from 'react';
import PropTypes from 'prop-types';

const FeedbackCard = ({
  feedbackId,
  feedbackDesc,
  title,
  desc,
  email,
  onClick,
  star,
}) => (
  <article>
    <div>
      <p>desc: {feedbackDesc}</p>
    </div>
    <article>
      <div>
        <span>title: {title}</span>
      </div>
      <div>
        <span>email: {email}</span>
      </div>
      <div>
        <span>desc: {desc}</span>
      </div>
      <div>
        <span>title: {title}</span>
      </div>
      <div>
        <span>star: {star.length}</span>
      </div>
    </article>
    <button onClick={() => onClick(feedbackId)}>피드백 보기</button>
  </article>
);

FeedbackCard.propTypes = {
  feedbackId: PropTypes.string,
  feedbackDesc: PropTypes.string,
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  star: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
};

FeedbackCard.defaultProps = {
  feedbackId: undefined,
  feedbackDesc: undefined,
};

export default FeedbackCard;
