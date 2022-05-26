export type EventAction = "click" | "changed" | "render";

export interface EventPayload {
  applicationPrefix?: string;
  eventName: string;
  eventAction: string;
  metadata?: object;
  eventPage?: string;
}