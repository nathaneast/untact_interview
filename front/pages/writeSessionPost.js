import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { END } from 'redux-saga';
import axios from 'axios';
import styled from 'styled-components';

import AppLayout from '../components/AppLayout';
import { UPLOAD_SESSION_POST_REQUEST } from '../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import useInput from '../hooks/useInput';
import wrapper from '../store/configureStore';

const Container = styled.div`
  width: 760px;
  height: 790px;
  margin: 40px 0px;
  background-color: #34495e;
  border-radius: 40px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  text-align: center;
  & div {
    margin: 15px 0px;
  }
`;

const TitleFormWrapper = styled.form`
  display: flex;
  flex-direction: column;
`;

const QuestionForms = styled.div`
  display: flex;
  flex-direction: column;
`;

const writeSessionPost = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);

  const [desc, onChangeDesc, setDesc] = useInput('');
  const [title, onChangeTitle, setTitle] = useInput('');
  const [category, onChangeCategory, setCategory] = useInput('frontEnd');

  const [questionform, setQuestionValues] = useState({});

  const onSubmit = useCallback((e) => {
    e.preventDefault();
    console.log('온 서브밋 !');
    const questionformKeys = Object.keys(questionform);
    const isQuestionsEmpty = questionformKeys.every(
      (key, index) => key === `question_${index + 1}` && questionform[key],
    );
    const isEveryValues = title && category && desc && isQuestionsEmpty;
    if (!isEveryValues) {
      return alert('모든 값을 입력 해주세요');
    }
    const data = {
      creator: me._id,
      questions: questionformKeys.map((key) => questionform[key]),
      title,
      desc,
      category,
    };
    console.log(data, 'data');
    // dispatch({
    //   type: UPLOAD_SESSION_POST_REQUEST,
    //   data: {
    //     creator: me._id,
    //     questions: questionformKeys.map((key) => questionform[key]),
    //     title,
    //     desc,
    //     category,
    //   },
    // });
  });

  const onChangeQuestion = useCallback((e) => {
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

          <div>
            <label>카테고리</label>
            <select defaultValue={'frontend'} onChange={onChangeCategory}>
              <option value="frontend">FrontEnd</option>
              <option value="backend">BackEnd</option>
              <option value="others">Others</option>
            </select>
          </div>

          <div>
            <label>설명</label>
            <textarea rows="2" cols="70" onChange={onChangeDesc} />
          </div>

          <QuestionForms>
            <label>질문 작성</label>
            <div>
              <input
                name="question_1"
                type="text"
                onChange={onChangeQuestion}
              />
            </div>
            <div>
              <input
                name="question_2"
                type="text"
                onChange={onChangeQuestion}
              />
            </div>
            <div>
              <input
                name="question_3"
                type="text"
                onChange={onChangeQuestion}
              />
            </div>
            <div>
              <input
                name="question_4"
                type="text"
                onChange={onChangeQuestion}
              />
            </div>
            <div>
              <input
                name="question_5"
                type="text"
                onChange={onChangeQuestion}
              />
            </div>
          </QuestionForms>

          <div>
            <input type="submit" />
          </div>
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
