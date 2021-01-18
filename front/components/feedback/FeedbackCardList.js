import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import FeedbackCard from './FeedbackCard';

const Container = styled.section`
  display: grid;
  grid-gap: 15px;
  grid-template-columns: repeat(2, 1fr);
`;

const FeedbackCardList = ({ posts }) => {
  const router = useRouter();
  const onClickRedirectFeedback = useCallback((feedbackId) => {
    router.push(`/feedback/${feedbackId}`);
  });

  console.log(posts, 'FeedbackCardList posts');

  return (
    <Container>
      {posts.map((post) => (
        <FeedbackCard
          key={post._id}
<<<<<<< HEAD
          feedbackPostId={post._id}
          feedbackDesc={post.desc}
          sessionPost={post.sessionPost}
          onClick={onClickRedirectFeedback}
        />
      ))}
    </Container>
=======
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
>>>>>>> 552f14c4e13fe7e1ddc40ffc2229743407719d84
  );
};

FeedbackCardList.propTypes = {
  posts: PropTypes.array.isRequired,
};

export default FeedbackCardList;
