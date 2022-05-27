# React Actions Tracker

Imagine you want to track user events of your application, everything goes mess if you don't have a pattern to follow. 

Now imagine you have to track, click, knows when a component render to make some A/B Test, what is the values, metadata and connect everything in the api you have to send. It's a bunch of work right? 

But now, imagine you just have to put a provider over you root application and just wrap the component you want to track. Easier right? So focus on what you have to learn and let the `React Actions Tracker` do this job for you!

## Installation

```bash
npm install react-actions-tracker
```
or 
```bash
yarn add react-actions-tracker
```

## Interactive Demo.
Coming soon

## Wrap your application with the provider

```javascript
<React.StrictMode>
  <EventTrackerProvider trackEvent={(payload) => null}>
    <App />
  </EventTrackerProvider>
</React.StrictMode>
```
## Then just add the EventTracker component over the target component.

```javascript  
<EventTracker eventName="NAME_YOU_WANT">
  <button>Test button</button>
</EventTracker>
```

## Event Payload.
```javascript
{
  eventName: string;
  applicationPrefix?: string;
  eventAction: "click" | "changed" | "render";
  metadata?: object;
  eventPage?: string;
}
```

## Props - EventTracker

Name | Type | Default | Optional | Desc
---- | ---- | ------- | -------- | ----
eventName | `string` |    -    | `false`  | name of the event
trackClick | `boolean` | false | `true`  | Enable track click over the target element 
trackChange | `boolean` | false | `true`  | Enable track of state change over the target element you must use the `watch` pamareter to work
trackRender | `boolean` | false | `true`  | Enable track when the target element renders/appears in customer screen, `Caution` with this prop, you don't want to track when everything rendered right...
watch | `any` | undefined | `true`  | Prop used with trackChange parameter, this will trigger the trackChange event when this prop updates
eventMetadata | `object` | { } | `true`  | This prop is used to explain and attach data that you make sense to your tracking activity
eventDebug | `boolean` | false | `true`  | This prop is used debug the events you want to track, only for test and development purposes
threshold | ` number or number[]` | undefined | `true`  | This prop is used to give a porcentage in users screen the target element appears. Ex: you want to track when the target element appears 50% in users screen, you should use values between 0 to 1, so the threshold should be P `0.5`
triggerOnce | `boolean` | true | `true`  |  If you want to track everytime the target component appears on the screen, you should set `triggerOnce=false`
eventPage | `string` | undefined | `true`  |  If you want to put some data to be more especific, use this event to attach pageName to your events.

## Props - EventTracker

Name | Type | Default | Optional | Desc
---- | ---- | ------- | -------- | ----
trackEvent | `function` |    -    | `false`  | this will be the callback that will return the `eventPayload` of the event you're tracking, here you can do everything you want.
globalMetadata | `object` |   { }  | `true`  | Equals metadata just global 😂😂
applicationPrefix | `string` |  undefined | `true`  | Imagine you're tracking lot's of services, and your tracking service does not know where this data comes from, so this is to name the service you're tracking globally to every event
untrack | `boolean` |   { }  | `false`  | Stops the event tracking

## License
[MIT](https://choosealicense.com/licenses/mit/)
