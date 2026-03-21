---
title: AppIntegrity
description: Android에서는 Google Play Integrity API, iOS에서는 Apple App Attest service에 접근할 수 있게 해주는 라이브러리입니다.
sourceCodeUrl: 'https://github.com/expo/expo/tree/main/packages/expo-app-integrity'
packageName: '@expo/app-integrity'
platforms: ['android', 'ios', 'expo-go']
isAlpha: true
---

# AppIntegrity

Android에서는 Google Play Integrity API, iOS에서는 Apple App Attest service에 접근할 수 있게 해주는 라이브러리입니다.
Android, iOS, Expo Go에 포함

> **이 라이브러리는 현재 alpha 상태이며, 자주 호환성이 깨지는 변경이 발생할 수 있습니다.**

`@expo/app-integrity`는 genuine device에서 실행 중인 앱의 legitimate installation만 backend resource에 접근하도록 보장하는 데 도움이 되는 API를 제공합니다. Android에서는 Google의 [Play Integrity APIs](https://developer.android.com/google/play/integrity)를 사용하고, iOS에서는 Apple의 [App Attest service](https://developer.apple.com/documentation/devicecheck/establishing-your-app-s-integrity)를 사용해 앱의 진위를 검증함으로써, 인증되지 않은 client, 변조된 앱, 자동화된 script가 서버에 요청을 보내는 일을 방지하는 데 도움을 줍니다.

일반적으로 `@expo/app-integrity`는 서버가 다음을 구분할 수 있도록 도와줍니다:

-   **실제 기기**에서 실행 중인 **실제 앱**
-   그 외 모든 것(변조된 앱, 스크립트, 에뮬레이터)

이 라이브러리는 플랫폼에서 권장하는 앱 attest service를 사용해 이를 수행합니다.

## Installation

```sh
npx expo install @expo/app-integrity
```

이를 [기존 React Native 앱](/bare/overview)에 설치하는 경우, 프로젝트에 [`expo`를 설치](/bare/installing-expo-modules)했는지 확인하세요.

## Android에서 사용하기

`@expo/app-integrity`는 무결성 검사에 Play Integrity의 [Standard request flow](https://developer.android.com/google/play/integrity/standard)를 사용합니다.

### Configuration

앱에서 integrity API를 활성화하는 방법은 [Play Integrity setup guide](https://developer.android.com/google/play/integrity/setup#set-integrity-responses)를 참고하세요.

### integrity token provider 준비하기(한 번만)

integrity check 요청을 하기 전에 integrity token provider를 준비해야 합니다. 앱이 시작될 때 하거나 integrity check가 필요해지기 전에 백그라운드에서 해둘 수 있습니다.

```js
import * as AppIntegrity from '@expo/app-integrity';

const cloudProjectNumber = 'your-cloud-project-number';
await AppIntegrity.prepareIntegrityTokenProviderAsync(cloudProjectNumber);
```

### integrity token 요청하기(필요할 때마다)

앱이 genuine한 요청인지 확인하고 싶은 server 요청을 보낼 때마다 integrity token을 요청하고, 이를 복호화 및 검증을 위해 앱의 backend server로 전송합니다. 그러면 backend server가 어떻게 동작할지 결정할 수 있습니다.

```js
const requestHash = '2cp24z...';
const result = await AppIntegrity.requestIntegrityCheckAsync(requestHash);
```

[`requestIntegrityCheckAsync`](/versions/latest/sdk/app-integrity#appintegrityrequestintegritycheckasyncrequesthash)를 호출하기 전에 [`prepareIntegrityTokenProviderAsync`](/versions/latest/sdk/app-integrity#appintegrityprepareintegritytokenproviderasynccloudprojectnumber)가 성공적으로 호출되었는지 확인하세요.

이 예시에서 `requestHash`는 검증 중인 특정 사용자 작업에 고유한 hash입니다. 서로 다른 사용자 작업마다 다른 hash를 사용해 [`requestIntegrityCheckAsync`](/versions/latest/sdk/app-integrity#appintegrityprepareintegritytokenproviderasynccloudprojectnumber)를 여러 번 호출할 수 있습니다.

성공하면 검증을 위해 결과를 서버로 전송하세요.

> **참고**: 앱이 같은 token provider를 너무 오래 사용하면 token provider가 만료될 수 있으며, 그러면 다음 token 요청에서 `ERR_APP_INTEGRITY_PROVIDER_INVALID` 오류가 발생합니다. 이 오류가 발생하면 `prepareIntegrityTokenProviderAsync`를 다시 호출해 새 provider를 요청하도록 처리해야 합니다.

### integrity verdict 복호화 및 검증

서버에서 integrity token을 검증하는 방법은 [Play Integrity's guide](https://developer.android.com/google/play/integrity/standard#decrypt-and)를 참고하세요.

### Additional resources

-   [Google Pay Integrity documentation](https://developer.android.com/google/play/integrity/overview): `@expo/app-integrity`를 구동하는 API와 검증 흐름을 이해하려면 Google의 공식 가이드를 참고하세요.
    
-   [Play Integrity Standard request flow](https://developer.android.com/google/play/integrity/standard): 이 페이지는 Android 5.0(API level 21) 이상에서 지원되는 integrity verdict용 standard API 요청 방법을 설명합니다. 앱에서 상호작용이 genuine한지 확인하기 위해 서버 호출을 보낼 때마다 integrity verdict용 standard API 요청을 수행할 수 있습니다.
    
-   [About Integrity verdicts](https://developer.android.com/google/play/integrity/verdicts): integrity verdict는 기기, 앱, 계정의 유효성에 대한 정보를 전달합니다. 앱 서버는 복호화되고 검증된 verdict의 payload를 사용해 앱의 특정 작업이나 요청을 어떻게 처리할지 결정할 수 있습니다.
    
-   [Handling error codes](https://developer.android.com/google/play/integrity/reference/com/google/android/play/core/integrity/model/StandardIntegrityErrorCode): 앱이 Play Integrity API 요청을 보냈는데 호출이 실패하면 오류 코드를 받습니다. 이런 오류는 약한 네트워크 연결 같은 환경 문제, API 통합 문제, 악의적인 활동이나 진행 중인 공격 등 여러 이유로 발생할 수 있습니다.
    

## iOS에서 사용하기

### Configuration

Xcode에서 **Signing & Capabilities**로 이동해 **\+ Capability**를 클릭한 다음 **App Attest**를 추가하세요. 그러면 Xcode가 필요한 entitlement를 앱에 자동으로 추가합니다.

> **참고**: App Attest service를 사용하려면 Apple Developer website에 등록한 App ID가 있어야 합니다.

서버의 검증 로직은 [Validating apps that connect to your server](https://developer.apple.com/documentation/devicecheck/validating-apps-that-connect-to-your-server)를 참고하세요.

### 기기가 app attestation을 지원하는지 확인하기

모든 기기가 App Attest service를 사용할 수 있는 것은 아니므로, service에 접근하기 전에 앱이 compatibility check를 수행하는 것이 중요합니다. 사용자의 앱이 compatibility check를 통과하지 못하면 service를 우회해 자연스럽게 진행하세요. 사용 가능 여부는 `isSupported` 속성을 읽어 확인할 수 있습니다.

```js
import * as AppIntegrity from '@expo/app-integrity';

if (AppIntegrity.isSupported) {
  // Perform key generation and attestation.
}
// Continue with your server API access.
```

> **참고**: App Attest는 iOS Simulator에서 지원되지 않습니다.

> 대부분의 app extension은 App Attest를 지원하지 않습니다. 일반적으로 이러한 extension에서 코드를 실행할 때는 `isSupported` 메서드 속성이 `true`여도 key generation과 attestation을 우회해야 합니다. App Attest를 지원하는 유일한 app extension은 watchOS 9 이상에서의 watchOS extension입니다. 이러한 extension에서는 `isSupported` 결과를 사용해 WatchKit extension이 attestation을 우회할지 여부를 나타낼 수 있습니다.

### key pair 생성하기

앱을 실행하는 각 기기의 각 사용자 계정마다, `generateKey` 메서드를 호출해 고유한 하드웨어 기반 cryptographic key pair를 생성합니다.

```js
const keyId = await AppIntegrity.generateKeyAsync();
```

성공하면 이 메서드는 나중에 key에 접근할 때 사용할 key identifier(`keyId`)를 반환합니다. identifier 없이는 key를 사용할 방법이 없고, 나중에 identifier를 다시 얻을 방법도 없기 때문에 이 식별자를 영구 저장소에 기록하세요. 기기는 관련 private key를 Secure Enclave에 자동 저장하며, App Attest service는 이곳에 있는 key를 사용해 signature를 생성할 수 있지만 어떤 process도 이를 직접 읽거나 수정할 수 없으므로 보안이 보장됩니다.

> App Clip에서 key pair를 생성하는 경우에는 해당 앱에서도 같은 key pair를 사용하세요. 이를 지원하려면 전체 앱에서 접근 가능한 shared container에 식별자를 저장해야 합니다. 앱/extension 간 database 공유에 대한 Expo 가이드는 [expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/#sharing-a-database-between-appsextensions-ios)를 참고하거나, 두 대상 모두에서 식별자를 지속 저장하기 위해 React Native MMKV의 [App Groups / extensions](https://github.com/mrousavy/react-native-mmkv?tab=readme-ov-file#app-groups-or-extensions) shared storage를 사용하세요.

하나의 기기에서 여러 사용자 간에 같은 key를 재사용하지 마세요. 이는 보안 보호 수준을 약화시킵니다. 특히 손상된 하나의 기기를 사용해 손상된 앱 버전을 실행하는 여러 원격 사용자에게 서비스를 제공하는 공격을 탐지하기 어려워집니다. 자세한 내용은 [Assessing fraud risk](https://developer.apple.com/documentation/devicecheck/assessing-fraud-risk)를 참고하세요.

### 서버에서 challenge 받기

서버에서 고유한 일회용 challenge를 요청하세요. 이 challenge는 아래의 attestation 단계에 포함되어 공격자가 재사용할 수 없게 됩니다. challenge는 추측이 불가능하도록 충분한 entropy를 제공하기 위해 최소 16바이트 이상이어야 합니다.

### key pair를 유효한 것으로 인증하기

이전 단계에서 서버가 만든 challenge와 `keyId`를 아래와 같이 `attestKey` 메서드에 전달하세요:

```js
const attestationObject = await AppIntegrity.attestKeyAsync(keyId, challenge);
```

성공하면 받은 `attestationObject`와 `keyId`를 검증을 위해 서버로 전송하세요.

메서드가 `ERR_APP_INTEGRITY_SERVER_UNAVAILABLE` 오류를 반환하면 나중에 같은 key로 다시 attestation을 시도하세요. 다른 오류의 경우에는 key identifier를 폐기하고 다시 시도하고 싶을 때 새 key를 생성하세요.

> 앱에 이미 수백만 명의 일일 활성 사용자가 있고 앱에서 attestation을 시작하기 위해 `attestKey` 메서드 호출을 시작하려는 경우, 사용자를 안전하게 점진적으로 확대하는 방법은 [Preparing to use the app attest service](https://developer.apple.com/documentation/DeviceCheck/preparing-to-use-the-app-attest-service)를 참고하세요.

서버가 attestation object를 성공적으로 검증할 수 있으면 해당 앱 인스턴스가 유효하다고 판단합니다. 이 경우 향후 server 요청에 서명하기 위해 앱에 attestation object가 아니라 key identifier를 영구적으로 저장해야 합니다.

### 민감한 요청에서 assertion 생성하기

key의 attestation을 성공적으로 검증한 뒤에는, 서버가 이후의 일부 또는 모든 server 요청에서 앱이 정당한지 assertion을 요구할 수 있습니다. 앱은 요청에 서명해 이를 수행합니다. 앱에서 서버로부터 고유한 일회용 challenge를 받으세요. attestation 때와 마찬가지로 여기서도 replay attack을 피하기 위해 challenge를 사용합니다.

```js
const challenge = 'A string from your server';
const request = {
  action: 'getGameLevel',
  levelId: '1234',
  challenge: challenge,
};
const assertion = await AppIntegrity.generateAssertionAsync(keyId, JSON.stringify(request));
```

성공하면 assertion object를 client data와 함께 서버로 전달하세요. assertion object가 검증에 실패하면 요청을 어떻게 처리할지는 여러분이 결정해야 합니다.

key로 생성할 수 있는 assertion 수에는 제한이 없습니다. 그럼에도 일반적으로 assertion은 앱 생명주기의 민감한 순간, 예를 들어 premium content를 다운로드할 때 만들어지는 요청에만 사용하는 것이 좋습니다.

### 재설치 시 처음부터 시작하기

생성한 key는 일반적인 앱 업데이트를 거쳐도 계속 유효하지만, 앱 재설치, 기기 마이그레이션, 백업에서 기기 복원은 견디지 못합니다. 이런 경우에는 처음부터 다시 시작해서 새 key를 생성해야 합니다. 가능하면 새 key 생성은 이러한 이벤트가 발생했을 때나 새 사용자가 추가되었을 때로만 제한하세요. 기기에서 key 수를 적게 유지하면 특정 종류의 fraud를 감지하는 데 도움이 됩니다.

### Additional resources

-   [Apple's App Attest documentation](https://developer.apple.com/documentation/devicecheck/establishing-your-app-s-integrity): `@expo/app-integrity`를 구동하는 API와 검증 흐름을 이해하려면 Apple의 공식 가이드를 참고하세요.
    
-   [Validating apps that connect to your server](https://developer.apple.com/documentation/devicecheck/validating-apps-that-connect-to-your-server): 서버에서 앱 attestation과 assertion을 검증합니다.
    
-   [Assessing fraud risk](https://developer.apple.com/documentation/devicecheck/assessing-fraud-risk): 서버 간 호출을 사용해 risk data를 요청하고 분석합니다.
    
-   [Preparing to use the app attest service](https://developer.apple.com/documentation/devicecheck/preparing-to-use-the-app-attest-service): 개발 환경에서 구현을 테스트하고 사용자를 점진적으로 온보딩합니다.
    

## API

```js
import * as AppIntegrity from '@expo/app-integrity';
```

## Constants

### `AppIntegrity.isSupported`

지원 플랫폼: iOS.

타입: `boolean`

특정 기기가 [App Attest](https://developer.apple.com/documentation/devicecheck/establishing-your-app-s-integrity) service를 제공하는지를 나타내는 boolean 값입니다. 모든 기기 유형이 App Attest service를 지원하는 것은 아니므로, service를 사용하기 전에 지원 여부를 확인하세요.

## Methods

### `AppIntegrity.attestKeyAsync(keyId, challenge)`

지원 플랫폼: iOS.

| Parameter | Type | Description |
| --- | --- | --- |
| `keyId` | `string` | `generateKey` 함수를 호출해서 받은 식별자입니다. |
| `challenge` | `string` | 서버에서 받은 challenge 문자열입니다. |

  

Apple에 생성된 cryptographic key의 유효성을 attest해 달라고 요청합니다.

반환값: `Promise<string>`

attestation data를 담은 문자열로 이행되는 Promise입니다. `keyId`와 연관된 key가 유효하다는 Apple의 진술입니다. 처리를 위해 이를 서버로 보내세요.

### `AppIntegrity.generateAssertionAsync(keyId, challenge)`

지원 플랫폼: iOS.

| Parameter | Type | Description |
| --- | --- | --- |
| `keyId` | `string` | `generateKey` 함수를 호출해서 받은 식별자입니다. |
| `challenge` | `string` | attest된 private key로 서명할 문자열입니다. |

  

기기에서 실행 중인 앱 인스턴스가 정당하다는 것을 보여주는 데이터 블록을 생성합니다.

반환값: `Promise<string>`

assertion object를 담은 문자열로 이행되는 Promise입니다. 처리를 위해 서버로 보내는 데이터 구조입니다.

### `AppIntegrity.generateHardwareAttestedKeyAsync(keyAlias, challenge)`

지원 플랫폼: Android.

| Parameter | Type | Description |
| --- | --- | --- |
| `keyAlias` | `string` | key에 대한 고유 식별자입니다. |
| `challenge` | `string` | 서버에서 받은 challenge 문자열입니다. |

  

Android Keystore에서 hardware-attested key pair를 생성합니다. 이 key는 GrapheneOS 및 다른 secure Android 배포판에서 attestation에 사용할 수 있습니다.

반환값: `Promise<void>`

key가 성공적으로 생성되면 resolve되는 Promise입니다.

### `AppIntegrity.generateKeyAsync()`

지원 플랫폼: iOS.

App Attest service에서 사용할 새 cryptographic key를 생성합니다.

반환값: `Promise<string>`

key identifier를 담은 문자열로 이행되는 Promise입니다. key 자체는 Secure Enclave에 안전하게 저장됩니다.

### `AppIntegrity.getAttestationCertificateChainAsync(keyAlias)`

지원 플랫폼: Android.

| Parameter | Type | Description |
| --- | --- | --- |
| `keyAlias` | `string` | certificate를 가져올 key의 식별자입니다. |

  

hardware-attested key의 attestation certificate chain을 가져옵니다. certificate chain은 서버에서 검증해 기기 무결성을 확인할 수 있습니다.

반환값: `Promise<string[]>`

base64로 인코딩된 X.509 certificate 배열로 이행되는 Promise입니다.

### `AppIntegrity.isHardwareAttestationSupportedAsync()`

지원 플랫폼: Android.

이 기기에서 hardware attestation이 지원되는지 확인합니다.

반환값: `Promise<boolean>`

지원 여부를 나타내는 boolean으로 이행되는 Promise입니다.

### `AppIntegrity.prepareIntegrityTokenProviderAsync(cloudProjectNumber)`

지원 플랫폼: Android.

| Parameter | Type | Description |
| --- | --- | --- |
| `cloudProjectNumber` | `string` | cloud project 번호입니다. |

  

주어진 cloud project 번호에 대한 integrity token provider를 준비합니다.

반환값: `Promise<void>`

integrity token provider가 성공적으로 준비되면 이행되는 Promise입니다.

### `AppIntegrity.requestIntegrityCheckAsync(requestHash)`

지원 플랫폼: Android.

| Parameter | Type | Description |
| --- | --- | --- |
| `requestHash` | `string` | request hash를 나타내는 문자열입니다. |

  

주어진 request hash에 대한 integrity verdict를 Google Play에 요청합니다.

반환값: `Promise<string>`

integrity check 결과를 담은 문자열로 이행되는 Promise입니다.
