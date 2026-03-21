---
modificationDate: July 16, 2025
title: dangerous mod 사용하기
description: config plugin을 만들 때 dangerous mod가 무엇이며 어떻게 사용하는지 알아보세요.
---

# dangerous mod 사용하기

config plugin을 만들 때 dangerous mod가 무엇이며 어떻게 사용하는지 알아보세요.

Expo의 dangerous mod는 문자열 조작과 정규 표현식을 통해 네이티브 프로젝트 파일에 직접 접근할 수 있게 해 줍니다. [기존 mod plugin](/config-plugins/mods)을 사용하는 것이 권장되는 접근 방식이지만, dangerous mod는 기존 mod plugin으로는 해결할 수 없는 수정이 필요할 때 사용하는 탈출구 역할을 합니다.

왜 dangerous하다고 여겨질까요?

자동화된 직접 소스 코드 조작은 일반적으로 조합성이 좋지 않습니다. 예를 들어 한 dangerous mod가 소스 파일의 텍스트를 교체했는데, 뒤이어 실행되는 dangerous mod가 원래의 텍스트가 여전히 그 자리에 있기를 기대한다면(아마 정규 표현식의 anchor로 원본 텍스트를 사용한다면), 원하는 결과가 나오지 않을 가능성이 큽니다. 구현 방식에 따라 오류를 던지거나 로그만 남길 수도 있습니다. 다른 유형의 mod는 이런 문제에 덜 취약하지만, `withAndroidManifest`나 `withPodfile`처럼 소스 파일을 직접 조작하는 mod에서도 비슷한 문제가 생길 수 있습니다.

표준 mod와 달리 dangerous mod는 여러 번 안전하게 실행된다는 보장이 거의 없습니다. 같은 dangerous mod를 여러 번 실행하면 결과가 달라지거나, 중복 수정이 생기거나, 대상 파일이 완전히 망가질 수 있습니다.

## dangerous mod를 사용해야 하는 경우

다음과 같은 경우 dangerous mod 사용을 고려할 수 있습니다:

