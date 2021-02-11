import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import Head from 'next/head';
import styles from './styles.module.scss';

import socket, { socketEmits } from '../../../socket';
import Modal from '../../modal/Modal';
import ConfirmMessage from '../../modal/ConfirmMessage';
import useInterval from '../../../hooks/useInterval';
import Loader from '../../Loader';

const PlaySession = ({
  questions,
  saveTimeStamps,
  saveBlob,
  sessionTitle,
  moveFeedback,
}) => {
  const limitTime = 120;
  const [timer, setTimer] = useState(limitTime);
  const [isRunning, setIsRunning] = useState(true);
  const [questionIndex, setQuestionIndex] = useState(0);

  const [allSpeech, setAllSpeech] = useState(null);
  const [realtimeSpeech, setSpeechRealtime] = useState(null);
  const [isModal, setIsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const videoElement = useRef();
  const recorder = useRef();
  const recorderStream = useRef();
  const nextQuestionButton = useRef();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      videoElement.current.srcObject = recorderStream.current;
    }
  }, [recorderStream.current, videoElement.current]);

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
        recorderStream.current = stream;
        recorder.current.stream = stream;
        recorder.current.startRecording();
        socket(setSpeechRealtime, setAllSpeech, saveTimeStamps);
        socketEmits.startGoogleCloudStream();
        setIsLoading(false);
      });
  }, []);

  const endSession = useCallback(
    (isFinal) => { // 인터뷰를 끝까지 마무리 했는지 여부
      if (isFinal) {
        recorder.current.stopRecording(() => {
          saveBlob(URL.createObjectURL(recorder.current.getBlob()));
          recorder.current.stream.stop();
          recorder.current.destroy();
          recorder.current = null;
        });
        setIsRunning(false);
        socketEmits.endGoogleCloudStream(isFinal);
        moveFeedback();
      } else {
        socketEmits.endGoogleCloudStream();
        router.push('/interviews');
      }
    },
  );

  useInterval(
    () => {
      if (timer - 1 === 0) {
        if (questions.length - 1 === questionIndex) {
          endSession(true);
          return;
        }
        setQuestionIndex(questionIndex + 1);
        setTimer(limitTime);
        socketEmits.detectFirstSentence();
      } else {
        setTimer(timer - 1);
      }
    },
    isRunning ? 1000 : null,
  );

  const onClickNextQuestion = useCallback(() => {
    if (questions.length - 1 > questionIndex) {
      setQuestionIndex(questionIndex + 1);
      setTimer(limitTime);
      socketEmits.detectFirstSentence();
      nextQuestionButton.current.disabled = true;
      nextQuestionButton.current.style.backgroundColor = '#95a5a6';
      nextQuestionButton.current.style.color = '#2d3436';
      setTimeout(() => {
        nextQuestionButton.current.disabled = false;
        nextQuestionButton.current.style.backgroundColor = '#e84118';
        nextQuestionButton.current.style.color = '#FFFFF6';
      }, 4000);
    } else {
      endSession(true);
    }
  }, [questions, questionIndex]);

  return (
    <>
      <Head>
        <script src="https://www.WebRTC-Experiment.com/RecordRTC.js" />
      </Head>
      {isLoading ? (
        <Loader />
      ) : (
        <div className={styles.container}>
          <header className={styles.header}>
            <div>
              <ul className={styles.navbar}>
                <li>
                  <span>진행중인 인터뷰: {sessionTitle}</span>
                </li>
                <li>
                  <span>{`${questionIndex + 1} / ${questions.length}`}</span>
                </li>
              </ul>
            </div>
            <div className={styles.exit} onClick={() => setIsModal(true)}>
              <span>나가기</span>
            </div>
          </header>

          <div className={styles.timer}>
            <span>🕑 {timer}</span>
          </div>

          <div className={styles.question}>
            <p>Q: {questions[questionIndex]}</p>
          </div>

          <main className={styles.mainContents}>
            <article className={styles.videoWrapper}>
              <video
                ref={videoElement}
                autoPlay
                muted
                width="600px"
                height="450px"
              />
            </article>
            <article className={styles.speechBoard}>
              <div className={styles.speechBoardTitle}>
                <p>speech board</p>
              </div>
              <div>
                <p>{allSpeech}</p>
              </div>
              <div>
                <p>{realtimeSpeech}</p>
              </div>
            </article>
          </main>

          <div className={styles.buttonWrapper}>
            <button ref={nextQuestionButton} onClick={onClickNextQuestion}>
              다음 문제
            </button>
          </div>
        </div>
      )}
      {isModal && (
        <Modal onCancelModal={() => setIsModal(false)}>
          <ConfirmMessage
            message={'나가시겠습니까?'}
            onOk={() => endSession(false)}
            onCancel={() => setIsModal(false)}
          />
        </Modal>
      )}
    </>
  );
};

PlaySession.propTypes = {
  questions: PropTypes.array.isRequired,
  moveFeedback: PropTypes.func.isRequired,
  saveTimeStamps: PropTypes.func.isRequired,
  saveBlob: PropTypes.func.isRequired,
  sessionTitle: PropTypes.string.isRequired,
};

export default PlaySession;
