import React, { useCallback, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import Head from 'next/head';

import FeedbackCard from './FeedbackCard';
import TimeStampCard from './TimeStampCard';
import { UPLOAD_FEEDBACK_POST_REQUEST } from '../reducers/post';
import PlayedSessionPostCard from './PlayedSessionPostCard';

// 모든 피드백 입력 되었는지 폼 검사 로직 추가
// 서브밋시 작성할껀지 모달 추가
const Feedback = ({
  blob,
  timeStamps,
  title,
  category,
  email,
  desc,
  star,
  questions,
  sessionPostId,
  creatorId,
}) => {
  const dispatch = useDispatch();
  const [form, setValues] = useState({});

  const videoElement = useRef();

  const onChange = (e) => {
    setValues({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = useCallback(() => {
    dispatch({
      type: UPLOAD_FEEDBACK_POST_REQUEST,
      data: {
        creatorId,
        sessionPostId,
        timeStamps,
        // answers: timeStamps.map((item) => item.text),
        feedbacks: Object.keys(form).map((key) => form[key]),
      },
    });
  }, [form, timeStamps]);

  const moveVideoTime = useCallback(
    (time) => {
      videoElement.current.currentTime = time;
    },
    [videoElement.current],
  );

  console.log(timeStamps, 'Feedback timeStamps');

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
          <h2>타임스탬프</h2>
          {timeStamps &&
            timeStamps.map((item, index) => (
              <TimeStampCard
                key={index}
                text={item.text}
                time={item.time}
                answerNumber={index + 1}
                onClick={moveVideoTime}
              />
            ))}
        </section>
        <PlayedSessionPostCard
          title={title}
          category={category}
          email={email}
          desc={desc}
          star={Object.keys(star).length}
        />
        {/* <article>
          <h2>진행한 글 정보</h2>
          <div>title: {title}</div>
          <div>category: {category}</div>
          <div>email: {email}</div>
          <div>desc: {desc}</div>
          <div>star: {Object.keys(star).length}</div>
        </article> */}
        <section>
          <h2>질문, 답변, 피드백 작성 폼</h2>
          {timeStamps &&
            questions.map((item, index) => (
              <FeedbackCard
                key={index}
                question={item}
                answer={timeStamps[index].text}
                FeedbackNumber={index + 1}
                onChange={onChange}
                writeMode={true}
              />
            ))}
          <input type="submit" value="작성" onClick={onSubmit} />
        </section>
      </article>
    </>
  );
};

// Feedback.propTypes = {
//   blob: PropTypes.string.isRequired,
//   timeStamps: PropTypes.array.isRequired,
//   title: PropTypes.string.isRequired,
//   category: PropTypes.string.isRequired,
//   email: PropTypes.string.isRequired,
//   desc: PropTypes.string.isRequired,
//   star: PropTypes.array.isRequired,
// };

export default Feedback;
