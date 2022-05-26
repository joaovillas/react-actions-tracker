import React from "react";
import { EventTrackerContextType } from "../types/event-dispatcher";
import { EventPayload } from "../types/event-payload";

interface EventTrackerContextProps {
  children?: React.ReactNode;
  /**
   * This callback function is to connect the event method of the api or service you want
   */
  trackEvent: (payload: EventPayload) => void;
  /**
   * This prop is to put global metadata that put on every event you want.
   */
  globalMetadata?: object;
  /**
   * This prop is to bind some application name, to help you organize the events with prefixed service.
   */
  applicationPrefix?: string;
  /**
   * This is to block the event tracking in your application
   */
  untrack?: boolean;
}

export const EventTrackerContext =
  React.createContext<EventTrackerContextType | null>(null);

const EventTrackerProvider: React.FC<EventTrackerContextProps> = ({
  children,
  trackEvent,
  applicationPrefix,
  globalMetadata,
  untrack,
}) => {
  const providerValue: EventTrackerContextType = {
    trackEvent,
    applicationPrefix,
    globalMetadata,
    untrack
  };

  return (
    <EventTrackerContext.Provider value={providerValue}>
      {children}
    </EventTrackerContext.Provider>
  );
};

export default EventTrackerProvider;
