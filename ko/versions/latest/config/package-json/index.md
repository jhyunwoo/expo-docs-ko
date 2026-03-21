---
title: package.json
description: package.json 파일에서 사용할 수 있는 Expo 전용 속성 레퍼런스입니다.
---

# package.json

package.json 파일에서 사용할 수 있는 Expo 전용 속성 레퍼런스입니다.

**package.json**은 JavaScript 프로젝트의 메타데이터를 담고 있는 JSON 파일입니다. 이 문서는 **package.json** 파일에서 사용할 수 있는 Expo 전용 속성에 대한 레퍼런스입니다.

## `install.exclude`

다음 명령어는 프로젝트에 설치된 library의 버전을 검사하고, 해당 library의 버전이 Expo가 권장하는 버전과 다를 때 경고를 표시합니다:

-   `npx expo start` 및 `npx expo-doctor`
-   `npx expo install`(해당 library의 새 버전을 설치할 때 또는 `--check`, `--fix` 옵션을 사용할 때)

**package.json** 파일의 `install.exclude` 배열 아래에 library를 지정하면 버전 검사에서 제외할 수 있습니다:

```json
{
  "expo": {
    "install": {
      "exclude": ["expo-updates", "expo-splash-screen"]
    }
  }
}
```

## `autolinking`

**package.json**의 `autolinking` 속성을 사용해 module resolution 동작을 구성할 수 있습니다.

전체 레퍼런스는 [Autolinking configuration](/modules/autolinking#configuration)을 참고하세요.

## `doctor`

[`npx expo-doctor`](/develop/tools#expo-doctor) 명령의 동작을 구성할 수 있습니다.

### `reactNativeDirectoryCheck`

기본적으로 Expo Doctor는 프로젝트의 패키지를 [React Native directory](https://reactnative.directory/)와 비교해 검사합니다. 이 검사는 React Native Directory에 포함되지 않은 패키지 목록과 함께 경고를 표시합니다.

프로젝트의 **package.json** 파일에 다음 구성을 추가해 이 검사를 사용자 지정할 수 있습니다:

```json
{
  "expo": {
    "doctor": {
      "reactNativeDirectoryCheck": {
        "enabled": true,
        "exclude": ["/foo/", "bar"],
        "listUnknownPackages": true
      }
    }
  }
}
```

기본적으로 이 검사는 활성화되어 있으며, 알 수 없는 패키지가 목록에 표시됩니다.

### `appConfigFieldsNotSyncedCheck`

Expo Doctor는 프로젝트에 **android** 또는 **ios** 같은 native project directory가 포함되어 있는지 검사합니다. 이 디렉터리들이 존재하지만 **.gitignore** 또는 [**.easignore**](/build-reference/easignore) 파일에 포함되어 있지 않다면, Expo Doctor는 app config 파일이 존재하는지 확인합니다. 이 파일이 존재한다면 프로젝트가 [Prebuild](/more/glossary-of-terms#prebuild)를 사용하도록 구성되었다는 뜻입니다.

**android** 또는 **ios** 디렉터리가 존재하는 경우 EAS Build는 app config 속성을 native project와 동기화하지 않습니다. 이러한 조건이 참이면 Expo Doctor가 경고를 표시합니다.

프로젝트의 **package.json** 파일에 다음 구성을 추가해 이 검사를 비활성화하거나 활성화할 수 있습니다:

```json
{
  "expo": {
    "doctor": {
      "appConfigFieldsNotSyncedCheck": {
        "enabled": false
      }
    }
  }
}
```
