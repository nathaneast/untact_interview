import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import FeedbackCard from './FeedbackCard';

const Container = styled.section`
  display: grid;
  grid-gap: 15px;
  grid-template-columns: repeat(2, 1fr);
  margin-bottom: 25px;
`;

const FeedbackCardList = ({ posts }) => {
  const router = useRouter();
  const onClickRedirectFeedback = useCallback((feedbackId) => {
    router.push(`/feedback/${feedbackId}`);
  });

  return (
    <Container>
      {posts.map((post) => (
        <FeedbackCard
          key={post._id}
          feedbackPostId={post._id}
          feedbackDesc={post.desc}
          sessionPost={post.sessionPost}
          onClick={onClickRedirectFeedback}
        />
      ))}
    </Container>
  );
};

FeedbackCardList.propTypes = {
  posts: PropTypes.array.isRequired,
};

export default FeedbackCardList;
