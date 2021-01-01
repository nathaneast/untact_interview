import React, { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';
import Head from 'next/head';

const Feedback = ({
  blob,
  timeStamps,
  title,
  category,
  email,
  desc,
  star }) => {

  console.log(title, category,email,desc,star, 'Feedback posts');
  console.log(blob, 'Feedback blob');
  console.log(timeStamps, 'Feedback timeStamps');

  return (
    <div>
      <Head>
        <title>피드백 작성 | Untact_Interview </title>
      </Head>
      <video controls src={blob} autoPlay width="500px" height="500px" />
      {/* <button>영상 다운</button> */}
      <div>질문, 답</div>
      <div>진행한 글 정보</div>
      <div>질문, 피드백 작성 폼</div>
      <button>작성</button>
    </div>
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
