---
modificationDate: February 26, 2026
title: 격리 접근 방식으로 네이티브 앱에 Expo 추가하기
description: 격리 접근 방식을 사용해 Expo와 React Native를 네이티브 라이브러리로 추가하고 기존 (brownfield) 네이티브 앱에 통합하는 가이드입니다.
---

# 격리 접근 방식으로 네이티브 앱에 Expo 추가하기

격리 접근 방식을 사용해 Expo와 React Native를 네이티브 라이브러리로 추가하고 기존 (brownfield) 네이티브 앱에 통합하는 가이드입니다.

격리 접근 방식에서는 React Native 코드를 네이티브 프로젝트와 별도로 개발하고 유지보수합니다. 이를 Android에서는 AAR, iOS에서는 XCFramework 형태의 네이티브 라이브러리로 패키징하고, 기존 네이티브 앱에 다른 의존성과 같은 방식으로 통합합니다.

이 방식은 React Native가 기존 네이티브 빌드 프로세스에 미치는 영향을 최소화하고 싶을 때, 또는 네이티브 개발 팀과 React Native 개발 팀이 분리되어 있을 때 이상적입니다. 이 방식을 사용하면 네이티브 개발자는 Node.js, Yarn, React Native 빌드 도구를 설치할 필요 없이 미리 빌드된 아티팩트만 소비하면 됩니다.

> React Native를 네이티브 프로젝트에 직접 통합하는 대안적 접근 방식은 [통합 접근 방식 가이드](/brownfield/integrated-approach)를 참고하세요.

## 사전 준비 사항

기존 애플리케이션에 React Native를 통합하려면 JavaScript 개발 환경을 설정해야 합니다. 여기에는 Expo CLI를 실행하기 위한 Node.js와 프로젝트의 JavaScript 의존성을 관리하기 위한 Yarn 설치가 포함됩니다.

-   [Node.js (LTS)](https://nodejs.org/en/): JavaScript 코드와 Expo CLI를 실행하기 위한 런타임입니다.
-   [Yarn](https://yarnpkg.com/): JavaScript 의존성을 설치하고 관리하는 패키지 관리자입니다.

자세한 내용은 [환경 설정 가이드](/get-started/set-up-your-environment)를 참고하세요.

## Expo 프로젝트 설정하기

### 새 Expo 프로젝트 만들기

다음 명령을 실행해 새 Expo 프로젝트가 들어 있는 **my-project** 디렉터리를 만드세요. 프로젝트 이름은 자유롭게 정할 수 있지만, 이 가이드에서는 일관성을 위해 **my-project**를 사용합니다.

```sh
npx create-expo-app@latest my-project --template default@sdk-55
```

**my-project**는 기존 네이티브 앱 안에 있을 필요가 없으며, 별도의 저장소나 모노레포에 만들어도 됩니다. 새 프로젝트에는 시작에 도움이 되는 예제 TypeScript 애플리케이션이 포함됩니다.

### expo-brownfield 설치하기

새 Expo 프로젝트 디렉터리로 이동해 `expo-brownfield` 라이브러리를 설치하세요. 이 라이브러리는 React Native 코드를 네이티브 라이브러리로 빌드하고 기존 네이티브 앱에 통합하는 도구를 제공합니다.

```sh
npx expo install expo-brownfield
```

### config plugin 조정하기(선택 사항)

`expo-brownfield`는 대부분의 프로젝트에서 충분한 기본 구성으로 **app.json**의 `plugins` 배열에 항목을 자동으로 추가해야 합니다.

```json
{
  "expo": {
    "plugins": ["expo-brownfield"]
  }
}
```

기본값은 앱 구성에서 파생됩니다(예: target 이름은 앱의 scheme 또는 slug를 기반으로 합니다). target 이름, bundle identifier, publish 구성을 사용자화하고 싶다면 옵션을 전달할 수도 있습니다.

사용자 정의 expo-brownfield 구성

```json
{
  "expo": {
    "plugins": [
      [
        "expo-brownfield",
        {
          "ios": {
            "targetName": "MyBrownfield",
            "bundleIdentifier": "com.example.mybrownfield"
          },
          "android": {
            "libraryName": "mybrownfield",
            "group": "com.example",
            "package": "com.example.mybrownfield",
            "version": "1.0.0"
          }
        }
      ]
    ]
  }
}
```

사용 가능한 모든 옵션에 대한 자세한 내용은 [`expo-brownfield` API reference](/versions/v55.0.0/sdk/brownfield)를 참고하세요.

## Expo 프로젝트를 네이티브 라이브러리로 내보내기

Expo 프로젝트 설정이 끝났다면 `expo-brownfield` CLI를 사용해 React Native 코드를 Android용 AAR과 iOS용 XCFramework로 빌드하세요.

Expo 프로젝트 디렉터리에서 다음을 실행하세요:

```sh
npx expo-brownfield build:android
```

이 명령은 AAR을 빌드하고 Maven 저장소에 게시합니다. 기본적으로는 로컬 Maven 저장소(`~/.m2`)에 게시되지만, 원격 저장소로 게시하도록 구성할 수도 있습니다. 생성되는 아티팩트 이름은 config plugin 설정에 따라 결정되며, 이 경우 `com.username.myproject:brownfield:1.0.0`입니다.

디버그 또는 릴리스만 빌드하기, 사용자 정의 출력 디렉터리 지정하기 등 빌드 옵션에 대한 자세한 내용은 [API reference](/versions/v55.0.0/sdk/brownfield)를 참고하세요.

네이티브 target 디버깅하기

Expo 프로젝트 target의 네이티브 코드를 디버깅해야 한다면 `npx expo prebuild`를 실행해 **android**와 **ios\`** 디렉터리 안에 brownfield 라이브러리 target이 포함된 네이티브 프로젝트를 생성할 수 있습니다.

```sh
npx expo prebuild
```

위 명령은 다음을 생성합니다:

-   **Android**: `ReactNativeHostManager`, `BrownfieldActivity`, `ReactNativeFragment`, `ReactNativeViewFactory`, `BrownfieldMessaging`를 포함하는 별도 라이브러리 모듈
-   **iOS**: `ReactNativeHostManager`, `ReactNativeViewController`, `ReactNativeView` (SwiftUI), `BrownfieldMessaging`, `ReactNativeDelegate`를 포함하는 별도 Xcode 프레임워크 target

## 네이티브 앱에 통합하기

아티팩트가 빌드되면 이제 기존 네이티브 앱에 통합할 수 있습니다. 정확한 단계는 프로젝트 구조와 빌드 시스템에 따라 다르지만, 일반적인 과정은 미리 빌드된 아티팩트를 의존성으로 추가하고 React Native host를 초기화하는 것입니다.

#### Maven 의존성 추가하기

먼저 앱의 **build.gradle.kts**에 의존성을 추가하세요. group, artifact 이름, version은 config plugin 설정과 일치해야 합니다:

```kotlin
dependencies {
  implementation("com.username.myproject:brownfield:1.0.0")
}
```

라이브러리를 로컬 Maven에 게시했다면 저장소 구성에 `mavenLocal()`을 추가해야 합니다:

```kotlin
dependencyResolutionManagement {
  repositories {
    google()
    mavenCentral()
    mavenLocal()
  }
}
```

#### React Native 화면 표시하기

`BrownfieldActivity`를 확장하는 activity를 만들고 `showReactNativeFragment()` 확장을 사용하세요:

```kotlin
import android.os.Bundle
import com.example.brownfield.BrownfieldActivity
import com.example.brownfield.showReactNativeFragment

class ExpoActivity : BrownfieldActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    showReactNativeFragment()
  }
}
```

이 activity를 **AndroidManifest.xml**에 ActionBar가 없는 테마와 함께 추가하세요:

```xml
<activity
  android:name=".ExpoActivity"
  android:theme="@style/Theme.AppCompat.Light.NoActionBar"
  android:configChanges="keyboard|keyboardHidden|orientation|screenLayout|screenSize|smallestScreenSize|uiMode"
