import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

import FeedbackCard from './FeedbackCard';

const FeedbackCardList = ({ posts }) => {
  const router = useRouter();
  const onClickRedirectFeedback = useCallback((feedbackId) => {
    router.push(`/feedback/${feedbackId}`);
  });

  console.log(posts, 'FeedbackCardList posts');

  return (
    <section>
      {posts.map((post) => (
        <FeedbackCard
          key={post._id}
          feedbackId={post.feedbackPost?._id}
          feedbackDesc={post.feedbackPost?.desc}
          title={post.title}
          desc={post.desc}
          email={post.creator.email}
          star={post.star}
          onClick={onClickRedirectFeedback}
        />
      ))}
    </section>
  );
};

FeedbackCardList.propTypes = {
  posts: PropTypes.array.isRequired,
};

export default FeedbackCardList;
