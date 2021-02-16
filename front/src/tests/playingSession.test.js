import { render, fireEvent } from "@testing-library/react";
import { Provider } from 'react-redux';
import { RouterContext } from "next/dist/next-server/lib/router-context";

import { initialState, store, mockRouter } from "./setup";
import PlayingSession from "../../components/session/playingSession/PlayingSession";

describe("PlayingSession", () => {
  it("open exit modal after clicked exit", () => {
    const { getByText } = render(
      // <Provider store={store}>
      <PlayingSession
        questions={initialState.posts[0].questions}
        saveTimeStamps={jest.fn()}
        saveBlob={jest.fn()}
        sessionTitle={initialState.posts[0].title}
        moveFeedback={jest.fn()}
      />
      // </Provider>
    );
    const exitButton = getByText('나가기');
    fireEvent.click(exitButton);
    getByText('나가시겠습니까?');
  });

  // it("redirect session page after click onOk", () => {
  //   const { getByText } = render(
  //     <RouterContext.Provider value={mockRouter}>
  //       <Provider store={store}>
  //         <SessionCardList posts={initialState.posts} meId={initialState.user.me._id} />
  //       </Provider>
  //     </RouterContext.Provider>
  //   );

  //   const spy = jest.spyOn(mockRouter, 'push');
  //   const startSessionButton = getByText('인터뷰 시작');
  //   fireEvent.click(startSessionButton);
  //   const onOk = getByText('확인');
  //   fireEvent.click(onOk);

  //   expect(spy).toHaveBeenCalled();
  //   expect(spy).toBeCalledWith(`/session/${initialState.posts[0]._id}`);
  // });
});
