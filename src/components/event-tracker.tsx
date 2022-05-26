import React, { FC, useCallback, useEffect, useState } from "react";
import { EventTrackerContextType } from "../types/event-dispatcher";
import { EventPayload, EventAction } from "../types/event-payload";
import { EventTrackerContext } from "./event-tracker-context";
import { useInView } from "react-intersection-observer";

interface EventTrackerProps {
  children?: React.ReactNode;
  /**
   * Enable track click over the target element
   */
  trackClick?: boolean;
  /**
   * Enable track of state change over the target element
   */
  trackChange?: boolean;
  /**
   * Enable track when the target element renders/appears in customer screen
   * Caution with this prop, you don't want to track when everything rendered right...
   */
  trackRender?: boolean;
  /**
   * Prop used with trackChange parameter, this will trigger the trackChange event
   * when a prop updates.
   */
  watch?: unknown;
  /**
   * This prop is used to give a name to the target element you want to track
   * Ex: you want to track a button, the name should be button_register
   */
  eventName: string;
  /**
   * This prop is used to explain and attach data that you make sense to your tracking activity
   */
  eventMetadata?: object;
  /**
   * This prop is used debug the events you want to track, only for test and development purposes
   *
   */
  eventDebug?: boolean;
  /**
   * This prop is used to give a porcentage in users screen the target element appears.
   * Ex: you want to track when the target element appears 50% in users screen
   * You should use values between 0 to 1, so the threshold should be 0.5
   */
  threshold?: number | number[];
  /**
   * Default value is true, if you want to trigger the when a component appeared more the one time
   * you should use false value
   */
  triggerOnce?: boolean;
  /**
   * This prop is used to attach an event to some page.
   */
  eventPage?: string;
}

const EventTracker: FC<EventTrackerProps> = ({
  trackRender,
  trackChange,
  trackClick,
  children,
  watch,
  eventName,
  eventMetadata,
  eventDebug,
  threshold = 1,
  eventPage,
  triggerOnce = true,
}) => {
  const [prevWatchedProps, setPrevWatchedProps] = useState(watch);
  const { trackEvent, globalMetadata, applicationPrefix, untrack } =
    React.useContext(EventTrackerContext) as EventTrackerContextType;
  const { ref, inView } = useInView({
    threshold,
    rootMargin: "0px",
    triggerOnce,
  });

  const onClick = () => {
    return trackClick && dispatchEvent("click");
  };

  const mountEvent = useCallback(
    (action: EventAction) => {
      const event: EventPayload = {
        eventName,
        eventPage,
        eventAction: action,
        metadata: { ...eventMetadata, ...globalMetadata },
        applicationPrefix,
      };

      return event;
    },
    [applicationPrefix, eventName, globalMetadata, eventMetadata, eventPage]
  );

  const debugEvent = useCallback(
    (event: EventPayload) => {
      console.log(`[ReactEventTracker] - Debug event: ${eventName}`, event);
    },
    [eventName]
  );

  const dispatchEvent = useCallback(
    (action: EventAction) => {
      const event = mountEvent(action);

      eventDebug && debugEvent(event);

      !untrack && trackEvent(event);
    },
    [mountEvent, debugEvent, trackEvent, untrack, eventDebug]
  );

  const onPropChange = useCallback(
    (watchedProp: unknown) => {
      if (!trackChange || watchedProp === prevWatchedProps) {
        return;
      }

      setPrevWatchedProps(watch);
      dispatchEvent("changed");
    },
    [watch, prevWatchedProps, dispatchEvent, trackChange]
  );

  const onRender = useCallback(
    (inView: boolean) => {
      return inView && dispatchEvent("render");
    },
    [dispatchEvent]
  );

  useEffect(() => {
    trackRender && onRender(inView);
  }, [inView, trackRender, onRender]);

  useEffect(() => {
    trackChange && onPropChange(watch);
  }, [watch, prevWatchedProps, trackChange, onPropChange]);

  return (
    <div ref={ref} onClick={onClick}>
      {children}
    </div>
  );
};

export default EventTracker;
