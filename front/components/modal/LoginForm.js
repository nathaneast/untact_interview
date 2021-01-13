import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import useInput from '../../hooks/useInput';
import { LOG_IN_REQUEST } from '../../reducers/user';

const FormInput = styled.div`
  margin: 12px 0px;
  color: #34495e;
  & label {
    margin-right: 12px;
    font-weight: bolder;
  }
  font-size: 16px;
  & input {
    border-radius: 7px;
    border: 1px solid #34495e;
  }
`;

const ButtonWrapper = styled.div`
  margin: 20px 0px;
  & input {
  border-radius: 4px;
  padding: 6px 30px;
  color: #fffff6;
  background-color: #34495e;
  font-size: 15px;
  font-weight: bolder;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  & :hover {
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  }
  cursor: pointer;
  }
`;

const LoginError = styled.div`
  & p {
    color: #e55039;
  }
`;

const LoginForm = ({ onCancelModal }) => {
  const { logInError, logInDone } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [email, onChangeEmail, setEmail] = useInput('');
  const [password, onChangePassword, setPassword] = useInput('');
  const [loginErrorDisplay, setLoginErrorDisplay] = useState('');

  const handleErrorMessage = useCallback((text) => {
    setLoginErrorDisplay(text);
    setTimeout(() => setLoginErrorDisplay(''), 3000);
  }, [setLoginErrorDisplay]);

  useEffect(() => {
    if (logInDone) {
      onCancelModal();
    } else {
      logInError ? handleErrorMessage(logInError) : '';
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
    <article>
      <form onSubmit={onSubmit}>
        <FormInput>
          <label>Email</label>
          <input
            type="eamil"
            maxLength="24"
            onChange={onChangeEmail}
            // pattern="[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}"
            required
          />
        </FormInput>
        <FormInput>
          <label>Password</label>
          <input type="password" maxLength="12" onChange={onChangePassword} required />
        </FormInput>
        <LoginError>
          <p>{loginErrorDisplay}</p>
        </LoginError>
        <ButtonWrapper>
          <input type="submit" value="로그인" />
        </ButtonWrapper>
      </form>
    </article>
  );
};

LoginForm.propTypes = {
  onCancelModal: PropTypes.func.isRequired,
};

export default LoginForm;
