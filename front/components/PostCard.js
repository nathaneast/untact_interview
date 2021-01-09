import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card } from 'antd';

const PostCard = ({
  postId,
  userId,
  title,
  desc,
  email,
  star,
  onClick,
  moveUserProfile,
}) => (
  <Card
    title={title}
    style={{ width: 300 }}
    extra={
      <span onClick={() => moveUserProfile(userId)}>
        작성자: {email}
      </span>
    }
  >
    <p>{desc}</p>
    <Button onClick={() => onClick(postId)}>세션 시작</Button>
    {/* {feedbackMode ? (
      <Button onClick={() => onClick(postId)}>피드백 보기</Button>
    ) : (
      <Button onClick={() => onClick(postId)}>세션 시작</Button>
    )} */}
  </Card>
);

PostCard.propTypes = {
  postId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  star: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
  moveUserProfile: PropTypes.func.isRequired,
};

export default PostCard;
