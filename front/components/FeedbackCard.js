import React from 'react';
import PropTypes from 'prop-types';

import PlayedSessionPostCard from './PlayedSessionPostCard';

const FeedbackCard = ({ feedbackPostId, sessionPost, onClick }) => { 
  return (
  <article>
    <article>
      <h2>피드백</h2>
      <p>desc</p>
      <button onClick={() => onClick(feedbackPostId)}>피드백 보기</button>
    </article>
    <PlayedSessionPostCard
      title={sessionPost.title}
      category={sessionPost.category.name}
      email={sessionPost.email}
      desc={sessionPost.desc}
      // star={Object.keys(sessionPost.star).length}
    />
  </article>
  );
};

FeedbackCard.propTypes = {
  feedbackPostId: PropTypes.string.isRequired,
  sessionPost: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default FeedbackCard;
