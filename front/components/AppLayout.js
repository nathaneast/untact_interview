import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import Modal from './modal/Modal';
import LoginForm from './modal/LoginForm';
import { LOG_OUT_REQUEST, CLEAR_LOGIN_ERROR_REQUEST } from '../reducers/user';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Header = styled.header`
  width: 100%;
  height: 55px;
  justify-content: space-between;
  background-color: #34495e;
  display: flex;
  align-items: center;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 2px 2px;
`;

const Logo = styled.div`
  margin-left: 40px;
  cursor: pointer;
`;

const LogoTitle = styled.span`
  font-weight: bolder;
  font-size: 20px;
  cursor: pointer;
`;

const NavBar = styled.ul`
  display: flex;
  list-style-type: none;
  margin: 0px;
  & > li {
     margin-right: 40px;
  }
`;

const NavItem = styled.li`
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: bolder;
  color: #FFFFF6;
  cursor: pointer;
`;

const Link = styled.a`
  color: #FFFFF6;
  text-decoration: none;
`;

const Avatar = styled.div`
  padding: 8px 14px;
  background-color: #FFFFF6;
  border-radius: 17px;
  color: #2f3640;  
  cursor: pointer;
`;

const Contents = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const AppLayout = ({ children }) => {
  const [tryLogin, setTryLogin] = useState(false);
  const { me } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const onLogIn = useCallback(() => {
    dispatch({
      type: CLEAR_LOGIN_ERROR_REQUEST,
    });
    setTryLogin(true);
  });

  const onLogOut = useCallback(() => {
    dispatch({
      type: LOG_OUT_REQUEST,
    });
  });

  return (
    <Container>
      <Header>
        <Logo>
          <Link href="/">
            <LogoTitle>Untact Interview</LogoTitle>
          </Link>
        </Logo>
        <nav>
          <NavBar>
            <NavItem>
              <Link href="/interviews">
                <span>시작하기</span>
              </Link>
            </NavItem>
            {me ? (
              <>
                <NavItem>
                  <Link href="/sessionForm">
                    <span>글쓰기</span>
                  </Link>
                </NavItem>
                <NavItem onClick={onLogOut}>
                  <span>로그아웃</span>
                </NavItem>
                <NavItem>
                  <Link href={`/user/${me._id}`}>
                    <Avatar>
                      <span>{me.nickname}</span>
                    </Avatar>
                  </Link>
                </NavItem>
              </>
            ) : (
              <>
                <NavItem onClick={onLogIn}>
                  <span>로그인</span>
                </NavItem>
                <NavItem>
                  <Link href="/signup">
                    <span>회원가입</span>
                  </Link>
                </NavItem>
              </>
            )}
          </NavBar>
        </nav>
      </Header>
      <Contents>{children}</Contents>
      {tryLogin && (
        <Modal onCancelModal={() => setTryLogin(false)}>
          <LoginForm onCancelModal={() => setTryLogin(false)} />
        </Modal>
      )}
    </Container>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
