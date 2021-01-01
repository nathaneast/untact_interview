import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { END } from 'redux-saga';
import axios from 'axios';
import { useRouter } from 'next/router';

import wrapper from '../../store/configureStore';
import { LOAD_MY_INFO_REQUEST } from '../../reducers/user';
import { LOAD_POST_REQUEST } from '../../reducers/post';
import PlaySession from '../../components/PlaySession';
import Feedback from '../../components/Feedback';
import { socketEmits } from '../../socket';

// 다음 버튼 클릭시 timer 바꾸는것말고 일정하게 바뀌도록 고민
// 레코딩 화면 나올때 문제,시간 같이 나오도록
const Post = () => {
  const { singlePost } = useSelector((state) => state.post);
  const { me } = useSelector((state) => state.user);
  const router = useRouter();

  const [isEndSession, setIsEndSession] = useState(false);
  const [timeStamps, setTimeStamps] = useState([]);
  const [blob, setBlob] = useState(null);

  if (!me) {
    alert('로그인 후 이용 가능 합니다');
    return router.push('/');
  }

  const oneMoreCheckEndSTT = useCallback((e) => {
    socketEmits.endGoogleCloudStream();
  });

  useEffect(() => {
    window.addEventListener('unload', oneMoreCheckEndSTT);
    return () => {
      window.removeEventListener('unload', oneMoreCheckEndSTT);
    };
  }, []);

  return (
    <>
      {isEndSession ? (
        <Feedback
          blob={blob}
          timeStamps={timeStamps}
          title={singlePost.title}
          category={singlePost.category.name}
          email={singlePost.creator.email}
          desc={singlePost.desc}
          star={singlePost.star}
        />
      ) : (
        <PlaySession
          questions={singlePost.questions}
          setIsEndSession={setIsEndSession}
          saveTimeStamp={setTimeStamps}
          saveBlob={setBlob}
        />
      )}
    </>
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
  },
);

export default Post;
