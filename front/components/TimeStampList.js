import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import TimeStampCard from './TimeStampCard';

const Container = styled.section`
  margin: 15px;
  padding: 15px 5px;
  width: 380px;
  height: 500px;
  background-color: #dcdde1;
  border-radius: 30px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const TimeStampList = ({ timeStamps, targetVideo }) => {
  const moveVideoTime = useCallback((videoEle, time) => {
    if (time) {
      videoEle.current.currentTime = time;
    } else {
      alert('답변한 질문이 아닙니다.');
    }
  });

  return (
    <Container>
      {timeStamps.map((item, index) => (
        <TimeStampCard
          key={index}
          text={item.text}
          time={item.time}
          answerNumber={index + 1}
          onClick={() => moveVideoTime(targetVideo, item.time)}
        />
      ))}
    </Container>
  );
};

TimeStampList.propTypes = {
  timeStamps: PropTypes.array.isRequired,
  targetVideo: PropTypes.node.isRequired,
};

export default TimeStampList;
