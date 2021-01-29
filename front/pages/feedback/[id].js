import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { END } from 'redux-saga';
import axios from 'axios';
import styled from 'styled-components';
import Head from 'next/head';

import wrapper from '../../store/configureStore';
import { LOAD_MY_INFO_REQUEST } from '../../reducers/user';
import { LOAD_FEEDBACK_POST_REQUEST } from '../../reducers/post';
import AppLayout from '../../components/AppLayout';
import FeedbackFormCard from '../../components/feedback/FeedbackFormCard';
import TimeStampList from '../../components/TimeStampList';
import { ButtonDefault } from '../../styles/reStyled';

const MonitoringBoard = styled.article`
  display: flex;
  align-items: center;
`;

const UploadButton = styled(ButtonDefault)``;

const VideoWrapper = styled.div`
  margin: 10px 0px;
`;

const EmptyVideoBoard = styled.div`
  width: 650px;
  height: 450px;
  background-color: #636e72;
  margin: 10px 0px;
  border-radius: 10px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fffff6;
  font-weight: bolder;
  font-size: 20px;
`;

const PlayedSessionBoard = styled.div`
  position: relative;
  margin: 5px 0px;
  font-size: 19px;
  border-bottom: 1px solid #2d3436;
  color: #2d3436;
`;

const SessionFlipCard = styled.div`
  position: absolute;
  left: 100px;
  bottom: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  width: 200px;
  height: 150px;
  background-color: #34495e;
  color: black;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  & ul {
    padding: 0px;
    margin: 0px;
    font-size: 15px;
    font-weight: bolder;
    list-style: none;
    color: #fffff6;
  }
`;

const feedbackPost = () => {
  const { singlePost } = useSelector(
    (state) => state.post,
  );

  const [videoBlob, setVideoBlob] = useState(null);
  const [isSessionFlipCard, setIsSessionFlipCard] = useState(false);

  const videoElement = useRef();
  const videoUpload = useRef();
  const sessionCardElement = useRef();

  useEffect(() => {
    if (videoBlob) {
      videoElement.current.style.display = 'block';
    } else {
      videoElement.current.style.display = 'none';
    }
  }, [videoBlob, videoElement]);

  useEffect(() => {
    sessionCardElement.current.addEventListener(
      'mouseover',
      () => {
        setIsSessionFlipCard(true);
      },
      false,
    );
    sessionCardElement.current.addEventListener(
      'mouseout',
      () => {
        setIsSessionFlipCard(false);
      },
      false,
    );
  }, []);

  const onUpload = useCallback(() => {
    videoUpload.current.click();
  }, [videoUpload.current]);

  const onChangeVideo = useCallback(
    (e) => {
      setVideoBlob(e.target.files[0]);
    },
    [setVideoBlob],
  );

  return (
    <AppLayout>
      <Head>
        <title>{singlePost.desc}</title>
        <meta name="description" content={`${singlePost.desc}`} />
        <meta property="og:title" content={`${singlePost.desc}`} />
        <meta property="og:description" content={`${singlePost.desc}`} />
        <meta property="og:url" content={`http://untact-interview.site/feedback/${singlePost._id}`} />
      </Head>
      <MonitoringBoard>
        <div>
          <div>
            <input
              type="file"
              name="video"
              hidden
              ref={videoUpload}
              onChange={onChangeVideo}
            />
            <UploadButton onClick={onUpload}>영상 업로드</UploadButton>
          </div>
          <div>
            <VideoWrapper>
              <video
                controls
                autoPlay
                ref={videoElement}
                src={videoBlob ? URL.createObjectURL(videoBlob) : null}
                width="600px"
                height="450px"
              />
            </VideoWrapper>
            {!videoBlob && (
              <EmptyVideoBoard>
                <span>영상을 올려 주세요 😃</span>
              </EmptyVideoBoard>
            )}
          </div>
        </div>
        {singlePost && (
          <TimeStampList
            timeStamps={singlePost.timeStamps}
            targetVideo={videoElement.current}
          />
        )}
      </MonitoringBoard>
      <PlayedSessionBoard ref={sessionCardElement}>
        <span>진행한 인터뷰 보기</span>
        {singlePost && isSessionFlipCard && (
          <SessionFlipCard>
            <ul>
              <li>
                <span>title: {singlePost.sessionPost.title}</span>
              </li>
              <li>
                <span>creator: {singlePost.sessionPost.creator.email}</span>
              </li>
              <li>
                <span>category: {singlePost.sessionPost.category.name}</span>
              </li>
              <li>
                <span>desc: {singlePost.sessionPost.desc}</span>
              </li>
              <li>
                <span>star: {singlePost.sessionPost.star.length}</span>
              </li>
            </ul>
          </SessionFlipCard>
        )}
      </PlayedSessionBoard>
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
