---
modificationDate: December 05, 2025
title: Runtime version과 update
description: 다양한 runtime version policy와 그것이 프로젝트에 어떻게 맞을 수 있는지 알아보세요.
---

# Runtime version과 update

다양한 runtime version policy와 그것이 프로젝트에 어떻게 맞을 수 있는지 알아보세요.

runtime version은 build의 native code와 update 사이의 호환성을 보장하는 속성입니다. 프로젝트가 build로 만들어질 때, build에는 update로 바꿀 수 없는 native code 일부가 포함됩니다. 따라서 update가 build에서 실행되려면 그 build의 native code와 호환되어야 합니다.

build와 update가 어떻게 상호작용하는지 설명하기 위해, 다음 다이어그램을 살펴보세요:

build는 두 개의 layer로 생각할 수 있습니다. 앱 binary에 포함된 native layer와, 다른 호환 update로 교체 가능한 update layer입니다. 이런 분리를 통해 bug fix가 들어 있는 update가 build 내부의 native layer에서 실행될 수 있기만 하면 build에 bug fix를 전달할 수 있습니다. `"runtimeVersion"` 속성은 update가 특정 build의 native code와 호환됨을 보장할 수 있게 해 줍니다.

update는 build의 native code와 호환되어야 하므로, native code가 업데이트될 때마다 update를 게시하기 전에 새 build를 만들어야 합니다. 어떤 개발자는 새 Expo SDK로 업그레이드할 때만 native code를 업데이트하고, 다른 개발자는 build 사이사이나 다른 주기로 native code를 업데이트하기도 합니다. 아래에는 프로젝트에 맞을 수 있는 다양한 상황과 구성에 대한 설명이 있습니다.

## `"runtimeVersion"` 설정하기

build와 update 사이에서 `"runtimeVersion"` 속성을 더 쉽게 관리할 수 있도록, 프로젝트에 이미 존재하는 다른 정보를 바탕으로 runtime version을 파생시키는 policy를 만들었습니다. 이 policy가 프로젝트의 개발 흐름과 맞지 않는다면, `"runtimeVersion"`을 수동으로 설정하는 선택지도 있습니다.

### Runtime version policy

사용 가능한 policy는 [`expo-updates` 라이브러리 문서](/versions/latest/sdk/updates#automatic-configuration-using-runtime-version-policies)에 문서화되어 있습니다.

### Custom runtime version

[runtime version 형식 요구 사항](/versions/latest/config/app#runtimeversion)을 만족하는 custom runtime version을 직접 설정할 수도 있습니다:

```json
{
  "expo": {
    "runtimeVersion": "1.0.0"
  }
}
```

이 옵션은 프로젝트 app config에 있는 다른 version 번호와 별개로 runtime version을 수동으로 관리하고 싶은 개발자에게 적합합니다. 어떤 update가 어떤 build와 호환되는지에 대해 개발자가 완전한 제어권을 갖게 해 줍니다.

### 플랫폼별 runtime version

플랫폼별로 runtime version을 설정할 수도 있습니다. 예를 들면 다음과 같습니다.

```json
{
  "expo": {
    "android": {
      "runtimeVersion": "1.0.0"
    }
  }
}
```

또는:

```json
{
  "expo": {
    "android": {
      "runtimeVersion": {
        "policy": "appVersion"
      }
    }
  }
}
```

최상위 runtime과 플랫폼별 runtime이 모두 설정되어 있으면 플랫폼별 값이 우선합니다.

## 호환되지 않는 update 피하기

update를 게시할 때 발생할 수 있는 주요 문제는, 해당 update가 실행 중인 build가 지원하지 않는 native code에 의존할 수 있다는 점입니다. 예를 들어 `"1.0.0"`이라는 runtime version으로 build를 만들었다고 가정해 봅시다. 그리고 그 build를 app store에 제출해 공개 릴리스했다고 합시다.

이후 `expo-camera` 같은 새 native library에 의존하는 update를 개발했는데, `"runtimeVersion"` 속성을 여전히 `"1.0.0"`으로 유지했다고 상상해 봅시다. 이 상태에서 update를 게시하면 `"1.0.0"` runtime version을 가진 build는 같은 runtime version을 가진 새 update가 호환된다고 생각하고 로드하려고 시도할 것입니다. 하지만 해당 update는 build 안에 존재하지 않는 code를 호출하게 되므로, `expo-updates`는 오류를 감지하고 이전에 정상 동작하던 update로 롤백을 시도할 수 있습니다([오류 복구 동작에 대해 자세히 알아보기](/eas-update/error-recovery)).

아래는 build의 native code와 호환되지 않는 update 배포를 피하기 위한 몇 가지 전략입니다.

### native code가 업데이트될 때 runtime version도 자동으로 갱신되는 runtime version policy 사용하기

`"appVersion"` policy는 앱 버전이 증가할 때마다 runtime version도 증가시킵니다. 하지만 native runtime을 바꾸면서 앱 버전을 올리는 것을 잊으면 runtime version 불일치가 생길 수 있습니다. 호환되지 않는 update가 발생할 가능성을 매우 낮추고 싶고, 그 대가로 build를 더 자주 만들어야 하는 점을 감수할 수 있다면 `"fingerprint"` policy를 사용할 수 있습니다. 이 policy는 native runtime에 영향을 줄 수 있는 어떤 것이든 바뀔 때마다 runtime version을 증가시킵니다([fingerprinting에 대해 자세히 알아보기](/versions/latest/sdk/fingerprint)).

### runtime version 수동 증가시키기

native code를 설치하거나 업데이트할 때마다 프로젝트의 [`"runtimeVersion"` 속성을 수동으로 증가](/eas-update/runtime-versions#custom-runtime-version)시키고, 그 설정은 프로젝트의 [app config](/workflow/configuration)에서 관리하세요.

### update를 점진적으로 롤아웃하기

새 update의 영향이 확실하지 않다면 먼저 소수 사용자에게만 롤아웃할 수 있습니다. [rollouts](/eas-update/rollouts)을 사용해 소수 사용자 비율에 update를 게시하고, EAS dashboard에서 해당 update의 오류율을 모니터링하세요. 오류율이 높다면 롤아웃을 취소하세요. 이미 전체 롤아웃을 마쳤다면 [롤백](/eas-update/rollbacks)하세요.

### 더 작은 사용자 그룹으로 update를 수동 검증하기

production에 배포할 때는 동일한 runtime을 사용하지만 다른 channel을 가리키는 preview build를 만드세요. 그런 build에서 update를 테스트한 뒤 production으로 promote하세요(자세한 내용은 [배포 가이드](/eas-update/deployment#deploying-previews) 참고). 대안으로, runtime에 update 매개변수를 재정의하여 앱의 특정 사용자만 update를 받게 할 수도 있습니다([자세히 알아보기](/eas-update/override)).
