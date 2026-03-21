---
modificationDate: March 09, 2026
title: iOS 디바이스용 cloud build 만들고 실행하기
description: EAS Build를 사용해 iOS 디바이스용 development build를 설정하는 방법을 알아봅니다.
---

# iOS 디바이스용 cloud build 만들고 실행하기

EAS Build를 사용해 iOS 디바이스용 development build를 설정하는 방법을 알아봅니다.

이 장에서는 EAS Build를 사용해 iOS 디바이스에서 실행할 수 있는 development build를 만들어 보겠습니다.

iOS 디바이스용 development build는 iOS 앱 설치의 표준 형식인 **.ipa** 형식으로 생성됩니다.

[시청하기: iOS 실물 디바이스용 development build 만들기](https://www.youtube.com/watch?v=HbfWU7_o4cU) — 코드 서명 설정을 포함해 EAS Build를 사용해 실물 iOS 디바이스에서 development build를 만들고 실행하는 방법을 알아봅니다.

## 사전 준비

시작하기 전에 다음이 준비되어 있는지 확인하세요:

-   **Apple Developer Account:** 앱 서명에 필요한 [credential](/app-signing/app-credentials#ios)에 접근하기 위해 필요합니다. 각 build는 앱이 신뢰할 수 있는 출처에서 왔음을 검증할 수 있도록 서명되어야 하기 때문입니다. EAS Build는 이러한 credential 관리를 도와줍니다.
-   **iOS 16 이상에서 Developer Mode 활성화:** 디바이스에 development build를 설치하려면 Developer Mode가 활성화되어 있어야 합니다. 처음 설정하는 것이거나 현재 비활성화되어 있다면, [Developer Mode 활성화](/guides/ios-developer-mode) 지침을 참고하세요.

## provisioning profile

iOS 디바이스에서 개발을 시작하려면 다음이 필요합니다:

-   새로운 [provisioning profile](/app-signing/app-credentials#provisioning-profiles)을 만들어 디바이스를 등록합니다.
-   이 profile을 디바이스에 다운로드하고 설치합니다.

### iOS 디바이스 등록하기

EAS CLI로 새 Apple 디바이스를 등록하려면 다음 명령을 실행하세요:

```sh
eas device:create
```

이 명령은 다음 질문을 표시합니다:

-   **You're inside the project directory. Would you like to use the** **your-account-name** **account?** Y를 누르세요.
-   **Apple ID.** 이 단계에서는 Apple ID를 입력하세요. 그러면 Apple Developer account에 로그인합니다. 터미널 창의 안내를 따르세요.
-   **How would you like to register your devices?** iOS 디바이스에서 열 수 있는 등록 URL을 생성하는 **Website**를 선택합니다.

> **Tip**: 여러분이나 팀에 여러 디바이스가 있다면, provisioning profile 링크를 그 디바이스들과 공유해 profile을 다운로드하고 설치할 수 있습니다.

### profile 다운로드 및 설치하기

디바이스의 웹 브라우저에서 이전 단계에서 제공된 링크를 열고 **Download Profile button**을 탭하세요.

그러면 **Settings** 앱이 열리며 디바이스를 등록하라는 안내가 표시됩니다.

**Install**을 탭해 iOS 디바이스를 등록합니다.

provisioning profile 설치가 끝나면 디바이스는 다시 웹 브라우저로 돌아가고, 과정이 완료되었다는 성공 메시지를 표시합니다.

## iOS 디바이스용 development build

### 만들기

iOS 디바이스에서 development build를 만들려면 `build.development` profile 아래에서 다음을 확인하세요:

-   `developmentClient`가 **eas.json**에서 `true`로 설정되어 있어야 하며, 기본 설정으로 이미 되어 있습니다.
-   그런 다음 `ios`를 platform으로, `development`를 build profile로 지정해 `eas build` 명령을 실행합니다:

```sh
eas build --platform ios --profile development
```

> **Tip**: 다음부터 `eas build` 명령을 실행할 때는 platform 지정에 `-p`도 사용할 수 있습니다. `--platform`의 축약형입니다.

이 명령은 build를 처음 만들 때 다음 질문들을 표시합니다:

-   **What would you like your iOS bundle identifier to be?** 이 프롬프트에서 제공되는 기본값을 선택하려면 return을 누르세요. 아직 정의되어 있지 않다면 **app.json**에 [`ios.bundleIdentifier`](/versions/latest/config/app#package)가 추가됩니다.
-   **Do you want to log in to your Apple account?** 처음 development build를 만들기 때문에 **Generate a new Apple Distribution Certificate**를 묻게 됩니다. 두 번 모두 Y를 누르세요.
-   **Select a device for ad hoc build**. 이것이 핵심 단계이며, 그래서 미리 provisioning profile을 등록해야 했습니다. 여기서 등록한 디바이스 중 하나 또는 전체를 선택한 뒤 return을 눌러 나중에 그 디바이스들에 build를 설치할 수 있습니다.

> **Only if you have skipped [iOS Simulator chapter](/tutorial/eas/ios-development-build-for-simulators):** **iOS app only uses standard/exempt encryption?** 이 프롬프트에서 제공되는 기본값을 선택하려면 Y를 누르세요. 우리 앱은 encryption을 사용하지 않으므로, **Info.plist** 파일의 `ITSAppUsesNonExemptEncryption`을 `NO`로 설정하고, 나중에 앱을 TestFlight/Apple App Store에 릴리스할 때 관련 compliance check도 처리해 줍니다. 자신의 앱을 릴리스할 때 encryption을 사용하는 경우에는 N을 선택해 다음부터 이 프롬프트를 건너뛸 수 있습니다.

응답을 마치면 build가 queue에 들어가고, EAS CLI가 제공하는 링크를 통해 EAS dashboard에서 진행 상황을 추적할 수 있습니다:

build details 페이지에는 무엇이 있나요?

build details 페이지는 build type, profile, Expo SDK version, app version, build number, 마지막 commit hash, 그리고 build를 시작한 개발자 또는 계정 소유자의 정보를 표시합니다.

위 이미지에서 **Build artifact**의 현재 상태는 build가 진행 중임을 보여줍니다. 완료되면 이 섹션에 build를 다운로드할 수 있는 옵션이 제공됩니다. **Logs**는 EAS Build에서 수행한 iOS build 과정의 모든 단계를 보여줍니다. 간결함을 위해 여기서는 각 단계를 자세히 보지 않겠습니다. 더 자세한 내용은 [iOS build process](/build-reference/ios-builds)를 참고하세요.

iOS bundle identifier란 무엇인가요?

`ios.bundleIdentifier`는 앱의 고유 이름입니다. 지금 당장 앱을 게시한다면 Apple App Store는 이 속성과 값을 사용해 스토어에서 앱을 식별합니다.

이 표기법은 `host.owner.app-name` 형식으로 정의됩니다. 예를 들어 예제 앱은 `com.owner.stickersmash`를 사용하며, 여기서 `com.owner`는 도메인이고 `stickersmash`는 앱 이름입니다.

### 설치하기

build가 완료되면 Build artifact 섹션이 업데이트되어 build가 완료되었음을 보여줍니다:

이 섹션은 iOS 디바이스에서 development build를 실행할 수 있는 방법으로 Expo Orbit과 Install 버튼을 제공합니다.

[Expo Orbit](https://expo.dev/orbit)는 iOS 디바이스에 development build를 매끄럽게 설치할 수 있게 해줍니다. 이 방법을 사용하려면:

-   iOS 디바이스를 USB로 개발 머신에 연결합니다.
-   Orbit menu bar 앱을 엽니다.
-   Orbit 앱에서 **Device**를 선택합니다.

-   EAS dashboard의 **Build artifact** 아래에서 **Open with Orbit**를 클릭합니다.

build가 설치되면 Orbit 앱이 디바이스에서 development build를 실행합니다.

대안: Install 버튼과 QR 코드 사용하기

**Build artifact** 섹션의 **Install** 버튼은 손쉬운 설치를 위해 QR 코드를 생성합니다:

-   **Install**을 클릭해 QR 코드가 있는 팝업을 표시합니다.

-   iOS 디바이스의 카메라로 QR 코드를 스캔해 링크를 열고, 디바이스에 development build를 다운로드하도록 탭합니다.

### 실행하기

프로젝트 디렉터리에서 `npx expo start` 명령을 실행해 development server를 시작합니다:

```sh
npx expo start
```

-   디바이스에서 앱 아이콘을 탭해 development build를 엽니다.

-   EAS CLI와 development build 양쪽에 모두 로그인되어 있는지 확인해 account syncing 기능을 사용합니다. 우리는 이미 EAS CLI에는 로그인했으므로, 다음 단계는 development build UI를 통해 로그인하는 것입니다.

-   **Fetch development servers**를 탭하고 Development servers 아래 목록에서 실행 중인 서버를 선택합니다.

## 요약

4장: iOS 디바이스용 cloud build 만들고 실행하기

EAS Build를 사용해 iOS 디바이스에서 development build를 성공적으로 만들고 실행했습니다.

다음 장에서는 하나의 디바이스에 여러 app variant를 설치할 수 있도록 앱 설정을 구성하는 방법을 알아봅니다.

[다음: 여러 app variant 설정하기](/tutorial/eas/multiple-app-variants)
