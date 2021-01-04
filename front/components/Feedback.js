import React, { useCallback, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import Head from 'next/head';

import FeedbackCard from './FeedbackCard';
import TimeStampCard from './TimeStampCard';
import { UPLOAD_FEEDBACK_POST_REQUEST } from '../reducers/post';

const Feedback = ({
  // blob,
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
  const [videoSrc, setVideoSrc] = useState(null);

  const videoElement = useRef();
  const videoUpload = useRef();

  const onChange = (e) => {
    setValues({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // 서브밋시 작성할껀지 모달 추가
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

  const moveVideoTime = useCallback((time) => {
    videoElement.current.currentTime = time;
  }, [videoElement.current]);

  const onUpload = useCallback(() => {
    videoUpload.current.click();
  }, [videoUpload.current]);

  const onChangeVideo = useCallback((e) => {
    console.log(e.target.files, 'onChangeVideo target files');
    console.log(e, 'onChangeVideo event');
    setVideoSrc(e.target.files[0]);
  }, [setVideoSrc]);

  console.log(timeStamps, 'Feedback timeStamps');

  return (
    <>
      <Head>
        <title>피드백 작성 | Untact_Interview </title>
      </Head>
      <article>
          <article>
            <input
              type='file'
              name='video'
              hidden
              ref={videoUpload}
              onChange={onChangeVideo}
            />
            <button onClick={onUpload}>영상 업로드</button>
            {videoSrc ? (
              <video 
                controls 
                autoPlay 
                ref={videoElement} 
                src={URL.createObjectURL(videoSrc)}
                width="500px" 
                height="500px" 
              />
            ) : (
              <div>영상을 올려 주세요</div>
            )}
          </article>
        {/* <video
          controls
          autoPlay
          ref={videoElement}
          src={blob}
          width="500px"
          height="500px"
        /> */}
        <section>
          <h2>타임스탬프</h2>
            {timeStamps && timeStamps.map((item, index) => (
              <TimeStampCard
                key={index}
                text={item.text}
                time={item.time}
                answerNumber={index + 1}
                onClick={moveVideoTime}
              />
            ))}
        </section>
        <article>
          <h2>진행한 글 정보</h2>
          <div>title: {title}</div>
          <div>category: {category}</div>
          <div>email: {email}</div>
          <div>desc: {desc}</div>
          <div>star: {star.length}</div>
        </article>
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
