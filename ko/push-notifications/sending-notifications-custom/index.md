---
modificationDate: March 06, 2026
title: FCM과 APNs로 notifications 보내기
description: FCM과 APNs로 notifications를 보내는 방법을 알아보세요.
---

# FCM과 APNs로 notifications 보내기

FCM과 APNs로 notifications를 보내는 방법을 알아보세요.

notifications를 더 세밀하게 제어해야 할 수 있으며, 이 경우 FCM 및 APNs와 직접 통신해야 할 수도 있습니다. Expo 플랫폼은 Expo Application Services 사용을 강제하지 않으며, `expo-notifications` API는 특정 push 서비스에 종속되지 않습니다.

> **참고**: 이 가이드는 FCM 또는 APNs를 통해 notifications를 보내는 방법에 대한 포괄적인 자료를 목표로 하지 않습니다. 최신 지침을 따르고 있는지 확인하려면 공식 문서를 읽어보는 것을 권장합니다.

## FCM 또는 APNs용 device token 얻기

Expo notification 서비스를 사용할 때는 [`getExpoPushTokenAsync`](/versions/latest/sdk/notifications#getexpopushtokenasyncoptions-expotokenoptions-expopushtoken)로 얻은 `ExpoPushToken`을 사용합니다.

대신 FCM 또는 APNs를 통해 notifications를 보내려면 [`getDevicePushTokenAsync`](/versions/latest/sdk/notifications#getdevicepushtokenasync-devicepushtoken)로 네이티브 device token을 얻어야 합니다.

```diff
import * as Notifications from 'expo-notifications';
  // . .
- const token = (await Notifications.getExpoPushTokenAsync()).data;
+ const token = (await Notifications.getDevicePushTokenAsync()).data;
  // send token to your server
```

## FCMv1 server

이 가이드는 [Firebase 공식 문서](https://firebase.google.com/docs/cloud-messaging/server)를 바탕으로 합니다.

FCM과 통신하는 작업은 POST 요청을 보내는 방식으로 이루어집니다. 하지만 notifications를 보내거나 받기 전에 먼저 [FCM을 구성하는 단계](/push-notifications/fcm-credentials)를 따라 `FCM-SERVER-KEY`를 얻어야 합니다.

### 인증 토큰 얻기

FCM은 Oauth 2.0 액세스 토큰을 요구하며, 이 토큰은 ["send 요청의 authorization 업데이트"](https://firebase.google.com/docs/cloud-messaging/send/v1-api#authorize-http-v1-send-requests)에 설명된 방법 중 하나로 얻어야 합니다.

테스트 목적으로는 위에서 얻은 Google Auth Library와 private key 파일을 사용해, 아래와 같이 Firebase 문서의 Node 예제를 바탕으로 단일 notification용 단기 토큰을 얻을 수 있습니다:

```ts
import { JWT } from 'google-auth-library';

function getAccessTokenAsync(
  key: string // Contents of your FCM private key file
) {
  return new Promise(function (resolve, reject) {
    const jwtClient = new JWT(
      key.client_email,
      null,
      key.private_key,
      ['https://www.googleapis.com/auth/cloud-platform'],
      null
    );
    jwtClient.authorize(function (err, tokens) {
      if (err) {
        reject(err);
        return;
      }
      resolve(tokens.access_token);
    });
  });
}
```

### notification 보내기

아래 예제 코드는 위의 `getAccessTokenAsync()`를 호출해 Oauth 2.0 토큰을 얻고, 그다음 notification POST 요청을 구성해 전송합니다. FCM legacy protocol과 달리 요청 endpoint에 Firebase project 이름이 포함된다는 점에 유의하세요.

```ts
// FCM_SERVER_KEY: Environment variable with the path to your FCM private key file
// FCM_PROJECT_NAME: Your Firebase project name
// FCM_DEVICE_TOKEN: The client's device token (see above in this document)

async function sendFCMv1Notification() {
  const key = require(process.env.FCM_SERVER_KEY);
  const firebaseAccessToken = await getAccessTokenAsync(key);
  const fcmToken = process.env.FCM_DEVICE_TOKEN;

  const messageBody = {
    message: {
      token: fcmToken,
      data: {
        channelId: 'default',
        message: 'Testing',
        title: `This is an FCM notification message`,
        body: JSON.stringify({ title: 'bodyTitle', body: 'bodyBody' }),
        scopeKey: '@yourExpoUsername/yourProjectSlug',
        experienceId: '@yourExpoUsername/yourProjectSlug',
      },
    },
  };

  const response = await fetch(
    `https://fcm.googleapis.com/v1/projects/${process.env.FCM_PROJECT_NAME}/messages:send`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${firebaseAccessToken}`,
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageBody),
    }
  );

  const readResponse = (response: Response) => response.json();
  const json = await readResponse(response);

  console.log(`Response JSON: ${JSON.stringify(json, null, 2)}`);
}
```

`experienceId`와 `scopeKey` 필드는 Expo Go를 사용할 때만 적용됩니다(SDK 53부터는 Expo Go에서 push notifications 지원이 제거되었습니다). 그렇지 않으면 notifications가 앱으로 전달되지 않습니다. FCM은 [notification payload](https://firebase.google.com/docs/cloud-messaging/http-server-ref#notification-payload-support)에서 지원되는 필드 목록을 제공하며, Android에서 `expo-notifications`가 어떤 필드를 지원하는지는 [FirebaseRemoteMessage](/versions/latest/sdk/notifications#firebaseremotemessage)를 보면 확인할 수 있습니다.

FCM은 raw `fetch` 요청 대신 사용할 수 있는 [몇 가지 언어용 server-side 라이브러리](https://firebase.google.com/docs/cloud-messaging/send/admin-sdk)도 제공합니다.

### FCM server key 찾는 방법

FCM server key는 [구성 단계](/push-notifications/push-notifications-setup#android)를 제대로 따랐는지 확인한 뒤, Expo에 FCM key를 업로드하는 대신 해당 key를 서버에서 직접 사용하면 찾을 수 있습니다(이전 예제의 `FCM-SERVER-KEY`처럼).

## APNs server

> 이 문서는 [Apple 문서](https://developer.apple.com/library/archive/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/APNSOverview.html)를 기반으로 하며, 이 섹션은 시작하는 데 필요한 기본 사항을 다룹니다.

APNs와 통신하는 일은 FCM보다 조금 더 복잡합니다. 일부 라이브러리는 이러한 기능 전체를 [`node-apn`](https://github.com/node-apn/node-apn) 같은 한두 개의 함수 호출로 감쌉니다. 하지만 아래 예제에서는 최소한의 라이브러리만 사용합니다.

### Client APNs entitlement

iOS 앱에 APNs entitlement가 있어야만 push notifications를 받을 수 있습니다. [CNG](/workflow/continuous-native-generation)를 사용하는 앱의 경우 Expo config를 아래 두 가지 방법 중 하나로 수정해야 합니다:

-   **권장**: 앱에 `expo-notifications` 라이브러리를 추가하고, 해당 plugin이 [app config](/workflow/configuration)의 `plugins` 배열에 포함되어 있는지 확인합니다:

```json
{
  "expo": {
    ... 
    "plugins": [
      ... 
      "expo-notifications"
      ]
  }
}
```

-   `expo-notifications` 라이브러리를 사용할 계획이 없다면, 아래 예시처럼 [Expo configuration에 `aps-environment` entitlement를 수동으로 추가](/build-reference/ios-capabilities#entitlements)해야 합니다:

```json
{
  "expo": {
    ... 
    "ios": {
      ... 
      "entitlements": {
        "aps-environment": "development"
      }
    }
  }
}
```

CNG를 사용하지 않는 경우에는 [Xcode에서 push notification entitlement를 추가](https://developer.apple.com/documentation/usernotifications/registering-your-app-with-apns)해야 합니다.

> **참고**: SDK 51 이하 버전의 Expo 앱에서 업그레이드하는 경우 [이 FYI 문서](https://expo.fyi/apns-entitlement-sdk-51)를 참고하세요.

### Authorization

처음에는 APNS로 요청을 보내기 전에 앱에 notifications를 보낼 권한이 필요합니다. 이 권한은 iOS 개발자 자격 증명을 사용해 생성한 JSON web token을 통해 부여됩니다:

-   앱과 연결된 APN key (`.p8` 파일)
-   위 `.p8` 파일의 Key ID
-   Apple Team ID

```js
const jwt = require("jsonwebtoken");
const authorizationToken = jwt.sign(
  {
    iss: "YOUR-APPLE-TEAM-ID"
    iat: Math.round(new Date().getTime() / 1000),
  },
  fs.readFileSync("./path/to/appName_apns_key.p8", "utf8"),
  {
    header: {
      alg: "ES256",
      kid: "YOUR-P8-KEY-ID",
    },
  }
);
```

### HTTP/2 connection

`authorizationToken`을 얻은 뒤에는 Apple 서버와 HTTP/2 connection을 열 수 있습니다. 개발 환경에서는 요청을 `api.sandbox.push.apple.com`으로 보내고, 프로덕션에서는 `api.push.apple.com`으로 보냅니다.

다음은 요청을 구성하는 방법입니다:

```js
const http2 = require('http2');

