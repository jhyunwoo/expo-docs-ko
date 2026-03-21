---
modificationDate: July 31, 2024
title: 보안
description: EAS를 사용할 때 자격 증명과 기타 민감한 데이터가 어떻게 처리되는지 알아보세요.
---

# 보안

EAS를 사용할 때 자격 증명과 기타 민감한 데이터가 어떻게 처리되는지 알아보세요.

외부 자격 증명을 입력하거나 다른 민감한 데이터를 서드파티 소프트웨어에 제공하기 전에, 그 소프트웨어가 이를 책임감 있게 사용하고 보호할 것인지 스스로 판단해 보아야 합니다. 앱 스토어에 배포할 앱 바이너리를 빌드하는 과정의 특성상, Expo standalone 앱 빌드 서비스는 민감도가 서로 다른 여러 종류의 정보를 필요로 합니다. 이 문서는 그 정보들이 무엇인지, 우리가 이를 어떻게 저장하는지, 그리고 만약 유출되었을 때 어떤 문제가 생길 수 있는지를 설명합니다.

Expo 서버에 저장되는 대부분의 데이터(자격 증명을 포함한 기타 데이터)는 클라우드 제공자인 Google Cloud에 의해 저장 시 암호화됩니다. 자격 증명은 여기에 더해 [KMS](https://cloud.google.com/security/products/security-key-management)로도 암호화됩니다. 자격 증명은 standalone 앱 빌더나 푸시 알림 서비스에서 메모리 상에서 필요한 동안에만 복호화됩니다. 데이터베이스, 메시지 큐, 그 밖의 더 오래 남는 시스템 구성 요소에서는 언제나 암호화된 상태로 보관됩니다.

아래에서 설명하는 정보와 관련된 모든 데이터는 Expo 서버에서 다운로드하고 제거할 수 있으며(애초에 서버에 저장되는 경우라면), 일부는 Apple Developer Portal 같은 다른 위치에서도 확인할 수 있습니다.

## Android 푸시 알림 자격 증명

Android는 푸시 알림에 Firebase Cloud Messaging(FCM)을 사용합니다. Expo로 standalone 앱을 빌드하면 FCM 서버 키를 대신 저장해 둡니다.

### 유출되었을 때의 영향

각 FCM 서버 키는 해당 키가 속한 Firebase 프로젝트와 연결된 모든 Android 앱으로 푸시 알림을 보낼 수 있습니다. 악의적인 행위자가 알림을 보내려면 FCM 서버 키와 기기 토큰 모두에 접근할 수 있어야 합니다.

Firebase 콘솔에서 서버 키를 생성하고 삭제할 수 있습니다. 키를 삭제하면 해당 키를 사용하는 알림은 더 이상 동작하지 않습니다. 새 키를 생성해 Expo에 업로드하면 알림이 다시 동작합니다.

### 분실했을 때의 영향

없습니다. Firebase 콘솔에서 다시 접근할 수 있습니다.

## Android 빌드 자격 증명

Play Store에 릴리스할 빌드에 서명하려면 keystore와 keystore 비밀번호가 필요합니다. 이 정보는 KMS로 암호화되며 저장 시에도 추가로 보호됩니다. 앱을 Google Play Store에 처음 제출한 뒤에는 이후 업데이트를 위해서도 같은 keystore로 다시 앱에 서명해야 합니다. 이 keystore는 해당 APK가 keystore 소유 개발자가 만든 것임을 증명합니다. 다만 keystore만으로 Google Play에 제출할 수 있는 것은 아니며, Google 계정에도 Google Play Console 접근 권한이 있어야 합니다.

### 유출되었을 때의 영향

Google Play Developer 계정이 안전하게 보호되고 있다면, 악의적인 행위자가 keystore와 keystore 비밀번호만으로 여러분의 앱을 업데이트할 수는 없습니다. keystore는 변경할 수 없습니다.

### 분실했을 때의 영향

Google Play에서 앱을 업데이트할 수 없게 됩니다. 원하는 안전한 저장 위치나 Google Play의 App Signing 기능을 사용해 keystore와 keystore 비밀번호를 다운로드하고 백업해 두는 것이 좋습니다.

## Google Developer 자격 증명

Expo 도구는 Google 계정 자격 증명을 제공하라고 요구하지 않습니다.

## Android 제출 자격 증명

### Google Service Account Key

Google Service Account Key는 EAS Submit으로 Android 앱을 Google Play Store에 제출할 때 사용하는 인증 방식입니다. 이 키는 Expo 서버에 저장되며 저장 시 [KMS](https://cloud.google.com/security/products/security-key-management)로 암호화됩니다. 이후 제출에서도 재사용할 수 있도록 Expo 서버에 남아 있으며, 필요한 권한이 있는 사용자는 언제든 삭제할 수 있습니다.

#### 유출되었을 때의 영향

악의적인 행위자가 어떤 식으로든 Google Service Account Key에 접근하게 되면, 여러분을 대신해 Google Play Console에서 여러 작업을 수행할 수 있습니다. 다만 수행 가능한 작업은 해당 서비스 계정 키에 부여된 권한 범위로 제한됩니다.

공격자가 추가로 업로드 keystore까지 확보한 경우에는 기존 앱의 새 버전을 제출할 수 있습니다. 다만 새 앱을 여러분 이름으로 Google Play Store에 처음 등록할 수는 없습니다. 첫 번째 Google Play 제출은 웹 콘솔을 통해 직접 해야 하기 때문입니다.

#### 분실했을 때의 영향

없습니다. Google Service Account Key를 잃어버린 경우 Google Cloud Console에서 이를 취소하고 새로 만들 수 있습니다.

## iOS 푸시 알림 자격 증명

iOS 푸시 알림 자격 증명에는 Apple이 권장하는 현대적인 방식과 레거시 방식, 두 가지가 있습니다. 기본 동작은 현대적인 방식을 사용하는 것이지만, 개발자가 p12 인증서를 제공해 레거시 방식을 선택할 수도 있습니다.

### APNs auth key (p8) + key ID (string)

각 개발자 계정에는 최대 두 개의 auth key를 둘 수 있으며, 각 키는 계정의 어떤 앱에도 알림을 보낼 수 있습니다.

auth key는 Apple Developer Center에서 취소할 수 있습니다. 이를 취소하면 알림이 더 이상 동작하지 않습니다. 새 auth key를 발급해 Expo에 업로드하면 알림이 다시 동작합니다. auth key가 취소되어도 기기 토큰은 무효화되지 않습니다.

### 유출되었을 때의 영향

악의적인 행위자가 어떤 식으로든 이 자격 증명에 접근한다면, 여러분의 앱으로 푸시 알림을 보낼 수 있습니다. 다만 어느 기기 토큰으로 보내야 하는지는 알고 있어야 합니다.

### 분실했을 때의 영향

Apple Developer console에서는 APNs Auth Key를 생성할 때만 다운로드할 수 있습니다. Auth Key를 잃어버리면 Apple Developer console에서 이를 취소하고 새 키로 교체할 수 있습니다.

## iOS 빌드 자격 증명

여기서 말하는 것은 production distribution certificate와 그 비밀번호(Expo가 관리하도록 두면 자동 생성됨), 그리고 provisioning profile(비밀 정보는 아님)을 뜻합니다. Expo에 저장되는 대부분의 자격 증명 데이터와 마찬가지로 이들 역시 모두 KMS로 암호화됩니다. 빌드 자격 증명이 있으면 App Store Connect에 업로드할 앱을 빌드할 수 있습니다. 하지만 실제로 업로드하고 심사를 위해 제출하려면 Apple Developer 계정 자격 증명도 필요합니다.

### 유출되었을 때의 영향

이 정보만으로 악의적인 행위자가 할 수 있는 일은 많지 않습니다. Apple Developer 계정 자격 증명이 없으면 어떤 앱도 제출할 수 없기 때문입니다. distribution certificate와 provisioning profile은 Apple Developer 웹사이트에서 취소할 수 있습니다.

### 분실했을 때의 영향

없습니다. Apple Developer console에서 다시 확인할 수 있습니다.

## Apple Developer 계정 자격 증명

standalone 앱 빌드를 만들거나 App Store에 업로드할 때 Apple Developer 계정 자격 증명을 입력하라는 안내가 표시됩니다. 우리는 이를 서버에 저장하지 않습니다. EAS CLI는 이 자격 증명을 로컬에서만 사용합니다. 배포 인증서와 auth key는 여러분의 컴퓨터에서만 프로비저닝되어 Expo 서버로 전송되며, 개발자 계정 자격 증명 자체는 Expo 서버로 전송되지 않습니다. 또한 Apple은 모든 Apple Developer 계정에 대해 two-factor authentication을 요구하므로 보안이 한 층 더 강화됩니다.

ad-hoc 빌드를 만들 때는 개발 기기의 UDID로 ad-hoc provisioning profile을 생성하는 데 쓰이는 Apple Developer 세션 토큰을 일시적으로 저장합니다. 이 세션 토큰 사용이 끝나면 바로 폐기합니다.

### Keychain

기본적으로 Apple ID 자격 증명은 macOS Keychain에 저장됩니다. 비밀번호는 오직 여러분의 컴퓨터 로컬에만 저장됩니다. 이 기능은 Windows나 Linux 사용자에게는 제공되지 않습니다.

환경 변수 `EXPO_NO_KEYCHAIN=1`을 사용하면 Keychain 지원을 끌 수 있습니다. 저장된 비밀번호를 변경할 때도 이 방법을 사용할 수 있습니다.

### Keychain에서 Apple ID 비밀번호 변경하기

로컬에 저장된 비밀번호를 삭제하려면 "Keychain Access" 앱을 열고 "All Items"로 이동한 다음 "deliver. [Your Apple ID]"를 검색하세요(예: `deliver.bacon@expo.dev`). 수정하려는 항목을 선택해 삭제하면 됩니다. 다음에 Expo 명령을 실행할 때 새 비밀번호를 입력하라는 안내가 표시됩니다.

### 유출되었을 때의 영향

standalone 빌드의 경우, 위에서 설명한 것처럼 악의적인 행위자가 여러분의 사용자 이름과 비밀번호에 접근하려면 먼저 여러분의 기기가 침해되어야 합니다. 또한 Apple Developer 계정의 경우 사전에 승인된 Apple 기기에서 생성되는 two-factor authentication 코드에도 접근할 수 있어야 합니다. 이 정도 상황이라면 더 큰 문제가 있을 수 있지만, 예상할 수 있듯이 공격자는 여러분의 Apple Developer 계정으로 할 수 있는 거의 모든 작업을 수행할 수 있게 됩니다.

ad-hoc 빌드의 경우 누군가 세션 토큰에 접근하게 되면, 사실상 여러분의 계정에 로그인된 것과 비슷한 상태가 됩니다.

### 분실했을 때의 영향

없습니다. Apple Developer console에서 다시 확인할 수 있습니다.

## iOS 제출 자격 증명

### Apple App Store Connect (ASC) API key

Apple App Store Connect(ASC) API key는 EAS Submit 서비스를 사용해 iOS 앱을 Apple App Store에 제출할 때 사용할 수 있는 인증 방식 중 하나입니다. 이 키는 Expo 서버에 저장되며 저장 시 [KMS](https://cloud.google.com/security/products/security-key-management)로 암호화됩니다. 이후 제출에서도 재사용할 수 있도록 Expo 서버에 남아 있으며, 필요한 권한이 있는 사용자는 언제든 삭제할 수 있습니다.

ASC API key는 EAS Submit으로 앱을 App Store에 제출할 때 기본값이자 **권장되는** 인증 방식입니다.

#### 유출되었을 때의 영향

악의적인 행위자가 어떤 식으로든 ASC API key에 접근하게 되면, 여러분을 대신해 App Store Connect에서 여러 작업을 수행할 수 있습니다. 다만 수행 가능한 작업은 해당 API key에 부여된 권한 범위로 제한됩니다.

공격자가 추가로 빌드 자격 증명까지 확보한 경우에는 기존 앱의 새 버전을 제출할 수 있습니다. 다만 그 빌드 자격 증명으로 서명된 앱만 제출할 수 있으며, 임의의 앱을 여러분 이름으로 App Store에 제출할 수는 없습니다.

#### 분실했을 때의 영향

없습니다. ASC API key를 잃어버린 경우 App Store Connect 포털에서 이를 취소하고 새로 만들 수 있습니다.

### Apple app-specific password

Apple app-specific password는 EAS Submit을 사용해 iOS 앱을 Apple App Store에 제출할 때 사용할 수 있는 또 다른 인증 방식입니다. 다른 자격 증명과 달리 app-specific password는 제출 사이에 Expo 서버에 저장되지 않으며, 사용할 때마다 매번 제공해야 합니다.

이 비밀번호는 [KMS](https://cloud.google.com/security/products/security-key-management)로 암호화되며, App Store 제출에 필요한 기간에 더해 그 시간 동안 재시도를 허용하기 위한 24시간 동안만 저장됩니다. 이 기간이 지나면 비밀번호는 Expo 서버에서 삭제됩니다.

이 인증 방식은 **권장되지 않습니다**. 대신 App Store에 앱을 제출할 때는 App Store Connect(ASC) API key 사용을 권장합니다. Expo는 App Store에 앱을 제출하는 것 외의 다른 용도로 Apple app-specific password를 사용하지 않습니다.

#### 유출되었을 때의 영향

악의적인 행위자가 어떤 식으로든 app-specific password에 접근하게 되면, iCloud에 저장된 메일, 연락처, 캘린더 같은 정보에 접근할 수 있습니다(자세한 내용은 [Apple 문서](https://support.apple.com/en-us/102654)를 참고하세요).

공격자가 추가로 빌드 자격 증명까지 확보한 경우에는 기존 앱의 새 버전을 제출할 수 있습니다. 다만 그 빌드 자격 증명으로 서명된 앱만 제출할 수 있으며, 임의의 앱을 여러분 이름으로 App Store에 제출할 수는 없습니다.

#### 분실했을 때의 영향

없습니다. app-specific password를 잃어버린 경우 Apple 계정 설정에서 이를 취소하고 새로 만들 수 있습니다.

## Android 및 iOS 푸시 알림용 기기 토큰

플랫폼별 자격 증명 외에도 푸시 알림을 보내려면 기기 토큰이 필요합니다. Expo는 이 부분을 대신 관리하며, 그 위에 Expo Push Token이라는 추상화를 제공합니다. 기기 토큰은 수신자, 즉 알림을 받는 기기를 식별합니다. 기기 토큰은 저장 시 암호화되며 Android와 iOS에서 주기적으로 자동 교체됩니다.

### 유출되었을 때의 영향

악의적인 행위자가 기기 토큰에 접근하더라도, 해당 플랫폼의 푸시 알림 자격 증명까지 함께 갖고 있지 않다면 이를 이용해 할 수 있는 일은 없습니다.

### 분실했을 때의 영향

사용자가 앱을 다시 열 때까지는 알림을 보낼 수 없습니다.

## 더 많은 제어가 필요하신가요?

위 정보가 보안 요구 사항을 충족하지 못한다면 [자체 인프라](/build-reference/local-builds)에서 standalone 앱 빌드를 실행하는 방법을 고려할 수 있습니다. 다만 푸시 알림 서비스를 사용하려면 여전히 푸시 알림 자격 증명을 제공해야 합니다. 그것조차 불가능하다면 푸시 알림을 직접 처리하는 것을 권장합니다.
