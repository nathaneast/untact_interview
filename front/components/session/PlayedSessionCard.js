import React from 'react';
import PropTypes from 'prop-types';

const PlayedSessionCard = ({ title, category, email, desc, star }) => (
  <article>
    <div>
      <ul>
        <li>
          <span> 제목 {title}</span>
        </li>
        <li>
          <span>작성자 {email}</span>
        </li>
        <li>
          <span>카테고리 {category}</span>
        </li>
        <li>
          <span>설명 {desc}</span>
        </li>
        <li>
          <span>star {star}</span>
        </li>
      </ul>
    </div>
  </article>
);

PlayedSessionCard.propTypes = {
  title: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  star: PropTypes.number.isRequired,
};

export default PlayedSessionCard;
