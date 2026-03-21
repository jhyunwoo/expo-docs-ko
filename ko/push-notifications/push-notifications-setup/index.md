---
modificationDate: August 17, 2025
title: Expo push notifications 설정
description: push notifications를 설정하고, 개발 및 프로덕션용 credential을 얻고, 테스트용 push notification을 보내는 방법을 알아보세요.
---

# Expo push notifications 설정

push notifications를 설정하고, 개발 및 프로덕션용 credential을 얻고, 테스트용 push notification을 보내는 방법을 알아보세요.

Expo push notification service를 활용하려면, 라이브러리 집합을 설치하고, 알림을 처리하는 함수를 구현하고, Android와 iOS용 credential을 설정해 앱을 구성해야 합니다.

이 가이드에 나오는 단계를 완료하거나 아래의 더 자세한 영상을 따라 하세요. 마지막에는 push notification을 보내고 기기에서 이를 수신할 수 있게 됩니다.

[Expo Notifications with EAS | Complete Guide](https://www.youtube.com/watch?v=BCCjGtKtBjE) — Expo 프로젝트에서 push notifications를 설정하는 방법을 알아보세요. 이 영상은 Android에서 FCM v1용 Firebase 구성, EAS에서 Android 및 iOS credential 설정, EAS Build로 빌드하기, Expo Notifications 도구로 테스트하기까지 다룹니다.

  

클라이언트 측을 push notifications에 대비시키기 위해서는 다음이 필요합니다.

-   사용자로부터 push notifications를 보낼 권한을 받아야 합니다.
-   앱의 [`ExpoPushToken`](/versions/latest/sdk/notifications#expopushtoken)이 필요합니다.

  

Expo push notification service 대신 FCM / APNs를 직접 사용하고 싶나요?

알림을 더 세밀하게 제어해야 한다면 FCM 및 APNs와 직접 통신해야 할 수 있습니다. Expo는 Expo Application Services 사용을 강제하지 않으며, `expo-notifications` API는 특정 push service에 종속되지 않습니다. ["Send notifications with FCM and APNs"](/push-notifications/sending-notifications-custom)를 참고하세요.

## Prerequisites

> **Important:** Push notifications는 Android Emulator와 iOS Simulator에서 지원되지 않습니다. 실제 기기가 필요합니다.

이 가이드에 설명된 단계는 [EAS Build](/build/introduction)를 사용합니다. 이것이 알림을 설정하는 가장 쉬운 방법이며, EAS 프로젝트에 [notification credentials](/push-notifications/push-notifications-setup#get-credentials-for-development-builds)도 함께 포함되기 때문입니다. 하지만 [프로젝트를 로컬에서 빌드](/guides/local-app-development)해도 `expo-notifications` 라이브러리를 사용할 수 있습니다.

## 라이브러리 설치

다음 명령을 실행해 `expo-notifications`, `expo-device`, `expo-constants` 라이브러리를 설치하세요.

```sh
npx expo install expo-notifications expo-device expo-constants
```

-   [`expo-notifications`](/versions/latest/sdk/notifications) 라이브러리는 사용자의 권한을 요청하고 push notifications 전송에 필요한 `ExpoPushToken`을 얻는 데 사용됩니다.
-   [`expo-device`](/versions/latest/sdk/device)는 앱이 실제 기기에서 실행 중인지 확인하는 데 사용됩니다.
-   [`expo-constants`](/versions/latest/sdk/constants)는 app config에서 `projectId` 값을 얻는 데 사용됩니다.

## config plugin 추가

[app config](/workflow/configuration)의 `plugins` 배열에 `expo-notifications` plugin을 추가하세요.

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

## 최소 동작 예제 추가

아래 코드는 React Native 앱에서 push notifications를 등록하고, 전송하고, 수신하는 동작 예제를 보여 줍니다. 프로젝트에 복사해 붙여 넣으세요.

```tsx
import { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function sendPushNotification(expoPushToken: string) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Original Title',
    body: 'And here is the body!',
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      handleRegistrationError('Permission not granted to get push token for push notification!');
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError('Project ID not found');
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(pushTokenString);
      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError('Must use physical device for push notifications');
  }
}

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined
  );

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(token => setExpoPushToken(token ?? ''))
      .catch((error: any) => setExpoPushToken(`${error}`));

    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
      <Text>Your Expo push token: {expoPushToken}</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>Title: {notification && notification.request.content.title} </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
      </View>
      <Button
        title="Press to Send Notification"
        onPress={async () => {
          await sendPushNotification(expoPushToken);
        }}
      />
    </View>
  );
}
```

### `projectId` 구성

앞선 예제를 사용할 때 push notifications 등록 과정에서 [`projectId`](/versions/latest/sdk/constants#easconfig)를 사용해야 합니다. 이 속성은 Expo push token을 특정 프로젝트에 귀속시키는 데 사용됩니다. EAS를 사용하는 프로젝트에서 `projectId` 속성은 해당 프로젝트의 Universally Unique Identifier(UUID)를 의미합니다.

`projectId`는 development build를 생성할 때 자동으로 설정됩니다. 하지만 **프로젝트 코드에서 수동으로 설정하는 것을 권장합니다**. 이를 위해 [`expo-constants`](/versions/latest/sdk/constants)를 사용해 app config에서 `projectId` 값을 가져올 수 있습니다.

```ts
const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
const pushTokenString = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
```

Expo push token을 프로젝트 ID에 귀속시키는 장점 중 하나는 프로젝트가 다른 계정으로 이전되거나 기존 계정 이름이 바뀌더라도 token이 바뀌지 않는다는 점입니다.

## development build용 credential 얻기

Android와 iOS는 credential 설정 요구 사항이 서로 다릅니다.

Android에서는 credential을 얻고 Expo 프로젝트를 설정하기 위해 **Firebase Cloud Messaging (FCM)**을 구성해야 합니다.

credential 설정은 [Add Android FCM V1 credentials](/push-notifications/fcm-credentials)의 단계를 따르세요.

  

> EAS Build를 사용하지 않는다면 `eas credentials`를 수동으로 실행하세요.

## 앱 빌드

```sh
eas build
```

## push notifications tool로 테스트하기

development build를 만들고 설치한 뒤에는 [Expo push notifications tool](https://expo.dev/notifications)을 사용해 기기에 테스트 알림을 빠르게 보낼 수 있습니다.

1.  프로젝트의 development server를 시작합니다.
    
    ```sh
    npx expo start
    ```
    
2.  기기에서 development build를 엽니다.
    
3.  `ExpoPushToken`이 생성되면, Expo push notifications tool에 그 값을 다른 정보(예: 메시지 제목과 본문)와 함께 입력합니다.
    
4.  **Send a Notification** 버튼을 클릭합니다.
    

도구에서 알림을 보낸 뒤에는 기기에서 알림이 보여야 합니다. 아래는 Android 기기가 push notification을 수신한 예시입니다.
