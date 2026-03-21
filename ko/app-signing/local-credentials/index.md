---
modificationDate: December 08, 2025
title: 로컬 자격 증명 사용하기
description: EAS를 사용할 때 로컬 자격 증명을 설정하고 사용하는 방법을 알아보세요.
---

# 로컬 자격 증명 사용하기

EAS를 사용할 때 로컬 자격 증명을 설정하고 사용하는 방법을 알아보세요.

보통은 [EAS가 자격 증명을 처리하도록 맡기면](/app-signing/managed-credentials) 코드 서명 전문가가 아니어도 충분합니다. 하지만 일부 사용자는 프로젝트의 keystore, 인증서, 프로파일을 직접 관리하고 싶을 수 있습니다.

직접 앱 서명 자격 증명을 관리하고 싶다면 **credentials.json**을 사용해 로컬 파일 시스템에 있는 자격 증명의 상대 경로와 관련 비밀번호를 EAS Build에 제공하고, 이를 사용해 빌드에 서명할 수 있습니다.

## credentials.json

로컬 자격 증명 구성을 사용하기로 했다면 프로젝트 루트에 **credentials.json** 파일을 만들어야 하며, 대략 다음과 같은 형식이 됩니다:

```json
{
  "android": {
    "keystore": {
      "keystorePath": "android/keystores/release.keystore",
      "keystorePassword": "paofohlooZ9e",
      "keyAlias": "keyalias",
      "keyPassword": "aew1Geuthoev"
    }
  },
  "ios": {
    "provisioningProfilePath": "ios/certs/profile.mobileprovision",
    "distributionCertificate": {
      "path": "ios/certs/dist-cert.p12",
      "password": "iex3shi9Lohl"
    }
  }
}
```

> **credentials.json**과 모든 자격 증명을 **.gitignore**에 추가해 저장소에 실수로 커밋되어 비밀 정보가 유출되지 않도록 하세요.

### Android 자격 증명

Android 앱 바이너리를 빌드하려면 keystore가 필요합니다. 아직 release keystore가 없다면 다음 명령으로 직접 생성할 수 있습니다(`KEYSTORE_PASSWORD`, `KEY_PASSWORD`, `KEY_ALIAS`, `com.expo.your.android.package`는 원하는 값으로 바꾸세요):

```sh
keytool \
-genkey -v \
-storetype JKS \
-keyalg RSA \
-keysize 2048 \
-validity 10000 \
-storepass KEYSTORE_PASSWORD \
-keypass KEY_PASSWORD \
-alias KEY_ALIAS \
-keystore release.keystore \
-dname "CN=com.expo.your.android.package,OU=,O=,L=,S=,C=US"
```

컴퓨터에 keystore 파일이 생기면 적절한 디렉터리로 옮겨야 합니다. 권장 위치는 **android/keystores** 디렉터리입니다. **릴리스 keystore는 반드시 모두 git-ignore 하세요!** 위의 `keytool` 명령을 실행했고 keystore를 **android/keystores/release.keystore**에 두었다면, 다음 줄을 **.gitignore**에 추가해 무시할 수 있습니다:

```sh
android/keystores/release.keystore
```

**credentials.json**을 만들고 다음과 같이 자격 증명을 설정하세요:

```json
{
  "android": {
    "keystore": {
      "keystorePath": "android/keystores/release.keystore",
      "keystorePassword": "KEYSTORE_PASSWORD",
      "keyAlias": "KEY_ALIAS",
      "keyPassword": "KEY_PASSWORD"
    }
  },
  "ios": {
    ... 
  }
}
```

-   `keystorePath`는 컴퓨터에서 keystore가 위치한 경로를 가리킵니다. 프로젝트 루트 기준 상대 경로와 절대 경로를 모두 지원합니다.
-   `keystorePassword`는 keystore 비밀번호입니다. 앞 단계를 따라왔다면 `KEYSTORE_PASSWORD`의 값입니다.
-   `keyAlias`는 키 별칭입니다. 앞 단계를 따라왔다면 `KEY_ALIAS`의 값입니다.
-   `keyPassword`는 키 비밀번호입니다. 앞 단계를 따라왔다면 `KEY_PASSWORD`의 값입니다.

### iOS 자격 증명