/>
```

그다음 앱 어디에서든 다음과 같이 실행할 수 있습니다:

```kotlin
startActivity(Intent(this, ExpoActivity::class.java))
```

`BrownfieldActivity`는 `AppCompatActivity`를 확장하며, 구성 변경 사항을 Expo modules로 전달하는 작업을 처리합니다. `showReactNativeFragment()` 확장은 네이티브 뒤로 가기 버튼 처리도 자동으로 설정합니다.

## 통합 테스트하기

애플리케이션에 React Native를 통합하기 위한 기본 단계는 모두 완료했습니다. 이제 테스트할 차례입니다. 정확한 과정은 디버그 빌드를 실행하는지 릴리스 빌드를 실행하는지에 따라 달라집니다.

### 개발 환경(디버그 빌드)

이제 React Native 디렉터리에서 다음 명령을 실행해 [Metro bundler](https://metrobundler.dev/)를 시작하세요.

```sh
npx expo start
```

그다음 Android Studio 또는 Xcode에서 네이티브 앱을 빌드하고 실행하세요. React Native 화면으로 이동하면 Metro 개발 서버에서 로드되며 hot reloading을 지원합니다.

### 프로덕션(릴리스 빌드)

릴리스 빌드에서는 JavaScript 번들이 아티팩트(AAR 또는 XCFramework)에 포함되므로 Metro 서버가 필요하지 않습니다. 네이티브 앱을 Release 구성으로 빌드하고 React Native 화면이 올바르게 로드되는지 확인하세요.

## 다음 단계

[Lifecycle listeners](/brownfield/lifecycle-listeners) — Expo modules와 더 깊게 통합하기 위한 애플리케이션 수명주기 리스너를 구성하세요.

[expo-brownfield API reference](/versions/v55.0.0/sdk/brownfield) — 통신, 내비게이션 등 전체 JavaScript API를 살펴보세요.
