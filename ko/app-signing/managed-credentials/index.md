---
modificationDate: May 21, 2025
title: 자동으로 관리되는 자격 증명 사용하기
description: EAS로 앱 자격 증명을 자동 관리하는 방법을 알아보세요.
---

# 자동으로 관리되는 자격 증명 사용하기

EAS로 앱 자격 증명을 자동 관리하는 방법을 알아보세요.

앱을 앱 스토어에 배포하려면 keystore나 distribution certificate 같은 자격 증명으로 디지털 서명해야 합니다. 이렇게 하면 앱의 출처를 증명하고 변조를 방지할 수 있습니다. FCM API Key나 Apple Push Key 같은 다른 자격 증명은 푸시 알림을 보내는 데 필요하지만 앱 서명에는 관여하지 않습니다.

EAS Build로 앱을 빌드하는 데 필요한 내용은 이것이 전부이지만, 더 자세히 알고 싶다면 [App Signing](/app-signing/app-credentials) 가이드를 참고할 수 있습니다.

계속 읽으며 EAS가 여러분과 팀을 위해 자격 증명을 자동으로 관리하는 방법을 알아보세요.

## 앱 서명 자격 증명 생성하기

`eas build`를 실행하면 아직 자격 증명을 생성하지 않은 경우 생성하라는 안내가 표시됩니다. 간단한 안내에 따라 자격 증명을 생성하세요. 필요한 경우 자격 증명은 EAS 서버에 저장됩니다. 이후 앱을 다시 빌드할 때는 별도로 다르게 지정하지 않는 한 같은 자격 증명이 재사용됩니다.

iOS 자격 증명(distribution certificate, provisioning profile, push key)을 생성하려면 [Apple Developer Program](https://developer.apple.com/programs) 멤버십으로 로그인해야 합니다.

> EAS가 자격 증명을 관리하는 것 또는 EAS CLI를 통해 Apple Developer 계정에 로그인하는 것에 보안상 우려가 있다면 [보안](/app-signing/security) 가이드를 참고하세요. 그래도 우려가 해소되지 않는다면 자세한 정보를 위해 [secure@expo.dev](mailto:secure@expo.dev)로 문의하거나, 대신 [로컬 자격 증명](/app-signing/local-credentials)을 사용할 수 있습니다.

### 푸시 알림 자격 증명

#### Android

EAS Build에서 Android 푸시 알림 자격 증명을 설정하려면 앱에 FCM을 구성해야 합니다. `eas credentials`를 실행하고 `Android`를 선택한 다음 `Push Notifications: Manage your FCM Api Key`를 고르고, 키를 설정하는 적절한 옵션을 선택하세요.

#### iOS

아직 Push Notifications key를 설정하지 않았다면 다음 `eas build` 실행 시 EAS CLI가 설정하라고 안내합니다.

`eas credentials` 명령으로도 Push Notifications key를 설정할 수 있습니다. 명령을 실행한 뒤 `iOS`, `Push Notifications: Manage your Apple Push Notifications Key`를 차례로 선택하고, 키를 설정하는 적절한 옵션을 고르세요.

## 팀과 자격 증명 공유하기

프로젝트에서 다른 개발자와 협업한다면, 그들도 직접 빌드를 수행할 수 있도록 권한을 주는 것이 유용한 경우가 많습니다. [프로젝트가 협업용으로 구성되어 있는지 확인](/accounts/account-types#organizations)하고, [EAS dashboard](https://expo.dev/)를 통해 추가한 팀원이 충분한 권한을 가지고 있다면 `eas build`를 문제없이 실행할 수 있습니다.

iOS 자격 증명을 한 번 생성하고 나면 더 이상 빌드를 시작하기 위해 Apple Developer 팀 접근 권한이 필요하지 않습니다. 즉, 협업자들은 자신의 Expo 계정만으로 새 iOS 빌드를 시작할 수 있습니다.

## 자격 증명 구성 확인하기

현재 구성된 앱 서명 자격 증명은 `eas credentials`를 실행해 확인할 수 있습니다. 이 명령으로 필요할 경우 자격 증명을 제거하거나 수정할 수도 있습니다. 보통은 그럴 필요가 없지만, [로컬에서 빌드를 실행하기 위해 자격 증명을 로컬 머신으로 동기화](/app-signing/syncing-credentials)하거나 [기존 자격 증명을 자동 관리 방식으로 마이그레이션](/app-signing/existing-credentials)하려는 경우에는 유용할 수 있습니다.
