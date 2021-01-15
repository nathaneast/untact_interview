import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

import FeedbackCard from './FeedbackCard';

const FeedbackCardList = ({ posts }) => {
  const router = useRouter();
  const onClickRedirectFeedback = useCallback((feedbackPostId) => {
    router.push(`/feedback/${feedbackPostId}`);
  });

  console.log(posts, 'FeedbackCardList posts');

  return (
    <section>
      {posts.map((post) => (
        <FeedbackCard
          key={post._id}
          feedbackPostId={post._id}
          sessionPost={post.sessionPost}
          desc={post.desc}
          onClick={onClickRedirectFeedback}
        />
      ))}
      ;
    </section>
  );
};

FeedbackCardList.propTypes = {
  posts: PropTypes.array.isRequired,
};

export default FeedbackCardList;
