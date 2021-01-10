import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { END } from 'redux-saga';
import axios from 'axios';

import wrapper from '../../store/configureStore';
import { LOAD_MY_INFO_REQUEST } from '../../reducers/user';
import { LOAD_FEEDBACK_POST_REQUEST } from '../../reducers/post';
import TimeStampCard from '../../components/TimeStampCard';
import AppLayout from '../../components/AppLayout';
import FeedbackFormCard from '../../components/FeedbackFormCard';
import PlayedSessionCard from '../../components/PlayedSessionCard';

const feedbackPost = () => {
  // const dispatch = useDispatch();
  // const { me } = useSelector((state) => state.user);
  const { singlePost } = useSelector((state) => state.post);

  const [videoBlob, setVideoBlob] = useState(null);

  const videoElement = useRef();
  const videoUpload = useRef();

  const onUpload = useCallback(() => {
    videoUpload.current.click();
  }, [videoUpload.current]);

  const onChangeVideo = useCallback(
    (e) => {
      console.log(e.target.files, 'onChangeVideo target files');
      setVideoBlob(e.target.files[0]);
    },
    [setVideoBlob],
  );

  const moveVideoTime = useCallback(
    (time) => {
      if (time) {
        videoElement.current.currentTime = time;
      }
    },
    [videoElement.current],
  );

  console.log(singlePost, '피드백 포스트 singlePost');

  return (
    <>
      <AppLayout>
        <article>
          <input
            type="file"
            name="video"
            hidden
            ref={videoUpload}
            onChange={onChangeVideo}
          />
          <button onClick={onUpload}>영상 업로드</button>
          {videoBlob ? (
            <video
              controls
              autoPlay
              ref={videoElement}
              src={URL.createObjectURL(videoBlob)}
              width="500px"
              height="500px"
            />
          ) : (
            <span>영상을 올려 주세요</span>
          )}
        </article>
        <section>
          <h2>타임 스탬프</h2>
          {singlePost &&
            singlePost.timeStamps.map((item, index) => (
              <TimeStampCard
                key={index}
                text={item.text}
                time={item.time}
                answerNumber={index + 1}
                onClick={moveVideoTime}
              />
            ))}
        </section>
        <h2>세션 포스트 카드</h2>
        {singlePost && (
          <PlayedSessionCard
            title={singlePost.sessionPost.title}
            category={singlePost.sessionPost.category.name}
            email={singlePost.sessionPost.creator.email}
            desc={singlePost.sessionPost.desc}
            star={singlePost.sessionPost.star.length}
          />
        )}
        <section>
          {singlePost && (
            singlePost.sessionPost.questions.map((item, index) => (
              <FeedbackFormCard
                key={index}
                answer={singlePost.timeStamps[index].text}
                feedback={singlePost.feedbacks[index]}
                FeedbackNumber={index + 1}
                question={item}
                writeMode={false}
              />
            )))}
        </section>
      </AppLayout>
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
      type: LOAD_FEEDBACK_POST_REQUEST,
      data: {
        feedbackPostId: context.params.id,
      },
    });
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
  },
);

export default feedbackPost;
