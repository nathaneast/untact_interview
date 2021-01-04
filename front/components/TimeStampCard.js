import React from 'react';
import PropTypes from 'prop-types';

const TimeStampCard = ({ text, time, onClick, answerNumber }) => (
  <article>
    <div onClick={() => onClick(time)}>
      <h2>{answerNumber}</h2>
      <p>{text}</p>
    </div>
  </article>
);

TimeStampCard.propTypes = {
  text: PropTypes.string.isRequired,
  // time: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  answerNumber: PropTypes.number.isRequired,
};

export default TimeStampCard;
