import React from 'react';
import PropTypes from 'prop-types';

import PlayedSessionCard from './PlayedSessionCard';

const FeedbackCard = ({ feedbackPostId, sessionPost, onClick }) => {
  console.log(feedbackPostId, sessionPost, 'FeedbackCard');

  return (
    <article>
      <h2>피드백</h2>
      <p>desc</p>
      <PlayedSessionCard
        title={sessionPost.title}
        category={sessionPost.category.name}
        email={sessionPost.creator.email}
        desc={sessionPost.desc}
        star={sessionPost.star.length}
      />
      <button onClick={() => onClick(feedbackPostId)}>피드백 보기</button>
    </article>
  );
};

FeedbackCard.propTypes = {
  feedbackPostId: PropTypes.string.isRequired,
  sessionPost: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default FeedbackCard;
