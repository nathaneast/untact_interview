import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { Col, Menu, Row } from 'antd';

import LoginModal from './modal/LoginModal';

const AppLayout = ({ children }) => {
  const [tryLogin, setTryLogin] = useState(false);
  const { me } = useSelector((state) => state.user);

  return (
    <>
      <nav>
        <Menu mode="horizontal">
          <Menu.Item>
            <Link href="/">
              <a>홈</a>
            </Link>
          </Menu.Item>
          {me ? (
            <>
              <Menu.Item>
                <Link href="/postWrite">
                  <a>글쓰기</a>
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link href="/user">
                  <a>내정보</a>
                </Link>
              </Menu.Item>
              <Menu.Item>
                <span>로그아웃</span>
              </Menu.Item>
            </>
          ) : (
            <>
              <Menu.Item>
                <span onClick={() => setTryLogin((prev) => !prev)}>로그인</span>
              </Menu.Item>
              <Menu.Item>
                <Link href="/">
                  <a>회원가입</a>
                </Link>
              </Menu.Item>
            </>
          )}
        </Menu>
        <Row>
          <Col>{children}</Col>
        </Row>
        <Row>푸터</Row>
      </nav>
      {tryLogin && (
        <LoginModal
          visible={tryLogin}
          onCancel={() => setTryLogin((prev) => !prev)}
        />
      )}
    </>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
