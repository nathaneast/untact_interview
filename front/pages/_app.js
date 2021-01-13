import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import 'antd/dist/antd.css';
import '../styles/global.css';

import wrapper from '../store/configureStore';

const untactInterview = ({ Component }) => (
  <>
    <Head>
      <meta charSet="utf-8" />
      <title>Untact_Interview</title>
    </Head>
    <Component />
  </>
);

untactInterview.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

export default wrapper.withRedux(untactInterview);
