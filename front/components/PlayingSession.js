import React, { useState, useCallback, useEffect, useRef } from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';

import useInterval from '../hooks/useInterval';
import socket, { socketEmits } from '../socket';

// question 비동기프랍 검사
// 로딩 추가
// 세션 끝 => 모달 추가
// 영상 저장을 버튼으로 하는 방법 연구
const PlaySession = ({
  questions,
  setIsEndSession,
  saveTimeStamp,
  saveBlob,
  sessionTitle,
}) => {
  const [limitTime, setLimitTime] = useState(30);
  const [timer, setTimer] = useState(limitTime);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  const [saveSpeech, setSaveSpeech] = useState(null);
  const [speech, setSpeech] = useState(null);

  const videoElement = useRef();
  const recorder = useRef();
  const nextQuestionButton = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then(async (stream) => {
        recorder.current = RecordRTC(await stream, {
          type: 'video',
          timeSlice: 1000,
        });
        videoElement.current.srcObject = stream;
        recorder.current.stream = stream;
        recorder.current.startRecording();

        socket(setSpeech, setSaveSpeech, saveTimeStamp);
        socketEmits.startGoogleCloudStream();
      });
  }, []);

  const endSession = useCallback(() => {
    recorder.current.stopRecording(() => {
      // videoElement.current.srcObject = null;
      saveBlob(URL.createObjectURL(recorder.current.getBlob()));
      const isConfirm = confirm('영상을 저장 하시겠습니까?');
      if (isConfirm) {
        invokeSaveAsDialog(recorder.current.getBlob(), `${sessionTitle}_${new Date().valueOf()}.webm`);
      }
      recorder.current.stream.stop();
      recorder.current.destroy();
      recorder.current = null;
    });
    setIsRunning(false);
    socketEmits.endGoogleCloudStream('final');
    setIsEndSession(true);
    alert('세션 끝');
  }, [sessionTitle]);

  const onClick = useCallback(() => {
    console.log('버튼 클릭 다음문제');
    if (questions.length - 1 > questionIndex) {
      setQuestionIndex(questionIndex + 1);
      setTimer(limitTime);
      socketEmits.detectFirstSentence();
    } else {
      endSession();
    }
    // nextQuestionButton.current.disabled = true;
    // setTimeout(() => {
    //   nextQuestionButton.current.disabled = false;
    // }, 4000);
  }, [questions, questionIndex, limitTime]);

  useInterval(
    () => {
      if (timer - 1 === 0 && questions.length - 1 === questionIndex) {
        endSession();
        return;
      }
      if (timer - 1 === 0) {
        console.log('다음문제');
        setQuestionIndex(questionIndex + 1);
        setTimer(limitTime); // 타이머 취소하고 변경
        socketEmits.detectFirstSentence();
      } else {
        setTimer(timer - 1);
      }
    },
    isRunning ? 1000 : null,
  );

  // console.log(questions, sessionTitle, 'PlaySession');

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>세션진행 | Untact_Interview </title>
        <script src="https://www.WebRTC-Experiment.com/RecordRTC.js" />
      </Head>
      {questions && (
        <article>
          <div>제한시간: {timer}</div>
          <div>{questions[questionIndex]}</div>
          <video
            ref={videoElement}
            autoPlay
            muted
            width="500px"
            height="500px"
          />
          <div>{`${questionIndex + 1} / ${questions.length}`}</div>
          <section>
            <article>
              <h2>스피치 저장</h2>
              <p>{saveSpeech}</p>
            </article>
            <article>
              <h2>스피치 리얼타임</h2>
              <p>{speech}</p>
            </article>
          </section>
          <button onClick={onClick} ref={nextQuestionButton}>
            다음 문제
          </button>
        </article>
      )}
    </>
  );
};

PlaySession.propTypes = {
  questions: PropTypes.array.isRequired,
  setIsEndSession: PropTypes.func.isRequired,
  saveTimeStamp: PropTypes.func.isRequired,
  saveBlob: PropTypes.func.isRequired,
  sessionTitle: PropTypes.string.isRequired,
};

export default PlaySession;