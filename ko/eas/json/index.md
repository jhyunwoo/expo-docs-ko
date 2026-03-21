---
modificationDate: November 03, 2025
title: eas.json으로 구성하기
description: 프로젝트 내부에서 EAS Build와 EAS Submit의 기본 동작을 설정하고 재정의할 수 있는 속성을 알아보세요.
---

# eas.json으로 구성하기

프로젝트 내부에서 EAS Build와 EAS Submit의 기본 동작을 설정하고 재정의할 수 있는 속성을 알아보세요.

**eas.json**은 EAS CLI와 서비스의 구성 파일입니다. 이 페이지에서 [EAS Build](/build/introduction)와 [EAS Submit](/submit/introduction)에 사용할 수 있는 모든 schema 속성의 전체 reference를 확인할 수 있습니다.

> EAS 서비스를 사용하는 프로젝트가 **eas.json**으로 어떻게 구성되는지 자세히 알아보려면 [Configure EAS Build with eas.json](/build/eas-json)과 [Configure EAS Submit with eas.json](/submit/eas-json)을 참고하세요.

## EAS Build

다음 속성들은 **eas.json**의 `build` key schema에서 사용할 수 있습니다.

여러 build profile의 schema 예시

```json
{
  "build": {
    "base": {
      "node": "12.13.0",
      "yarn": "1.22.5",
      "env": {
        "EXAMPLE_ENV": "example value"
      },
      "android": {
        "image": "default",
        "env": {
          "PLATFORM": "android"
        }
      },
      "ios": {
        "image": "latest",
        "env": {
          "PLATFORM": "ios"
        }
      }
    },
    "development": {
      "extends": "base",
      "developmentClient": true,
      "env": {
        "ENVIRONMENT": "development"
      },
      "android": {
        "distribution": "internal",
        "withoutCredentials": true
      },
      "ios": {
        "simulator": true
      }
    },
    "staging": {
      "extends": "base",
      "env": {
        "ENVIRONMENT": "staging"
      },
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "extends": "base",
      "env": {
        "ENVIRONMENT": "production"
      }
    }
  }
}
```

### 네이티브 플랫폼 공통 속성

| Property | Description |
| --- | --- |
| `withoutCredentials` | **(boolean)** - `true`로 설정하면 앱 build 시 EAS CLI가 credentials 구성을 요구하지 않습니다. EAS Build [custom builds](/custom-builds/get-started)를 사용할 때 유용합니다. 기본값은 `false`입니다. |
| `extends` | **(string)** - 현재 build profile이 값을 상속받을 build profile의 이름입니다. 이 값은 플랫폼별로 지정할 수 없습니다. |
| `credentialsSource` | **(enum: local, remote)** - 애플리케이션 archive 서명에 사용할 credentials의 출처입니다.
-   `local` - 직접 제공한 [**credentials.json**](/app-signing/local-credentials)을 사용하려는 경우
-   `remote` - EAS가 관리하는 credentials를 사용하려는 경우(기본 옵션)

 |
