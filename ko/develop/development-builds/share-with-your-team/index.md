---
modificationDate: March 05, 2026
title: development build를 팀과 공유하기
description: development build를 팀과 함께 설치하고 공유하거나 여러 기기에서 실행하는 방법을 알아보세요.
---

# development build를 팀과 공유하기

development build를 팀과 함께 설치하고 공유하거나 여러 기기에서 실행하는 방법을 알아보세요.

Android와 iOS 모두 앱의 build를 기기에 직접 설치할 수 있는 방법을 제공합니다. 이를 통해 특정 build를 기기에 직접 올릴 수 있어 빠르게 반복 작업하고, 앱의 여러 build를 동시에 검토용으로 사용할 수 있습니다. 팀과 공유하거나 여러 테스트 기기에서 실행하는 것도 가능합니다.

## URL 공유하기

development build가 준비되면, build를 실행하는 방법이 포함된 공유 가능한 URL이 생성됩니다. 이 URL을 팀원과 공유하거나 테스트 기기로 보내 build를 설치할 수 있습니다. 생성되는 URL은 여러분의 프로젝트 build마다 고유합니다.

> development build를 만든 뒤 새 iOS 기기를 등록했다면, 그 기기에 설치하려면 새 development build를 다시 만들어야 합니다. 자세한 내용은 [internal distribution](/build/internal-distribution)을 참고하세요.

### EAS dashboard 사용하기

팀원에게 EAS dashboard의 build 페이지로 직접 안내할 수도 있습니다. 그곳에서 팀원은 자신의 기기에서 build artifact를 직접 다운로드할 수 있습니다.

### EAS CLI 사용하기

팀원은 EAS CLI를 사용해 development build를 다운로드하고 설치할 수도 있습니다. 먼저 development build와 연결된 Expo account로 로그인되어 있는지 확인한 뒤, 다음 명령을 실행하면 됩니다:

```sh
eas build:run --profile development
```

development build의 profile 이름이 `development`가 아니라면 `--profile`에 그 이름을 대신 사용하세요.

### iOS 전용 안내

> iOS 16 이상을 사용 중이고 아직 Developer Mode를 켜지 않았다면, build를 실행하기 전에 먼저 [활성화](/guides/ios-developer-mode)해야 합니다. (enterprise provisioning을 사용하는 경우에는 해당되지 않습니다.)

`eas build:resign`을 사용하면 기존 iOS용 **.ipa**를 새로운 ad hoc provisioning profile로 codesign할 수 있습니다. 팀과 배포할 때 시간을 줄이는 데 도움이 됩니다. 예를 들어 기존 build에 새 테스트 기기를 추가하고 싶다면, 이 명령으로 provisioning profile을 업데이트해 기기를 포함시키고 앱 전체를 처음부터 다시 빌드하지 않아도 됩니다. 자세한 내용은 [새 자격 증명으로 다시 서명하기](/app-signing/app-credentials#re-signing-new-credentials)를 참고하세요.

## 다음 단계

[같은 기기에 여러 앱 variant 설치하기](/build-reference/variants) — app.json을 app.config.js로 변환하고 각 variant용 development server를 시작하기 위해 필요한 추가 구성을 통해, 같은 기기에 앱의 여러 variant(development, preview, production)를 나란히 설치하는 방법을 알아보세요. — app.json — app.config.js

[앱의 프리릴리스 버전 공유하기](/build/internal-distribution) — 앱의 프리릴리스 버전을 공유하는 방법을 더 알아보세요.
