---
modificationDate: September 10, 2025
title: 같은 기기에 앱 variant 함께 설치하기
description: 같은 기기에 앱의 여러 variant를 설치하는 방법을 알아보세요.
---

# 같은 기기에 앱 variant 함께 설치하기

같은 기기에 앱의 여러 variant를 설치하는 방법을 알아보세요.

[development, preview, production 빌드](/build/eas-json#common-use-cases)를 만들 때는 이 build variant들을 같은 기기에 동시에 설치하는 경우가 흔합니다. 이렇게 하면 앱을 제거하고 다시 설치하지 않아도 development 작업을 하고, 다음 버전을 미리 보고, 프로덕션 버전을 기기에서 실행할 수 있습니다.

이 가이드는 여러 variant(development와 production)를 구성해 같은 기기에 설치하고 사용하는 데 필요한 단계를 제공합니다.

## 사전 준비

기기에 앱 variant를 여러 개 설치하려면 각 variant가 고유한 [Application ID (Android)](/versions/latest/config/app#package) 또는 [Bundle Identifier (iOS)](/versions/latest/config/app#bundleidentifier)를 가져야 합니다.

## development 및 production variant 구성하기

Expo 도구를 사용해 프로젝트를 만들었고, 이제 development 빌드와 production 빌드를 만들고 싶다고 가정해 보겠습니다. 프로젝트의 **app.json**은 다음과 같을 수 있습니다:

```json
{
  "expo": {
    "name": "MyApp",
    "slug": "my-app",
    "ios": {
      "bundleIdentifier": "com.myapp"
    },
    "android": {
      "package": "com.myapp"
    }
  }
}
```

프로젝트에 EAS Build가 구성되어 있다면 **eas.json**도 아래와 비슷한 구성을 갖습니다:

```json
{
  "build": {
    "development": {
      "developmentClient": true
    },
    "production": {}
  }
}
```

### app.json을 app.config.js로 변환하기

같은 기기에 앱 variant를 여러 개 설치하려면 **app.json**을 **app.config.js**로 이름을 바꾸고, 아래와 같이 구성을 export하세요:

```js
export default {
  name: 'MyApp',
  slug: 'my-app',
  ios: {
    bundleIdentifier: 'com.myapp',
  },
  android: {
    package: 'com.myapp',
  },
};
```

**app.config.js**에 `IS_DEV`라는 환경 변수를 추가해, 그 값에 따라 각 variant의 `android.package`와 `ios.bundleIdentifier`를 전환하세요:

```js
const IS_DEV = process.env.APP_VARIANT === 'development';

export default {
  name: IS_DEV ? 'MyApp (Dev)' : 'MyApp',
  slug: 'my-app',
  ios: {
    bundleIdentifier: IS_DEV ? 'com.myapp.dev' : 'com.myapp',
  },
  android: {
    package: IS_DEV ? 'com.myapp.dev' : 'com.myapp',
  }
};
```

위 예시에서 환경 변수 `IS_DEV`는 development 환경과 production 환경을 구분하는 데 사용됩니다. 그 값에 따라 각 variant에 서로 다른 Application ID 또는 Bundle Identifier가 설정됩니다.

추가 앱 variant 사용자 지정

앱의 다른 측면도 variant별로 사용자 지정할 수 있습니다. 이전에 **app.json**에서 사용하던 어떤 구성이라도 위와 같은 방식으로 전환할 수 있습니다.

**예시:**

-   Google Maps나 Firebase Cloud Messaging (FCM)처럼 SDK 사용을 위해 외부 서비스에 앱 식별자를 등록해야 하는 라이브러리를 사용한다면, `android.package`와 `ios.bundleIdentifier`마다 별도의 API 구성이 필요합니다.
-   [development builds](/develop/development-builds/introduction)를 사용하고 있다면 `expo-dev-client` plugin을 구성해, development가 아닌 빌드에서는 Expo CLI 및 EAS Update QR 코드에 사용되는 앱 scheme을 비활성화할 수 있습니다. 이렇게 하면 기기의 기본 설정과 관계없이 해당 URL이 항상 development build를 실행하게 됩니다:

```js
plugins: [
  [
    'expo-dev-client',
    {
      addGeneratedScheme: !!IS_DEV,
    },
  ],
],
```

### EAS Build용 구성

**eas.json**에서 `env` 속성을 사용해 **development** profile로 빌드가 실행될 때 `APP_VARIANT` 환경 변수를 설정하세요:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "env": {
        "APP_VARIANT": "development"
      }
    },
    "production": {}
  }
}
```

이제 `eas build --profile development`를 실행하면 **app.config.js**를 평가할 때 로컬과 EAS Build builder 모두에서 `APP_VARIANT` 환경 변수가 `development`로 설정됩니다.

### development server 사용하기

development server를 시작할 때는 `APP_VARIANT=development npx expo start`를 실행해야 합니다(Windows를 사용한다면 플랫폼에 맞는 동등한 명령 사용).

이를 위한 지름길로 **package.json**에 다음 스크립트를 추가할 수 있습니다:

```json
{
  "scripts": {
    "dev": "APP_VARIANT=development npx expo start"
  }
}
```

### production variant 사용하기

`eas build --profile production`을 실행하면 `APP_VARIANT` 환경 변수는 설정되지 않으며, 빌드는 production variant로 실행됩니다.

> **참고:** EAS Update를 사용해 앱의 JavaScript 업데이트를 게시한다면, `eas update` 명령을 실행할 때 게시 대상 앱 variant에 맞는 환경 변수를 올바르게 설정했는지 주의해야 합니다. 자세한 내용은 EAS Build의 [Environment variables and secrets](/build/updates)를 참고하세요.

### 기존의 (bare) React Native 프로젝트에서

> 앱 variant용 bundle identifier와 package name을 포함한 앱 구성을 [app config file](/workflow/configuration)을 단일 진실 원본으로 사용하고 싶다면, [Continuous Native Generation (CNG)](/workflow/continuous-native-generation)로 마이그레이션하고 **android**와 **ios** 디렉터리를 **.gitignore**에 추가해야 합니다. 이는 특히 React Native CLI 프로젝트로 시작한 뒤 커스텀 네이티브 코드를 추가한 경우 중요합니다. 이렇게 해야 네이티브 프로젝트 구성이 app config보다 우선하지 않으며, 특히 bundle ID 조회 동작을 사용할 때 더 중요합니다. 이를 하지 않으면 잘못된 앱 variant가 실행되거나 development build가 제대로 감지되지 않는 문제가 생길 수 있습니다. 또는 아래에 설명된 Android flavor와 iOS scheme 방식을 명시적으로 선택할 수도 있습니다.

#### Android

**android/app/build.gradle**에서 빌드하고 싶은 **eas.json**의 각 build profile마다 별도의 flavor를 만드세요.

```groovy
android {
    ... 
    flavorDimensions "env"
    productFlavors {
        production {
            dimension "env"
            applicationId 'com.myapp'
        }
        development {
            dimension "env"
            applicationId 'com.myapp.dev'
        }
    }
    ... 
}
```

> **참고:** 현재 EAS CLI는 `applicationId` 필드만 지원합니다. `productFlavors` 또는 `buildTypes` 섹션 안에서 `applicationIdSuffix`를 사용하면 이 값은 올바르게 감지되지 않습니다.

**eas.json**에서 `gradleCommand`를 지정해 Android flavor를 EAS Build profile에 연결하세요:

```json
{
  "build": {
    "development": {
      "android": {
        "gradleCommand": ":app:assembleDevelopmentDebug"
      }
    },
    "production": {
      "android": {
        "gradleCommand": ":app:bundleProductionRelease"
      }
    }
  }
}
```

기본적으로 모든 flavor는 debug 또는 release 모드로 빌드할 수 있습니다. 특정 flavor를 특정 모드로 제한하고 싶다면 아래 스니펫을 참고해 **build.gradle**을 수정하세요.

```groovy
android {
    ... 
    variantFilter { variant ->
        def validVariants = [
                ["production", "release"],
                ["development", "debug"],
        ]
        def buildTypeName = variant.buildType*.name
        def flavorName = variant.flavors*.name

        def isValid = validVariants.any { flavorName.contains(it[0]) && buildTypeName.contains(it[1]) }
        if (!isValid) {
            setIgnore(true)
        }
    }
    ... 
}
```

이 시점 이후의 나머지 구성은 EAS 전용이 아니라 flavor를 사용하는 일반적인 Android 프로젝트와 동일합니다. 프로젝트에 적용하고 싶을 수 있는 흔한 구성 몇 가지는 다음과 같습니다:

-   development profile로 빌드한 앱의 이름을 바꾸려면 **android/app/src/development/res/value/strings.xml** 파일을 만드세요:
    
    ```xml
    <resources>
        <string name="app_name">MyApp - Dev</string>
    </resources>
    ```
    
-   development profile로 빌드한 앱의 아이콘을 바꾸려면 적절한 에셋을 포함한 **android/app/src/development/res/mipmap-\*** 디렉터리를 만드세요(**android/app/src/main/res**에서 복사한 뒤 아이콘 파일을 바꿀 수 있습니다).
-   특정 flavor용 **google-services.json**을 지정하려면 **android/app/src/{flavor}/google-services.json** 파일에 넣으세요.
-   sentry를 구성하려면 **android/app/build.gradle**에 `project.ext.sentryCli = [ flavorAware: true ]`를 추가하고 속성 파일 이름을 **android/sentry-{flavor}-{buildType}.properties**로 지정하세요(예: **android/sentry-production-release.properties**)

#### iOS

**eas.json**의 각 build profile에 서로 다른 `scheme`을 할당하세요:

```json
{
  "build": {
    "development": {
      "ios": {
        "buildConfiguration": "Debug",
        "scheme": "myapp-dev"
      }
    },
    "production": {
      "ios": {
        "buildConfiguration": "Release",
        "scheme": "myapp"
      }
    }
  }
}
```

**Podfile**에는 다음과 같은 target 정의가 있어야 합니다:

```ruby
target 'myapp' do
  ... 
