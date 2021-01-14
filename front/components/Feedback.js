import React, { useCallback, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import Head from 'next/head';
import styled from 'styled-components';

import { UPLOAD_FEEDBACK_POST_REQUEST } from '../reducers/post';
import useInput from '../hooks/useInput';
import { ButtonNavy } from '../styles/reStyled';
import FeedbackFormCard from './FeedbackFormCard';
import TimeStampCard from './TimeStampCard';
// import PlayedSessionCard from './PlayedSessionCard';
import Modal from './modal/Modal';
import GuideMessage from './modal/GuideMessage';
import AppLayout from './AppLayout';

const MainContents = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0px;
`;

const ViedoBoard = styled.div`
  margin: 15px;
`;

const VideoDownload = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

const VideoDownloadButton = styled(ButtonNavy)`
  border-radius: 8px;
  padding: 8px 25px;
  background-color: #e84118;
  border: 1px solid gray;
  & a {
    color: #FFFFF6
  }
`;

const TimeStampBoard = styled.section`
  margin: 15px;
  padding: 7px;
  width: 380px;
  height: 500px;
  background-color: #dcdde1;
  border-radius: 30px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const FeedbackDesc = styled.div`
  padding: 20px;
  margin: 10px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
  display: flex;
  flex-direction: column;
  width: 600px;
  & span {
    display:block;
    color: black;
    font-size: 15px;
    font-weight: bolder;
    padding: 5px;
  }
  & textarea {
    color: #2f3640;
    border-radius: 10px;
    margin-top: 5px;
  }
`;

const FeedbackFormBoard = styled.section`
  margin-bottom: 15px;
`;

const ButtonWrapper = styled.div`
  margin-bottom: 20px;
`;

const SubmitButton = styled(ButtonNavy)`
  padding: 8px 80px;
  border-radius: 20px;
`;

// 모든 피드백 입력 되었는지 폼 검사 로직 추가
// 서브밋시 작성할껀지 모달 추가
const Feedback = ({
  sessionPostId,
  creatorId,
  questions,
  blob,
  timeStamps,
  title,
  category,
  email,
  desc,
  star,
}) => {
  const dispatch = useDispatch();
  const [feedbackform, setFeedbackValues] = useState({});
  const [feedbackDesc, onChangeFeedbackDesc, setFeedbackDesc] = useInput('');

  const [isModal, setIsModal] = useState(true);

  const videoElement = useRef();

  const onChange = (e) => {
    setFeedbackValues({
      ...feedbackform,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = useCallback(() => {
    const FeedbackformKeys = Object.keys(feedbackform);
    const isFeedbacksEmptyCheck = FeedbackformKeys.every((key, index) => (
      key === `feedback_${index + 1}` && feedbackform[key]
    ));
    console.log(feedbackDesc, 'Feedback feedbackDesc onSubmit');
    if (isFeedbacksEmptyCheck && feedbackDesc) {
      dispatch({
        type: UPLOAD_FEEDBACK_POST_REQUEST,
        data: {
          creatorId,
          sessionPostId,
          timeStamps,
          feedbacks: FeedbackformKeys.map((key) => feedbackform[key]),
          feedbackDesc,
        },
      });
    } else {
      alert('피드백 설명과 각 피드백을 모두 입력 해주세요');
    }
  }, [feedbackform, feedbackDesc, timeStamps]);

  const moveVideoTime = useCallback((time) => {
    if (!time) {
      alert('답변한 질문이 아닙니다.');
      return;
    }
    videoElement.current.currentTime = time;
  }, [videoElement.current]);

  // console.log(feedbackform, 'Feedback feedbackform');
  console.log(feedbackDesc, 'Feedback feedbackDesc');

  return (
    <>
      <Head>
        <title>피드백 작성 | Untact_Interview </title>
      </Head>
      <AppLayout>
        <MainContents>
          <ViedoBoard>
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
                <a href={blob} target="_blank" rel="noopener">영상 다운받기</a>
              </VideoDownloadButton>
            </VideoDownload>
          </ViedoBoard>
          <TimeStampBoard>
            {timeStamps.map((item, index) => (
              <TimeStampCard
                key={index}
                text={item.text}
                time={item.time}
                answerNumber={index + 1}
                onClick={moveVideoTime}
              />
            ))}
          </TimeStampBoard>
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
      {isModal && (
        <Modal onCancelModal={() => setIsModal(false)}>
          <GuideMessage
            message={
              '수고하셨습니다! 영상과 내 답변을 참고해서 피드백을 작성해 보세요 :)'
            }
            onOk={() => setIsModal(false)}
          />
        </Modal>
      )}
    </>
  );
};

Feedback.propTypes = {
  sessionPostId: PropTypes.string.isRequired,
  creatorId: PropTypes.string.isRequired,
  questions: PropTypes.array.isRequired,
  blob: PropTypes.string.isRequired,
  timeStamps: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  star: PropTypes.array.isRequired,
};

export default Feedback;
