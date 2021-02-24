import { render, fireEvent } from "@testing-library/react";
import { RouterContext } from "next/dist/next-server/lib/router-context";

import { feedbackPostMock, mockRouter } from "./setup";
import FeedbackCardList from "../../components/feedback/FeedbackCardList";

describe("FeedbackCardList", () => {
  const setup = () => {
    return render(
      <RouterContext.Provider value={mockRouter}>
        <FeedbackCardList
          posts={[feedbackPostMock]}
        />
      </RouterContext.Provider>
    );
  };

  it("redirect feedback page after click showFeedback", () => {
    const { getByText } = setup();

    const spy = jest.spyOn(mockRouter, 'push');
    const showFeedbackButton = getByText('피드백 보기');
    fireEvent.click(showFeedbackButton);

    expect(spy).toHaveBeenCalled();
    expect(spy).toBeCalledWith(`/feedback/${feedbackPostMock._id}`);
  });
});
