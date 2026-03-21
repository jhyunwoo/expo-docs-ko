---
modificationDate: March 06, 2026
title: Expo Push Service로 notifications 보내기
description: 서버에서 push notifications를 보내기 위해 Expo Push Service API를 호출하는 방법을 알아보세요.
---

# Expo Push Service로 notifications 보내기

서버에서 push notifications를 보내기 위해 Expo Push Service API를 호출하는 방법을 알아보세요.

[`expo-notifications`](/versions/latest/sdk/notifications) 라이브러리는 push notifications에 필요한 모든 클라이언트 측 기능을 제공합니다. Expo는 또한 push notifications를 FCM과 APNs로 전달하고, 이 서비스들이 다시 특정 디바이스로 전송하도록 처리합니다. 여러분이 해야 할 일은 [`getExpoPushTokenAsync`](/versions/latest/sdk/notifications#getexpopushtokenasyncoptions)로 얻은 `ExpoPushToken`과 함께 Expo Push API에 요청을 보내는 것뿐입니다.

> APNs와 FCM과 직접 통신하는 서버를 직접 구축하고 싶다면 [FCM과 APNs로 notifications 보내기](/push-notifications/sending-notifications-custom)를 참고하세요. Expo Push Service를 사용하는 것보다 더 복잡하지만, 더 세밀한 제어와 FCM 및 APNs의 모든 기능에 대한 완전한 접근을 제공합니다.

## 서버를 사용해 push notifications 보내기

push notification 자격 증명을 설정하고 `ExpoPushToken`을 얻는 로직을 추가한 뒤에는, HTTPS POST 요청을 사용해 이를 Expo API로 보낼 수 있습니다. 데이터베이스를 갖춘 서버를 구축해서 처리할 수도 있고(또는 이를 보내기 위한 커맨드라인 도구를 작성하거나 앱에서 직접 보낼 수도 있습니다).

Expo 팀과 커뮤니티는 이미 몇 가지 언어로 백엔드를 만들어 두었습니다:

| SDKs | Back-end | Maintained by |
| --- | --- | --- |
| [expo-server-sdk-node](https://github.com/expo/expo-server-sdk-node) | Node.js | Expo team |
| [expo-server-sdk-python](https://github.com/expo/expo-server-sdk-python) | Python | Community |
| [expo-server-sdk-ruby](https://github.com/expo/expo-server-sdk-ruby) | Ruby | Community |
| [expo-push-notification-client-rust](https://github.com/katayama8000/expo-push-notification-client-rust) | Rust | Community |
| [expo-notifier](https://github.com/symfony/expo-notifier) | Symfony | Symfony |
| [exponent-server-sdk-php](https://github.com/Alymosul/exponent-server-sdk-php) | PHP | Community |
| [expo-server-sdk-php](https://github.com/ctwillie/expo-server-sdk-php) | PHP | Community |
| [exponent-server-sdk-golang](https://github.com/oliveroneill/exponent-server-sdk-golang) | Golang | Community |
| [exponent](https://github.com/9ssi7/exponent) | Golang | Community |
| [exponent-server-sdk-elixir](https://github.com/pachun/exponent-server-sdk-elixir) | Elixir | Community |
| [expo-server-sdk-dotnet](https://github.com/glyphard/expo-server-sdk-dotnet) | dotnet | Community |
| [expo-server-sdk-java](https://github.com/hlspablo/expo-server-sdk-java) | Java | Community |
| [laravel-expo-notifier](https://github.com/YieldStudio/laravel-expo-notifier) | Laravel | Community |

위의 예제 서버들은 모두 Expo Push Service API를 감싼 wrapper입니다.

## push notifications를 안정적으로 구현하기

Push Notifications는 서버에서 수신 디바이스까지 여러 시스템을 거쳐 이동합니다. Notifications는 대부분의 경우 전달됩니다. 하지만 중간에 있는 시스템들과 그 사이의 네트워크 연결에 가끔 문제가 생길 수 있습니다. 오류를 처리하면 push notifications가 목적지에 더 안정적으로 도착하도록 도울 수 있습니다.

### 동시 연결 수 제한하기

한 번에 많은 양의 push notifications를 보낼 때는 동시 연결 수를 제한하세요. [Node SDK](https://github.com/expo/expo-server-sdk-node)는 이 기능을 이미 구현하고 있으며 최대 여섯 개의 동시 연결만 엽니다. 이렇게 하면 순간 부하를 완화하고 Expo push notification 서비스가 push notification 요청을 더 안정적으로 받을 수 있도록 도와줍니다.

### 실패 시 재시도하기

push notifications 전송의 첫 단계는 이를 Expo push notification 서비스에 전달하는 것이며, 이 서비스는 내부적으로 이를 Google(FCM v1)과 Apple(APNs)로 전달하기 위한 queue에 넣습니다. 이 첫 단계는 여러 이유로 실패할 수 있습니다:

-   서버와 Expo push notification 서비스 사이의 네트워크 문제
-   Expo notification 서비스의 장애 또는 성능 저하
-   잘못 구성된 push credentials
-   유효하지 않은 notification payload

이러한 실패 중 일부는 일시적입니다. 예를 들어 Expo push notification 서비스가 다운되었거나 도달할 수 없는 상태에서 네트워크 오류, HTTP 429 오류(Too Many Requests), 또는 HTTP 5xx 오류(Server Errors)를 받았다면, 몇 초 기다린 뒤 [exponential backoff](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/)를 사용해 재시도하세요. 첫 번째 재시도가 실패하면 더 오래 기다린 뒤(exponential backoff에 따라) 다시 재시도하세요. 이렇게 하면 일시적으로 사용할 수 없는 서비스가 복구할 시간을 주게 됩니다.

다른 실패는 저절로 해결되지 않습니다. 예를 들어 push notification payload 형식이 잘못되었다면 payload 문제를 설명하는 HTTP 400 응답을 받을 수 있습니다. 프로젝트에 push credentials가 없거나, 하나의 요청에 서로 다른 프로젝트의 push notifications를 함께 보내는 경우에도 오류가 발생합니다.

### 오류 확인을 위해 push receipts 확인하기

Expo push notification 서비스는 notifications를 성공적으로 수신하면 [**push tickets**](/push-notifications/sending-notifications#push-tickets)로 응답합니다. Push ticket은 Expo가 notification payload를 수신했음을 의미하지만, 아직 실제 전송은 진행 중일 수 있습니다. 각 push ticket에는 ticket ID가 포함되며, 나중에 이를 사용해 [push receipt](/push-notifications/sending-notifications#push-receipts)를 조회합니다. Push receipt는 Expo가 FCM 또는 APNs로 전달을 시도한 뒤에 사용할 수 있습니다. 이를 통해 push notification provider로의 전달이 성공했는지 알 수 있습니다.

반드시 push receipts를 확인해야 합니다. push notifications 전달에 문제가 있다면, push receipts는 근본 원인에 대한 정보를 얻는 가장 좋은 방법입니다. 예를 들어 receipts는 FCM 또는 APNs, Expo push notification 서비스, 혹은 notification payload 자체의 문제를 알려줄 수 있습니다.

Push receipts는 또한 수신 디바이스가 notifications 구독을 해제했는지(예: notification 권한 철회 또는 앱 삭제) 여부도 알려줄 수 있습니다. APNs 또는 FCM이 해당 정보를 응답하면, push receipt에는 `details` → `error` 필드가 `DeviceNotRegistered`로 설정됩니다. 이 경우 해당 디바이스가 서버에 다시 등록할 때까지 그 디바이스의 push token으로 notifications 전송을 중단해야 앱이 좋은 시민 역할을 유지할 수 있습니다. `DeviceNotRegistered` 오류는 Google 또는 Apple이 해당 디바이스를 미등록 상태라고 판단할 때만 push receipts에 나타납니다. 이 상태가 반영되기까지 걸리는 시간은 정의되어 있지 않으며, 앱을 삭제하고 직후 push notification을 보내는 방식으로는 테스트가 거의 불가능한 경우가 많습니다.

push notifications를 보낸 후 15분 뒤에 push receipts를 확인하는 것을 권장합니다. push receipts는 보통 훨씬 빨리 준비되지만, 15분의 여유를 두면 Expo push notification 서비스가 receipts를 사용자에게 제공할 수 있도록 충분한 시간을 확보할 수 있습니다. 15분이 지나도 push receipt가 없다면, 이는 Expo push notification 서비스에 오류가 있음을 의미할 가능성이 높습니다. 마지막으로 push receipts는 24시간 후 삭제됩니다.

### SLA

Expo push notification 서비스에는 SLA가 없고, FCM과 APNs 서비스도 가끔 장애가 발생할 수 있습니다. 위 가이드를 따르면 일시적인 서비스 중단에 대해서도 애플리케이션을 더 견고하게 만들 수 있습니다.

## HTTP/2 API

앞서 나열한 라이브러리 중 하나를 사용하는 대신, HTTP/2 API로 직접 요청을 보내고 싶을 수도 있습니다(이 API는 현재 인증이 필요하지 않습니다).

이렇게 하려면 다음 HTTP 헤더와 함께 `https://exp.host/--/api/v2/push/send`로 POST 요청을 보내세요:

```text
host: exp.host
accept: application/json
accept-encoding: gzip, deflate
content-type: application/json
```

다음은 터미널에서 보낼 수 있는 cURL 기반 "hello world" push notification입니다(placeholder push token을 자신의 값으로 바꾸세요):

```sh
curl -H "Content-Type: application/json" -X POST "https://exp.host/--/api/v2/push/send" -d '{
  "to": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
  "title":"hello",
  "body": "world"
}'
```

요청 본문은 JSON이어야 합니다. 위 예시처럼 단일 [message object](/push-notifications/sending-notifications#message-request-format)일 수도 있고, 아래처럼 모두 동일한 프로젝트에 속하는 최대 100개의 message object 배열일 수도 있습니다. **여러 메시지를 보내려면 Expo 서버로 보내야 하는 요청 수를 효율적으로 줄이기 위해 배열 사용을 권장합니다.** 다음은 네 개의 메시지를 보내는 요청 본문 예시입니다:

```json
[
  {
    "to": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
    "sound": "default",
    "body": "Hello world!"
  },
  {
    "to": "ExponentPushToken[yyyyyyyyyyyyyyyyyyyyyy]",
    "badge": 1,
    "body": "You've got mail"
  },
  {
    "to": [
      "ExponentPushToken[zzzzzzzzzzzzzzzzzzzzzz]",
      "ExponentPushToken[aaaaaaaaaaaaaaaaaaaaaa]"
    ],
    "body": "Breaking news!"
  }
]
```

Expo Push Service는 gzip으로 압축된 요청 본문도 선택적으로 받을 수 있습니다. 이는 많은 수의 notifications를 보낼 때 필요한 업로드 대역폭을 크게 줄여줍니다. [Node Expo Server SDK](https://github.com/expo/expo-server-sdk-node)는 요청을 자동으로 gzip 처리하고 요청 빈도도 자동으로 조절하여 부하를 완화하므로, 이를 강력히 권장합니다.

### Push tickets

위 요청들에 대한 응답은 `data`와 `errors`라는 두 개의 선택적 필드를 가진 JSON object입니다. `data`에는 메시지를 보낸 순서와 동일한 순서의 [**push tickets**](/push-notifications/sending-notifications#push-ticket-format) 배열이 들어 있습니다(또는 단일 수신자에게 하나의 메시지를 보내는 경우 단일 push ticket object). 각 ticket에는 Expo가 notification을 성공적으로 수신했는지 나타내는 `status` 필드가 포함되며, 성공한 경우 나중에 push receipt를 조회할 수 있는 `id` 필드도 포함됩니다.

> `ok` 상태와 receipt ID가 함께 있다는 것은 메시지가 Expo 서버에 수신되었다는 의미이며, 사용자가 수신했다는 뜻은 **아닙니다**(그 여부는 [push receipt](/push-notifications/sending-notifications#push-receipts)를 확인해야 합니다).

위 예제를 계속 사용하면, 성공적인 응답 본문은 다음과 같습니다:

```json
{
  "data": [
    { "status": "ok", "id": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX" },
    { "status": "ok", "id": "YYYYYYYY-YYYY-YYYY-YYYY-YYYYYYYYYYYY" },
    { "status": "ok", "id": "ZZZZZZZZ-ZZZZ-ZZZZ-ZZZZ-ZZZZZZZZZZZZ" },
    { "status": "ok", "id": "AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA" }
  ]
}
```

요청 전체에는 문제가 없지만 개별 메시지에 오류가 있는 경우, 해당 잘못된 메시지의 push ticket에는 `error` 상태와 함께 아래처럼 오류를 설명하는 필드가 들어 있습니다:

```json
{
  "data": [
    {
      "status": "error",
      "message": "\"ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]\" is not a registered push notification recipient",
      "details": {
        "error": "DeviceNotRegistered"
      }
    },
    {
      "status": "ok",
      "id": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
    }
  ]
}
```

요청 전체가 실패하면 HTTP 상태 코드는 4xx 또는 5xx가 되며, `errors` 필드는 오류 object들의 배열(보통 하나)입니다. 그렇지 않으면 HTTP 상태 코드는 200이고 메시지는 Android 및 iOS push notification 서비스로 전달됩니다.

### Push receipts

Expo는 notification 배치를 받은 뒤 각 notification을 Android와 iOS push notification 서비스(각각 FCM과 APNs)에 전달하기 위해 queue에 넣습니다. 대부분의 notifications는 일반적으로 몇 초 내에 전달됩니다. 하지만 Android 또는 iOS push notification 서비스가 notifications를 수신하고 전달하는 데 평소보다 오래 걸리거나, Expo의 Push Service 인프라가 높은 부하를 받고 있다면 더 오래 걸릴 수 있습니다.

Expo가 notification을 Android 또는 iOS push notification 서비스에 전달하면, 해당 서비스가 notification을 성공적으로 수신했는지 나타내는 [**push receipt**](/push-notifications/sending-notifications#push-receipt-response-format)를 생성합니다. notification 전달에 오류가 있었다면(예: 잘못된 credentials 또는 서비스 중단), push receipt에는 그 오류에 대한 추가 정보가 포함됩니다.

push receipts를 가져오려면 `https://exp.host/--/api/v2/push/getReceipts`로 POST 요청을 보내세요. [request body](/push-notifications/sending-notifications#push-receipt-request-format)는 `ids`라는 필드 이름을 가진 JSON object여야 하며, 이 필드는 ticket ID 문자열 배열입니다:

```sh
curl -H "Content-Type: application/json" -X POST "https://exp.host/--/api/v2/push/getReceipts" -d '{
  "ids": [
    "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
    "YYYYYYYY-YYYY-YYYY-YYYY-YYYYYYYYYYYY",
    "ZZZZZZZZ-ZZZZ-ZZZZ-ZZZZ-ZZZZZZZZZZZZ"
  ]
}'
```

[response body](/push-notifications/sending-notifications#push-receipt-response-format)는 push tickets의 응답과 매우 유사하며, `data`와 `errors`라는 두 개의 선택적 필드를 가진 JSON object입니다. `data`에는 receipt ID와 receipt의 매핑이 포함됩니다. Receipts에는 `status` 필드가 있으며, `"status": "error"`인 경우 선택적인 `message`와 `details` 필드도 포함됩니다. 요청한 receipt ID에 대한 push receipt가 없으면, 해당 ID는 매핑에 포함되지 않습니다. 위 요청에 대한 성공적인 응답은 다음과 같습니다:

```json
{
  "data": {
    "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX": { "status": "ok" },
    "ZZZZZZZZ-ZZZZ-ZZZZ-ZZZZ-ZZZZZZZZZZZZ": { "status": "ok" }
    // When there is no receipt with a given ID (YYYYYYYY-YYYY-YYYY-YYYY-YYYYYYYYYYYY in this
    // example), the ID is omitted from the response.
  }
}
```

**각 push receipt는 반드시 확인해야 합니다. 해결해야 할 오류에 대한 정보가 들어 있을 수 있기 때문입니다.** 예를 들어 디바이스가 더 이상 notifications를 받을 수 없는 상태라면, Apple 문서는 해당 디바이스로 notifications 전송을 중단하라고 요구합니다. Push receipts에는 이런 오류에 대한 정보가 포함됩니다.

> receipt의 `status`가 `ok`라고 하더라도 디바이스가 실제로 메시지를 받았다는 뜻은 아닙니다. push receipt에서의 "ok"는 Android(FCM) 또는 iOS(APNs) push notification 서비스가 notification을 성공적으로 받았다는 의미입니다. 예를 들어 수신 디바이스가 꺼져 있다면, iOS 또는 Android push notification 서비스는 메시지 전달을 시도하겠지만 디바이스가 실제로 수신하지는 못할 수 있습니다.

요청 전체가 실패하면 HTTP 상태 코드는 4xx 또는 5xx이며 `errors` 필드는 오류 object들의 배열(보통 하나)입니다. 그렇지 않으면 HTTP 상태 코드는 200이고 메시지는 사용자 디바이스로 향하게 됩니다.

## Errors

Expo는 이 전체 과정에서 발생하는 모든 오류에 대한 세부 정보를 제공합니다. 아래에서는 가장 흔한 오류 몇 가지를 다루며, 서버에서 이를 자동으로 처리하는 로직을 구현할 수 있도록 안내합니다.

어떤 이유로든 Expo가 Android 또는 iOS push notification 서비스로 메시지를 전달하지 못했다면, push receipt의 details에는 서비스별 정보가 포함될 수도 있습니다. 이는 주로 디버깅과 Expo에 가능한 버그를 보고할 때 유용합니다.

### 개별 오류

push tickets와 push receipts 둘 다에서 `error` 필드가 있는 `details` object를 찾으세요. 있다면 다음 값 중 하나일 수 있으며, 각 오류는 아래 방식으로 처리해야 합니다:

### Push ticket errors

-   `DeviceNotRegistered`: 해당 디바이스는 더 이상 push notifications를 받을 수 없으므로, 대응되는 Expo push token으로 메시지를 보내는 것을 중단해야 합니다.

### Push receipt errors

-   `DeviceNotRegistered`: 해당 디바이스는 더 이상 push notifications를 받을 수 없으므로, 대응되는 Expo push token으로 메시지를 보내는 것을 중단해야 합니다.
    
-   `MessageTooBig`: notification payload 전체가 너무 큽니다. Android와 iOS에서는 전체 payload가 최대 4096 bytes 이하여야 합니다.
    
-   `MessageRateExceeded`: 해당 디바이스로 메시지를 너무 자주 보내고 있습니다. exponential backoff를 구현하고 천천히 재시도하세요.
    
-   `MismatchSenderId`: 이는 FCM push credentials에 문제가 있음을 나타냅니다. FCM push credentials는 두 부분으로 구성됩니다: FCM server key와 **google-services.json** 파일입니다. 둘 다 동일한 sender ID와 연결되어 있어야 합니다. sender ID는 [server key를 찾는 같은 위치](/push-notifications/push-notifications-setup#upload-server-credentials)에서 찾을 수 있습니다. 프로젝트의 EAS dashboard에서 **Credentials** > **Application identifier** > **Service Credentials** > **FCM V1 service account key** 아래의 server key와, 프로젝트의 **google-services.json** > `project_number`에 있는 sender ID가 Firebase console의 **Project Settings** > **Cloud Messaging** 탭 > **Cloud Messaging API (Legacy)**에 표시된 값과 같은지 확인하세요.
    
-   `InvalidCredentials`: standalone app용 push notification credentials가 유효하지 않습니다(예: 취소되었을 수 있습니다).
    
    -   **Android**: [FCM V1 server credentials 업로드](/push-notifications/fcm-credentials)에 설명된 대로 Firebase Console의 server key를 올바르게 업로드했는지 확인하세요.
    -   **iOS**: `eas credentials`를 실행하고 안내에 따라 새 push notification credentials를 다시 생성하세요. APN key를 취소하면 그 key에 의존하는 모든 앱은 새 key를 업로드해 대체할 때까지 push notifications를 보내거나 받을 수 없게 됩니다. 새 APN key를 업로드해도 사용자의 Expo Push Token은 **변경되지 않습니다**. 때때로 이런 오류에는 추가 details로 `InvalidProviderToken` 오류가 포함되기도 합니다. 이는 실제로 APN key **와** provisioning profile 모두와 관련이 있습니다. 이 오류를 해결하려면 앱을 다시 빌드하고 새 push key와 provisioning profile을 다시 생성해야 합니다.

> push notification credentials를 포함한 iOS credentials에 대해 더 잘 이해하려면 [App Signing docs](/app-signing/app-credentials#ios)를 읽어보세요.

### 요청 오류

push tickets든 push receipts든 전체 요청에 오류가 있다면, `errors` object에 다음 값 중 하나가 들어 있을 수 있으며, 이 오류들은 아래와 같이 처리해야 합니다:

-   `TOO_MANY_REQUESTS`: 프로젝트당 초당 600 notifications의 요청 한도를 초과하고 있습니다. 서버에서 초당 600개가 넘는 notifications를 보내지 않도록 rate-limiting을 구현하는 것을 권장합니다([expo-server-sdk-node](https://github.com/expo/expo-server-sdk-node)를 사용하면 재시도용 exponential backoff와 함께 이미 구현되어 있습니다).
    
-   `PUSH_TOO_MANY_EXPERIENCE_IDS`: `@username/projectAAA`와 `@username/projectBBB`처럼 서로 다른 Expo experience로 push notifications를 보내려고 하고 있습니다. `details` 필드에서 experience 이름과 요청에 포함된 push token 매핑을 확인한 뒤, 다른 experience에 속한 항목을 제거하세요.
    
-   `PUSH_TOO_MANY_NOTIFICATIONS`: 하나의 요청에서 100개를 초과하는 push notifications를 보내려고 하고 있습니다. 각 요청에서 100개 이하의 notifications만 보내도록 하세요.
    
-   `PUSH_TOO_MANY_RECEIPTS`: 하나의 요청에서 1000개를 초과하는 push receipts를 조회하려고 하고 있습니다. push receipts를 조회할 때는 1000개 이하의 ticket ID 문자열 배열만 보내도록 하세요.
    

## 추가 보안

유효한 [access token](/accounts/programmatic-access)과 함께 전송된 push 요청만 사용자에게 전달되도록 설정할 수 있습니다. 이 강화된 push security는 [EAS Dashboard](https://expo.dev/settings/access-tokens)에서 활성화할 수 있습니다.

기본적으로는 사용자의 Expo Push Token과 메시지에 필요한 텍스트 또는 추가 데이터를 함께 보내면 사용자에게 notification을 보낼 수 있습니다. 설정하기는 쉽지만, **만약 token이 유출되면 악의적인 사용자가 서버를 사칭해 여러분의 사용자에게 자신의 메시지를 보낼 수 있습니다.** 지금까지 이런 보고 사례는 없었습니다. 하지만 더 나은 보안 실천을 위해, push token과 함께 access token을 사용하는 추가 보안 계층을 제공합니다.

[`expo-server-sdk-node`](https://github.com/expo/expo-server-sdk-node#usage)를 사용 중이라면 최소 `v3.6.0` 이상으로 업그레이드하고 constructor 옵션으로 `accessToken`을 전달하세요. 그렇지 않다면 push API 요청에 `'Authorization': 'Bearer ${accessToken}'` 헤더를 함께 전달하세요.

push security를 활성화한 뒤 _유효한 access token 없이_ 전송된 모든 요청은 `UNAUTHORIZED` 코드 오류를 반환합니다.

## Formats

### Message request format

각 메시지는 다음 필드를 가진 JSON object여야 합니다(`to` 필드만 필수입니다):

| Field | Platform | Type | Description |
| --- | --- | --- | --- |
| `to` | Android and iOS | `string | string[]` | 이 메시지의 수신자를 지정하는 Expo push token 또는 Expo push token 배열입니다. |
| `_contentAvailable` | iOS Only | `boolean | undefined` | 이 값이 true로 설정되면 notification이 iOS 앱을 백그라운드에서 시작해 [background task](/versions/latest/sdk/notifications#background-notifications)를 실행하게 합니다. 앱은 이를 지원하도록 [configured](/versions/latest/sdk/notifications#background-notification-configuration)되어 있어야 합니다. |
| `data` | Android and iOS | `Object` | 앱으로 전달되는 JSON object입니다. 크기는 약 4KiB까지 가능하며, Apple과 Google로 전송되는 전체 notification payload는 최대 4KiB 이하여야 합니다. 그렇지 않으면 "Message Too Big" 오류가 발생합니다. |
| `title` | Android and iOS | `string` | notification에 표시할 제목입니다. 보통 notification 본문 위에 표시됩니다. [`AndroidNotification.title`](https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#AndroidNotification) 및 [`aps.alert.title`](https://developer.apple.com/documentation/usernotifications/generating-a-remote-notification#Payload-key-reference)에 매핑됩니다. |
| `body` | Android and iOS | `string` | notification에 표시할 메시지입니다. [`AndroidNotification.body`](https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#AndroidNotification) 및 [`aps.alert.body`](https://developer.apple.com/documentation/usernotifications/generating-a-remote-notification#Payload-key-reference)에 매핑됩니다. |
| `ttl` | Android and iOS | `number` | Time to Live: 아직 전달되지 않았을 경우 재전달을 위해 메시지를 유지할 수 있는 초 단위 시간입니다. 기본값은 `undefined`이며 각 provider의 기본값을 사용합니다(Android/FCM과 iOS/APNs 모두 1개월). |
| `expiration` | Android and iOS | `number` | 메시지가 만료되는 시점을 Unix epoch 기준 timestamp로 지정합니다. `ttl`과 동일한 효과를 가지며(`ttl`이 `expiration`보다 우선합니다). |
| `priority` | Android and iOS | `'default' | 'normal' | 'high'` | 메시지의 전달 우선순위입니다. 각 플랫폼의 기본 우선순위(Android에서는 "normal", iOS에서는 "high")를 사용하려면 `default`를 지정하거나 이 필드를 생략하세요. |
| `subtitle` | iOS Only | `string` | notification 제목 아래 표시할 부제목입니다. [`aps.alert.subtitle`](https://developer.apple.com/documentation/usernotifications/generating-a-remote-notification#Payload-key-reference)에 매핑됩니다. |
| `sound` | iOS Only | `string | null` | 수신자가 이 notification을 받을 때 소리를 재생합니다. 기기의 기본 notification 소리를 재생하려면 `default`를 지정하고, 소리를 재생하지 않으려면 이 필드를 생략하세요. 커스텀 소리는 config plugin을 통해 [configured](/versions/latest/sdk/notifications#configurable-properties)되어 있어야 하며, 파일 확장자를 포함해 지정해야 합니다. 예: `bells_sound.wav`. |
| `badge` | iOS Only | `number` | 앱 아이콘 배지에 표시할 숫자입니다. 배지를 지우려면 0을 지정하세요. |
| `interruptionLevel` | iOS Only | `'active' | 'critical' | 'passive' | 'time-sensitive'` | notification의 중요도와 전달 시점을 나타냅니다. 문자열 값은 [`UNNotificationInterruptionLevel`](https://developer.apple.com/documentation/usernotifications/unnotificationinterruptionlevel) 열거형 케이스에 해당합니다. |
| `channelId` | Android Only | `string` | 이 notification을 표시할 Notification Channel의 ID입니다. ID를 지정했지만 해당 채널이 디바이스에 존재하지 않으면(아직 앱에서 생성되지 않았다면) notification은 사용자에게 표시되지 않습니다. |
| `icon` | Android Only | `string` | notification의 아이콘입니다. Android drawable resource의 이름입니다(예: `myicon`). 기본값은 [config plugin](/versions/latest/sdk/notifications#configurable-properties)에 지정된 아이콘입니다. |
| `richContent` | Android and iOS | `Object` | 현재는 notification 이미지 설정을 지원합니다. `image`라는 key와 image URL인 `string` 값을 가진 object를 제공하세요. Android는 별도 설정 없이 이미지를 표시합니다. iOS에서는 앱에 Notification Service Extension target을 추가해야 합니다. 방법은 [이 예시](https://github.com/expo/expo/pull/36202)를 참고하세요. |
| `categoryId` | Android and iOS | `string` | 이 notification과 연결된 notification category의 ID입니다. [notification categories에 대해 자세히 알아보기](/versions/latest/sdk/notifications#manage-notification-categories-interactive-notifications). |
| `collapseId` | Android and iOS | `string` | notifications를 병합하기 위한 식별자입니다. Android에서는 전송 중인 메시지만 병합하며(디바이스가 오프라인인 경우 주어진 `collapseId`를 가진 가장 최신 메시지만 전달됨), FCM의 [`collapse_key`](https://firebase.google.com/docs/cloud-messaging/concept-options#collapsible_and_non-collapsible_messages)에 매핑됩니다. Android에서 이미 표시된 notifications도 교체하려면 `tag`를 사용하세요. iOS에서는 전송 중인 메시지를 병합하고, 디바이스에 이미 표시된 notifications도 교체하며 [`apns-collapse-id`](https://developer.apple.com/documentation/usernotifications/generating-a-remote-notification#Send-a-POST-request-to-APNs)에 매핑됩니다. |
| `tag` | Android Only | `string` | 디바이스에 이미 표시된 notifications를 교체하기 위한 식별자입니다. 디바이스가 이미 동일한 `tag`를 가진 notification을 표시 중이라면, 새 notification이 이를 교체합니다. 이는 전송 중 메시지를 병합하는 `collapseId`와 별개이며, `tag`는 _이미 표시된_ notifications를 교체합니다. FCM의 [`notification.tag`](https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#AndroidNotification) 필드에 매핑됩니다. |
| `mutableContent` | iOS Only | `boolean` | 이 notification이 [client app에 의해 가로채질 수 있는지](https://developer.apple.com/documentation/usernotifications/modifying-content-in-newly-delivered-notifications?language=objc)를 지정합니다. 기본값은 `false`입니다. |

**`ttl`에 대한 참고**: Android에서 TTL이 0인 메시지는 즉시 전달되도록 최선을 다하며 throttling하지 않습니다. 하지만 TTL을 너무 낮게(예: 0) 설정하면 doze mode 상태의 Android 디바이스에는 normal-priority notification이 아예 도달하지 못할 수 있습니다. notification 전달을 보장하려면, 디바이스가 doze mode에서 깨어날 수 있을 만큼 충분히 긴 TTL을 사용해야 합니다. `ttl`과 `expiration`이 모두 지정되면 이 필드가 우선합니다.

**`priority`에 대한 참고**: Android에서는 normal-priority 메시지가 잠자는 디바이스에서 네트워크 연결을 열지 않으며, 배터리 절약을 위해 전달이 지연될 수 있습니다. High-priority 메시지는 즉시 전달될 가능성이 더 높고, 잠자는 디바이스를 깨워 네트워크 연결을 열 수 있으므로 에너지를 더 소비합니다. iOS에서는 normal-priority 메시지가 디바이스의 전력 상황을 고려한 시점에 전송되며, 묶어서 한 번에 전달될 수 있습니다. 이들은 throttling되며 Apple에 의해 전달되지 않을 수도 있습니다. High-priority 메시지는 보통 즉시 전송됩니다. Normal priority는 APNs priority level 5에 해당하고, high priority는 10에 해당합니다.

**`channelId`에 대한 참고**: null로 두면 "Default" channel이 사용되며, Expo는 디바이스에 해당 채널이 아직 없으면 생성합니다. 하지만 "Default" channel은 사용자에게 노출되므로, 완전히 삭제하지 못할 수 있다는 점에 주의하세요.

### Push ticket format

```js
{
  "data": [
    {
      "status": "error" | "ok",
      "id": string, // this is the Receipt ID
      // if status === "error"
      "message": string,
      "details": JSON
    },
    ...
  ],
  // only populated if there was an error with the entire request
  "errors": [{
    "code": string,
    "message": string
  }]
}
```

### Push receipt request format

```js
{
  "ids": string[]
}
```

### Push receipt response format

```js
{
  "data": {
    Receipt ID: {
      "status": "error" | "ok",
      // if status === "error"
      "message": string,
      "details": JSON
    },
    ...
  },
  // only populated if there was an error with the entire request
  "errors": [{
    "code": string,
    "message": string
  }]
}
```

## 전달 보장

Expo는 Google과 Apple이 운영하는 push notification 서비스로 notifications를 전달하기 위해 최선을 다합니다. Expo 인프라는 적어도 한 번은 하위 push notification 서비스로 전달을 시도하도록 설계되어 있습니다. notification이 Google 또는 Apple에 전혀 전달되지 않는 것보다는, 중복 전달되는 쪽이 더 가능성이 높습니다. 다만 이 둘 다 드문 경우입니다.

notification이 하위 push notification 서비스로 전달된 뒤, Expo는 전달이 성공했는지를 기록하는 "push receipt"를 생성합니다. Push receipt는 하위 push notification 서비스가 해당 notification을 수신했는지 여부를 나타냅니다.

마지막으로 Google과 Apple의 push notification 서비스는 각자의 정책에 따라 notifications를 디바이스로 전달합니다.

## Troubleshooting

네트워크 연결 문제

이 섹션은 일반적인 네트워크 문제를 진단하고 해결하는 데 도움을 줍니다. 여러분의 서버는 미국 리전에 있는 Google Cloud Platform 서비스와 연결 가능해야 합니다. Expo의 push notification 서비스가 이 리전에 호스팅되어 있기 때문입니다.

#### DNS 해석

서버가 Expo의 push service 도메인 이름을 해석할 수 있는지 테스트하세요:

```bash
dig exp.host

# Check with a public DNS server
dig @8.8.8.8 exp.host
```

#### 네트워크 라우팅과 연결성

서버가 Expo endpoint에 도달할 수 있는지 확인하세요:

```bash
# Use traceroute to identify routing issues
traceroute exp.host

# Test basic connectivity
ping exp.host

# Test HTTPS connectivity to the push server.
# You should receive HTTP response headers with a 200 status code.
curl --verbose https://exp.host/
```

확인해야 할 일반적인 문제:

-   outbound HTTPS(포트 443) 트래픽을 차단하는 방화벽 규칙
-   인증 또는 특별한 설정이 필요할 수 있는 사내 프록시 서버
-   outbound 연결을 제한하는 네트워크 ACL 또는 security group(클라우드 환경에서)
-   MTU 크기 문제로 인한 packet fragmentation

#### TLS certificate validation

서버가 서버의 TLS certificate를 검증할 수 있는지 확인하세요:

```bash
openssl s_client -connect exp.host:443 -servername exp.host
```

우리는 Cloudflare, Google, Let's Encrypt를 포함한 주요 서비스 제공업체가 서명한 표준 TLS certificates를 사용합니다.
