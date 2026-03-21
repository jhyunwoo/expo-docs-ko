---
modificationDate: December 30, 2025
title: patch-project 사용하기
description: Expo 프로젝트에서 patch-project를 사용해 네이티브 변경 사항을 생성, 적용, 유지하는 방법을 알아보세요.
---

# patch-project 사용하기

Expo 프로젝트에서 patch-project를 사용해 네이티브 변경 사항을 생성, 적용, 유지하는 방법을 알아보세요.

> **참고**: `patch-project`는 alpha 기능입니다.

`patch-project`는 `npx expo prebuild` 실행 후에도 네이티브 변경 사항을 유지하기 위해 patch를 생성하고 적용하는 Expo config plugin이자 command-line interface(CLI) 도구입니다. 이 도구는 config plugin을 직접 작성하는 방법을 몰라도 사용자 정의를 유지하고 싶은 네이티브 앱 개발자에게 유용하며, 사실상 [Continuous Native Generation (CNG)](/workflow/continuous-native-generation)과 함께 동작하는 자동 솔루션을 만들어 줍니다.

이 가이드는 `patch-project`를 사용하는 방법, 언제 사용해야 하는지, 그리고 제한 사항을 설명합니다.

## patch-project의 동작 방식

`patch-project`는 Git에서 영감을 받은 방식으로 patch를 생성하고 자동으로 적용합니다. 이 command-line tool을 사용하려면 프로젝트에서 다음 단계를 거칩니다:

### 설치

시작하려면 프로젝트에 도구를 설치해야 합니다:

```sh
npx expo install patch-project
```

이 명령은 [app config](/workflow/configuration)에 `patch-project` config plugin을 자동으로 추가합니다:

```json
{
  "expo": {
    "plugins": [
      "patch-project"
       ...
    ]
  }
}
```

### 기존 사용자 정의에서 patch 생성하기

프로젝트의 네이티브 디렉터리(**android**와 **ios**)를 수동으로 수정했다고 가정해 봅시다. 이 네이티브 디렉터리에 대한 patch를 생성하려면 다음 명령을 실행할 수 있습니다:

```sh
npx patch-project
```

> **참고**: 특정 플랫폼에 대한 patch만 생성하고 싶다면 `--platform` 옵션을 사용해 `npx patch-project --platform android` 또는 `npx patch-project --platform ios`를 실행할 수 있습니다.

생성된 patch는 **cng-patches** 디렉터리에 저장됩니다.

`.`

 `app.json``with patch-project plugin`

 `cng-patches`

  `android+eee880ad7b07965271d2323f7057a2b4.patch``patch for android directory`

  `ios+eee880ad7b07965271d2323f7057a2b4.patch``patch for ios directory`

 `package.json`

 `...``other project files`

각 파일은 플랫폼 이름과 checksum 값이 접두사로 붙습니다. 예를 들면 다음과 같습니다:

```bash
ios+eee880ad7b07965271d2323f7057a2b4.patch
```

### prebuild 중 patch 적용하기

patch를 생성한 뒤에는 이후 `npx expo prebuild` 명령을 실행할 때 자동으로 적용됩니다. `patch-project` config plugin이 기존 patch를 감지하고 이를 적용해 사용자 정의를 복원합니다.

## patch-project를 사용해야 하는 경우

다음과 같은 시나리오에서 `patch-project`를 사용할 수 있습니다:

-   **기존 React Native 앱 마이그레이션**: 네이티브 사용자 정의가 많아, 이를 config plugin으로 다시 만드는 데 시간이 많이 걸리는 복잡한 앱을 옮길 때
-   **수동 변경 보존**: Expo 프로젝트에서 Continuous Native Generation(CNG)을 도입하는 과정에서 **android** 및/또는 **ios** 디렉터리에 수동으로 가한 변경 사항을 유지하고 싶을 때
-   **빠른 프로토타이핑**: config plugin을 작성하기 전에 네이티브 변경 사항을 빠르게 시험해 보고 싶을 때
-   **patch의 자동 적용**: 이후 `npx expo prebuild` 명령을 실행할 때 patch가 자동으로 적용됩니다. 이는 npm 라이브러리용 patch를 생성할 때 흔히 쓰는 `patch-package` 같은 도구보다 유리합니다. 그런 도구는 prebuild 과정에서 patch를 유지하고 자동 적용하지 않기 때문입니다.

## 제한 사항과 고려할 점

patch는 Expo SDK 버전을 업그레이드할 때 더 이상 유효하지 않을 수 있습니다. 이유는 다음과 같습니다:

-   **template 및/또는 파일 구조 변경**: prebuild template은 SDK 버전이 바뀌면 새로운 변경 사항과 네이티브 디렉터리 파일 업데이트를 반영하며 함께 진화합니다. 이는 **cng-patches** 디렉터리에 이미 생성된 diff에 영향을 주고, 더 이상 적용되지 않을 수 있습니다.
-   **plugin 충돌**: CNG patch는 위험할 수 있으며 다른 plugin이 같은 파일을 수정하면 깨질 수 있습니다. 예를 들어 **MainApplication.kt**를 업데이트하는 새 plugin을 추가했고, 이 변경이 기존 patch와 충돌하면 patch가 더 이상 올바르게 적용되지 않을 수 있습니다. 이런 경우 patch를 다시 생성해야 할 수 있습니다.
-   **iOS .pbxproj 변경**: iOS 프로젝트에서는 **.pbxproj** 파일에 patch를 적용하는 것이 취약할 수 있습니다. 이 파일은 UUID를 포함하고 있으며 `npx expo prebuild --clean` 같은 명령을 실행하면 이 ID가 바뀔 수 있기 때문입니다. 예를 들어 widget extension을 추가하거나 다른 프로젝트 구성 변경을 할 때는 patch 기반 접근이 안정적으로 동작하지 않을 수 있습니다. 생성된 **cng-patches/ios-\***를 검토하고 필요한 patch만 남길 수 있습니다. patch를 가능한 한 최소화할수록 적용 실패 위험이 줄어듭니다.

각 SDK 업그레이드 이후에는 patch를 다시 생성하는 것을 권장합니다.
