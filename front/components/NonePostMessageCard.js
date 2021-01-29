import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 100px 0px;
  & span {
    font-size: 20px;
    color: #2c3a47;
  }
`;

const NonePostMessageCard = () => (
  <Container>
    <span>해당 카테고리의 글이 없습니다. 😅</span>
  </Container>
);

export default NonePostMessageCard;
