---
modificationDate: February 26, 2026
title: 통합 접근 방식으로 네이티브 앱에 Expo 추가하기
description: 통합 접근 방식을 사용해 기존 네이티브(brownfield) 앱에 Expo와 React Native를 추가하는 가이드입니다.
---

# 통합 접근 방식으로 네이티브 앱에 Expo 추가하기

통합 접근 방식을 사용해 기존 네이티브(brownfield) 앱에 Expo와 React Native를 추가하는 가이드입니다.

React Native와 Expo는 유연하며, 한 번에 한 화면(심지어 한 뷰)씩 점진적으로 도입할 수 있습니다. 어떤 경우에는 이런 방식으로 Expo를 사용하는 것이 현재 애플리케이션에 가장 잘 맞을 수도 있고, 시간이 지나면서 앱의 더 많은 영역으로 천천히 확장하게 될 수도 있습니다. 어느 쪽이든 이런 유연성 덕분에 개발자는 전체 재작성의 위험을 감수하지 않고도 네이티브 앱에서 곧바로 최신 크로스플랫폼 도구를 도입할 수 있습니다.

이 가이드는 기존 네이티브 앱에 React Native 뷰를 추가하는 단계를 안내합니다. 여기서 다루는 방법은 React Native와 Expo를 다른 라이브러리처럼 같은 방식으로 통합하기 때문에 "통합" 접근 방식이라고 부릅니다.

> 또 다른 인기 있는 기법은 "격리" 접근 방식이라고 부르는 것으로, Expo 앱을 라이브러리로 패키징하고 기존 메인 애플리케이션에서는 이를 블랙박스처럼 다루는 방식입니다. 자세한 내용은 [격리 접근 방식 가이드](/brownfield/isolated-approach)를 참고하세요.

## 사전 준비 사항

기존 애플리케이션에 React Native를 통합하려면 JavaScript 개발 환경을 설정해야 합니다. 여기에는 Expo CLI를 실행하기 위한 Node.js와 프로젝트의 JavaScript 의존성을 관리하기 위한 Yarn 설치가 포함됩니다.

