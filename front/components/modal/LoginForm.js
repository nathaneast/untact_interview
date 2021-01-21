import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { ButtonDefault } from '../../styles/reStyled';
import useInput from '../../hooks/useInput';
import { LOG_IN_REQUEST } from '../../reducers/user';

const Container = styled.article`
  display: flex;
  justify-content: center;
`;

const FormItem = styled.div`
  display: flex;
  margin: 12px 0px;
  color: #34495e;
  font-size: 16px;
  & input {
    padding: 5px 14px;
    border-radius: 7px;
    border: 1px solid #34495e;
  }
`;

const FormLabel = styled.label`
  font-weight: bolder;
  width: 100px;
`;

const ButtonWrapper = styled.div`
  margin: 20px 0px;
`;

const Button = styled(ButtonDefault)`
`;

const LoginError = styled.div`
  & p {
    color: #e55039;
  }
`;

const LoginForm = ({ onCancelModal }) => {
  const { logInError, logInDone } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');
  const [loginErrorDisplay, setLoginErrorDisplay] = useState('');

  const handleErrorMessage = useCallback((text) => {
    setLoginErrorDisplay(text);
    setTimeout(() => setLoginErrorDisplay(''), 3000);
  }, [setLoginErrorDisplay]);

  useEffect(() => {
    if (logInDone) {
      onCancelModal();
    } else if (logInError) {
      handleErrorMessage(logInError);
    }
  }, [logInError, logInDone]);

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      console.log('submit', email, password);
      dispatch({
        type: LOG_IN_REQUEST,
        data: { email, password },
      });
    },
    [email, password],
  );

  return (
    <Container>
      <form onSubmit={onSubmit}>
        <FormItem>
          <FormLabel>
            <label>Email</label>
          </FormLabel>
          <input
            type="eamil"
            maxLength="24"
            onChange={onChangeEmail}
            // pattern="[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}"
            required
          />
        </FormItem>
        <FormItem>
          <FormLabel>
            <label>Password</label>
          </FormLabel>
          <input
            type="password"
            maxLength="12"
            onChange={onChangePassword}
            required
          />
        </FormItem>
        <LoginError>
          <p>{loginErrorDisplay}</p>
        </LoginError>
        <ButtonWrapper>
          <Button type="submit">로그인</Button>
        </ButtonWrapper>
      </form>
    </Container>
  );
};

LoginForm.propTypes = {
  onCancelModal: PropTypes.func.isRequired,
};

export default LoginForm;
