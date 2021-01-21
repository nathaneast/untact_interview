import React, { useState, useCallback, useEffect } from 'react';
import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
import { END } from 'redux-saga';
import axios from 'axios';
import styled from 'styled-components';

import { ButtonDefault } from '../styles/reStyled';
import AppLayout from '../components/AppLayout';
import useInput from '../hooks/useInput';
import { SIGN_UP_REQUEST, LOAD_MY_INFO_REQUEST } from '../reducers/user';
import wrapper from '../store/configureStore';

const Container = styled.div`
  background-color: white;
  box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
  margin-top: 50px;
  width: 500px;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
`;

const FormItem = styled.div`
  margin: 10px 0px;
  & label {
    color: #2d3436;
    font-size: 18px;
    font-weight: bolder;
    display: block;
  }
  & input {
    margin: 5px;
    color: #2d3436;
    padding: 5px 18px;
    border-radius: 8px;
    font-size: 17px;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  }
`;

const SignUpErrorWrapper = styled.div`
  text-align: center;
  & p {
    font-size: 16px;
    color: #e55039;
  }
`;

const ButtonWrapper = styled.div`
  text-align: center;
  margin: 10px 0px;
`;

const Button = styled(ButtonDefault)`
  background-color: #e74c3c;
  border-radius: 17px;
`;

const Signup = () => {
  const { me, signUpError } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [email, onChangeEmail] = useInput('');
  const [nickname, onChangeNickname] = useInput('');
  const [password, onChangePassword] = useInput('');
  const [passwordCheck, onChangePasswordCheck] = useInput('');
  const [signUpErrorDisplay, setSignUpErrorDisplay] = useState('');

  const handleErrorMessage = useCallback((text) => {
    setSignUpErrorDisplay(text);
    setTimeout(() => setSignUpErrorDisplay(''), 3000);
  }, [signUpErrorDisplay]);

  useEffect(() => {
    if (me && me.id) {
      Router.replace('/');
    }
  }, [me && me.id]);

  useEffect(() => {
    if (signUpError) {
      handleErrorMessage(signUpError);
    }
  }, [signUpError]);

  const onSubmit = useCallback((e) => {
    e.preventDefault();
    if (password !== passwordCheck) {
      return handleErrorMessage('두 비밀번호가 다릅니다');
    }
    console.log('서브밋 !!');
    dispatch({
      type: SIGN_UP_REQUEST,
      data: { email, nickname, password },
    });
  }, [email, nickname, password, passwordCheck]);

  return (
    <AppLayout>
      <Head>
        <title>회원가입 | untact_interview</title>
      </Head>
      <Container>
        <form onSubmit={onSubmit}>
          <FormItem>
            <label>Email</label>
            <input
              type="eamil"
              maxLength="24"
              onChange={onChangeEmail}
              // pattern="[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}"
              required
            />
          </FormItem>
          <FormItem>
            <label>nickname</label>
            <input
              type="text"
              maxLength="15"
              onChange={onChangeNickname}
              required
            />
          </FormItem>
          <FormItem>
            <label>Password</label>
            <input
              type="password"
              maxLength="12"
              onChange={onChangePassword}
              required
            />
          </FormItem>
          <FormItem>
            <label>Password Check</label>
            <input
              type="password"
              maxLength="12"
              onChange={onChangePasswordCheck}
              required
            />
          </FormItem>
          <SignUpErrorWrapper>
            <p>{signUpErrorDisplay}</p>
          </SignUpErrorWrapper>
          <ButtonWrapper>
            <Button type="submit">가입하기</Button>
          </ButtonWrapper>
        </form>
      </Container>
    </AppLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
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
});

export default Signup;