const client = http2.connect(
  IS_PRODUCTION ? 'https://api.push.apple.com' : 'https://api.sandbox.push.apple.com'
);

const request = client.request({
  ':method': 'POST',
  ':scheme': 'https',
  'apns-topic': 'YOUR-BUNDLE-IDENTIFIER',
  ':path': '/3/device/' + nativeDeviceToken, // This is the native device token you grabbed client-side
  authorization: `bearer ${authorizationToken}`, // This is the JSON web token generated in the "Authorization" step
});
request.setEncoding('utf8');

request.write(
  JSON.stringify({
    aps: {
      alert: {
        title: "\uD83D\uDCE7 You've got mail!",
        body: 'Hello world! \uD83C\uDF10',
      },
    },
    experienceId: '@yourExpoUsername/yourProjectSlug', // Required only when testing in legacy Expo Go (in SDK 52 and earlier)
    scopeKey: '@yourExpoUsername/yourProjectSlug', // Required only when testing in legacy Expo Go (in SDK 52 and earlier)
  })
);
request.end();
```

> 이 예제는 최소 구성만 담고 있으며 오류 처리와 connection pooling은 포함하지 않습니다. 테스트 목적으로는 [`sendNotificationToAPNS`](https://github.com/expo/expo/blob/main/docs/public/static/examples/sendNotificationToAPNS.js) 예제 코드를 참고할 수 있습니다.

APNs는 [notification payload](https://developer.apple.com/documentation/usernotifications/generating-a-remote-notification#Payload-key-reference)에서 지원하는 필드 전체 목록을 제공합니다.
