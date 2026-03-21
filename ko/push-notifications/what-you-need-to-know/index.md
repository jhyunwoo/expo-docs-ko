---
modificationDate: March 06, 2026
title: notifications에 대해 알아야 할 것
description: 시작하기 전에 notification 유형과 그 동작 방식을 알아보세요.
---

# notifications에 대해 알아야 할 것

시작하기 전에 notification 유형과 그 동작 방식을 알아보세요.

Notifications는 앱이 적극적으로 사용 중이 아닐 때에도 사용자에게 새로운 정보나 이벤트를 알려주는 알림입니다. Notifications는 범위가 넓고 플랫폼마다 차이가 있기 때문에 구현이 부담스럽게 느껴질 수 있습니다.

notifications를 처음 시작하든 이미 어느 정도 알고 있든, 이 문서는 서로 다른 notification 유형과 그 동작 방식을 설명합니다.

Expo의 notification 지원은 Android와 iOS가 제공하는 네이티브 기능 위에 구축되어 있습니다. 네이티브 플랫폼의 동일한 개념과 동작 방식이 Expo 앱에도 적용됩니다. 특정 notification 기능이 확실하지 않다면 각 플랫폼의 [공식 문서](/push-notifications/what-you-need-to-know#external-references)를 확인하세요.

## Remote notifications와 Local notifications

1.  **Push Notifications**: ("remote notifications"라고도 함) 원격 서버에서 사용자의 디바이스로 전송되는 Notifications입니다.
2.  **Local Notifications**: ("in-app notifications"라고도 함) 앱 내부에서 생성되고 표시되는 Notifications입니다. 이러한 notifications를 만드는 API 중 상당수는 특정 시점에 이를 생성하므로, "scheduled notifications"라고 부르기도 합니다.

`expo-notifications`는 push notifications와 local notifications를 모두 지원합니다. Push notifications는 이 기능이 Expo Go에 내장되어 있지 않기 때문에 반드시 [development build](/develop/development-builds/introduction)을 사용해야 합니다.

local notification을 생성하고 표시하는 방법은 [in-app notifications](/versions/latest/sdk/notifications#present-a-local-in-app-notification-to-the-user)를 참고하세요. 이 가이드의 나머지 부분은 push notifications에 초점을 맞춥니다.

## Push Notification 전달

push notification이 앱에 도착했을 때의 동작은 앱의 상태와 notification 유형에 따라 달라집니다. 먼저 용어를 분명히 해보겠습니다:

### 애플리케이션 상태

-   **Foreground**: 앱이 foreground에서 활발하게 실행 중입니다. 현재 인터페이스가 화면에 표시되고 있습니다.
-   **Background**: 앱이 background에서 실행 중이며 "최소화"된 상태입니다. 현재 인터페이스는 화면에 표시되지 않습니다.
-   **Terminated**: 앱이 "종료"된 상태이며, 보통 앱 전환기에서 스와이프해 없앤 경우입니다. Android에서는 사용자가 디바이스 설정에서 앱을 강제 중지하면, notifications가 다시 동작하려면 앱을 수동으로 다시 열어야 합니다(Android의 제한 사항입니다).

### Push Notification 동작

어떤 종류의 notification이든, 앱이 foreground에 있을 때는 들어오는 notification을 어떻게 처리할지 앱이 제어합니다. 앱이 이를 직접 표시할 수도 있고, 커스텀 in-app UI를 보여줄 수도 있으며, 아예 무시할 수도 있습니다([`NotificationHandler`](/versions/latest/sdk/notifications#setnotificationhandlerhandler)가 이를 제어합니다). 앱이 foreground가 아닐 때의 동작은 notification 유형에 따라 달라집니다.

아래 표는 push notification이 디바이스에 전달되었을 때 어떤 일이 일어나는지 요약합니다:

| Notification Type | App in Foreground | App in Background | App Terminated |
| --- | --- | --- | --- |
| [Notification Message](/push-notifications/what-you-need-to-know#notification-message) and [Notification Message with data payload](/push-notifications/what-you-need-to-know#notification-message-with-data-payload) | 전달 시 [`NotificationReceivedListener`](/versions/latest/sdk/notifications#addnotificationreceivedlistenerlistener)와 [JS task](/versions/latest/sdk/notifications#registertaskasynctaskname) 실행 | OS가 notification 표시 | OS가 notification 표시 |
| [Headless Background Notification](/push-notifications/what-you-need-to-know#headless-background-notifications) | 전달 시 [`NotificationReceivedListener`](/versions/latest/sdk/notifications#addnotificationreceivedlistenerlistener)와 [JS task](/versions/latest/sdk/notifications#registertaskasynctaskname) 실행 | 전달 시 [JS task](/versions/latest/sdk/notifications#registertaskasynctaskname) 실행 | 전달 시 [JS task](/versions/latest/sdk/notifications#registertaskasynctaskname) 실행 |

사용자가 notification과 상호작용하는 경우(예: action button을 누르는 경우), 아래 핸들러를 사용할 수 있습니다.

| App state | iOS Listener(s) triggered | Android Listener(s) triggered |
| --- | --- | --- |
| Foreground | `NotificationResponseReceivedListener` | `NotificationResponseReceivedListener` |
| Background | `NotificationResponseReceivedListener` | `NotificationResponseReceivedListener` and [JS task](/versions/latest/sdk/notifications#registertaskasynctaskname) |
| Terminated | `NotificationResponseReceivedListener` | [JS task](/versions/latest/sdk/notifications#registertaskasynctaskname) |

위 표에서 `NotificationResponseReceivedListener`가 실행될 때마다 `useLastNotificationResponse`의 반환값도 함께 변경됩니다.

> 앱이 실행 중이 아니거나 종료된 상태에서 notification을 탭해 시작되는 경우, iOS에서 실행되도록 하려면 `NotificationResponseReceivedListener`를 초기에(module top-level) 등록해야 합니다. 앱을 foreground로 가져오는 action buttons의 경우에는, 앱 시작 후 `useLastNotificationResponse` 또는 `getLastNotificationResponse`를 사용해 응답을 포착하는 것을 권장합니다.

## Push Notification 유형

### Notification Message

Notification Message는 제목이나 본문 텍스트처럼 표시용 정보를 지정하는 notification입니다.

-   Android에서는 [`AndroidNotification`](https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#AndroidNotification)을 포함하는 push notification 요청에 해당합니다.
-   iOS에서는 [`aps.alert` dictionary](https://developer.apple.com/documentation/usernotifications/generating-a-remote-notification#Create-the-JSON-payload)를 포함하고 `apns-push-type` 헤더가 `alert`로 설정된 push notification 요청에 해당합니다.

Expo Push Service를 사용할 때 `title`, `subtitle`, `body`, `icon`, 또는 `channelId`를 지정하면, 결과로 만들어지는 push notification 요청은 Notification Message가 됩니다.

Notification Message의 일반적인 사용 사례는 추가 처리 없이 즉시 사용자에게 표시되도록 하는 것입니다.

### data payload가 있는 Notification Message

이것은 Android 전용 용어입니다([공식 문서 보기](https://firebase.google.com/docs/cloud-messaging/customize-messages/set-message-type#data-messages)). push notification 요청 안에 `data` 필드와 `notification` 필드가 모두 들어 있는 경우를 가리킵니다.

iOS에서는 추가 데이터가 일반적인 Notification Message 요청의 일부가 될 수 있습니다. Apple은 데이터를 포함하는 Notification Message와 그렇지 않은 Notification Message를 구분하지 않습니다.

### Headless Background Notifications

Headless Notification은 제목이나 본문 텍스트와 같은 표시용 정보를 직접 지정하지 않는 remote notification입니다. 아래 예외\*를 제외하면 headless notifications는 사용자에게 표시되지 않습니다. 대신 JSON 데이터를 담고 있으며, 이 데이터는 앱 안에서 [`registerTaskAsync`](/versions/latest/sdk/notifications#registertaskasynctaskname)로 정의한 JavaScript task에 의해 처리됩니다. 이 task는 임의의 로직을 수행할 수 있습니다. 예를 들어 `AsyncStorage`에 기록하거나, api 요청을 보내거나, push notification 데이터에서 가져온 내용을 사용해 local notification을 표시할 수 있습니다.

> 여기서 "Headless Background Notification"이라는 용어는 Android의 [Data Message](https://firebase.google.com/docs/cloud-messaging/customize-messages/set-message-type#data-messages)와 iOS의 [background notification](https://developer.apple.com/documentation/usernotifications/pushing-background-updates-to-your-app#Create-a-background-notification)을 가리키는 데 사용합니다. 두 notification 유형의 핵심 공통점은 둘 다 JSON 데이터만 보낼 수 있고, 앱에 의한 background processing을 허용한다는 점입니다.

Headless Background Notifications는 _앱이 종료된 상태에서도_ notification에 반응해 커스텀 JavaScript를 실행할 수 있습니다. 이는 강력하지만 제한도 있습니다. notification이 디바이스에 전달되더라도, OS는 앱으로의 전달을 보장하지 않습니다. 이는 Android에서 [Doze mode](https://developer.android.com/training/monitoring-device-state/doze-standby)가 활성화된 경우나, background notifications를 너무 많이 보낸 경우 등 여러 이유로 발생할 수 있습니다. Apple은 [시간당 두세 개를 넘기지 말 것](https://developer.apple.com/documentation/usernotifications/pushing-background-updates-to-your-app#overview)을 권장합니다.

Expo Push Service를 사용할 때 `data`와 `_contentAvailable: true`만 지정하고(`ttl`과 같은 다른 비상호작용 필드는 제외), 결과로 만들어지는 push notification 요청은 Headless Background Notification이 됩니다.

> iOS에서 Headless Background Notifications를 사용하려면 먼저 이를 [configure](/versions/latest/sdk/notifications#background-notification-configuration)해야 합니다.

경험적으로는 background에서 JavaScript 실행이 꼭 필요하지 않다면 일반적인 Notification Message를 우선 선택하는 것이 좋습니다.

\* 예외는 [`data`](https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#AndroidConfig) 안에 `title` 또는 `message`를 지정하는 경우입니다. 이 경우 `expo-notifications` 패키지는 Android에서는 headless notification을 자동으로 표시하지만, iOS에서는 그렇지 않습니다. 향후 릴리스에서는 이 동작을 플랫폼 간에 더 일관되게 만들 계획입니다.

### Data-only notifications

Android에는 [Data Messages](https://firebase.google.com/docs/cloud-messaging/customize-messages/set-message-type#data-messages)라는 개념이 있습니다. iOS에는 정확히 같은 개념은 없지만, 가장 가까운 대응 개념은 [Headless Background Notifications](/push-notifications/what-you-need-to-know#headless-background-notifications)입니다.

사용자에게 아무것도 표시하지 않는 notifications를 가리켜 "silent notification"이라는 용어를 볼 수도 있는데, 이 문서에서는 이를 [Headless Background Notifications](/push-notifications/what-you-need-to-know#headless-background-notifications)라고 설명합니다.

## External references

다음은 Android와 iOS의 push notifications에 대한 공식 자료 중 일부입니다:

-   [Android - Firebase Cloud Messaging message types](https://firebase.google.com/docs/cloud-messaging/customize-messages/set-message-type)
-   [iOS - Generating a remote notification](https://developer.apple.com/documentation/usernotifications/generating-a-remote-notification)
-   [iOS - Pushing background updates to your app](https://developer.apple.com/documentation/usernotifications/pushing-background-updates-to-your-app)
