import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { END } from 'redux-saga';
import axios from 'axios';

import {
  Container,
  Form,
  TitleFormWrapper,
  CategoryWrapper,
  DescWrapper,
  QuestionWrappers,
  SubmitWrapper,
  SubmitButton,
} from '../styles/sessionForm';
import AppLayout from '../components/AppLayout';
import QuestionFormCard from '../components/QuestionFormCard';
import { UPLOAD_SESSION_POST_REQUEST } from '../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import useInput from '../hooks/useInput';
import wrapper from '../store/configureStore';

const writeSessionPost = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);

  const [desc, onChangeDesc] = useInput('');
  const [title, onChangeTitle] = useInput('');
  const [category, onChangeCategory] = useInput('frontEnd');

  const [questionform, setQuestionValues] = useState({});

  const onSubmit = useCallback((e) => {
    e.preventDefault();
    const questionformKeys = Object.keys(questionform);
    const isAllQuestions = questionformKeys.length === 5 && (
      questionformKeys.every(
        (key) => questionform[key].length > 0,
      ));
    const isEveryValues = title && category && desc && isAllQuestions;
    if (!isEveryValues) {
      return alert('모든 값을 입력 해주세요');
    }
    dispatch({
      type: UPLOAD_SESSION_POST_REQUEST,
      data: {
        creator: me._id,
        questions: questionformKeys.map((key) => questionform[key]),
        title,
        desc,
        category,
      },
    });
  });

  const onChange = useCallback((e) => {
    setQuestionValues({
      ...questionform,
      [e.target.name]: e.target.value,
    });
  });

  return (
    <AppLayout>
      <Container>
        <Form onSubmit={onSubmit}>
          <TitleFormWrapper>
            <label>제목</label>
            <div>
              <input type="text" onChange={onChangeTitle} />
            </div>
          </TitleFormWrapper>

          <CategoryWrapper>
            <label>카테고리</label>
            <div>
              <select defaultValue={'frontend'} onChange={onChangeCategory}>
                <option value="frontend">FrontEnd</option>
                <option value="backend">BackEnd</option>
                <option value="others">Others</option>
              </select>
            </div>
          </CategoryWrapper>

          <DescWrapper>
            <label>설명</label>
            <div>
              <textarea rows="2" cols="70" onChange={onChangeDesc} />
            </div>
          </DescWrapper>

          <QuestionWrappers>
            <span>질문 작성</span>
            {[...Array(5)].map((n, i) => (
              <QuestionFormCard
                key={i}
                questionNumber={i + 1}
                onChange={onChange}
              />
            ))}
          </QuestionWrappers>

          <SubmitWrapper>
            <SubmitButton type="submit">작성하기</SubmitButton>
          </SubmitWrapper>
        </Form>
      </Container>
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
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
  },
);

export default writeSessionPost;
