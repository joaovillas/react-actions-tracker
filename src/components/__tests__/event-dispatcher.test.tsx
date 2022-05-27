import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import EventTracker from "../event-tracker";
import EventTrackerProvider from "../event-tracker-context";
import { mockAllIsIntersecting } from "react-intersection-observer/test-utils";
import { EventPayload } from "../../types/event-payload";

interface MockComponentProps {
  buttonContent?: string;
  mockFunction?: () => void;
  testClick?: boolean;
  testChange?: boolean;
  testAppears?: boolean;
  watchedProps?: number;
  metadata?: object;
  pageName?: string;
  testDebug?: boolean;
}

const mockComponent = ({
  mockFunction = () => null,
  buttonContent,
  testClick = false,
  testChange = false,
  testAppears = false,
  testDebug = false,
  watchedProps,
  metadata,
  pageName,
}: MockComponentProps): React.ReactElement => {
  mockAllIsIntersecting(true);
  return (
    <EventTrackerProvider trackEvent={mockFunction}>
      <EventTracker
        trackChange={testChange}
        trackClick={testClick}
        trackRender={testAppears}
        eventName="test-button"
        watch={watchedProps}
        eventDebug={testDebug}
        eventMetadata={metadata || undefined}
        eventPage={pageName}
      >
        <button id="test">{buttonContent || "test"}</button>
      </EventTracker>
    </EventTrackerProvider>
  );
};

const mockEvent = ({
  eventAction,
  eventName,
  applicationPrefix,
  eventPage,
  metadata = {},
}: EventPayload) => {
  return {
    eventAction,
    eventName,
    applicationPrefix,
    eventPage,
    metadata,
  };
};
describe("<EventDispatcherComponent />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render children properly", () => {
    const testButton = "test-button";
    render(mockComponent({ buttonContent: testButton }));

    expect(screen.getByText(testButton, { exact: true })).toBeInTheDocument;
  });

  it("should track when click on button", () => {
    const testButton = "test-button";
    const mockFunction = jest.fn();
    render(
      mockComponent({
        buttonContent: testButton,
        mockFunction,
        testClick: true,
      })
    );

    fireEvent.click(screen.getByText(testButton));
    expect(mockFunction).toBeCalled;
    expect(mockFunction).toHaveBeenCalledWith(
      mockEvent({ eventAction: "click", eventName: "test-button" })
    );
  });

  it("should track when prop has changed on button", () => {
    const testButton = "test-button";
    const mockFunction = jest.fn();
    const { rerender } = render(
      mockComponent({
        buttonContent: testButton,
        mockFunction,
        testChange: true,
      })
    );

    rerender(
      mockComponent({
        buttonContent: testButton,
        mockFunction,
        testChange: true,
        watchedProps: 1,
      })
    );

    expect(mockFunction).toBeCalled;
    expect(mockFunction).toBeCalledWith(
      mockEvent({ eventName: "test-button", eventAction: "changed" })
    );
  });

  it("should track when appear on the screen", () => {
    const mockFunction = jest.fn();
    const { rerender } = render(
      mockComponent({
        mockFunction,
        testAppears: true,
      })
    );

    rerender(
      mockComponent({
        mockFunction,
        testAppears: true,
      })
    );

    expect(mockFunction).toBeCalled();
    expect(mockFunction).toBeCalledWith(
      mockEvent({ eventAction: "render", eventName: "test-button" })
    );
  });

  it("should return metada and pageName", () => {
    const testButton = "test-button";
    const mockFunction = jest.fn();
    const metadata = {
      test: true,
    };

    render(
      mockComponent({
        buttonContent: testButton,
        mockFunction,
        testClick: true,
        metadata,
        pageName: "test-page",
      })
    );

    fireEvent.click(screen.getByText(testButton));
    expect(mockFunction).toBeCalled;
    expect(mockFunction).toHaveBeenCalledWith(
      mockEvent({
        eventAction: "click",
        eventName: "test-button",
        metadata,
        eventPage: "test-page",
      })
    );
  });

  it("should debug when is active", () => {
    const testButton = "test-button";
    console.log = jest.fn();
      
    render(
      mockComponent({
        buttonContent: testButton,
        testClick: true,
        testDebug: true,
      })
    );

    fireEvent.click(screen.getByText(testButton));

    expect(console.log).toBeCalled;
    expect(console.log).toHaveBeenCalledWith(
      "[ReactEventTracker] - Debug event: test-button",
      mockEvent({
        eventAction: "click",
        eventName: testButton,
      })
    );
  });
});
