---
modificationDate: September 11, 2025
title: 빌드 라이프사이클 훅
description: npm과 함께 EAS Build 라이프사이클 훅을 사용해 빌드 프로세스를 사용자 지정하는 방법을 알아보세요.
---

# 빌드 라이프사이클 훅

npm과 함께 EAS Build 라이프사이클 훅을 사용해 빌드 프로세스를 사용자 지정하는 방법을 알아보세요.

EAS Build lifecycle npm hook을 사용하면 빌드 프로세스 전후에 스크립트를 실행해 빌드 과정을 사용자 지정할 수 있습니다.

> 더 잘 이해하려면 [Android 빌드 프로세스](/build-reference/android-builds)와 [iOS 빌드 프로세스](/build-reference/ios-builds)를 참고하세요.

> 라이프사이클 훅은 [custom builds](/custom-builds/get-started)의 빌드 프로세스에서는 실행되지 않습니다. 프로세스 중 빌드 단계에서 직접 추출해 수동으로 호출해야 합니다.

## EAS Build 라이프사이클 훅

사용할 수 있는 EAS Build lifecycle npm hook은 여섯 가지입니다. 이를 사용하려면 **package.json**에 설정하면 됩니다.

| Build Lifecycle npm hook | Description |
| --- | --- |
| `eas-build-pre-install` | EAS Build가 `npm install`을 실행하기 전에 실행됩니다. |
| `eas-build-post-install` | 동작은 플랫폼과 프로젝트 유형에 따라 달라집니다. Android에서는 `npm install`과 `npx expo prebuild`(필요한 경우)가 모두 완료된 뒤 한 번 실행됩니다. iOS에서는 `npm install`, `npx expo prebuild`(필요한 경우), `pod install`이 모두 완료된 뒤 한 번 실행됩니다. |
| `eas-build-on-success` | 빌드가 성공했을 때 빌드 프로세스 끝에서 이 훅이 트리거됩니다. |
| `eas-build-on-error` | 빌드가 실패했을 때 빌드 프로세스 끝에서 이 훅이 트리거됩니다. |
| `eas-build-on-complete` | 빌드 프로세스 끝에서 이 훅이 트리거됩니다. `EAS_BUILD_STATUS` 환경 변수로 빌드 상태를 확인할 수 있습니다. 값은 `finished` 또는 `errored`입니다. |
| `eas-build-on-cancel` | 빌드가 취소되면 이 훅이 트리거됩니다. |

하나 이상의 라이프사이클 훅을 사용할 때 **package.json**이 어떻게 보일 수 있는지 예시는 다음과 같습니다:

```json
{
  "name": "my-app",
  "scripts": {
    "eas-build-pre-install": "echo 123",
    "eas-build-post-install": "echo 456",
    "eas-build-on-success": "echo 789",
    "eas-build-on-error": "echo 012",
    "eas-build-on-cancel": "echo 345",
    "start": "expo start",
    "test": "jest"
  },
  "dependencies": {
    "expo": "54.0.0"
    ... 
  }
}
```

## 플랫폼별 훅 동작

Android 빌드에서만 또는 iOS 빌드에서만 스크립트(또는 스크립트의 일부)를 실행하려면, 스크립트 안에서 플랫폼에 따라 동작을 분기할 수 있습니다. 다음은 shell script 또는 Node script로 이를 구현하는 일반적인 예시입니다.

### 예시

#### package.json과 shell script

```json
{
  "name": "my-app",
  "scripts": {
    "eas-build-pre-install": "./pre-install",
    "start": "expo start"
    ... 
  },
  "dependencies": {
    ... 
  }
}
```

```bash
#!/bin/bash

# This is a file called "pre-install" in the root of the project

if [[ "$EAS_BUILD_PLATFORM" == "android" ]]; then
  echo "Run commands for Android builds here"
elif [[ "$EAS_BUILD_PLATFORM" == "ios" ]]; then
  echo "Run commands for iOS builds here"
fi
```

예시: macOS worker에 `git-lfs`를 설치하는 pre-install 스크립트

다음 스크립트는 아직 설치되어 있지 않다면 [`git-lfs`](https://git-lfs.com/)를 설치합니다. 이는 특정 CocoaPods를 설치하는 데 `git-lfs`가 필요한 경우에 유용합니다.

```bash
if [[ "$EAS_BUILD_PLATFORM" == "ios" ]]; then
  if brew list git-lfs > /dev/null 2>&1; then
    echo "=====> git-lfs is already installed."
  else
    echo "=====> Installing git-lfs"
    HOMEBREW_NO_AUTO_UPDATE=1 brew install git-lfs
    git lfs install
  fi
fi
```

#### package.json과 Node script

```json
{
  "name": "my-app",
  "scripts": {
    "eas-build-pre-install": "node pre-install.js",
    "start": "expo start"
    // ...
  },
  "dependencies": {
    // ...
  }
}
```

```js
// Create a file called "pre-install.js" at the root of the project

if (process.env.EAS_BUILD_PLATFORM === 'android') {
  console.log('Run commands for Android builds here');
} else if (process.env.EAS_BUILD_PLATFORM === 'ios') {
  console.log('Run commands for iOS builds here');
}
```
