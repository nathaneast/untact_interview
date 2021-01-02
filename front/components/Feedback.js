import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

import FeedbackCard from './FeedbackCard';

const Feedback = ({
  blob,
  timeStamps,
  title,
  category,
  email,
  desc,
  star,
  questions,
}) => {
  const [form, setValues] = useState({});

  const onChange = (e) => {
    setValues({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Head>
        <title>피드백 작성 | Untact_Interview </title>
      </Head>
      <article>
        <video controls src={blob} autoPlay width="500px" height="500px" />
        <section>
          <h2>타임스탬프</h2>
          <div>맵 돌리기</div>
        </section>
        <article>
          {/* 재사용 컴포넌트로 만들기 */}
          <h2>진행한 글 정보</h2>
          <div>title: {title}</div>
          <div>category: {category}</div>
          <div>email: {email}</div>
          <div>desc: {desc}</div>
          <div>star: {star}</div>
        </article>
        <section>
          <h2>질문, 답변, 피드백 작성 폼</h2>
          {questions.map((item, index) => (
            <FeedbackCard
              key={timeStamps[index].time}
              question={item}
              answer={timeStamps[index].text}
              feedbackIndex={index}
              onChange={onChange}
            />
          ))}
        </section>
        <button>작성</button>
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
