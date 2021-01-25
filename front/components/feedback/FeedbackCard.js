import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { ButtonDefault } from '../../styles/reStyled';

const Container = styled.article`
  width: 400px;
  height: auto;
  background-color: white;
  border: 1px solid #dcdde1;
  border-radius: 4px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
`;

const FeedbackDescCard = styled.div`
  color: black;
  font-size: 17px;
  font-weight: bolder;
  margin: 5px 3px;
  padding: 10px;
  border-radius: 5px;
  border: #95a5a6;
  & span {
    padding-left: 12px;
  }
`;

const SessionInfoCard = styled.div`
  display: flex;
  flex-direction: column;
  margin: 3px;
  border-radius: 5px;
  padding: 10px;
  & ul {
    list-style: none;
    padding: 0px;
    margin: 7px;
    padding-left: 13px;
    & li {
      color: #353b48;
    }
  }
`;

const ButtonWrapper = styled.div`
  margin: 8px 0px;
  text-align: center;
`;

const Button = styled(ButtonDefault)`
`;

const FeedbackCard = ({ feedbackPostId, feedbackDesc, sessionPost, onClick }) => (
  <Container>
    <FeedbackDescCard>
      <span>desc: {feedbackDesc}</span>
    </FeedbackDescCard>

    <SessionInfoCard>
      <ul>
        <li>
          <span>title: {sessionPost.title}</span>
        </li>
        <li>
          <span>creator: {sessionPost.creator.email}</span>
        </li>
        <li>
          <span>category: {sessionPost.category.name}</span>
        </li>
        <li>
          <span>desc: {sessionPost.desc}</span>
        </li>
        <li>
          <span>star {sessionPost.star.length}</span>
        </li>
      </ul>
    </SessionInfoCard>

    <ButtonWrapper>
      <Button onClick={() => onClick(feedbackPostId)}>피드백 보기</Button>
    </ButtonWrapper>
  </Container>
);

FeedbackCard.propTypes = {
  feedbackPostId: PropTypes.string.isRequired,
  feedbackDesc: PropTypes.string.isRequired,
  sessionPost: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default FeedbackCard;
