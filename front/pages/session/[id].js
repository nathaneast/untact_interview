import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { END } from 'redux-saga';
import { useRouter } from 'next/router';
import Head from 'next/head';
import axios from 'axios';

import { LOAD_MY_INFO_REQUEST } from '../../reducers/user';
import { LOAD_SESSION_POST_REQUEST } from '../../reducers/post';
import { socketEmits } from '../../socket';
import wrapper from '../../store/configureStore';
import PlayingSession from '../../components/session/playingSession/PlayingSession';
import Feedback from '../../components/feedback/Feedback/Feedback';

const SessionPost = () => {
  const { singlePost } = useSelector((state) => state.post);
  const { me } = useSelector((state) => state.user);
  const router = useRouter();

  const [isEndSession, setIsEndSession] = useState(false);
  const [timeStamps, setTimeStamps] = useState(null);
  const [blob, setBlob] = useState(null);

  const oneMoreCheckEndSTT = useCallback(() => {
    socketEmits.endGoogleCloudStream();
  });

  useEffect(() => {
    if (!me) {
      alert('로그인 후 이용 가능 합니다');
      return router.push('/');
    }
    window.addEventListener('unload', oneMoreCheckEndSTT);
    return () => {
      window.removeEventListener('unload', oneMoreCheckEndSTT);
    };
  }, []);

  return (
    <>
      {singlePost && (
        <Head>
          <title>{singlePost.title} 인터뷰 진행</title>
          <meta name="description" content={`${singlePost.desc}`} />
          <meta property="og:title" content={`${singlePost.title}`} />
          <meta property="og:description" content={`${singlePost.desc}`} />
          <meta property="og:url" content={`http://untact-interview.site/session/${singlePost._id}`} />
        </Head>
      )}
      {singlePost && (isEndSession ? (
        timeStamps && blob && (
          <Feedback
            blob={blob}
            timeStamps={timeStamps}
            creatorId={me._id}
            sessionPostId={singlePost._id}
            questions={singlePost.questions}
          />
        )
      ) : (
        <PlayingSession
          questions={singlePost.questions}
          sessionTitle={singlePost.title}
          moveFeedback={() => setIsEndSession(true)}
          saveBlob={setBlob}
          saveTimeStamps={setTimeStamps}
        />
      ))}
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
      type: LOAD_SESSION_POST_REQUEST,
      data: context.params.id,
    });
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
  },
);

export default SessionPost;
