import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';

const Feedback = ({ blob, post }) => {
  console.log(post, 'Feedback post');

  return (
    <div>
      <video src={blob} controls={true}></video>
      {/* <div>영상 보기</div>
      <button>영상 다운</button>
      <div>질문, 답</div>
      <div>진행한 글 정보</div>
      <div>질문, 피드백 작성 폼</div>
      <button>작성</button> */}
    </div>
  );
};

// Feedback.propTypes = {
//   questions: PropTypes.array.isRequired,
//   answers: PropTypes.array.isRequired,
//   post: PropTypes.object.isRequired,
// };

export default Feedback;