iOS 앱 바이너리를 빌드하려면 몇 가지 추가 준비가 필요합니다. 먼저 유료 Apple Developer Account가 있어야 하고, 애플리케이션용 Distribution Certificate와 Provisioning Profile을 생성해야 합니다. 이는 [Apple Developer Portal](https://developer.apple.com/account/resources/certificates/list)에서 할 수 있습니다.

Distribution Certificate와 Provisioning Profile을 컴퓨터에 준비했다면 적절한 디렉터리로 옮겨야 합니다. 권장 위치는 `ios/certs` 디렉터리입니다. 이 문서의 나머지 부분에서는 파일 이름이 각각 **dist.p12**와 **profile.mobileprovision**이라고 가정합니다.

> 자격 증명이 들어 있는 디렉터리를 **.gitignore**에 추가해 저장소에 실수로 커밋되어 비밀 정보가 유출되지 않도록 하세요.

권장 디렉터리에 자격 증명을 두었다면 다음 줄을 **.gitignore**에 추가해 해당 파일을 무시할 수 있습니다:

```sh
ios/certs/*
```

**credentials.json**을 만들거나 수정한 뒤 다음과 같이 자격 증명을 설정하세요:

```json
{
  "android": {
    ... 
  },
  "ios": {
    "provisioningProfilePath": "ios/certs/profile.mobileprovision",
    "distributionCertificate": {
      "path": "ios/certs/dist.p12",
      "password": "DISTRIBUTION_CERTIFICATE_PASSWORD"
    }
  }
}
```

-   `provisioningProfilePath`는 컴퓨터에서 Provisioning Profile이 위치한 경로를 가리킵니다. 프로젝트 루트 기준 상대 경로와 절대 경로를 모두 지원합니다.
-   `distributionCertificate.path`는 컴퓨터에서 Distribution Certificate가 위치한 경로를 가리킵니다. 프로젝트 루트 기준 상대 경로와 절대 경로를 모두 지원합니다.
-   `distributionCertificate.password`는 `distributionCertificate.path`에 있는 Distribution Certificate의 비밀번호입니다.

#### 멀티 타깃 프로젝트

iOS 앱에서 Share Extension, Widget Extension 같은 [App Extensions](https://developer.apple.com/app-extensions/)를 사용한다면 Xcode 프로젝트의 모든 타깃에 대해 자격 증명을 제공해야 합니다. 각 익스텐션이 개별 bundle identifier로 식별되기 때문입니다.

예를 들어 프로젝트가 메인 애플리케이션 타깃(`multitarget`)과 Share Extension 타깃(`shareextension`)으로 구성되어 있다고 가정해 보겠습니다.

이 경우 **credentials.json**은 다음과 같아야 합니다:

```json
{
  "ios": {
    "multitarget": {
      "provisioningProfilePath": "ios/certs/multitarget-profile.mobileprovision",
      "distributionCertificate": {
        "path": "ios/certs/dist.p12",
        "password": "DISTRIBUTION_CERTIFICATE_PASSWORD"
      }
    },
    "shareextension": {
      "provisioningProfilePath": "ios/certs/shareextension-profile.mobileprovision",
      "distributionCertificate": {
        "path": "ios/certs/another-dist.p12",
        "password": "ANOTHER_DISTRIBUTION_CERTIFICATE_PASSWORD"
      }
    }
  }
}
```

## 자격 증명 소스 설정하기

빌드 프로파일에서 `"credentialsSource": "local"` 또는 `"credentialsSource:" "remote"`를 지정하여 EAS Build가 자격 증명을 어떻게 해석할지 알려줄 수 있습니다.

-   `"local"`을 지정하면 **credentials.json**이 사용됩니다.
-   `"remote"`를 지정하면 EAS 서버에서 자격 증명을 가져옵니다.

예를 들어 Amazon Appstore에 배포할 때는 로컬 자격 증명을 사용하고, Google Play Store에 배포할 때는 원격 자격 증명을 사용하고 싶을 수 있습니다:

```json
{
  "build": {
    "amazon-production": {
      "credentialsSource": "local",
      "android": {
        // ...
      }
    },
    "google-production": {
      "credentialsSource": "remote",
      "android": {
        // ...
      }
    }
  }
}
```

어떤 옵션도 지정하지 않으면 `"credentialsSource"`의 기본값은 `"remote"`입니다.

## CI에서 트리거되는 빌드에서 로컬 자격 증명 사용하기

CI 작업 설정을 시작하기 전에 **credentials.json**과 **eas.json** 파일이 [위에서 설명한 대로](/app-signing/local-credentials#credentialsjson) 구성되어 있는지 확인하세요.

개발자는 보통 환경 변수를 사용해 CI 작업에 비밀 정보를 제공합니다. 그런데 **credentials.json** 파일은 JSON 객체를 포함하므로, 이를 환경 변수에 할당할 수 있도록 올바르게 이스케이프하기가 어려울 수 있습니다. 이 문제를 해결하는 한 가지 방법은 파일을 base64 문자열로 변환하고, 그 값을 환경 변수에 저장한 다음, CI에서 다시 디코딩해 파일을 복원하는 것입니다.

다음 단계를 고려해 보세요:

-   콘솔에서 다음 명령을 실행해 자격 증명 파일을 기반으로 Base64 문자열을 생성합니다:
    
    ```sh
    base64 credentials.json
    ```
    
-   CI에서 위 명령의 출력값으로 `CREDENTIALS_JSON_BASE64` 환경 변수를 설정합니다.
-   CI 작업에서 간단한 셸 명령으로 파일을 복원합니다:
    
    ```sh
    echo $CREDENTIALS_JSON_BASE64 | base64 -d > credentials.json
    ```
    

마찬가지로 keystore, provisioning profile, distribution certificate도 인코딩해 두었다가 CI에서 나중에 복원할 수 있습니다. CI에서 로컬 자격 증명을 사용해 빌드를 성공적으로 트리거하려면, **credentials.json**에 정의한 것과 같은 위치에 모든 자격 증명이 CI 인스턴스의 파일 시스템에 존재하도록 해야 합니다.

복원 단계가 준비되면 [CI에서 빌드 트리거하기](/build/building-on-ci) 가이드에 설명된 것과 같은 절차로 빌드를 트리거할 수 있습니다.
