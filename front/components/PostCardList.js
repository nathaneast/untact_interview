import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';

import { ON_STAR_POST_REQUEST } from '../reducers/post';
import StartPostModal from './modal/StartPostModal';
import PostCard from './PostCard';
import FeedbackCard from './FeedbackCard';

const PostCardList = ({ posts, me, isFeedbackPost }) => {
  const [modal, setModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();

  const onClickStartPost = useCallback((postId) => {
    setModal(true);
    setSelectedPostId(postId);
  });

  const onClickRedirectFeedback = useCallback((feedbackPostId) => {
    router.push(`/feedbackPost/${feedbackPostId}`);
  });

  const onClickRedirectUser = useCallback((userId) => {
    router.push(`/user/${userId}`);
  });

  const onStarHandler = useCallback((postId) => {
    dispatch({
      type: ON_STAR_POST_REQUEST,
      data: {
        userId: me?._id,
        postId,
      },
    });
  }, [me]);

  const isStarUser = useCallback((staredUsers) => {
    if (!me) {
      return false;
    }
    return staredUsers.some((user) => user === me._id);
  });

  // console.log(posts, me, isFeedbackPost, '포스트카드리스트 posts, me, isFeedbackPost')

  return (
    <>
      <section>
        {posts.map((post) => {
          // console.log(post, 'postCardList posts map');
          return isFeedbackPost ? (
            <FeedbackCard
              key={post._id}
              feedbackPostId={post._id}
              sessionPost={post.sessionPost}
              onClick={onClickRedirectFeedback}
            />
          ) : (
              <PostCard
                key={post._id}
                postId={post._id}
                userId={post.creator._id}
                isLogin={me ? true : false}
                title={post.title}
                desc={post.desc}
                email={post.creator.email}
                star={post.star}
                onClick={onClickStartPost}
                moveUserProfile={onClickRedirectUser}
                isStarUser={isStarUser}
                onStarHandler={onStarHandler}
              />
          );
        })}
      </section>
      {modal && (
        <StartPostModal
          postId={selectedPostId}
          isLogin={Boolean(me)}
          resetPost={() => setSelectedPostId('')}
          modal={modal}
          onModal={() => setModal(false)}
        />
      )}
    </>
  );
};

PostCardList.propTypes = {
  // me: PropTypes.oneOfType([
  //   PropTypes.object.isRequired,
  //   PropTypes.instanceOf(null),
  //   // PropTypes.oneOf([null]).isRequired,
  // ]).isRequired,
  me: PropTypes.object,
  posts: PropTypes.array.isRequired,
  isFeedbackPost: PropTypes.bool.isRequired,
};

PostCardList.defaultProps = {
  me: null,
};

export default PostCardList;

// return (
//   feedbackMode ? (
//     <PostCard
//       key={post._id}
//       toMovePostId={post._id}
//       userId={post.sessionPost.creator._id}
//       title={post.sessionPost.title}
//       desc={post.sessionPost.desc}
//       star={post.sessionPost.star}
//       email={post.sessionPost.creator.email}
//       onClick={onClickRedirectFeedback}
//       feedbackMode={feedbackMode}
//       moveUserProfile={onClickRedirectUser}
//     />
//   ) : (
//     <PostCard
//       key={post._id}
//       toMovePostId={post._id}
//       userId={post.creator._id}
//       title={post.title}
//       desc={post.desc}
//       email={post.creator.email}
//       star={post.star}
//       onClick={onClickStartPost}
//       feedbackMode={feedbackMode}
//       moveUserProfile={onClickRedirectUser}
//     />
//   )
// );