-   **표준 mod로는 수정할 수 없음**: 필요한 수정이 [`withAndroidManifest`](/config-plugins/mods#android), [`withPodfile`](/config-plugins/mods#ios) 같은 기존 mod plugin으로 지원되지 않거나, 특정 라이브러리가 표준 plugin으로 처리되지 않는 고유한 네이티브 수정을 요구하는 경우입니다.
-   **이전 Expo SDK 버전 호환성 필요**: 필요한 mod plugin이 포함되지 않은 오래된 Expo SDK 버전을 대상으로 할 때입니다.
-   **정규식 또는 replace 함수로 텍스트를 수정해야 함**: 기존 mod plugin이 지원하지 않는 복잡한 텍스트 조작이 필요한 경우입니다. 예를 들어 Expo는 라이브러리 이름이 바뀔 때 대규모 파일 시스템 리팩터링을 위해 내부적으로 dangerous mod를 사용합니다.

## dangerous mod 사용 방법

실제 시나리오에서는 이 섹션에 설명된 예시 config plugin을 [config plugin 만들기 섹션](/config-plugins/plugins#creating-a-config-plugin)의 표준 사용 패턴에 따라 프로젝트에 직접 사용할 수 있습니다. 다만 [`withPodfile`](/config-plugins/mods#ios)라는 기존 mod plugin이 이미 있으므로, 이 경우에는 dangerous mod를 사용할 필요가 없습니다. 아래 예시는 dangerous mod가 어떻게 만들어지고 사용될 수 있는지를 보여 주기 위한 예시일 뿐입니다.

Expo 프로젝트에서 Continuous Native Generation을 사용하고 있다고 가정하고, 네이티브 디렉터리(**ios**) 안의 파일을 수정하는 예시 config plugin을 살펴보겠습니다. 이 config plugin을 사용하면 `npx expo prebuild` 명령이 실행될 때마다 네이티브 파일(**ios/Podfile**)이 업데이트됩니다. 이 명령을 수동으로 실행하든 EAS Build에서 실행하든 동일합니다. 이 예시는 기존 mod plugin이 네이티브 디렉터리 내부 파일을 수정하고 업데이트할 수 없을 때 이상적인 사용 사례입니다.

[config plugin 만들기 섹션](/config-plugins/plugins#creating-a-config-plugin)의 디렉터리 구조와 단계(3, 4, 5)에 따라, 이 config plugin이 Expo 프로젝트의 **plugins** 디렉터리 안에 생성된다고 가정해 보겠습니다:

```tsx
import { ConfigPlugin, IOSConfig, withDangerousMod } from 'expo/config-plugins';
import fs from 'fs/promises';
import path from 'path';

const withCustomPodfile: ConfigPlugin = config => {
  return withDangerousMod(config, [
    'ios',
    async config => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');

      try {
        let contents = await fs.readFile(podfilePath, 'utf8');
        const projectName = IOSConfig.XcodeUtils.getProjectName(config.modRequest.projectRoot);

        contents = addCustomPod(contents, projectName);
        await fs.writeFile(podfilePath, contents);

        console.log('✅ Successfully added custom pod to Podfile');
      } catch (error) {
        console.warn('⚠️ Podfile not found, skipping modification');
      }

      return config;
    },
  ]);
};

function addCustomPod(contents: string, projectName: string): string {
  if (contents.includes("pod 'Alamofire'")) {
    console.log('Alamofire pod already exists, skipping');
    return contents;
  }

  const targetRegex = new RegExp(
    `(target ['"]${projectName}['"] do[\\s\\S]*?use_expo_modules!)`,
    'm'
  );

  return contents.replace(targetRegex, `$1\n  pod 'Alamofire', '~> 5.6'`);
}

export default withCustomPodfile;
```

위 예시에서 plugin **withCustomPodfile**은 prebuild 과정 중 프로젝트의 네이티브 **ios/Podfile**에 CocoaPod 의존성을 자동으로 추가합니다. 이 plugin은 `withDangerousMod`를 사용해 네이티브 파일 시스템에 직접 접근하며, 네이티브 프로젝트가 생성된 뒤이면서 CocoaPod 의존성이 설치되기 전 시점에 실행됩니다.

**Podfile**은 직접적인 텍스트 조작이 필요하며, 이는 `addCustomMod` 함수 안의 정규식 패턴을 사용해 수행됩니다. 이 과정에서는 CocoaPod 의존성을 **Podfile**의 특정 위치, 즉 `use_expo_modules!` 문 뒤에 삽입해야 한다는 요구사항도 있습니다.

## `withDangerousMod` 문법과 요구 사항

`withDangerousMod`를 사용하려면 몇 가지 매개변수가 필요합니다:

1.  네이티브 플랫폼(**android** 또는 **ios**)
2.  파일 시스템 접근이 가능한 `config` 객체를 받는 비동기 함수
3.  네이티브 디렉터리 내부에서 접근할 상대 파일 이름/경로
4.  기존 파일을 읽고, 내용을 수정하고, 다시 파일에 쓰는 작업
5.  (선택 사항) prebuild 과정에서 plugin이 실행될 때 성공 및 실패 상태에 대한 사용자 지정 로그 메시지

아래 코드 스니펫은 필요한 필드의 골격과 `withDangerousMod`를 사용할 때 config plugin이 어떻게 구성될 수 있는지를 보여 줍니다:

```tsx
import { ConfigPlugin, withDangerousMod } from 'expo/config-plugins';
import fs from 'fs/promises';
import path from 'path';

const myPlugin: ConfigPlugin = config => {
  return withDangerousMod(config, [
    'platform', // 1. "ios" | "android"
    async config => {
      // 2. Async modification function
      // 3. Build file paths
      const filePath = path.join(
        config.modRequest.platformProjectRoot, // Native project root
        'path/to/file' // Relative path to target file
      );

      try {
        // 4. Read existing file, modify its contents, and write back to the file
        let contents = await fs.readFile(filePath, 'utf8');
        contents = modifyContents(contents);
        await fs.writeFile(filePath, contents);

        // 5. Log success and failure states
        console.log('✅ Successfully modified file');
      } catch (error) {
        console.warn('⚠️ File modification failed:', error);
      }

      return config;
    },
  ]);
};

// Helper functions to use regex to modify the contents of the file
```

### config plugin에서 사용할 수 있는 path

config plugin에서 사용할 수 있는 path 속성은 다음과 같습니다:

| Path | Type | Description |
| --- | --- | --- |
| `config.modRequest.projectRoot` | `string` | **package.json**이 위치한 범용 앱 프로젝트 루트 디렉터리입니다. asset 해석, **package.json** 읽기, 크로스 플랫폼 작업에 사용됩니다. 항상 디렉터리가 존재하고 **package.json**을 포함하는지 확인하세요. |
| `config.modRequest.platformProjectRoot` | `string` | 플랫폼별 프로젝트 루트(**projectRoot/android** 또는 **projectRoot/ios**)입니다. 네이티브 설정 파일 수정 같은 플랫폼별 파일 작업에 사용됩니다. 메인 `projectRoot`를 기준으로 플랫폼 디렉터리가 실제로 존재하는지 확인하세요. |
| `config.modRequest.projectName` | `string` | [iOS 전용] iOS 파일 경로를 구성할 때 사용하는 프로젝트 이름 구성 요소입니다(예: **projectRoot/ios/[projectName]/**). iOS 전용 파일 경로 생성에 사용됩니다. iOS 플랫폼에서만 사용할 수 있으며 실제 Xcode 프로젝트 구조와 일치해야 합니다. |
| `config.modRequest.introspect` | `boolean` | 파일 시스템을 변경하면 안 되는 introspection 모드로 실행 중인지 여부입니다. `true`일 때는 mod가 파일을 쓰지 말고 읽고 분석만 해야 합니다. config 분석과 검증 중에 사용됩니다. |
| `config.modRequest.ignoreExistingNativeFiles` | `boolean` | 기존 네이티브 파일을 무시할지 여부입니다. 템플릿 기반 작업에 사용되며, 특히 entitlements와 다른 네이티브 구성이 prebuild 기대 동작과 맞도록 하는 데 영향을 줍니다. |

## dangerous mod를 사용할 때 고려할 점

dangerous mod를 사용할 때는 다음을 고려하세요:

-   **제한적인 idempotency 보장.** 일반적으로 idempotent하고 clean flag 없이도 동작할 수 있는 표준 mod와 달리, dangerous mod는 **idempotent하다고 거의 보장되지 않습니다**. 즉 같은 dangerous mod를 여러 번 실행하면 결과가 달라지거나 문제를 일으킬 수 있습니다.
-   **실험적이며 깨지기 쉽습니다.** `withDangerousMod`는 앞으로 변경될 수 있으므로 신중하게 사용하세요. 네이티브 템플릿이 바뀔 때 특히 깨지기 쉬우므로, SDK가 릴리스될 때마다 dangerous mod를 충분히 테스트하세요.
-   **표준 mod plugin 사용하기**. Android와 iOS 모두 `withAndroidManifest`, `withPodfile`, `withPodfileProperties` 등 공통 네이티브 파일 수정을 위한 mod plugin을 제공합니다. 여러분의 사용 사례를 처리할 [기존 mod plugin](/config-plugins/mods#available-mod-plugins)이 없을 때만 dangerous mod를 사용하세요.
-   **파일이 존재한다고 가정하지 마세요.** 읽기/쓰기를 하기 전에 네이티브 디렉터리와 파일의 상대 경로를 항상 확인하세요. CNG를 사용한다면 언제든 `npx expo prebuild`를 실행해 네이티브 **android**와 **ios** 디렉터리를 만들고 파일이 실제로 존재하는지 수동으로 확인할 수 있습니다.
-   **Dangerous mod는 먼저 실행됩니다.** dangerous mod의 실행 순서는 신뢰하기 어려울 수 있습니다. dangerous mod는 다른 modifier보다 먼저 실행되기 때문입니다. 이는 빌드 프로세스의 예측 가능성에 영향을 줄 수 있고, 다른 수정과 충돌을 일으킬 수 있습니다.
