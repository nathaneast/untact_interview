import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const PostCard = styled.article`
  width: 360px;
  height: 200px;
  border: 2px solid #34495e;
  border-radius: 30px;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  & :hover {
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
    cursor: default;
  }
`;

const PostInfo = styled.article`
  display: flex;
  justify-content: space-between;
  padding: 10px;
`;

const PostTitleWrapper = styled.article`
  padding: 8px 7px;
`;

const PostTitle = styled.div`
  border-bottom: 2px solid black;
  width: 200px;
  padding: 0px 10px;
  & h1 {
    font-size: 20px;
    font-weight: bolder;
  }
`;

const PostDesc = styled.div`
  padding: 5px 10px;
  color: #34495e;
  & p {
    margin: 0px
  }
`;

const PostDetail = styled.div`
  padding: 9px;
  color: #34495e;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding:10px 0px;
`;

const Creator = styled.div`
  font-weight: bolder;
  cursor: pointer;
  & :hover {
    background-color: #34495e;
    color: #FFFFF6;
    border-radius: 5px;
    padding: 1px;
  } 
`;

const Star = styled.div`
  cursor: pointer;
  & :hover {
    & span {
      font-size: 18px;
    }
  }
`;

const Button = styled.button`
  border-radius: 4px;
  padding: 6px 50px;
  color: #fffff6;
  background-color: #34495e;
  font-size: 15px;
  font-weight: bolder;
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
  <PostCard>
    <PostInfo>
      <PostTitleWrapper>
        <PostTitle>
          <h1>{title}</h1>
        </PostTitle>
        <PostDesc>
          <p>{desc}</p>
        </PostDesc>
      </PostTitleWrapper>
      <PostDetail>
        <Creator>
          <span onClick={() => moveUserProfile(userId)}>글쓴이: {email}</span>
        </Creator>
        <Star>
          <span onClick={() => onStarHandler(postId)}>{isStarUser(star) ? '⭐' : '☆'}</span>
        <span>{' '}{star.length}</span>
        </Star>
      </PostDetail>
    </PostInfo>
    <ButtonWrapper>
      <Button onClick={() => onClick(postId)}>진행하기</Button>
    </ButtonWrapper>
  </PostCard>
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
