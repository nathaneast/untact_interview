import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button, Card } from 'antd';

const PostCard = ({ post, onModal, startPost }) => {
  const onClick = useCallback(() => {
    onModal();
    startPost(post);
  });

  return (
    <Card
      title={post.title}
      style={{ width: 300 }}
      extra={<span>작성자: {post.creator.nickname}</span>}
    >
      <p>{post.desc}</p>
      <Button onClick={onClick}>시작하기</Button>
    </Card>
  );
};

PostCard.propTypes = {
  post: PropTypes.object.isRequired,
  onModal: PropTypes.func.isRequired,
  startPost: PropTypes.func.isRequired,
};

export default PostCard;
