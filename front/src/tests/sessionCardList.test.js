import { render, fireEvent } from "@testing-library/react";
import { Provider } from 'react-redux';
import { RouterContext } from "next/dist/next-server/lib/router-context";

import { initialState, store, mockRouter } from "./setup";
import SessionCardList from "../../components/session/SessionCardList";

describe.skip("SessionCardList Modal", () => {
  it("open start sesison modal when login", () => {
    const { getByText } = render(
      <Provider store={store}>
        <SessionCardList posts={initialState.posts} meId={initialState.user.me._id} />
      </Provider>
    );
    const startSessionButton = getByText('인터뷰 시작');
    fireEvent.click(startSessionButton);
    getByText('인터뷰를 진행 하시겠습니까?');
  });

  it("redirect session page after click onOk", () => {
    const { getByText } = render(
      <RouterContext.Provider value={mockRouter}>
        <Provider store={store}>
          <SessionCardList posts={initialState.posts} meId={initialState.user.me._id} />
        </Provider>
      </RouterContext.Provider>
    );

    const spy = jest.spyOn(mockRouter, 'push');
    const startSessionButton = getByText('인터뷰 시작');
    fireEvent.click(startSessionButton);
    const onOk = getByText('확인');
    fireEvent.click(onOk);

    expect(spy).toHaveBeenCalled();
    expect(spy).toBeCalledWith(`/session/${initialState.posts[0]._id}`);
  });
});
