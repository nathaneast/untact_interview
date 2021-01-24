import React from 'react';
import styled from 'styled-components';

const Container = styled.article`
  width: 100%;
  height: 100%;
`;

const Contents = styled.div`
  padding: 150px 0px;
  text-align: center;
  & h1 {
    font-size: 25px;
    font-weight: bolder;
  }
`;

const Loader = () => (
  <Container>
    <Contents>
      <h1>로딩중 입니다.. 👧👦</h1>
    </Contents>
  </Container>
);

export default Loader;
