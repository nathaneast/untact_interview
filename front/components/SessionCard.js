import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const MenuItem = styled.li`
  font-size: 17px;
  font-weight: bolder;
  color: #34495e;
  cursor: pointer;
`;

const SessionCard = ({
  postId,
  userId,
  title,
  desc,
  email,
  star,
  onClick,
  moveUserProfile,
  isStarUser,
  onStarHandler,
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
    <div onClick={() => onStarHandler(postId)}>
      <span>{isStarUser(star) ? '★' : '☆'}</span>
      <span>{ star.length}</span>
    </div>
    <Button onClick={() => onClick(postId)}>세션 시작</Button>
  </Card>
);

SessionCard.propTypes = {
  postId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  star: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
  moveUserProfile: PropTypes.func.isRequired,
  isStarUser: PropTypes.func.isRequired,
  onStarHandler: PropTypes.func.isRequired,
};

export default SessionCard;
