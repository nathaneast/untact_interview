import React from 'react';
import { END } from 'redux-saga';
import axios from 'axios';
import styled from 'styled-components';

import { ButtonDefault } from '../styles/reStyled';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import AppLayout from '../components/AppLayout';
import wrapper from '../store/configureStore';

const Container = styled.div`
  margin: 50px 0px 20px 0px;
`;

const IntroContents = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const Title = styled.div`
  & h1 {
    font-size: 40px;
    color: #222f3e;
  }
`;

const IntroMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 50px 0px;
`;

const Message = styled.p`
  color: #222f3e;
  font-weight: bolder;
  font-size: 18px;
`;

const ButtonWrapper = styled.div`
  text-align: center;
  margin: 10px;
  border-radius: 10px;
`;

const Button = styled(ButtonDefault)`
& a {
  color: #fffff6;
  text-decoration: none;
}
`;

const OutroMessage = styled.div`
  margin: 15px 0px;
`;

const ManualBoard = styled.main`
  display: grid;
  grid-gap: 60px;
  grid-template-columns: repeat(2, 1fr);
  margin: 20px 0px;
  & div {
    width: 550px;
    height: 400px;
    background-color: green;
    border-radius: 15px;
  }
`;

const ManualItem = styled.div`
  & div {
    color: black;
    width: 550px;
    height: 400px;
    background-color: green;
    border-radius: 15px;
  }
  p {
    color: black;
    text-align: center;
  }
`;

const Home = () => (
  <AppLayout>
    <Container>
      <IntroContents>
        <Title>
          <h1>Untact Interview</h1>
        </Title>

        <IntroMessage>
          <Message>
            인터뷰를 진행하고 <br /> 피드백을 통해 <br /> 부족한 점을 보완해가며{' '}
            <br /> 성장하세요
          </Message>
        </IntroMessage>

        <ButtonWrapper>
          <Button>
            <a href="/interviews">
              <span>시작하기</span>
            </a>
          </Button>
        </ButtonWrapper>

        <OutroMessage>
          <Message>당신의 성장을 응원합니다 😉👍</Message>
        </OutroMessage>
      </IntroContents>

      <ManualBoard>
        <ManualItem>
          <div>이미지 1</div>
          <p>설명 1</p>
        </ManualItem>
        <ManualItem>
          <div>이미지 2</div>
          <p>설명 2</p>
        </ManualItem>
        <ManualItem>
          <div>이미지 3</div>
          <p>설명 3</p>
        </ManualItem>
        <ManualItem>
          <div>이미지 4</div>
          <p>설명 4</p>
        </ManualItem>
      </ManualBoard>
    </Container>
  </AppLayout>
);

export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    const cookie = context.req ? context.req.headers.cookie : '';
    axios.defaults.headers.Cookie = '';
    if (context.req && cookie) {
      axios.defaults.headers.Cookie = cookie;
    }
    context.store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
  },
);

export default Home;
