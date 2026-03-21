---
modificationDate: March 05, 2026
title: EAS Update 사용하기
description: EAS Build와 함께 EAS Update를 사용하는 방법을 알아보세요.
---

# EAS Update 사용하기

EAS Build와 함께 EAS Update를 사용하는 방법을 알아보세요.

EAS Build에는 [`expo-updates`](/versions/latest/sdk/updates) 라이브러리를 사용할 때의 특별한 이점이 몇 가지 있습니다. 특히 **eas.json**에서 [`channel`](/eas-update/how-it-works#distributing-builds) 속성을 구성하면, EAS Build가 빌드 시점에 네이티브 프로젝트에 이를 업데이트하는 작업을 대신 처리해 줍니다.

이 문서는 EAS Build와 함께 `expo-updates` 라이브러리를 사용할 때의 특이 사항을 다룹니다. EAS Update와 함께 라이브러리를 구성하는 보다 일반적인 정보는 [EAS Update 시작하기](/eas-update/getting-started)를 참고하세요.

## build profile에 channel 설정하기

각 [build profile](/build/eas-json#build-profiles)은 하나의 channel에 할당될 수 있으며, 따라서 특정 profile로 생성된 빌드는 해당 channel에 게시된 release만 가져오게 됩니다.

다음 예시는 production 빌드에 `"production"` channel을 사용하고, [internal distribution](/build/internal-distribution)으로 배포하는 테스트 빌드에 `"staging"` channel을 사용하는 방법을 보여 줍니다.

```json
{
  "build": {
    "production": {
      "channel": "production"
    },
    "preview": {
      "channel": "staging",
      "distribution": "internal"
    }
  }
}
```

## 바이너리 호환성과 runtime version

네이티브 런타임은 JavaScript와의 API 계약을 바꾸는 방식으로 코드를 수정했는지에 따라 빌드마다 달라질 수 있습니다. 호환되지 않는 네이티브 런타임을 가진 바이너리에 JavaScript 번들을 게시하면(예를 들어 JavaScript 번들이 존재한다고 기대하는 함수가 실제로는 존재하지 않으면), 앱이 예상대로 동작하지 않거나 크래시가 날 수 있습니다.

앱의 각 바이너리 버전마다 서로 다른 [runtime version](/eas-update/runtime-versions)을 사용하는 것을 권장합니다. 네이티브 런타임이 바뀔 때마다(managed 앱에서는 네이티브 라이브러리를 추가하거나 제거하거나 **app.json**을 수정할 때 해당), runtime version을 증가시켜야 합니다.

## development build에서 update 미리 보기

`runtimeVersion` 필드로 게시한 update는 Expo Go에서 로드할 수 없습니다. 대신 [`expo-dev-client`](/versions/latest/sdk/dev-client)를 사용해 development build를 만들어야 합니다.

## 환경 변수와 `eas update`

build profile의 `env` 필드에 설정한 환경 변수는 `eas update`를 실행할 때 사용할 수 없습니다. [EAS Update와 함께 환경 변수 사용하기](/eas/environment-variables/usage#using-environment-variables-with-eas-update)에서 자세히 알아보세요.