-   [Node.js (LTS)](https://nodejs.org/en/): JavaScript 코드와 Expo CLI를 실행하기 위한 런타임입니다.
-   [Yarn](https://yarnpkg.com/): JavaScript 의존성을 설치하고 관리하는 패키지 관리자입니다.
-   iOS용 [CocoaPods](https://cocoapods.org/): iOS에서 사용할 수 있는 의존성 관리 시스템 중 하나입니다. CocoaPods는 Ruby [gem](https://en.wikipedia.org/wiki/RubyGems)입니다. 최신 macOS에 포함된 Ruby 버전을 사용해 CocoaPods를 설치할 수 있습니다.

자세한 내용은 [환경 설정 가이드](/get-started/set-up-your-environment)를 참고하세요.

## Expo 프로젝트 만들기

먼저 기존 네이티브 프로젝트의 루트 디렉터리 안에 Expo 프로젝트를 만드세요.

```sh
npx create-expo-app@latest my-project --template default@sdk-55
```

이 명령은 새 Expo 프로젝트를 담고 있는 **my-project**라는 새 디렉터리를 만듭니다. 프로젝트 이름은 자유롭게 정할 수 있지만, 이 가이드에서는 일관성을 위해 **my-project**를 사용합니다. 새 프로젝트에는 시작에 도움이 되는 예제 TypeScript 애플리케이션이 포함됩니다.

## 프로젝트 구조 설정하기

표준 React Native 프로젝트는 네이티브 코드를 **android**와 **ios** 디렉터리에 둡니다. 이를 어떻게 구성할지는 프로젝트마다 다르지만, 디렉터리를 만들고 프로젝트를 그 안으로 옮기는 것만으로 충분할 수도 있습니다. 예를 들면:

```sh
mkdir my-project/android
mv /path/to/your/android-project my-project/android/
```

네이티브 프로젝트를 android와 ios 디렉터리로 옮길 수 없나요?

### 모노레포 설정하기

모노레포, 즉 "monolithic repositories"는 여러 앱이나 패키지를 포함하는 단일 저장소입니다. [더 알아보기](/guides/monorepos).

모노레포를 설정하면 사용자 정의 폴더 구조를 사용하더라도 Android와 iOS 스크립트가 Node 라이브러리의 명령을 호출할 수 있게 됩니다. Yarn 모노레포를 설정하려면 프로젝트 루트에 **package.json** 파일을 만들고 다음 내용을 추가하세요:

```json
{
  "version": "1.0.0",
  "private": true,
  "workspaces": ["my-project"]
}
```

그다음 `yarn install`을 실행해 의존성을 설치하세요. 그러면 **node_modules**가 프로젝트 루트에 설치되고, 네이티브 스크립트가 React Native 코드와 상호작용할 수 있게 됩니다. `["my-project"]`는 앞 단계에서 만든 Expo 프로젝트 이름으로 바꾸는 것을 잊지 마세요.

> 모노레포를 선택하면 Gradle/CocoaPods에서 사용자 정의 프로젝트 루트를 구성해야 합니다. 이는 다음 섹션에서 다룹니다.

## 네이티브 프로젝트 구성하기

Android에서 React Native를 통합하려면 다음 파일을 수정해 네이티브 프로젝트를 구성해야 합니다:

-   **Gradle files**: RNGP(React Native Gradle Plugin)와 기타 속성을 추가하기 위해 **settings.gradle**, 최상위 **build.gradle**, **app/build.gradle**, **gradle.properties**를 수정합니다.
-   **AndroidManifest.xml**: 필요한 권한을 추가합니다. ([더 알아보기](/brownfield/integrated-approach#configuring-your-manifest))
-   **MainActivity**: React Native 애플리케이션을 로드합니다.

### Gradle 구성하기

먼저 **settings.gradle** 파일을 편집하고 다음 줄을 추가하세요([bare minimum template](https://github.com/expo/expo/blob/main/templates/expo-template-bare-minimum/android/settings.gradle)를 참고용으로 사용할 수 있습니다):

```groovy
// Configures the React Native Gradle Settings plugin used for autolinking
pluginManagement {
  def reactNativeGradlePlugin = new File(
    providers.exec {
      workingDir(rootDir)
      commandLine("node", "--print", "require.resolve('@react-native/gradle-plugin/package.json', { paths: [require.resolve('react-native/package.json')] })")
    }.standardOutput.asText.get().trim()
  ).getParentFile().absolutePath
  includeBuild(reactNativeGradlePlugin)

  def expoPluginsPath = new File(
    providers.exec {
      workingDir(rootDir)
      commandLine("node", "--print", "require.resolve('expo-modules-autolinking/package.json', { paths: [require.resolve('expo/package.json')] })")
    }.standardOutput.asText.get().trim(),
    "../android/expo-gradle-plugin"
  ).absolutePath
  includeBuild(expoPluginsPath)
}

plugins {
  id("com.facebook.react.settings")
  id("expo-autolinking-settings")
}

extensions.configure(com.facebook.react.ReactSettingsExtension) { ex ->
  ex.autolinkLibrariesFromCommand(expoAutolinking.rnConfigCommand)
}
expoAutolinking.useExpoModules()

// rootProject.name = 'HelloWorld'

expoAutolinking.useExpoVersionCatalog()

includeBuild(expoAutolinking.reactNativeGradlePlugin)
// Include your existing Gradle modules here.
// include(":app")
```

사용자 정의 폴더 구조를 사용 중인가요?

사용자 정의 폴더 구조를 사용 중이라면 autolinking이 동작하도록 **settings.gradle**에서 프로젝트 루트를 명시적으로 설정해야 합니다. 다음 줄을 수정하세요:

그다음 최상위 **build.gradle**을 열고 이 줄을 포함하세요([bare minimum template](https://github.com/expo/expo/blob/main/templates/expo-template-bare-minimum/android/build.gradle)에서 제안하는 내용입니다):

이렇게 하면 React Native Gradle과 Expo 플러그인이 프로젝트 안에서 사용 가능하고 적용되도록 보장할 수 있습니다.

앱의 **build.gradle** 파일(보통 **app/build.gradle**이며, 참고용으로 [bare minimum template 파일](https://github.com/expo/expo/blob/main/templates/expo-template-bare-minimum/android/app/build.gradle)을 사용할 수 있습니다) 안에 다음 줄을 추가하세요:

사용자 정의 폴더 구조를 사용 중인가요?

사용자 정의 폴더 구조를 사용 중이라면 **app/build.gradle**에서 `projectRoot` 값이 Expo 프로젝트 루트를 가리키도록 조정해야 합니다. 다음 줄을 수정하세요:

마지막으로 앱의 **gradle.properties** 파일을 열고 다음 줄을 추가하세요([bare minimum template 파일](https://github.com/expo/expo/blob/main/templates/expo-template-bare-minimum/android/gradle.properties)을 참고하세요):

```properties
reactNativeArchitectures=armeabi-v7a,arm64-v8a,x86,x86_64
newArchEnabled=true
hermesEnabled=true
```

### manifest 구성하기

먼저 **AndroidManifest.xml**에 `INTERNET` 권한이 있는지 확인하세요:

이제 **debug** **AndroidManifest.xml**에서 [cleartext traffic](https://developer.android.com/training/articles/security-config#CleartextTrafficPermitted)을 활성화하세요:

이는 앱이 HTTP를 통해 로컬 [Metro bundler](https://metrobundler.dev/)와 통신하는 데 필요합니다. 참고용으로 bare minimum template의 **AndroidManifest.xml** 파일을 사용할 수 있습니다: [main](https://github.com/expo/expo/blob/main/templates/expo-template-bare-minimum/android/app/src/main/AndroidManifest.xml) 및 [debug](https://github.com/expo/expo/blob/main/templates/expo-template-bare-minimum/android/app/src/debug/AndroidManifest.xml)

### 코드와 통합하기

이제 React Native 런타임을 시작하고 React 컴포넌트를 렌더링하도록 지시하는 네이티브 코드를 추가해야 합니다.

#### `Application` 클래스 업데이트하기

먼저 React Native를 초기화하도록 `Application` 클래스를 업데이트하세요. 참고용으로 [bare minimum template](https://github.com/expo/expo/blob/main/templates/expo-template-bare-minimum/android/app/src/main/java/com/helloworld/MainApplication.kt)의 **MainApplication.kt**를 사용할 수 있습니다:

#### `ReactActivity` 만들기

`ReactActivity`를 확장하고 React Native 코드를 호스팅할 새 `Activity`를 만드세요. 이 activity는 React Native 런타임을 시작하고 React 컴포넌트를 렌더링하는 역할을 합니다. 참고용으로 [bare minimum template 파일의 **MainActivity.kt**](https://github.com/expo/expo/blob/main/templates/expo-template-bare-minimum/android/app/src/main/java/com/helloworld/MainActivity.kt)을 사용할 수 있습니다:

```kotlin
// package <your-package-here>

import android.os.Build

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

import expo.modules.ReactActivityDelegateWrapper

class MyReactActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "main"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate {
    return ReactActivityDelegateWrapper(
          this,
          BuildConfig.IS_NEW_ARCHITECTURE_ENABLED,
          object : DefaultReactActivityDelegate(
              this,
              mainComponentName,
              fabricEnabled
          ){})
  }
}
```

새 Activity를 **AndroidManifest.xml** 파일에 추가하고, 애플리케이션이 React Native 화면 위에 `ActionBar`를 렌더링하지 않도록 `MyReactActivity`의 테마를 `Theme.AppCompat.Light.NoActionBar`(또는 ActionBar가 없는 다른 테마)로 설정하세요:

이제 activity가 JavaScript 코드를 실행할 준비가 되었습니다.

## 통합 테스트하기

애플리케이션에 React Native를 통합하기 위한 기본 단계는 모두 완료했습니다. 이제 React Native 디렉터리에서 다음 명령을 실행해 [Metro bundler](https://metrobundler.dev/)를 시작하세요.

```sh
yarn start
```

Metro는 TypeScript 애플리케이션 코드를 번들로 빌드하고, HTTP 서버를 통해 제공하며, 개발 환경의 `localhost`에서 시뮬레이터나 기기로 번들을 공유하여 [hot reloading](https://reactnative.dev/blog/2016/03/24/introducing-hot-reloading)을 가능하게 합니다. 이제 평소처럼 앱을 빌드하고 실행할 수 있습니다. 앱 내부의 React 기반 Activity로 이동하면 개발 서버에서 JavaScript 코드를 로드해야 합니다.
