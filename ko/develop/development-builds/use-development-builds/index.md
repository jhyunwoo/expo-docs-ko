---
modificationDate: August 26, 2025
title: development build 사용하기
description: 프로젝트에서 development build를 사용하는 방법을 알아보세요.
---

# development build 사용하기

프로젝트에서 development build를 사용하는 방법을 알아보세요.

보통 네이티브 build를 처음부터 새로 만드는 데는 작업을 바꾸고 집중력을 잃고 싶어질 만큼 긴 시간이 걸립니다. 하지만 기기나 emulator/simulator에 development build가 설치되어 있다면, 앱을 구동하는 [기반 네이티브 코드](/develop/development-builds/use-development-builds#rebuild-a-development-build)를 변경할 때까지는 네이티브 빌드 과정을 다시 기다릴 필요가 없습니다.

## development server 시작하기

개발을 시작하려면 다음 명령으로 development server를 시작하세요:

```sh
npx expo start
```

development client 안에서 프로젝트를 열려면:

-   `a` 또는 `i` 키를 눌러 Android Emulator 또는 iOS Simulator에서 프로젝트를 엽니다.
-   실제 기기에서는 시스템 카메라나 QR 코드 리더로 QR 코드를 스캔해 기기에서 프로젝트를 엽니다.

## launcher 화면

기기의 Home 화면에서 development build를 실행하면 다음과 비슷한 launcher 화면이 표시됩니다:

로컬 네트워크에서 bundler가 감지되거나, Expo CLI와 development build 양쪽 모두에서 Expo account에 로그인되어 있다면 이 화면에서 바로 연결할 수 있습니다. 그렇지 않다면 Expo CLI가 표시하는 QR 코드를 스캔해 연결할 수 있습니다.

## development build 다시 빌드하기

예를 들어 [`expo-secure-store`](/versions/latest/sdk/securestore)처럼 네이티브 코드 API를 포함한 라이브러리를 프로젝트에 추가하면 development client를 다시 빌드해야 합니다. 라이브러리를 프로젝트 의존성으로 설치한다고 해서 그 라이브러리의 네이티브 코드가 development client에 자동으로 포함되지는 않기 때문입니다.

## development build 디버그하기

필요할 때는 Expo CLI에서 Cmd ⌘ + d 또는 Ctrl + d를 누르거나, 휴대전화나 태블릿을 흔들어 menu에 접근할 수 있습니다. 여기서 development build의 모든 기능, 필요한 디버깅 기능을 사용하거나 다른 앱 버전으로 전환할 수 있습니다.

자세한 내용은 [Debugging](/debugging/runtime-issues) 가이드를 참고하세요.
