import React, { useCallback, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import Head from 'next/head';

import {
  MainContents,
  VideoBoard,
  VideoDownload,
  VideoDownloadButton,
  // TimeStampBoard,
  FeedbackDesc,
  FeedbackFormBoard,
  ButtonWrapper,
  SubmitButton,
} from './styles';
import { UPLOAD_FEEDBACK_POST_REQUEST } from '../../../reducers/post';
import useInput from '../../../hooks/useInput';
import FeedbackFormCard from '../FeedbackFormCard';
import Modal from '../../modal/Modal';
import GuideMessage from '../../modal/GuideMessage';
import AppLayout from '../../AppLayout';
import TimeStampList from '../../TimeStampList';

// 모든 피드백 입력 되었는지 폼 검사 로직 추가
const Feedback = ({
  sessionPostId,
  creatorId,
  questions,
  blob,
  timeStamps,
  // title,
  // category,
  // email,
  // desc,
  // star,
}) => {
  const dispatch = useDispatch();
  const [feedbackform, setFeedbackValues] = useState({});
  const [feedbackDesc, onChangeFeedbackDesc, setFeedbackDesc] = useInput('');

  const [isModal, setIsModal] = useState(true);
  const [isFinishedFeedback, setIsFinishedFeedback] = useState(false);
  const videoElement = useRef();
  const router = useRouter();

  const onChange = (e) => {
    setFeedbackValues({
      ...feedbackform,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = useCallback(() => {
    const feedbackformKeys = Object.keys(feedbackform);
    const isAllFeedbacks =
      feedbackformKeys.length === 5 &&
      feedbackformKeys.every((key) => true === Boolean(feedbackform[key]));
    if (isAllFeedbacks && feedbackDesc) {
      dispatch({
        type: UPLOAD_FEEDBACK_POST_REQUEST,
        data: {
          creatorId,
          sessionPostId,
          timeStamps,
          feedbacks: feedbackformKeys.map((key) => feedbackform[key]),
          feedbackDesc,
        },
      });
      setIsModal(true);
      setIsFinishedFeedback(true);
    } else {
      alert('피드백 설명과 각 피드백을 모두 입력 해주세요');
    }
  }, [feedbackform, feedbackDesc, timeStamps]);

  // const moveVideoTime = useCallback(
  //   (time) => {
  //     if (!time) {
  //       alert('답변한 질문이 아닙니다.');
  //       return;
  //     }
  //     videoElement.current.currentTime = time;
  //   },
  //   [videoElement.current]
  // );

  const onRedirectInterviews = useCallback(() => {
    router.push('/interviews');
  });

  console.log(feedbackDesc, 'Feedback feedbackDesc');

  return (
    <>
      <Head>
        <title>피드백 작성 | Untact_Interview </title>
      </Head>
      <AppLayout>
        <MainContents>
          <VideoBoard>
            <video
              controls
              autoPlay
              ref={videoElement}
              src={blob}
              width="600px"
              height="450px"
            />
            <VideoDownload>
              <VideoDownloadButton>
                <a href={blob} target="_blank" rel="noopener">
                  영상 다운받기
                </a>
              </VideoDownloadButton>
            </VideoDownload>
          </VideoBoard>
          <TimeStampList
            timeStamps={timeStamps}
            targetVideo={videoElement.current}
          />
          {/* <TimeStampBoard>
            {timeStamps.map((item, index) => (
              <TimeStampCard
                key={index}
                text={item.text}
                time={item.time}
                answerNumber={index + 1}
                onClick={moveVideoTime}
              />
            ))}
          </TimeStampBoard> */}
        </MainContents>

        <FeedbackDesc>
          <span>피드백 설명: </span>
          <textarea rows="2" cols="70" onChange={onChangeFeedbackDesc} />
        </FeedbackDesc>

        <FeedbackFormBoard>
          {questions.map((item, index) => (
            <FeedbackFormCard
              key={index}
              question={item}
              answer={timeStamps[index].text}
              FeedbackNumber={index + 1}
              onChange={onChange}
              writeMode={true}
            />
          ))}
        </FeedbackFormBoard>

        <ButtonWrapper>
          <SubmitButton onClick={onSubmit}>작성하기</SubmitButton>
        </ButtonWrapper>
      </AppLayout>

      {isModal &&
        (isFinishedFeedback ? (
          <Modal onCancelModal={onRedirectInterviews}>
            <GuideMessage
              message={'피드백 작성이 완료 되었습니다.'}
              onOk={onRedirectInterviews}
            />
          </Modal>
        ) : (
          <Modal onCancelModal={() => setIsModal(false)}>
            <GuideMessage
              message={
                '수고하셨습니다! 영상과 내 답변을 참고해서 피드백을 작성해 보세요 :)'
              }
              onOk={() => setIsModal(false)}
            />
          </Modal>
        ))}
    </>
  );
};

Feedback.propTypes = {
  sessionPostId: PropTypes.string.isRequired,
  creatorId: PropTypes.string.isRequired,
  questions: PropTypes.array.isRequired,
  blob: PropTypes.string.isRequired,
  timeStamps: PropTypes.array.isRequired,
  // title: PropTypes.string.isRequired,
  // category: PropTypes.string.isRequired,
  // email: PropTypes.string.isRequired,
  // desc: PropTypes.string.isRequired,
  // star: PropTypes.array.isRequired,
};

export default Feedback;
