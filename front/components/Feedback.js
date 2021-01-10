import React, { useCallback, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import Head from 'next/head';

import { UPLOAD_FEEDBACK_POST_REQUEST } from '../reducers/post';
import useInput from '../hooks/useInput';
import FeedbackFormCard from './FeedbackFormCard';
import TimeStampCard from './TimeStampCard';
import PlayedSessionCard from './PlayedSessionCard';

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

  const moveVideoTime = useCallback(
    (time) => {
      videoElement.current.currentTime = time;
    },
    [videoElement.current],
  );

  // console.log(feedbackform, 'Feedback feedbackform');
  console.log(feedbackDesc, 'Feedback feedbackDesc');

  return (
    <>
      <Head>
        <title>피드백 작성 | Untact_Interview </title>
      </Head>
      <article>
        <article>
          <video
            controls
            autoPlay
            ref={videoElement}
            src={blob}
            width="500px"
            height="500px"
          />
        </article>
        <section>
          타임스탬프
          {timeStamps.map((item, index) => (
            <TimeStampCard
              key={index}
              text={item.text}
              time={item.time}
              answerNumber={index + 1}
              onClick={moveVideoTime}
            />
          ))}
        </section>
        <PlayedSessionCard
          title={title}
          category={category}
          email={email}
          desc={desc}
          star={star.length}
        />
        <article>
          <label>피드백 설명</label>
          <input type='text' onChange={onChangeFeedbackDesc} />
        </article>
        <section>
          질문, 답변, 피드백 작성 폼
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
          <button onClick={onSubmit}>작성하기</button>
        </section>
      </article>
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
