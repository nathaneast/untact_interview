import React from 'react';
import { END } from 'redux-saga';
import axios from 'axios';
import styled from 'styled-components';

import { ButtonDefault } from '../styles/reStyled';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import AppLayout from '../components/AppLayout';
import wrapper from '../store/configureStore';

const Container = styled.div`
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
    color: #2d3436;
  }
`;

const IntroMessage = styled.div`
  text-align: center;
  margin: 20px 0px;
  p {
    color: #2d3436;
    font-weight: bolder;
    font-size: 18px;
  }
`;

const ButtonWrapper = styled.div`
  text-align: center;
  border-radius: 10px;
  & a {
    color: #2d3436;
    text-decoration: none;
    padding: 10px 0px;
  }
`;

const Button = styled(ButtonDefault)`
  background-color: #e55039;
  border-radius: 15px;
  padding: 8px 40px;
  & span {
    color: #2d3436;
  }
`;

const ManualBoard = styled.main`
  display: grid;
  grid-template-columns: repeat(2,570px);
  margin: 18px 0px;
  justify-content: center;
  grid-gap: 0px 25px;
`;

const ManualItem = styled.div`
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 18px 0px;
  width: 570px;
  display: flex;
  background-color: #636e72;
  box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
  & img {
    padding: 10px;
  }
  & div {
    padding-bottom: 10px;
    & p {
      text-align: center;
      margin: 0px;
      color: #FFFFF6;
    }
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
          <p>
            인터뷰를 진행하고 <br /> 셀프 피드백을 해보세요 <br />
            당신의 성장을 응원합니다 😉👍
          </p>
        </IntroMessage>
        <ButtonWrapper>
          <a href="/interviews">
            <Button>
              <span>시작하기</span>
            </Button>
          </a>
        </ButtonWrapper>
      </IntroContents>
      <ManualBoard>
        <ManualItem>
          <img src="/img1.png" width="550px" height="400px" alt="manualImage1" />
          <div>
            <p>1. 회원가입 로그인 후에 <b>'시작하기'</b>를 눌러 주세요</p>
          </div>
        </ManualItem>
        <ManualItem>
          <img src="/img2.png" width="550px" height="400px" alt="manualImage2" />
          <div>
            <p>2. 진행할 인터뷰 카드의 <b>'인터뷰 시작'</b>을 눌러 주세요</p>
          </div>
        </ManualItem>
        <ManualItem>
          <img src="/img3.png" width="550px" height="400px" alt="manualImage3" />
          <div>
            <p>3. 질문에 대한 답을 하면서 인터뷰를 진행합니다</p>
          </div>
        </ManualItem>
        <ManualItem>
          <img src="/img4.png" width="550px" height="400px" alt="manualImage4" />
          <div>
            <p>4. 인터뷰가 끝이 나면 영상과 기록된 내 답변을 토대로 <br />
              피드백을 작성해 보세요 :)</p>
          </div>
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
