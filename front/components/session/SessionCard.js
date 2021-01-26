import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ButtonDefault } from '../../styles/reStyled';

const Container = styled.article`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 400px;
  height: 240px;
  border: 2px solid #34495e;
  border-radius: 30px;
  background-color: white;
  box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
  cursor: default;
`;

const PostInfo = styled.article`
  display: flex;
  justify-content: space-around;
  padding: 10px;
`;

const PostTitleWrapper = styled.article`
  width: 70%;
`;

const PostTitle = styled.div`
  border-bottom: 2px solid black;
  width: 200px;
  padding: 0px 10px;
  & p {
    font-size: 20px;
    font-weight: bolder;
    margin: 5px 0px;
  }
`;

const PostDesc = styled.div`
  padding: 7px;
  color: #34495e;
  & p {
    margin: 0px
  }
`;

const PostDetail = styled.div`
  color: #34495e;
  width: 30%;
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

const Button = styled(ButtonDefault)``;

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
  <Container>
    <PostInfo>
      <PostTitleWrapper>
        <PostTitle>
          <p>{title}</p>
        </PostTitle>
        <PostDesc>
          <p>{desc}</p>
        </PostDesc>
      </PostTitleWrapper>
      <PostDetail>
        <Creator onClick={() => moveUserProfile(userId)}>
          <span>{email}</span>
        </Creator>
        <Star onClick={() => onStarHandler(postId)}>
          <span>{isStarUser(star) ? '⭐' : '☆'}</span>
          <span> {star.length}</span>
        </Star>
      </PostDetail>
    </PostInfo>
    <ButtonWrapper>
      <Button onClick={() => onClick(postId)}>인터뷰 시작</Button>
    </ButtonWrapper>
  </Container>
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
