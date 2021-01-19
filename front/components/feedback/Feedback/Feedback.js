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

const Feedback = ({
  sessionPostId,
  creatorId,
  questions,
  blob,
  timeStamps,
}) => {
  const dispatch = useDispatch();
  const [feedbackform, setFeedbackValues] = useState({});
  const [feedbackDesc, onChangeFeedbackDesc] = useInput('');

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

  const onRedirectInterviews = useCallback(() => {
    router.push('/interviews');
  });

  console.log(timeStamps, 'Feedback timeStamps');

  return (
    <>
      <AppLayout>
        <Head>
          <title>피드백 작성 | Untact_Interview </title>
        </Head>
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
              <a href={blob} target="_blank" rel="noopener noreferrer">
                <VideoDownloadButton>영상 다운받기</VideoDownloadButton>
              </a>
            </VideoDownload>
          </VideoBoard>
          {videoElement.current && (
            <TimeStampList
              timeStamps={timeStamps}
              targetVideo={videoElement.current}
            />
          )}
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
};

export default Feedback;