| `releaseChannel` | **(string)** - **Deprecated**: SDK 49 이하에서만 지원되는 Classic Updates 서비스용 release channel 이름입니다. channel을 지정하지 않으면 바이너리는 `default` channel의 release를 가져옵니다. EAS Update는 [channel](#channel) 필드를 사용하므로 [`releaseChannel`](#releasechannel)은 [EAS Update로 마이그레이션한 뒤](/eas-update/migrate-from-classic-updates) 제거할 수 있습니다. |
| `channel` | **(string)** - 이 build가 update를 확인할 EAS Update channel입니다. [자세히 알아보기](/eas-update/how-it-works). Standalone build는 platform, native runtime, channel이 일치하는 update를 확인하고 다운로드합니다. [`developmentClient`](#developmentclient)가 `true`이면 development build는 어떤 channel의 update도 실행할 수 있으므로 이 필드는 효과가 없습니다. 아직 Classic Updates에서 EAS Update로 마이그레이션하지 않았다면 계속 [`releaseChannel`](#releasechannel) 필드를 사용하세요. |
| `distribution` | **(enum: store, internal)** - 앱을 배포하는 방식입니다.

-   `internal` - 이 옵션을 사용하면 build URL을 누구와든 공유할 수 있고, 그들은 Expo 웹사이트에서 직접 build를 기기에 설치할 수 있습니다. `internal`을 사용할 때는 build 결과가 **.apk** 또는 **ipa** 파일인지 확인하세요. 그렇지 않으면 공유 URL이 동작하지 않습니다. 자세한 내용은 [internal distribution](/build/internal-distribution)을 참고하세요.
-   `store` - 스토어 업로드용 build를 생성하며, build URL은 공유할 수 없습니다.

 |
| `developmentClient` | **(boolean)** - `true`로 설정하면(기본값 `false`) 이 필드는 [development build](/workflow/overview#development-builds)를 생성합니다. build가 성공하려면 프로젝트에 [`expo-dev-client`](/versions/latest/sdk/dev-client)가 설치 및 설정되어 있어야 합니다. **참고**: 이 필드는 Android에서는 `gradleCommand`를 `:app:assembleDebug`로, iOS에서는 `buildConfiguration`을 `Debug`로 설정하기 위한 것입니다. 같은 build profile에 이 필드들이 함께 제공되면 `developmentClient`보다 우선합니다. |
| `resourceClass` | **(enum: default, medium, large)** - 이 build를 실행하는 데 사용할 resource class입니다. 플랫폼별 매핑은 [Android-specific resource class field](#resourceclass-1)와 [iOS-specific resource class field](#resourceclass-2)를 참고하세요. `large` resource class는 무료 플랜에서 사용할 수 없습니다. |
| `prebuildCommand` | **(string)** - EAS가 사용하는 [prebuild](/more/expo-cli#prebuild) 명령을 선택적으로 재정의합니다. 예를 들어 사용자 지정 template를 사용하려면 `prebuild --template example-template`을 지정할 수 있습니다. **참고**: `--platform`과 `--non-interactive`는 build engine이 자동으로 추가하므로 직접 지정할 필요가 없습니다. |
| `buildArtifactPaths` | **(string[])** - EAS Build가 build artifact를 찾을 경로(또는 패턴) 목록입니다. 애플리케이션 archive 업로드 경로를 지정하려면 `applicationArchivePath`를 사용하세요. build가 실패하더라도 build artifact는 업로드됩니다. EAS Build는 패턴 매칭에 [glob patterns](https://github.com/isaacs/node-glob#glob-primer)를 사용합니다. |
| `node` | **(string)** - build에 사용할 Node.js 버전입니다. |
| `corepack` | **(boolean)** - `true`로 설정하면 build 프로세스 시작 시 [corepack](https://nodejs.org/api/corepack.html)이 활성화됩니다. 기본값은 `false`입니다. |
| `yarn` | **(string)** - build에 사용할 Yarn 버전입니다. |
| `pnpm` | **(string)** - build에 사용할 pnpm 버전입니다. |
| `bun` | **(string)** - build에 사용할 Bun 버전입니다. 특정 버전을 지정할 수도 있습니다. [eas.json에서 정확한 버전 구성 방법](/guides/using-bun#customize-bun-version-on-eas)을 참고하세요. |
| `expoCli` | **(string)** - **Deprecated**: [`expo-cli`](https://www.npmjs.com/package/expo-cli)를 사용해 앱을 [prebuild](/more/expo-cli#prebuild)할 때의 버전입니다. 이는 Expo SDK 45 이하의 managed project에만 영향을 줍니다. 더 최신 SDK에서는 EAS Build가 버전 고정된 [Expo CLI](/more/expo-cli)를 사용합니다. 이 CLI는 `expo` 라이브러리에 포함되어 있습니다. build profile에 환경 변수 `EXPO_USE_LOCAL_CLI=0`을 설정하면 버전 고정 Expo CLI 사용을 끌 수 있습니다. |
| `env` | **(object)** - build 프로세스 중 설정해야 하는 [environment variables](/guides/environment-variables)입니다. git 저장소에 커밋해도 되는 값에만 사용해야 하며, 비밀번호나 [secret](/build-reference/variables)에는 사용하지 마세요. |
| `autoIncrement` | **(boolean)** - EAS CLI가 애플리케이션 build version을 올리는 방식을 제어합니다. 기본값은 `false`입니다. 활성화하면 Android에서는 `expo.android.versionCode`를(예: `3`에서 `4`로), iOS에서는 `expo.ios.buildNumber`의 마지막 구성 요소를(예: `1.2.3.39`에서 `1.2.3.40`으로) 증가시킵니다. |
| `cache` | **(object)** - Cache 구성입니다. 이 기능은 계산 비용이 큰 값을 캐시하기 위한 것입니다. 예를 들어 컴파일 결과(최종 바이너리와 중간 파일 모두)를 저장하는 데 적합합니다. 하지만 cache가 머신 로컬이 아니어서 npm registry에서 직접 내려받는 것과 속도가 비슷하므로 **node_modules**에는 적합하지 않습니다. |
| `disabled` | **(boolean)** - 캐싱을 비활성화합니다. 기본값은 `false`입니다. |
| `key` | **(string)** - Cache key입니다. 이 값을 바꾸면 cache를 무효화할 수 있습니다. |
| `paths` | **(array)** - 성공한 build 후 저장되고 다음 build 시작 시 복원될 경로 목록입니다. 절대 경로와 상대 경로를 모두 지원하며, 상대 경로는 **eas.json**이 있는 디렉터리를 기준으로 해석됩니다. |
| `config` | **(string)** - 이 build를 실행할 때 사용할 사용자 지정 workflow 파일 이름입니다. 플랫폼별 workflow를 위해 플랫폼 수준에서도 지정할 수 있습니다. [자세히 알아보기](/custom-builds/get-started). 예: `"config": "production.yml"`이면 `.eas/build/production.yml`의 workflow를 사용합니다. |
| `environment` | **(enum: development, preview, production)** - build 프로세스에 environment variables를 적용할 때 사용할 environment입니다. [자세히 알아보기](/eas/environment-variables). |

### Android 전용 옵션

| Property | Description |
| --- | --- |
| `withoutCredentials` | **(boolean)** - `true`로 설정하면 앱 build 시 EAS CLI가 credentials 구성을 요구하지 않습니다. debug keystore를 저장소에 체크인했고 debug binary를 build하려는 경우 유용합니다. 기본값은 `false`입니다. |
| `image` | **(string)** - [build environment가 들어 있는 이미지](/build-reference/infrastructure)입니다. |
| `resourceClass` | **(enum: default, medium, large)** - 이 build를 실행하는 데 사용할 Android 전용 resource class입니다. 기본값은 `medium`입니다. 각 resource class에서 사용할 수 있는 build resource에 대한 정보는 [Android build server configurations](/build-reference/infrastructure#android-build-server-configurations)을 참고하세요. `large` resource class는 무료 플랜에서 사용할 수 없습니다. |
| `ndk` | **(string)** - Android NDK 버전입니다. |
| `autoIncrement` | **(boolean | "version" | "versionCode")** - EAS CLI가 애플리케이션 build version을 올리는 방식을 제어합니다. 기본값은 `false`입니다. 허용 값은 다음과 같습니다.
-   `"version"` - `expo.version`의 patch 버전을 증가시킵니다(예: `1.2.3`에서 `1.2.4`로).
-   `"versionCode"` (또는 `true`) - `expo.android.versionCode`를 증가시킵니다(예: `3`에서 `4`로).
-   `false` - 버전이 자동으로 증가하지 않습니다(기본값).

. 값은 [**eas.json**의 `cli.appVersionSource`](/build-reference/app-versions)에 따라 프로젝트 로컬 또는 EAS 서버에서 업데이트됩니다. |
| `buildType` | **(enum: app-bundle, apk)** - build하려는 artifact 유형입니다. 어떤 Gradle task를 사용해 프로젝트를 build할지 제어합니다. `gradleCommand` 또는 `developmentClient: true` 옵션으로 재정의할 수 있습니다.

-   `app-bundle` - `:app:bundleRelease`(**.aab** artifact 생성)
-   `apk` - `:app:assembleRelease`(**.apk** artifact 생성)

 |
| `gradleCommand` | **(string)** - 프로젝트 build에 사용할 Gradle task입니다. 예를 들어 debug binary를 build하려면 `:app:assembleDebug`를 사용할 수 있습니다. `buildType`이 지원하지 않는 task가 꼭 필요하지 않다면 권장되지 않으며, [`buildType`](#buildtype)과 [`developmentClient`](#developmentclient)보다 우선합니다. |
| `applicationArchivePath` | **(string)** - EAS Build가 애플리케이션 archive를 찾을 경로(또는 패턴)입니다. EAS Build는 패턴 매칭에 [glob patterns](https://github.com/isaacs/node-glob#glob-primer)를 사용합니다. 기본값은 `android/app/build/outputs/**/*.{apk,aab}`입니다. |
| `config` | **(string)** - 이 Android build를 실행할 때 사용할 사용자 지정 workflow 파일 이름입니다. 플랫폼 독립 workflow를 위해 profile 수준에서도 지정할 수 있습니다. [자세히 알아보기](/custom-builds/get-started). 예: `"config": "production-android.yml"`이면 `.eas/build/production-android.yml`의 workflow를 사용합니다. |

### iOS 전용 옵션

| Property | Description |
| --- | --- |
| `withoutCredentials` | **(boolean)** - `true`로 설정하면 앱 build 시 EAS CLI가 credentials 구성을 요구하지 않습니다. EAS Build [custom builds](/custom-builds/get-started)를 사용할 때 유용합니다. 기본값은 `false`입니다. |
| `simulator` | **(boolean)** - `true`로 설정하면 iOS Simulator용 build를 생성합니다. 기본값은 `false`입니다. |
| `enterpriseProvisioning` | **(enum: universal, adhoc)** - Apple Developer Enterprise Program 멤버십이 있는 Apple 계정에서 `"distribution": "internal"`을 사용할 때 사용하는 provisioning 방식입니다. `adhoc` 또는 `universal`을 선택할 수 있습니다. 후자가 개별 device를 하나씩 등록할 필요가 없으므로 권장됩니다. 이 옵션을 제공하지 않았는데 enterprise team으로 인증했다면 어떤 provisioning 방식을 사용할지 묻는 프롬프트가 표시됩니다. |
| `autoIncrement` | **(boolean | "version" | "buildNumber")** - EAS CLI가 애플리케이션 build version을 올리는 방식을 제어합니다. 기본값은 `false`입니다. 허용 값은 다음과 같습니다.
-   `"version"` - `expo.version`의 patch 버전을 증가시킵니다(예: `1.2.3`에서 `1.2.4`로).
-   `"buildNumber"` (또는 `true`) - `expo.ios.buildNumber`의 마지막 구성 요소를 증가시킵니다(예: `1.2.3.39`에서 `1.2.3.40`으로).
-   `false` - 버전이 자동으로 증가하지 않습니다(기본값)

. 값은 [**eas.json**의 `cli.appVersionSource`](/build-reference/app-versions)에 따라 프로젝트 로컬 또는 EAS 서버에서 업데이트됩니다. |
| `image` | **(string)** - [build environment가 들어 있는 이미지](/build-reference/infrastructure)입니다. |
| `resourceClass` | **(enum: default, medium, large)** - 이 build를 실행할 때 사용할 iOS 전용 resource class입니다. 기본값은 `medium`입니다. 각 resource class에서 사용할 수 있는 build resource에 대한 정보는 [iOS build server configurations](/build-reference/infrastructure#ios-build-server-configurations)을 참고하세요. `large` resource class는 무료 플랜에서 사용할 수 없습니다. |
| `bundler` | **(string)** - [bundler](https://bundler.io/) 버전입니다. |
| `fastlane` | **(string)** - fastlane 버전입니다. |
| `cocoapods` | **(string)** - CocoaPods 버전입니다. |
| `scheme` | **(string)** - Xcode project의 scheme입니다. 프로젝트가 다음과 같다면:

-   scheme이 여러 개라면 이 값을 설정해야 합니다.
-   scheme이 하나뿐이라면 자동으로 감지됩니다.
-   scheme이 여러 개인데 이 값을 설정하지 않으면 EAS CLI가 그중 하나를 선택하라고 묻습니다.

 |
| `buildConfiguration` | **(string)** - Xcode project의 Build Configuration입니다.

-   Expo project에서는 값이 `"Release"` 또는 `"Debug"`이며, 기본값은 `"Release"`입니다.
-   [bare React Native](/bare/overview) project에서는 scheme에 지정된 값을 기본값으로 사용합니다.

. 이 값은 [`developmentClient`](#developmentclient)보다 우선합니다. |
| `applicationArchivePath` | **(string)** - EAS Build가 애플리케이션 archive를 찾을 경로(또는 패턴)입니다. EAS Build는 패턴 매칭에 [glob patterns](https://github.com/isaacs/node-glob#glob-primer)를 사용합니다. 사용자 지정 **Gymfile**을 사용하는 경우에만 이 경로를 수정해야 합니다. 기본값은 simulator build일 때 `ios/build/Build/Products/*-iphonesimulator/*.app`, 그 외에는 `ios/build/*.ipa`입니다. |
| `config` | **(string)** - 이 iOS build를 실행할 때 사용할 사용자 지정 workflow 파일 이름입니다. 플랫폼 독립 workflow를 위해 profile 수준에서도 지정할 수 있습니다. [자세히 알아보기](/custom-builds/get-started). 예: `"config": "production-ios.yml"`이면 `.eas/build/production-ios.yml`의 workflow를 사용합니다. |

## EAS Submit

다음 속성들은 **eas.json**의 `submit` key schema에서 사용할 수 있습니다.

production profile이 있는 schema 예시

```json
{
  "cli": {
    "version": ">= 0.34.0"
  },
  "submit": {
    "production": {
      "android": {
        "track": "internal"
      },
      "ios": {
        "appleId": "john@turtle.com",
        "ascAppId": "1234567890",
        "appleTeamId": "AB12XYZ34S"
      }
    }
  }
}
```

### Android 전용 옵션

| Property | Description |
| --- | --- |
| `serviceAccountKeyPath` | **(string)** - Google Play 인증에 사용할 [Google Service Account Key](https://expo.fyi/creating-google-service-account) JSON 파일의 경로입니다. |
| `track` | **(enum: production, beta, alpha, internal)** - 사용할 애플리케이션 track입니다. |
| `releaseStatus` | **(enum: completed, draft, halted, inProgress)** - [release 상태](https://developers.google.com/android-publisher/api-ref/rest/v3/edits.tracks#status)입니다. |
| `rollout` | **(number)** - release를 받을 수 있는 사용자 초기 비율입니다. 0(아무 사용자 없음)에서 1(모든 사용자) 사이의 값이어야 합니다. `inProgress` [release status](https://developers.google.com/android-publisher/api-ref/rest/v3/edits.tracks#status)에서만 동작합니다. |
| `changesNotSentForReview` | **(boolean)** - 이번 submission과 함께 전송된 변경 사항이 Google Play Console UI에서 명시적으로 검토 대상으로 보내기 전까지는 리뷰되지 않음을 나타냅니다. 기본값은 `false`입니다. |
| `applicationId` | **(string)** - Expo가 관리하는 Service Account Key에 접근할 때 사용할 application ID입니다. local credentials를 사용하는 경우에는 효과가 없습니다. 대부분의 경우 이 값은 자동 감지됩니다. 다만 product flavor가 여러 개면 이 값이 필요할 수 있습니다. |

### iOS 전용 옵션

| Property | Description |
| --- | --- |
| `appleId` | **(string)** - Apple ID 사용자 이름입니다(`EXPO_APPLE_ID` env variable로도 설정 가능). |
| `ascAppId` | **(string)** - [App Store Connect 고유 애플리케이션 Apple ID 숫자](https://expo.fyi/asc-app-id)입니다. 설정하면 앱 생성 단계를 건너뜁니다. |
| `appleTeamId` | **(string)** - Apple Developer Team ID입니다. |
| `sku` | **(string)** - App Store에는 표시되지 않는 앱의 고유 ID입니다. 제공하지 않으면 자동 생성됩니다. |
| `language` | **(string)** - 기본 언어입니다. 기본값은 `"en-US"`입니다. |
| `companyName` | **(string)** - App Store에 앱을 처음 제출할 때만 필요한 회사 이름입니다. |
| `appName` | **(string)** - App Store에 표시될 앱 이름입니다. 기본값은 [app config](/workflow/configuration)의 `expo.name`입니다. |
| `ascApiKeyPath` | **(string)** - [App Store Connect Api Key **.p8** 파일](https://expo.fyi/creating-asc-api-key)의 경로입니다. |
| `ascApiKeyIssuerId` | **(string)** - [App Store Connect Api Key](https://expo.fyi/creating-asc-api-key)의 Issuer ID입니다. |
| `ascApiKeyId` | **(string)** - [App Store Connect Api Key](https://expo.fyi/creating-asc-api-key)의 Key ID입니다. |
| `bundleIdentifier` | **(string)** - Expo가 관리하는 submit credentials에 접근할 때 사용할 bundle identifier입니다. local credentials를 사용하는 경우에는 효과가 없습니다. 대부분의 경우 이 값은 자동 감지됩니다. 하지만 Xcode scheme과 target이 여러 개라면 이 값이 필요할 수 있습니다. |
| `metadataPath` | **(string)** - [store configuration file](/eas/metadata)의 경로입니다. |
| `groups` | **(array)** - build를 추가할 TestFlight internal group 이름 배열입니다. 참고로 여기서 제공한 group 외에도, App Store Connect의 "Enable automatic distribution" 설정으로 생성된 group에는 build가 자동으로 추가됩니다. |
