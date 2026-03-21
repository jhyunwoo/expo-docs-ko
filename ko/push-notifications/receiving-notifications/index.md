---
modificationDate: November 03, 2025
title: 수신한 notifications 처리하기
description: 앱이 수신한 notification에 응답하고 이벤트에 따라 동작을 수행하는 방법을 알아보세요.
---

# 수신한 notifications 처리하기

앱이 수신한 notification에 응답하고 이벤트에 따라 동작을 수행하는 방법을 알아보세요.

[`expo-notifications`](/versions/latest/sdk/notifications) 라이브러리에는 notification을 수신했을 때 앱이 어떻게 반응할지 처리하는 event listener가 포함되어 있습니다.

## Notification event listeners

[`addNotificationReceivedListener`](/versions/latest/sdk/notifications#addnotificationreceivedlistenerlistener)와 [`addNotificationResponseReceivedListener`](/versions/latest/sdk/notifications#addnotificationresponsereceivedlistenerlistener) event listener는 notification이 수신되거나 상호작용되었을 때 객체를 전달받습니다.

이 listener를 사용하면 앱이 열려 있고 foreground 상태일 때 notification을 수신하는 경우와, 앱이 background 상태이거나 닫혀 있을 때 사용자가 notification을 탭하는 경우의 동작을 추가할 수 있습니다.

```js
useEffect(() => {
  registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

  const notificationListener = Notifications.addNotificationReceivedListener(notification => {
    console.log(notification);
  });

  const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
    console.log(response);
  });

  return () => {
    notificationListener.remove();
    responseListener.remove();
  };
}, []);
```

`addNotificationReceivedListener`의 Android notification object 예시

`Notifications.addNotificationReceivedListener`를 사용할 때 callback 함수가 받는 `notification` 객체의 예시는 다음과 같습니다.

```json
// console.log(notification);
{
  "request": {
    "trigger": {
      "remoteMessage": {
        "originalPriority": 2,
        "sentTime": 1724782348210,
        "notification": {
          "usesDefaultVibrateSettings": false,
          "color": null,
          "channelId": null,
          "visibility": null,
          "sound": null,
          "tag": null,
          "bodyLocalizationArgs": null,
          "imageUrl": null,
          "title": "Chat App",
          "ticker": null,
          "eventTime": null,
          "body": "New message from John Doe",
          "titleLocalizationKey": null,
          "notificationPriority": null,
          "icon": null,
          "usesDefaultLightSettings": false,
          "sticky": false,
          "link": null,
          "titleLocalizationArgs": null,
          "bodyLocalizationKey": null,
          "usesDefaultSound": false,
          "clickAction": null,
          "localOnly": false,
          "lightSettings": null,
          "notificationCount": null
        },
        "data": {
          "channelId": "default",
          "message": "New message from John Doe",
          "title": "Chat App",
          "body": "{\"senderId\":\"user123\",\"senderName\":\"John Doe\",\"messageId\":\"msg789\",\"conversationId\":\"conversation-456\",\"messageType\":\"text\",\"timestamp\":1724766427}",
          "scopeKey": "@betoatexpo/expo-notifications-app",
          "experienceId": "@betoatexpo/expo-notifications-app",
          "projectId": "51092087-87a4-4b12-8008-145625477434"
        },
        "to": null,
        "ttl": 0,
        "collapseKey": "dev.expo.notificationsapp",
        "messageType": null,
        "priority": 2,
        "from": "115310547649",
        "messageId": "0:1724782348220771%0f02879c0f02879c"
      },
      "channelId": "default",
      "type": "push"
    },
    "content": {
      "autoDismiss": true,
      "title": "Chat App",
      "badge": null,
      "sticky": false,
      "sound": "default",
      "body": "New message from John Doe",
      "subtitle": null,
      "data": {
        "senderId": "user123",
        "senderName": "John Doe",
        "messageId": "msg789",
        "conversationId": "conversation-456",
        "messageType": "text",
        "timestamp": 1724766427
      }
    },
    "identifier": "0:1724782348220771%0f02879c0f02879c"
  },
  "date": 1724782348210
}
```

`notification.request.content.data` 객체를 로깅하면 notification의 custom data에 바로 접근할 수 있습니다.

```json
// console.log(notification.request.content.data);
{
  "senderId": "user123",
  "senderName": "John Doe",
  "messageId": "msg789",
  "conversationId": "conversation-456",
  "messageType": "text",
  "timestamp": 1724766427
}
```
iOS notification object example from `addNotificationReceivedListener`

`Notifications.addNotificationReceivedListener`를 사용할 때 callback 함수가 받는 `notification` 객체의 예시는 다음과 같습니다.

```json
// console.log(notification);
{
  "request": {
    "trigger": {
      "class": "UNPushNotificationTrigger",
      "type": "push",
      "payload": {
        "experienceId": "@betoatexpo/expo-notifications-app",
        "projectId": "51092087-87a4-4b12-8008-145625477434",
        "scopeKey": "@betoatexpo/expo-notifications-app",
        "aps": {
          "thread-id": "",
          "category": "",
          "badge": 1,
          "alert": {
            "subtitle": "Hey there! How's your day going?",
            "title": "Chat App",
            "launch-image": "",
            "body": "New message from John Doe"
          },
          "sound": "default"
        },
        "body": {
          "messageId": "msg789",
          "timestamp": 1724766427,
          "messageType": "text",
          "senderId": "user123",
          "senderName": "John Doe",
          "conversationId": "conversation-456"
        }
      }
    },
    "identifier": "3AEB849E-9059-4D09-BC3B-9A0B104CF062",
    "content": {
      "body": "New message from John Doe",
      "sound": "default",
      "launchImageName": "",
      "badge": 1,
      "subtitle": "Hey there! How's your day going?",
      "title": "Chat App",
      "data": {
        "conversationId": "conversation-456",
        "senderName": "John Doe",
        "senderId": "user123",
        "messageType": "text",
        "timestamp": 1724766427,
        "messageId": "msg789"
      },
      "summaryArgument": null,
      "categoryIdentifier": "",
      "attachments": [],
      "interruptionLevel": "active",
      "threadIdentifier": "",
      "targetContentIdentifier": null,
      "summaryArgumentCount": 0
    }
  },
  "date": 1724798493.0589335
}
```

`notification.request.content.data` 객체를 로깅하면 notification의 custom data에 바로 접근할 수 있습니다.

```json
// console.log(notification.request.content.data);
{
  "senderId": "user123",
  "senderName": "John Doe",
  "messageId": "msg789",
  "conversationId": "conversation-456",
  "messageType": "text",
  "timestamp": 1724766427
}
```

이 객체들에 대한 자세한 내용은 [`Notification`](/versions/latest/sdk/notifications#notification) 문서를 참고하세요.

## Foreground notification behavior

앱이 **foregrounded** 상태일 때 notification을 수신하면 어떻게 동작할지 처리하려면, [`Notifications.setNotificationHandler`](/versions/latest/sdk/notifications#handling-incoming-notifications-when-the-app-is)의 `handleNotification()` callback을 사용해 다음 옵션을 설정하세요.

-   `shouldPlaySound`
-   `shouldSetBadge`
-   `shouldShowBanner`
-   `shouldShowList`

```jsx
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});
```

## Closed notification behavior

Android에서는 사용자가 성능 및 배터리 최적화와 관련된 일부 OS 수준 설정을 바꿀 수 있으며, 이로 인해 앱이 닫혀 있을 때 notification 전달이 막힐 수 있습니다. 예를 들어 Android 9 이하를 사용하는 OnePlus 기기의 **Deep Clear** 옵션이 그중 하나입니다.
