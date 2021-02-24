import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';

import { initialState, mockStore } from './setup';
import Modal from '../../components/modal/Modal';
import LoginForm from '../../components/modal/LoginForm';

// 서브밋 fn 호출 하는지 테스트 방법 연구
describe.skip('LoginForm', () => {
  it('change value as you input', () => {
    const storeWithoutMe = mockStore({ ...initialState, user: { me: null } });
    const { getByLabelText } = render(
      <Provider store={storeWithoutMe}>
        <Modal onCancelModal={jest.fn()}>
          <LoginForm onCancelModal={jest.fn()} />
        </Modal>
      </Provider>
    );

    const email = getByLabelText('email');
    const password = getByLabelText('password');

    fireEvent.change(email, { target: { value: 'test@test.com' } });
    fireEvent.change(password, { target: { value: '123123' } });

    expect(email.value).toBe('test@test.com');
    expect(password.value).toBe('123123');
  });
});
