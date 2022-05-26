import { EventPayload } from "./event-payload";

export type EventTrackerContextType = {
  trackEvent: (payload: EventPayload) => void;
  globalMetadata?: object;
  applicationPrefix?: string;
  untrack?: boolean;
};
