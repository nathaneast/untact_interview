import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Modal, Input, Form, Button } from 'antd';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import useInput from '../../hooks/useInput';
import { LOG_IN_REQUEST } from '../../reducers/user';

const InputEmail = styled(Input)`
  width: 200px;
`;

const InputPassword = styled(Input.Password)`
  width: 200px;
`;

const LoginModal = ({ visible, onCancel }) => {
  const [email, onChangeEmail, setEmail] = useInput('');
  const [password, onChangePassword, setPassword] = useInput('');

  const dispatch = useDispatch();

  const onSubmit = useCallback(() => {
    dispatch({
      type: LOG_IN_REQUEST,
      data: { email, password },
    });
    setEmail('');
    setPassword('');
    onCancel();
  }, [email, password]);

  return (
    <Modal footer={null} visible={visible} onCancel={onCancel}>
      <Form
        onFinish={onSubmit}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: 'email을 입력 해주세요',
            },
          ]}
        >
          <InputEmail value={email} onChange={onChangeEmail} />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: 'password를 입력 해주세요',
            },
          ]}
        >
          <InputPassword value={password} onChange={onChangePassword} />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          로그인
        </Button>
      </Form>
    </Modal>
  );
};

LoginModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default LoginModal;
