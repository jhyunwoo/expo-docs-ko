---
modificationDate: March 06, 2026
title: push notifications 사용하기
description: Expo 및 React Native 앱과 호환되는 push notification 서비스에 대해 알아보세요.
---

# push notifications 사용하기

Expo 및 React Native 앱과 호환되는 push notification 서비스에 대해 알아보세요.

Expo 앱은 모든 notification 서비스 또는 Android와 iOS 운영체제가 제공하는 notification 기능과 함께 동작할 수 있습니다. 어떤 기능에 대해 아직 패키지가 없더라도 [Expo Modules API](/modules/overview)를 통해 접근할 수 있도록 native code를 작성할 수 있고, native 프로젝트 설정은 [config plugins](/config-plugins/introduction)을 사용해 자동화할 수 있습니다. 다음 옵션들은 앱에 push notification을 구현하기 위해, 필요한 경우 config plugin을 포함한 목적 지향적인 Expo 통합을 제공합니다:

> [`expo-notifications`](/versions/latest/sdk/notifications) 라이브러리는 Expo의 push notification 서비스 및 FCM과 APNS에서 직접 보낸 notification과 함께 동작하도록 설계되고 테스트되었습니다. 일부 고급 기능은 서드파티 provider와 호환되지 않을 수 있는데, 이들은 종종 자기 서비스에 최적화된 자체 native 및 React Native SDK를 갖고 있기 때문입니다.

## Expo push notifications

[Expo Notifications](/versions/latest/sdk/notifications)는 Android와 iOS 전반에서 push notification을 처리하기 위한 통합 API를 제공합니다. Expo 계정과 매끄럽게 통합되며 무료로 사용할 수 있습니다.

### Key capabilities

