import { render, fireEvent } from "@testing-library/react";
import { Provider } from 'react-redux';
import { RouterContext } from "next/dist/next-server/lib/router-context";

import { initialState, mockRouter, mockStore } from "./setup";
import AppLayout from "../../components/AppLayout";

describe.skip("AppLayout", () => {
  const setup = () => {
    const storeWithoutMe = mockStore({ ...initialState, user: { me: null } });
    return render(
      <RouterContext.Provider value={mockRouter}>
        <Provider store={storeWithoutMe}>
          <AppLayout>
            <div>testContents</div>
          </AppLayout>
        </Provider>
      </RouterContext.Provider>
    );
  };

  it("open LoginModal after click login", () => {
    const { getByText } = setup();
    const login = getByText('로그인');
    fireEvent.click(login);

    expect(getByText('Email')).toBeTruthy();
    expect(getByText('Password')).toBeTruthy();
  });
});
