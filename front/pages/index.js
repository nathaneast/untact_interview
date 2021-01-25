import React from 'react';
import { END } from 'redux-saga';
import axios from 'axios';
import styled from 'styled-components';

import { ButtonDefault } from '../styles/reStyled';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import AppLayout from '../components/AppLayout';
import wrapper from '../store/configureStore';

const Container = styled.div`
  background-color: #2f3640;
  width: 100%;
  height: 100%;
`;

const IntroContents = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const Title = styled.div`
  margin-top: 25px;
  & h1 {
    font-size: 50px;
    color: #FFFFF6;
  }
`;

const IntroMessage = styled.div`
  text-align: center;
  margin: 20px 0px;
  p {
    color: #FFFFF6;
    font-weight: bolder;
    font-size: 18px;
  }
`;

const ButtonWrapper = styled.div`
  text-align: center;
  border-radius: 10px;
`;

const Button = styled(ButtonDefault)`
  background-color: #e55039;
  border-radius: 15px;
  padding: 8px 40px;
  & a {
    color: #fffff6;
    text-decoration: none;
  }
`;

const ManualBoard = styled.main`
  display: grid;
  grid-template-columns: repeat(2,600px);
  margin: 18px 0px;
  justify-content: center;
`;

const ManualItem = styled.div`
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 18px 0px;
  & div {
    background: green;
    color: #FFFFF6;
    width: 550px;
    height: 400px;
    border-radius: 15px;
  }
  & p {
    color: black;
    text-align: center;
    margin-top: 12px;
    color: #FFFFF6;
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
          <p>인터뷰를 진행하고 <br /> 셀프 피드백을 해보세요 <br />당신의 성장을 응원합니다 😉👍</p>
        </IntroMessage>

        <ButtonWrapper>
          <Button>
            <a href="/interviews">
              <span>시작하기</span>
            </a>
          </Button>
        </ButtonWrapper>
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
