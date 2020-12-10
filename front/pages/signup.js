import React, { useCallback, useEffect } from 'react';
import Head from 'next/head';
import { Input, Form, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
import { END } from 'redux-saga';
import axios from 'axios';

import AppLayout from '../components/AppLayout';
import useInput from '../hooks/useInput';
import { SIGN_UP_REQUEST, LOAD_MY_INFO_REQUEST } from '../reducers/user';
import wrapper from '../store/configureStore';

// 비밀번호 체크 alert 처리x 디테일
const Signup = () => {
  const [email, onChangeEmail] = useInput('');
  const [nickname, onChangeNickname] = useInput('');
  const [password, onChangePassword] = useInput('');
  const [passwordCheck, onChangePasswordCheck] = useInput('');

  const { me, signUpError } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (me && me.id) {
      Router.replace('/');
    }
  }, [me && me.id]);

  useEffect(() => {
    if (signUpError) {
      alert(signUpError);
    }
  }, [signUpError]);

  const onSubmit = useCallback(() => {
    if (password !== passwordCheck) {
      return alert('두 비밀번호가 다릅니다');
    }
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
      <Form onFinish={onSubmit}>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: 'email을 입력 해주세요',
            },
          ]}
        >
          <Input value={email} onChange={onChangeEmail} />
        </Form.Item>
        <Form.Item
          label="Nickname"
          name="nickname"
          rules={[
            {
              required: true,
              message: 'nickname을 입력 해주세요',
            },
          ]}
        >
          <Input value={nickname} onChange={onChangeNickname} />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: 'password를 입력 해주세요',
            },
          ]}
        >
          <Input.Password value={password} onChange={onChangePassword} />
        </Form.Item>
        <Form.Item
          label="PasswordCheck"
          name="passwordCheck"
          rules={[
            {
              required: true,
              message: '비밀번호를 한번 더 입력 해주세요',
            },
          ]}
        >
          <Input.Password
            value={passwordCheck}
            onChange={onChangePasswordCheck}
          />
        </Form.Item>
        {password !== passwordCheck ? (
          <div style={{ color: 'red' }}>두 비밀번호가 다릅니다.</div>
        ) : null}
        <Button type="primary" htmlType="submit">
          가입하기
        </Button>
      </Form>
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
