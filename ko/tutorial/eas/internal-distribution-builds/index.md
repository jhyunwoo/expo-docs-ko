---
modificationDate: March 09, 2026
title: internal distribution build 만들고 공유하기
description: internal distribution build가 무엇인지, 왜 필요한지, 그리고 이를 만드는 방법을 알아봅니다.
---

# internal distribution build 만들고 공유하기

internal distribution build가 무엇인지, 왜 필요한지, 그리고 이를 만드는 방법을 알아봅니다.

이 장에서는 [internal distribution builds](/build/internal-distribution#internal-distribution)를 설정하는 방법을 알아보겠습니다.

[시청하기: internal distribution build 만들고 공유하는 방법](https://www.youtube.com/watch?v=1fQuGLHxWks) — EAS로 internal distribution build를 만들고 테스트를 위해 팀과 직접 공유합니다.

## internal distribution build

internal distribution build는 팀 구성원과 업데이트를 공유하는 데 이상적이며, 기술 담당자와 비기술 담당자 모두가 직접 피드백을 줄 수 있게 해줍니다. development build와 달리 development server를 실행할 필요가 없어 테스트 과정이 더 단순합니다.

### 앱을 내부적으로 배포하는 방법

Google과 Apple은 모두 앱을 내부적으로 공유할 수 있는 내장 메커니즘을 제공합니다:

-   **Android**: Google Play beta 사용
-   **iOS**: TestFlight 사용

하지만 이 전통적인 방법들에는 각각 한계가 있습니다. 예를 들어 TestFlight는 한 번에 하나의 활성 build만 허용합니다.

### 더 빠른 배포를 위한 EAS Build

EAS Build는 이 과정을 더 빠르게 만들어 줍니다. build에 대한 공유 가능한 링크를 만들고 그 사용 방법에 대한 안내도 제공합니다. 내부 배포를 쉽게 하기 위해 설계된 기본 설정을 제공하며, 전통적인 방법보다 더 효율적인 대안을 제공합니다.

## internal distribution build 만들기

EAS Build로 build를 만들고 배포하려면 다음 단계를 따르면 됩니다:

### preview build profile 설정하기

초기 설정 단계에서 **eas.json** 안에 internal distribution용으로 설계된 `preview` build profile이 포함된 기본 설정이 이미 있습니다:

```json
{
  "build": {
    "preview": {
      "distribution": "internal"
    }
  }
}
```

첫 번째 internal distribution build를 만들기 위해 필요한 것은 이것이면 충분합니다. 위 코드 조각의 `preview` build profile에는 값이 `internal`로 설정된 `distribution` 속성이 있습니다. 이 값 덕분에 build URL을 누구와도 공유할 수 있어 그들이 디바이스에 설치할 수 있고, 앱을 실행하기 위해 development server도 필요하지 않습니다.

이전 장에서 이야기했듯이 앱 스토어용이 아닌 build에서는 Android는 **.apk**, iOS는 **.ipa** 형식이 필요합니다. internal distribution build에도 이 규칙이 적용됩니다. `distribution`을 `internal`로 설정하면 디바이스용 앱 binary를 이 파일 형식으로 자동 생성합니다.

### 만들기

internal distribution build를 만들려면 [app signing credentials](/app-signing/app-credentials)가 필요합니다.

Android 앱 서명은 제한이 적어 호환되는 어떤 **.apk** 파일이든 설치할 수 있습니다. development build를 만들 때 이미 새 Android Keystore가 생성되었기 때문에 preview build를 위해 새 keystore를 생성할 필요는 없습니다.

반면 Apple은 iOS 디바이스에 앱을 배포할 때 더 엄격한 규칙을 가지고 있습니다. 앱을 실행할 수 있는 디바이스를 명시적으로 나열한 ad hoc provisioning profile이 필요합니다. 특정 요구 사항을 충족하는 앱을 가진 일부 조직은 [Apple Developer Enterprise Program](https://developer.apple.com/programs/enterprise/)을 사용해 더 많은 대상에게 내부 배포를 할 수도 있습니다.

-   `preview` profile을 사용해 Android build를 시작합니다:

```sh
eas build --platform android --profile preview
```

-   이 명령은 EAS Build를 실행하며, EAS dashboard에서 build 진행 상황을 확인할 수 있습니다:

### 설치하기

build가 완료되면 Build artifact 섹션이 업데이트되어 build가 완료되었음을 보여줍니다. 이 섹션은 iOS 디바이스에서 development build를 실행할 수 있는 방법으로 Expo Orbit과 Install 버튼을 제공합니다.

-   build의 detail page를 엽니다. 다른 사람과 build를 공유하는 경우, build 링크를 보내줄 수 있습니다. 그 사람은 build의 detail page 또는 build artifact 세부 정보를 열 수 있고, 그 안에는 Expo Orbit도 포함되어 있습니다.
-   Android 또는 iOS 디바이스를 USB로 머신에 연결합니다.
-   Orbit menu bar 앱을 엽니다.
-   Orbit 앱에서 **Device**를 선택합니다.
-   **Build artifact** 아래의 **Open with Orbit**를 클릭합니다.

대안: Install과 QR 코드 사용하기

-   build의 detail page를 엽니다. 다른 사람과 build를 공유하는 경우, build page 링크를 보내줄 수 있습니다. 그 사람은 페이지를 열고 Expo Orbit이 포함된 build artifact 세부 정보를 볼 수 있습니다.
-   Build artifact 섹션 아래의 **Install**을 클릭해 **Install on a test device** 팝업을 표시합니다.
-   **Send a link to a device** 섹션의 링크를 복사해 테스트 디바이스로 전송합니다.

### 실행하기

디바이스에서 앱 아이콘을 탭해 preview build를 시작합니다. development server는 필요하지 않습니다.

이미 여러 app variant를 설정해 두었기 때문에, development variant와 preview variant가 각각 별도로 디바이스에 설치된 것을 볼 수 있습니다. 예를 들면:

-   Android에서:

-   iOS에서:

## 요약

6장: internal distribution build 만들고 공유하기

Android와 iOS용 internal distribution build를 성공적으로 만들었고, iOS에서는 ad hoc provisioning을 사용했으며, 같은 디바이스에 여러 app variant를 설치했습니다.

다음 장에서는 개발자 대상 버전과 사용자 대상 앱 버전이 무엇인지, 그리고 이를 자동으로 관리하는 방법을 알아보겠습니다.

[다음: 서로 다른 앱 버전 관리하기](/tutorial/eas/manage-app-versions)
