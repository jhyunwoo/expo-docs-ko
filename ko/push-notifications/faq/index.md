---
modificationDate: December 05, 2025
title: Push notifications 문제 해결 및 FAQ
description: Expo push notification service에 관한 자주 묻는 질문 모음입니다.
---

# Push notifications 문제 해결 및 FAQ

Expo push notification service에 관한 자주 묻는 질문 모음입니다.

`expo-notifications` 라이브러리와 Expo push notification service로 push notification을 설정할 때 자주 발생하는 문제와 FAQ를 모아 둔 문서입니다.

## Expo push notification service FAQ

### Push notification service 비용

Expo push notification service를 통해 알림을 보내는 데 드는 비용은 없습니다.

### 알림 전송 한도

프로젝트당 초당 600개의 알림까지 전송할 수 있는 한도가 있습니다. 이 속도를 초과하면 초당 600개 아래로 다시 떨어질 때까지 이후 요청은 실패합니다.

최상의 결과를 위해 서버에 throttling(이는 [`expo-server-sdk-node`](https://github.com/expo/expo-server-sdk-node)에서 자동으로 처리됩니다)과 재시도 로직을 추가할 것을 권장합니다.

### Expo push notification service 사용은 필수가 아닙니다

Expo 프로젝트에서는 어떤 push notification 서비스든 사용할 수 있습니다. [`expo-notifications`의 `getDevicePushTokenAsync` 메서드](/versions/latest/sdk/notifications#getdevicepushtokenasync-devicepushtoken)를 사용하면 네이티브 디바이스 push token을 얻을 수 있고, 이를 다른 서비스와 함께 사용하거나 [FCM과 APNs를 통해 직접 알림을 전송](/push-notifications/sending-notifications-custom)할 수도 있습니다.

### Notification service와의 연결은 암호화됩니다

Expo와 Apple 및 Google 간의 연결은 암호화되어 있으며 HTTPS를 사용합니다.

### 알림 내용은 저장되지 않습니다

Expo는 push notification 내용을 Google과 Apple이 운영하는 push notification service로 전달하는 데 필요한 시간 이상으로 저장하지 않습니다. 알림은 데이터베이스가 아니라 메모리와 메시지 큐에만 저장됩니다.

### 알림 내용은 Expo 직원이 볼 수 있을 수 있습니다

Expo 팀이 push notifications service를 적극적으로 디버깅하는 중이라면 알림 내용(예: breakpoint에서)을 볼 수 있을 수 있지만, 그 외의 경우 Expo는 push notification 내용을 볼 수 없습니다.

### 전달 보장

Expo는 Google과 Apple이 운영하는 push notification service로 알림을 전달하기 위해 최선을 다합니다. Expo의 인프라는 하위 push notification service로의 최소 1회(at-least-once) 전달을 목표로 설계되어 있습니다. 드물지만 어떤 경우에는 알림이 Google 또는 Apple에 두 번 이상 전달되거나 전혀 전달되지 않을 수 있습니다.

알림이 하위 push notification service로 전달된 뒤 Expo는 전달이 성공했는지를 기록하는 "push receipt"를 생성합니다. push receipt는 하위 push notification service가 알림을 수신했는지를 나타냅니다.

마지막으로, Google과 Apple의 push notification service는 각자의 정책에 따라 알림을 기기에 전달합니다.

### `ExpoPushToken`은 언제, 왜 바뀌나요

`ExpoPushToken`은 앱 업그레이드 전반에 걸쳐 동일하게 유지됩니다. Android에서는 앱을 재설치하면 token이 바뀔 수 있습니다. iOS에서는 앱을 삭제했다가 다시 설치해도 token이 동일하게 유지됩니다.

또한 [`applicationId`](/versions/latest/sdk/application#applicationapplicationid)나 `experienceId`(보통 `@expoUsername/projectSlug`)를 변경하면 token도 바뀝니다.

`ExpoPushToken`은 절대 만료되지 않습니다. 하지만 사용자 중 한 명이 앱을 삭제하면 Expo 서버에서 `DeviceNotRegistered` 오류를 받게 됩니다. 이는 해당 token으로는 더 이상 알림을 보내지 말아야 한다는 뜻입니다.

## Push notifications 문제 해결

### 알림이 동작하지 않습니다

Push notification에는 움직이는 부분이 많기 때문에 다양한 이유로 이런 문제가 생길 수 있습니다. 범위를 좁히려면 [push ticket](/push-notifications/sending-notifications#push-tickets)과 [push receipt](/push-notifications/sending-notifications#push-receipts)의 오류 메시지를 확인하세요.

앱에서 [local notifications](/versions/latest/sdk/notifications#schedulenotificationasyncnotificationrequest-notificationrequestinput-promisestring)를 테스트해 더 좁혀볼 수도 있습니다. 이렇게 하면 클라이언트 측 로직이 모두 올바른지 확인할 수 있고, 원인을 서버 측 또는 앱 credential 쪽으로 좁힐 수 있습니다.

push receipt를 가져오는 데 사용할 수 있는 빠른 터미널 명령은 다음과 같습니다.

1.  알림 전송:

```sh
curl -H "Content-Type: application/json" -X POST "https://exp.host/--/api/v2/push/send" -d '{
  "to": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
  "title":"hello",
  "body": "world"
}'
```

2.  반환된 ticket `id`를 사용해 push receipt를 요청:

```sh
curl -H "Content-Type: application/json" -X POST "https://exp.host/--/api/v2/push/getReceipts" -d '{
  "ids": [
    "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
  ]
}'
```

### 개발에서는 동작하지만 release mode에서는 알림이 동작하지 않습니다

이 경우 credential을 잘못 설정했거나, 프로덕션 앱에 전혀 설정하지 않았을 가능성이 큽니다. SDK 53 이상에서는 Expo Go가 push notifications 기능을 지원하지 않으므로, push를 테스트하려면 [development build](/develop/development-builds/introduction)를 사용해야 합니다. SDK 52 이하에서는 Expo Go가 Expo의 credential을 사용했기 때문에, 자체 credential을 설정하지 않아도 개발 중 push notifications가 동작할 수 있었습니다.

앱을 앱 스토어용으로 빌드할 때는 직접 credential을 생성해서 사용해야 합니다. Android는 [이 가이드](/push-notifications/fcm-credentials)를 따르세요. iOS에서는 [push key](/app-signing/app-credentials#push-notification-keys)가 이 역할을 담당합니다(앱과 연결된 push key를 revoke하면 알림이 전달되지 않게 됩니다. 이 경우 `eas credentials`로 새 push key를 추가하세요).

자세한 내용은 [app signing](/app-signing/app-credentials)을 참고하세요.

### Android에서 알림이 가끔씩 오지 않습니다

이는 대개 전송 중인 알림의 `priority` 수준 때문입니다. [Android priority](https://firebase.google.com/docs/cloud-messaging/http-server-ref#downstream-http-messages-json)에 대해 더 알아볼 수 있습니다. [Expo는 네 가지 priority를 허용합니다](/push-notifications/sending-notifications#message-request-format).

-   `default`: Apple과 Google 문서의 기본 priority에 수동 매핑됩니다
-   `high`: Apple과 Google 문서의 high priority 수준에 매핑됩니다
-   `normal`: Apple과 Google 문서의 normal priority 수준에 매핑됩니다
-   (priority omitted): `default`를 지정한 것과 정확히 동일하게 처리됩니다

priority를 `high`로 설정하면 Android가 알림을 표시할 가능성이 가장 높아집니다.

### 만료된 push notification credential 처리하기

push notification credential이 만료되면 `eas credentials`를 실행하고, iOS와 build profile을 선택한 뒤, push notification key를 제거하고 새 키를 생성하세요.

### iOS에서 No valid aps-environment entitlement string found 오류

이 오류는 iOS 프로젝트에 push notification key를 설정하지 않았을 때 발생합니다. 확인하려면 [Project Credentials page](https://expo.dev/accounts/%5Baccount%5D/projects/%5Bproject%5D/credentials/ios)로 이동하세요.

새 push notification key를 생성하려면 다음 명령으로 새 빌드를 트리거하세요.

```sh
eas build --profile [profile] --platform ios
```

시각적인 가이드는 [Expo Notifications with EAS video](https://youtu.be/BCCjGtKtBjE?t=2123)를 참고하세요.

### 알림 전송 시 오류 메시지

더 자세한 정보는 반환된 push ticket 또는 receipt의 `details` 속성을 확인하세요. 일반적인 오류 코드 응답과 각 해결 방법은 [여기](/push-notifications/sending-notifications#errors)를 참고하세요.

### iOS에서 push token 가져오기에 시간이 오래 걸립니다

`getDevicePushTokenAsync`와 `getExpoPushTokenAsync`는 iOS에서 가끔 resolve되기까지 오래 걸릴 수 있습니다. 이는 `expo-notifications`가 제어할 수 없는 부분이며, Apple의 [Troubleshooting Push Notifications](https://developer.apple.com/library/archive/technotes/tn2265/_index.html) 기술 노트에도 다음과 같이 나와 있습니다.

> 이것이 반드시 오류 상태를 의미하는 것은 아닙니다. 시스템이 기지국이나 Wi-Fi 액세스 포인트 범위를 벗어나 있거나 비행기 모드이기 때문에 인터넷 연결이 전혀 없을 수 있습니다. 이를 오류로 취급하는 대신, 앱은 정상적으로 계속 동작해야 하며 push notifications에 의존하는 기능만 비활성화해야 합니다.

커뮤니티 구성원들이 이 문제를 해결한 몇 가지 방법은 다음과 같습니다.

Apple의 push notifications 문제 해결 Technical Note 읽기

Apple의 [Technical Note on troubleshooting push notifications](https://developer.apple.com/library/archive/technotes/tn2265/_index.html)를 읽어 보세요. 이 문제에 대한 가장 신뢰할 수 있는 단일 정보원입니다. Apple이 제안하는 내용을 더 잘 이해할 수 있도록 정리하면 다음과 같습니다.

-   기기가 안정적으로 인터넷에 연결되어 있는지 확인하세요(Wi-Fi를 끄거나 다른 네트워크로 전환해 보고, [이 SO answer](https://stackoverflow.com/a/34332047/1123156)에서 제안한 것처럼 5223 포트 방화벽 차단을 해제해 보세요).
-   **Bare React Native apps**는 **Push Notifications** capability를 [수동으로 활성화](/build-reference/ios-capabilities#manual-setup)해야 합니다. 이를 설정하는 데 문제가 있다면 [this Stack Overflow answer](https://stackoverflow.com/a/10791240/1123156)를 참고하세요. [this Stack Overflow answer](https://stackoverflow.com/a/8036052/1123156)에 설명된 것처럼 persistent connection debug 정보를 로깅해 더 깊게 디버깅해 보는 것도 좋습니다.

잠시 후 다시 시도해 보기

-   [this forum thread](https://developer.apple.com/forums/thread/52224)에서 언급된 것처럼, 기기 근처 APNS 서버가 다운되었을 수 있습니다. 잠깐 산책하고 나중에 다시 시도해 보세요!
-   [this GitHub comment](https://github.com/expo/expo/issues/10369#issuecomment-717872956)에서 제안한 것처럼 며칠 뒤에 다시 시도해 보세요.

기기에서 네트워크 공유 끄기

[this Stack Overflow answer](https://stackoverflow.com/a/59156989/1123156)에서 제안한 것처럼, 네트워크 공유가 등록 과정에 영향을 줄 수 있으므로 이를 끄는 것이 필요할 수 있습니다.

기기 재시작하기

같은 기기에서 Xcode 빌드 위에 TestFlight 빌드를 설치하는 식으로 앱이 등록해야 하는 APNS 서버를 방금 바꿨다면, [this Stack Overflow answer](https://stackoverflow.com/a/59864028/1123156)에서 제안한 것처럼 기기를 재시작해야 할 수 있습니다.

SIM 카드를 넣어 기기 설정하기

이 문제가 발생하는 기기에 SIM 카드가 설정되어 있지 않다면, [this Stack Overflow answer](https://stackoverflow.com/a/19432504/1123156)에서 제안한 것처럼 이를 설정하면 이 버그 완화에 도움이 될 수 있습니다.

## Miscellaneous

### FCM과 APNs를 통해 직접 알림 보내기

[Expo push notification service](/push-notifications/sending-notifications)을 사용하지 않고 Google과 Apple과 직접 통신하고 싶다면, [Send notifications with FCM and APNs](/push-notifications/sending-notifications-custom)를 참고하세요.

### Android에서 notification icon이 회색 또는 흰색 사각형으로 보입니다

이는 제공한 이미지 asset에 문제가 있음을 의미합니다. 이미지는 투명 배경에 완전히 흰색이어야 합니다(이는 Expo가 아니라 Google이 요구하고 강제하는 사항입니다). 자세한 내용은 [this article](https://clevertap.com/blog/fixing-notification-icon-for-android-lollipop-and-above/)를 참고하세요.