-   [`expo-notifications`](/versions/latest/sdk/notifications) 라이브러리와 완전히 호환됩니다
-   FCM과 APNs에 대한 notification 전달을 추적하는 EAS dashboard가 포함됩니다
-   [Expo Notifications Tool](https://expo.dev/notifications)로 notification 테스트를 지원합니다

### Considerations and limitations

-   이미지 같은 추가 콘텐츠를 notification에 추가하기 위한 iOS Notification Service Extension은 공식적으로 포함되어 있지 않지만, custom native code와 설정이 포함된 config plugin으로 추가할 수 있습니다([example](https://github.com/expo/expo/pull/36202)).
-   프로젝트당 초당 600개의 notification으로 볼륨이 제한됩니다.

구현 세부 사항은 다음 가이드를 참고하세요:

[Expo push notifications overview](/push-notifications/overview) — Expo push notification에 대해 더 알아보세요.

[Expo Notifications server-side SDK options](/push-notifications/sending-notifications#send-push-notifications-using-a-servers) — 서버를 사용해 push notification을 보내는 방법에 대해 더 알아보세요.

## OneSignal

[OneSignal](https://onesignal.com/)은 웹과 모바일 앱을 위한 push notification, in-app messaging, SMS, email 서비스를 제공하는 고객 참여 플랫폼입니다. OneSignal은 notification 내 rich media와 engagement analytics를 지원합니다. Expo 프로젝트에 직접 통합할 수 있도록 [Expo config plugin](https://github.com/OneSignal/onesignal-expo-plugin)을 제공합니다.

[OneSignal Expo SDK Setup](https://documentation.onesignal.com/docs/react-native-expo-sdk-setup) — Expo 프로젝트에 OneSignal을 통합하는 단계별 설정 가이드를 따라가세요.

## Braze

[Braze](https://www.braze.com/)는 push notification, in-app messaging, email, SMS, web을 통해 개인화된 멀티채널 메시징을 제공하는 고객 참여 플랫폼입니다. Braze는 rich notification 콘텐츠, push notification 캠페인, 그리고 Android에서 전달 실패 후 notification 재전송 지원을 제공합니다. [React Native SDK](https://github.com/braze-inc/braze-react-native-sdk)와 [config plugin](https://github.com/braze-inc/braze-expo-plugin/tree/main)을 제공합니다. 자세한 내용은 [Expo example app](https://github.com/braze-inc/braze-expo-plugin/tree/main/example)을 참고하세요.

[Braze Expo Setup](https://www.braze.com/docs/developer_guide/sdk_integration?sdktab=react%20native) — Expo 프로젝트에 Braze를 통합하는 단계별 설정 가이드를 따라가세요.

## Customer.io

[Customer.io](http://Customer.io)는 push notification, in-app messaging, email, SMS 기능 등을 활용한 강력한 자동화 워크플로를 설계할 수 있게 해주는 고객 참여 플랫폼입니다. 시각적 워크플로 빌더를 통해 여러 채널에 걸친 복잡한 데이터 기반 캠페인을 자동화할 수 있습니다. Customer.io는 사용자 행동과 선호도에 맞춘 push notification을 커스터마이즈하는 데 사용할 수 있는 기기 측 metrics 수집을 지원합니다. Customer.io는 Expo 프로젝트와 직접 통합할 수 있는 [Expo plugin](https://github.com/customerio/customerio-expo-plugin)과, 다른 provider와 함께 Customer.io push notification을 사용하는 문서를 제공합니다.

[Customer.io Expo Quick Start Guide](https://docs.customer.io/sdk/expo/quick-start-guide/) — Expo 프로젝트에 Customer.io를 통합하는 단계별 설정 가이드를 따라가세요.

## CleverTap

[CleverTap](https://clevertap.com/)은 push notification, in-app message, email 등 다양한 채널에 걸쳐 개인화된 실시간 옴니채널 메시징을 제공하도록 도와주는 올인원 고객 참여 플랫폼입니다. 비즈니스 성장에 맞춰 확장할 수 있도록 고급 세분화, analytics, 캠페인 자동화를 제공합니다. [CleverTap React Native SDK](https://developer.clevertap.com/docs/react-native)와 [Expo config plugin](https://github.com/CleverTap/clevertap-expo-plugin)을 통해 Expo 프로젝트에 CleverTap을 쉽게 통합할 수 있습니다. config plugin은 prebuild 과정에서 모든 native module 설정을 처리하므로, native code를 직접 수정하지 않고도 app config를 통해 CleverTap을 설정할 수 있습니다. 자세한 내용은 [CleverTap Example Plugin](https://github.com/CleverTap/clevertap-expo-plugin/tree/main/CTExample)을 참고하세요.

[CleverTap Expo Plugin Docs](https://developer.clevertap.com/docs/clevertap-expo-plugin) — 이 가이드를 따라 Expo 또는 React Native 프로젝트에 CleverTap을 설정하세요.

## FCM과 APNs를 통해 직접 notification 보내기

백엔드에서 플랫폼 push API로 직접 보내는 방식을 선택할 수도 있습니다. 이 경우에도 [`expo-notifications`](/versions/latest/sdk/notifications)를 사용해 native push token을 가져오고 각 플랫폼에 대해 notification을 별도로 설정할 수 있습니다.

클라이언트 측 코드는 여전히 [`expo-notifications`](/versions/latest/sdk/notifications)로 크로스플랫폼 상태를 유지하지만, [FCM](https://firebase.google.com/docs/cloud-messaging) 및 [APNs](https://developer.apple.com/documentation/usernotifications) API와 각각 상호작용하기 위한 서버 측 로직은 직접 구현해야 합니다.

## React Native Firebase messaging

[React Native Firebase](https://rnfirebase.io/)는 Android와 iOS 모두에서 [Firebase Cloud Messaging (FCM)](https://firebase.google.com/docs/cloud-messaging)을 통합 push notification 서비스로 사용할 수 있게 해주는 messaging 모듈을 제공합니다. FCM은 흔히 Android notification과 연관되지만, 내부적으로 Apple Push Notification service(APNs)를 통해 메시지를 라우팅함으로써 iOS도 지원합니다.

이 접근 방식은 FCM을 Android notification에만 사용하는 것과는 다릅니다. 대신 Firebase의 크로스플랫폼 SDK가 하나의 서비스로 양쪽 플랫폼의 notification을 모두 처리합니다.

> FCM이 두 플랫폼 모두의 notification을 처리하더라도, iOS notification은 여전히 APNs를 거칩니다. Firebase가 이 라우팅을 자동으로 관리합니다. 자세한 내용은 [React Native Firebase messaging documentation](https://rnfirebase.io/messaging/usage)을 참고하세요.

## Tips and important considerations

-   **클라이언트 측 구현을 섞어 쓰지 마세요**: 서로 다른 notification 서비스는 충돌하는 클라이언트 측 구현을 가질 수 있습니다. 잠재적인 문제를 방지하려면 일관된 접근 방식을 사용하세요.
-   **웹 notifications**: Expo notifications는 웹 notification을 지원하지 않습니다. 하지만 일부 서드파티 솔루션은 이 기능을 제공할 수 있습니다. 서비스를 선택할 때 앱의 요구 사항을 고려하세요.
-   **토큰 관리**: 데이터베이스에서 Expo push token과 native device token을 모두 추적하세요. 이렇게 하면 미래의 통합, 특히 FCM이나 APNs를 통해 직접 notification을 보내는 마케팅 도구와의 연동에 유연하게 대응할 수 있습니다.