end
```

이를 abstract target으로 바꾸고, 공통 구성은 기존 target에서 복사할 수 있습니다:

```ruby
abstract_target 'common' do
  # put common target configuration here

  target 'myapp' do
  end

  target 'myapp-dev' do
  end
end
```

Xcode에서 프로젝트를 열고, 탐색 패널에서 프로젝트 이름을 클릭한 다음 기존 target을 오른쪽 클릭하고 "Duplicate"를 누르세요:

그다음 target 이름을 더 의미 있게 바꾸세요. 예를 들어 `myapp copy`를 `myapp-dev`로 바꿀 수 있습니다.

새 target의 scheme을 구성하세요:

-   `Product` -> `Scheme` -> `Manage schemes`로 이동합니다.
-   목록에서 `myapp copy` scheme을 찾습니다.
-   scheme 이름을 `myapp copy`에서 `myapp-dev`로 변경합니다.
-   기본적으로 새 scheme은 shared로 표시되어야 하지만, Xcode는 `.xcscheme` 파일을 생성하지 않습니다. 이를 해결하려면 "Shared" 체크박스를 해제했다가 다시 체크하세요. 그러면 새 `.xcscheme` 파일이 **ios/myapp.xcodeproj/xcshareddata/xcschemes** 디렉터리에 나타나야 합니다.

기본적으로 새로 만든 target은 별도의 **Info.plist** 파일을 가집니다(위 예시에서는 **ios/myapp copy-Info.plist**). 프로젝트를 단순하게 유지하려면 모든 target이 같은 파일을 사용하는 것을 권장합니다:

-   **./ios/myapp copy-Info.plist**를 삭제합니다.
-   새 target을 클릭합니다.
-   `Build Settings` 탭으로 이동합니다.
-   `Packaging` 섹션을 찾습니다.
-   **Info.plist** 값을 **myapp copy-Info.plist**에서 **myapp/Info.plist**로 바꿉니다.
-   `Product Bundle Identifier`를 변경합니다.

표시 이름을 바꾸려면:

-   **Info.plist**를 열고 `Bundle display name` 키를 추가한 뒤 값으로 `$(DISPLAY_NAME)`를 설정합니다.
-   두 target의 `Build Settings`를 열고 `User-Defined` 섹션을 찾습니다.
-   해당 target에 사용할 이름으로 `DISPLAY_NAME` 키를 추가합니다.

앱 아이콘을 바꾸려면:

-   새 image set을 만듭니다(현재 아이콘용 기존 image set에서 만들어도 되며, 보통 이름은 `AppIcon`입니다).
-   아이콘을 바꾸려는 target의 `Build Settings`를 엽니다.
-   `Asset Catalog Compiler - Options` 섹션을 찾습니다.
-   `Primary App Icon Set Name`을 새 image set의 이름으로 변경합니다.
