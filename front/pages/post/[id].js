import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'antd';
import { END } from 'redux-saga';
import axios from 'axios';

import AppLayout from '../../components/AppLayout';
import useInterval from '../../hooks/useInterval';
import wrapper from '../../store/configureStore';
import { LOAD_MY_INFO_REQUEST } from '../../reducers/user';
import { LOAD_POST_REQUEST } from '../../reducers/post';

// 세션 끝날때 시간, 문제수 디테일
// 버튼 한번 클릭후 3초 동안 클릭 못하도록
// 다음 버튼 클릭시 timer 바꾸는것말고 일정하게 바뀌도록 고민
const PlayPost = () => {
  const { singlePost } = useSelector((state) => state.post);
  const [timer, setTimer] = useState(5);
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  useInterval(
    () => {
      if (singlePost.questions.length - 1 < count) {
        setIsRunning(false);
        return alert('세션 끝');
      }
      setTimer(timer - 1);
      if (timer - 1 === 0) {
        setTimer(5);
        setCount(count + 1);
      }
    },
    isRunning ? 1000 : null
  );

  const onClick = useCallback(() => {
    setTimer(5);
    setCount(count + 1);
  });

  return (
    <AppLayout>
      <div>제한시간: {timer}</div>
      <div>{singlePost.questions[count]}</div>
      <div>실시간 비디오</div>
      <div>{`${count + 1} / ${singlePost.questions.length}`}</div>
      <Button onClick={onClick}>다음 문제</Button>
    </AppLayout>
  );
};

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
    context.store.dispatch({
      type: LOAD_POST_REQUEST,
      data: context.params.id,
    });
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
  }
);

export default PlayPost;
