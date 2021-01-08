import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button, Card } from 'antd';

const PostCard = ({ postId, post, onClick, mode }) => {
  // console.log(post, 'PostCard post');
  return (
  <Card
    title={post.title}
    style={{ width: 300 }}
    extra={<span>작성자: {post.creator.nickname}</span>}
  >
    <p>{post.desc}</p>
    {mode === 'feedback' ? (
      <Button onClick={() => onClick(postId)}>피드백 보기</Button>
    ) : (
      <Button onClick={() => onClick(postId)}>시작하기</Button>
    )}
  </Card>
)};

PostCard.propTypes = {
  postId: PropTypes.string.isRequired,
  post: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  mode: PropTypes.string.isRequired,
};

export default PostCard;
