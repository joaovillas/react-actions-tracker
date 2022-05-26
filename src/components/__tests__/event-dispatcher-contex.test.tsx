import React, { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import EventTracker from "../event-tracker";
import EventTrackerProvider from "../event-tracker-context";
import { mockAllIsIntersecting } from "react-intersection-observer/test-utils";
import { EventPayload } from "../../types/event-payload";

interface MockComponentProps {
  buttonContent?: string;
  mockFunction?: () => void;
  testClick?: boolean;
  metadata?: object;
  globalMetadata?: object;
  applicationPrefix?: string;
  untrack?: boolean;
}

const mockComponent = ({
  mockFunction = () => null,
  buttonContent,
  testClick = false,
  metadata,
  globalMetadata,
  applicationPrefix,
  untrack = false,
}: MockComponentProps): React.ReactElement => {
  mockAllIsIntersecting(true);
  return (
    <EventTrackerProvider
      globalMetadata={globalMetadata}
      applicationPrefix={applicationPrefix}
      trackEvent={mockFunction}
      untrack={untrack}
    >
      <EventTracker
        trackClick={testClick}
        eventMetadata={metadata}
        eventName={"test"}
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
    const MockProvider = () => {
      return (
        <EventTrackerProvider trackEvent={() => null}>
          <h1>test</h1>
        </EventTrackerProvider>
      );
    };

    render(<MockProvider />);
    expect(screen.getByText("test")).toBeInTheDocument;
  });

  it("should track global metadata when is set", () => {
    const testButton = "test-button";
    const mockFunction = jest.fn();

    const metadata = {
      test: true,
    };
    const globalMetadata = {
      global: "metadata",
    };

    render(
      mockComponent({
        buttonContent: testButton,
        mockFunction,
        testClick: true,
        metadata,
        globalMetadata,
      })
    );

    fireEvent.click(screen.getByText(testButton));
    expect(mockFunction).toBeCalled;
    expect(mockFunction).toHaveBeenCalledWith(
      mockEvent({
        eventAction: "click",
        eventName: "test",
        metadata: { ...globalMetadata, ...metadata },
      })
    );
  });

  it("should track applicationPrefix metadata when is set", () => {
    const testButton = "test-button";
    const mockFunction = jest.fn();
    render(
      mockComponent({
        buttonContent: testButton,
        mockFunction,
        testClick: true,
        applicationPrefix: "test",
      })
    );

    fireEvent.click(screen.getByText(testButton));
    expect(mockFunction).toBeCalled;
    expect(mockFunction).toHaveBeenCalledWith(
      mockEvent({
        eventAction: "click",
        eventName: "test",
        applicationPrefix: "test",
      })
    );
  });

  it("should track applicationPrefix metadata when is set", () => {
    const testButton = "test-button";
    const mockFunction = jest.fn();
    render(
      mockComponent({
        buttonContent: testButton,
        mockFunction,
        testClick: true,
        applicationPrefix: "test",
        untrack: true,
      })
    );

    fireEvent.click(screen.getByText(testButton));
    expect(mockFunction).toBeCalledTimes(0);
  });
});
