---
modificationDate: October 06, 2025
title: Asset selection과 exclusion
description: asset selection 기능을 사용하는 방법과 update에 필요한 앱 asset이 모두 포함되는지 검증하는 방법을 알아보세요.
---

# Asset selection과 exclusion

asset selection 기능을 사용하는 방법과 update에 필요한 앱 asset이 모두 포함되는지 검증하는 방법을 알아보세요.

실험적인 **asset selection feature**를 사용하면 개발자가 update에 특정 asset만 포함되도록 지정할 수 있습니다. 이를 통해 update server로 업로드하고 내려받아야 하는 asset 수를 크게 줄일 수 있습니다. 이 기능은 EAS Update server 또는 [`expo-updates` protocol](/technical-specs/expo-updates-1)을 준수하는 모든 custom server와 함께 동작합니다.

SDK 52에서 이 기능이 general availability로 출시되었습니다.

## asset selection 사용하기

52 미만의 SDK 버전에서 asset selection을 사용하려면 app config에 `extra.updates.assetPatternsToBeBundled` 속성을 포함하세요. 하나 이상의 파일 매칭 패턴(정규식)을 정의해야 합니다. 예를 들어 **app.json** 파일에서는 다음과 같이 패턴을 정의할 수 있습니다:

```json
"expo": {
    ... 
    "extra": {
      "updates": {
        "assetPatternsToBeBundled": [
          "app/images/**/*.png"
        ]
      }
    }
  }
```

SDK 52 이상에서 asset selection을 사용하려면 app config에 `updates.assetPatternsToBeBundled` 속성을 포함하세요. 하나 이상의 파일 매칭 패턴(정규식)을 정의해야 합니다. 예를 들어 **app.json** 파일에서는 다음과 같이 패턴을 정의할 수 있습니다:

```json
"expo": {
    ... 
    "updates": {
      "assetPatternsToBeBundled": [
        "app/images/**/*.png"
      ]
    }
  }
```

이 구성을 추가하면 **app/images**의 모든 하위 디렉터리에 있는 모든 **.png** 파일이 update에 포함됩니다. 또한 이 asset들이 JavaScript 코드에서 실제로 `require`되어야 한다는 점도 보장해야 합니다.

app config에 `assetPatternsToBeBundled`가 포함되어 있지 않다면, bundler가 해석한 모든 asset이 update에 포함됩니다(SDK 49 이하의 동작과 동일).

## update에 필요한 앱 asset이 모두 포함되는지 검증하기

asset selection을 사용할 때는 어떤 파일 패턴에도 일치하지 않는 asset도 Metro bundler에서는 resolve됩니다. 하지만 이러한 asset은 update server에 업로드되지 않습니다. 따라서 update에 포함되지 않은 asset이 앱의 네이티브 build 안에 포함되어 있어야 한다는 점을 확실히 해야 합니다.

앱을 로컬에서 빌드하고 있거나 update 게시에 사용할 올바른 build([runtime version](/eas-update/runtime-versions)이 동일한 build)에 접근할 수 있다면, `npx expo-updates assets:verify` 명령을 사용하세요. 이 명령은 update를 게시할 때 필요한 asset이 모두 포함되는지 확인할 수 있게 해 줍니다:

```sh
npx expo-updates assets:verify
```

> 이 새 명령은 [EAS Update code signing](/eas-update/code-signing)도 지원하는 `expo-updates` CLI의 일부입니다. [Expo CLI](/more/expo-cli)나 [EAS CLI](https://github.com/expo/eas-cli)의 일부는 아닙니다. ([`expo-updates`](/versions/latest/sdk/updates) >= 0.24.10)에서만 사용할 수 있습니다.

명령에서 `--help` 옵션을 사용해 사용 가능한 옵션을 볼 수도 있습니다:

| Option | Description |
| --- | --- |
| `<dir>` | Expo 프로젝트의 디렉터리. 기본값: 현재 작업 디렉터리. |
| `-a, --asset-map-path <path>` | `npx expo export --dump-assetmap` 명령으로 생성한 export 안의 **assetmap.json** 경로. |
| `-e, --exported-manifest-path <path>` | `npx expo export --dump-assetmap` 명령으로 생성한 export 안의 **metadata.json** 경로. |
| `-b, --build-manifest-path <path>` | Expo 애플리케이션 build(**android** 또는 **ios**) 안에서 `expo-updates`가 생성한 **app.manifest** 파일 경로. |
| `-p, --platform <platform>` | 옵션: ["android", "ios"] |
| `-h, --help` | 사용 정보. |

## 예제

[Working example](https://github.com/expo/UpdatesAPIDemo) — asset selection, assets:verify 명령, 기타 EAS Update 기능을 사용하는 동작 예제를 확인하세요. — assets:verify
