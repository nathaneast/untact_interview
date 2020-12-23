import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'antd';
import { END } from 'redux-saga';
import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';

import useInterval from '../../hooks/useInterval';
import wrapper from '../../store/configureStore';
import { LOAD_MY_INFO_REQUEST } from '../../reducers/user';
import { LOAD_POST_REQUEST } from '../../reducers/post';
import socket, { socketEmits } from '../../socket';

// 다음 버튼 클릭시 timer 바꾸는것말고 일정하게 바뀌도록 고민
// 세션 끝날때 시간, 문제수 디테일
// 버튼 한번 클릭후 3초 동안 클릭 못하도록
// 레코딩 화면 나올때 문제,시간 같이 나오도록
const PlayPost = () => {
  const { singlePost } = useSelector((state) => state.post);
  const { me } = useSelector((state) => state.user);

  const [timer, setTimer] = useState(10);
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [saveSpeech, setSaveSpeech] = useState(true);
  const [speech, setSpeech] = useState(true);

  const videoElement = useRef();
  const recorder = useRef();
  const router = useRouter();

  if (!me) {
    alert('로그인 후 이용 가능 합니다');
    return router.push('/');
  }

  const intervalLogic = useCallback(() => {
    setTimer(timer - 1);
  });

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        const sendRecord = new Promise((resolve) => {
          recorder.current = RecordRTC(stream, {
            type: 'video',
          });
          resolve();
        });
        sendRecord.then(() => {
          console.log('영상 나옴');
          setInterval(intervalLogic, 1000);
          // 문제 타임워치, 소켓
        });

        videoElement.current.srcObject = stream;
        recorder.current.stream = stream;
        recorder.current.startRecording();

        // socket(setSpeech, setSaveSpeech);
        // socketEmits.startGoogleCloudStream();
      });
  }, []);

  // useEffect(() => {
  //   navigator.mediaDevices
  //     .getUserMedia({
  //       video: true,
  //       audio: true,
  //     })
  //     .then(async (stream) => {
  //       recorder.current = RecordRTC(stream, {
  //         type: 'video',
  //       });
  //       videoElement.current.srcObject = stream;
  //       recorder.current.startRecording();
  //       recorder.current.stream = stream;

  //       // socket(setSpeech, setSaveSpeech);
  //       // socketEmits.startGoogleCloudStream();
  //     });
  // }, []);

  // useInterval(
  //   () => {
  //     if (singlePost.questions.length - 1 < count) {
  //       recorder.current.stopRecording(() => {
  //         videoElement.current.controls = true;
  //         videoElement.current.autoPlay = false;
  //         videoElement.current.muted = true;
  //         videoElement.current.srcObject = null;
  //         // videoElement.current.src = null;
  //         // videoElement.current.src = videoElement.current.srcObject = null;
  //         videoElement.current.src = URL.createObjectURL(
  //           recorder.current.getBlob(),
  //         );
  //         recorder.current.stream.stop();
  //         recorder.current.destroy();
  //         recorder.current = null;
  //       });
  //       setIsRunning(false);
  //       // 세션 끝 소켓
  //       return alert('세션 끝');
  //     }
  //     setTimer(timer - 1);
  //     if (timer - 1 === 0) {
  //       setTimer(10);
  //       setCount(count + 1);
  //     }
  //   },
  //   isRunning ? 1000 : null,
  // );

  const onClick = useCallback(() => {
    setTimer(10);
    setCount(count + 1);
    // 다음문제 소켓
  });

  return (
    <>
      <div>
        <Head>
          <meta charSet="utf-8" />
          <title>세션진행 | Untact_Interview </title>
          <script src="https://www.WebRTC-Experiment.com/RecordRTC.js" />
        </Head>
        {singlePost && (
          <section>
            <div>제한시간: {timer}</div>
            <div>{singlePost.questions[count]}</div>
            <video ref={videoElement} autoPlay muted width="500px" height="500px" />
            <div>{`${count + 1} / ${singlePost.questions.length}`}</div>
            <article>
              <div>
                <h2>스피치 저장</h2>
                <p>{saveSpeech}</p>
              </div>
              <div>
                <h2>스피치 리얼타임</h2>
                <p>{speech}</p>
              </div>
            </article>
            <Button onClick={onClick}>다음 문제</Button>
          </section>
        )}
      </div>
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

export default PlayPost;
