---
modificationDate: February 28, 2026
title: eas.json으로 EAS Build 구성하기
description: EAS 서비스를 사용하는 프로젝트가 eas.json으로 어떻게 구성되는지 알아보세요.
---

# eas.json으로 EAS Build 구성하기

EAS 서비스를 사용하는 프로젝트가 eas.json으로 어떻게 구성되는지 알아보세요.

**eas.json**은 EAS CLI와 EAS 서비스의 구성 파일입니다. 프로젝트에서 [`eas build:configure` 명령](/build/setup#configure-the-project)을 처음 실행할 때 생성되며, 프로젝트 루트에서 **package.json** 옆에 위치합니다. EAS Build 구성은 모두 `build` 키 아래에 들어갑니다.

새 프로젝트에서 생성되는 **eas.json**의 기본 구성은 아래와 같습니다:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  }
}
```

## Build profile

build profile은 특정 유형의 빌드를 수행하는 데 필요한 매개변수를 설명하는 이름 있는 구성 묶음입니다.

`build` 키 아래의 JSON 객체에는 여러 build profile을 포함할 수 있으며, build profile 이름도 자유롭게 지정할 수 있습니다. 기본 구성에는 `development`, `preview`, `production`이라는 세 개의 build profile이 있습니다. 하지만 이것들이 `foo`, `bar`, `baz`라고 이름 붙어 있어도 됩니다.

특정 profile로 빌드를 실행하려면 아래와 같이 `<profile-name>`과 함께 명령을 사용하세요:

```sh
eas build --profile
```

`--profile` 플래그를 생략하면 EAS CLI는 기본적으로 `production`이라는 이름의 profile이 있으면 그 profile을 사용합니다.

### 플랫폼별 옵션과 공통 옵션

각 build profile 안에서는 [`android`](/eas/json#android-specific-options)와 [`ios`](/eas/json#ios-specific-options) 필드를 지정할 수 있으며, 이 필드에는 플랫폼별 build 구성이 들어갑니다. [두 플랫폼 모두에서 사용할 수 있는 옵션](/eas/json#common-properties-for-native-platforms)은 플랫폼별 구성 객체 안이나 profile 루트에 둘 수 있습니다.

### profile 간 구성 공유하기

build profile은 `extends` 옵션을 사용해 다른 build profile 속성을 확장할 수 있습니다.

예를 들어 `preview` profile에 `"extends": "production"`을 둘 수 있습니다. 이렇게 하면 `preview` profile이 `production` profile의 구성을 상속받습니다.

원형 의존성만 만들지 않는다면 profile 확장은 최대 5단계 깊이까지 이어서 사용할 수 있습니다.

## 일반적인 사용 사례

Expo 도구를 사용하는 개발자는 대체로 세 가지 유형의 빌드를 갖게 됩니다. **development**, **preview**, **production**입니다.

### Development build

기본적으로 `eas build:configure`는 `"developmentClient": true`가 들어 있는 `development` profile을 생성합니다. 이는 이 빌드가 [`expo-dev-client`](/develop/development-builds/introduction)에 의존한다는 뜻입니다. 이러한 빌드에는 개발자 도구가 포함되며, 앱 스토어에 제출되지 않습니다.

또한 `development` profile은 기본적으로 [`"distribution": "internal"`](/build/internal-distribution)도 설정됩니다. 이를 통해 앱을 실제 Android와 iOS 기기에 직접 쉽게 배포할 수 있습니다.

development build를 [iOS Simulator](/build-reference/simulators)에서 실행하도록 구성할 수도 있습니다. 이를 위해서는 `development` profile에 다음 구성을 사용하세요:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    }
    ... 
  }
  ... 
}
```

> **참고:** iOS에서 internal distribution용 빌드와 iOS Simulator용 빌드를 각각 만들려면, 해당 빌드 전용 development profile을 별도로 만들 수 있습니다. profile 이름은 자유롭게 정할 수 있습니다. 예를 들어 `development-simulator`라고 이름 붙이고, `development`에 두는 대신 해당 profile에 [iOS Simulator 전용 구성](/build-reference/simulators#configuring-a-profile-to-build-for-simulators)을 사용하면 됩니다. 반면 [Android **.apk**를 실제 기기와 Android Emulator에서 실행](/build-reference/apk)하는 데에는 이런 구성이 필요하지 않습니다. 동일한 **.apk**가 두 환경 모두에서 실행되기 때문입니다.

### Preview build

이 빌드에는 개발자 도구가 포함되지 않습니다. 팀과 다른 이해관계자가 프로덕션과 유사한 환경에서 앱을 테스트할 수 있도록 설치하는 것이 목적입니다. 그런 의미에서 [production build](/build/eas-json#production-builds)와 비슷합니다. 하지만 production build와 다른 점은 앱 스토어 배포용 서명이 되어 있지 않거나(iOS의 ad hoc 또는 enterprise provisioning), 스토어 배포에 최적이 아닌 형식으로 패키징된다는 것입니다(preview에는 Android **.apk** 권장, Google Play Store에는 **.aab** 권장).

최소한의 `preview` profile 예시는 다음과 같습니다:

```json
{
  "build": {
    "preview": {
      "distribution": "internal"
    }
    ... 
  }
  ... 
}
```

[development build](/build/eas-json#development-builds)와 비슷하게, preview build도 [iOS Simulator](/build-reference/simulators)에서 실행하도록 구성하거나 그 용도의 preview profile variant를 만들 수 있습니다. 반면 [Android **.apk**를 실제 기기와 Android Emulator에서 실행](/build-reference/apk)하는 데에는 이런 구성이 필요하지 않습니다. 동일한 **.apk**가 두 환경 모두에서 실행되기 때문입니다.

### Production build

이 빌드는 일반 대중에게 릴리스하기 위해 또는 TestFlight 같은 스토어 기반 테스트 프로세스의 일부로 앱 스토어에 제출됩니다.

production build는 각 앱 스토어를 통해 설치되어야 합니다. Android Emulator나 실제 Android 기기, iOS Simulator나 실제 iOS 기기에 직접 설치할 수 없습니다. 유일한 예외는 Android build profile에서 명시적으로 `"buildType": "apk"`를 설정한 경우입니다. 하지만 스토어 제출에는 기본 구성인 **.aab** 사용을 권장합니다.

최소한의 `production` profile 예시는 다음과 같습니다:

```json
{
  "build": {
    "production": {}
    ... 
  }
  ... 
}
```

### 같은 기기에 같은 앱의 여러 빌드 설치하기

같은 기기에 development build와 production build를 동시에 설치하는 경우는 흔합니다. 자세한 내용은 [같은 기기에 앱 variant 함께 설치하기](/build-reference/variants)를 참고하세요.

## 빌드 도구 구성하기

모든 빌드는 빌드 프로세스를 수행하는 데 필요한 관련 도구들의 특정 버전에 암묵적 또는 명시적으로 의존합니다. 여기에는 Node.js, npm, Yarn, Ruby, Bundler, CocoaPods, Fastlane, Xcode, Android NDK 등이 포함됩니다.

### 빌드 도구 버전 선택하기

가장 일반적인 빌드 도구 버전은 각 도구 이름에 해당하는 필드를 build profile에 두어 설정할 수 있습니다. 예를 들어 [`node`](/eas/json#node)는 다음과 같습니다:

```json
{
  "build": {
    "production": {
      "node": "18.18.0"
    }
    ... 
  }
  ... 
}
```

profile 간에 빌드 도구 구성을 공유하는 경우가 흔합니다. 이를 위해 `extends`를 사용하세요:

```json
{
  "build": {
    "production": {
      "node": "18.18.0"
    },
    "preview": {
      "extends": "production",
      "distribution": "internal"
    },
    "development": {
      "extends": "production",
      "developmentClient": true,
      "distribution": "internal"
    }
    ... 
  }
  ... 
}
```

### resource class 선택하기

resource class는 EAS Build가 작업에 제공하는 가상 머신 리소스 구성(CPU 코어 수, RAM 크기)입니다. 기본적으로 resource class는 `medium`으로 설정되며, 보통 작은 프로젝트와 큰 프로젝트 모두에 충분합니다. 하지만 프로젝트에 더 강한 CPU나 더 큰 메모리가 필요하거나, 빌드를 더 빨리 끝내고 싶다면 `large` worker로 전환할 수 있습니다.

각 class에 제공되는 리소스의 자세한 내용은 [`android.resourceClass`](/eas/json#resourceclass-1)와 [`ios.resourceClass`](/eas/json#resourceclass-2) 속성을 참고하세요. 특정 resource class worker에서 빌드를 실행하려면 build profile에 이 속성을 구성하면 됩니다:

```json
{
  "build": {
    "production": {
      "android": {
        "resourceClass": "medium"
      },
      "ios": {
        "resourceClass": "large"
      },
    }
    ... 
  }
  ... 
}
```

> **참고**: `large` worker에서 작업을 실행하려면 [유료 EAS 플랜](https://expo.dev/accounts/%5Baccount%5D/settings/billing)이 필요합니다.

### base image 선택하기

빌드 작업의 base image는 Node.js, Yarn, CocoaPods 같은 다양한 의존성의 기본 버전을 제어합니다. 이전 섹션에서 설명한 것처럼 `resourceClass`와 함께 특정 이름의 필드를 사용해 이를 재정의할 수 있습니다. 하지만 image에는 운영 체제 버전이나 Xcode 버전처럼 다른 방법으로는 명시적으로 설정할 수 없는 도구 버전도 포함됩니다.

Expo로 앱을 빌드하는 경우, EAS Build는 빌드 대상 SDK 버전에 맞는 적절한 image와 합리적인 의존성 세트를 자동으로 선택합니다. 그렇지 않다면 [빌드 서버 인프라](/build-reference/infrastructure)에서 사용 가능한 image 목록을 확인하는 것이 좋습니다.

### 예시

#### Schema

```json
{
  "cli": {
    "version": "SEMVER_RANGE",
    "requireCommit": boolean,
    "appVersionSource": string,
    "promptToConfigurePushNotifications": boolean,
  },
  "build": {
    "BUILD_PROFILE_NAME_1": {
      ...COMMON_OPTIONS,
      "android": {
        ...COMMON_OPTIONS,
        ...ANDROID_OPTIONS
      },
      "ios": {
        ...COMMON_OPTIONS,
        ...IOS_OPTIONS
      }
    },
    "BUILD_PROFILE_NAME_2": {},
	... 
  }
}
```

> [공통 속성](/eas/json##common-properties-for-native-platforms)은 플랫폼별 구성 객체 안에도, profile 루트에도 지정할 수 있습니다. 플랫폼별 옵션이 전역으로 정의된 옵션보다 우선합니다.

여러 profile을 가진 managed 프로젝트

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
여러 profile을 가진 bare 프로젝트

```json
{
  "build": {
    "base": {
      "env": {
        "EXAMPLE_ENV": "example value"
      },
      "android": {
        "image": "ubuntu-18.04-android-30-ndk-r19c",
        "ndk": "21.4.7075529"
      },
      "ios": {
        "image": "latest",
        "node": "12.13.0",
        "yarn": "1.22.5"
      }
    },
    "development": {
      "extends": "base",
      "env": {
        "ENVIRONMENT": "staging"
      },
      "android": {
        "distribution": "internal",
        "withoutCredentials": true,
        "gradleCommand": ":app:assembleDebug"
      },
      "ios": {
        "simulator": true,
        "buildConfiguration": "Debug"
      }
    },
    "staging": {
      "extends": "base",
      "env": {
        "ENVIRONMENT": "staging"
      },
      "distribution": "internal",
      "android": {
        "gradleCommand": ":app:assembleRelease"
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

## 환경 변수

build profile의 `"env"` 필드를 사용해 환경 변수를 구성할 수 있습니다. 이 환경 변수는 `eas build`를 실행할 때 로컬에서 **app.config.js**를 평가하는 데 사용되며, EAS Build builder에도 설정됩니다.

```json
{
  "build": {
    "production": {
      "node": "16.13.0",
      "env": {
        "API_URL": "https://company.com/api"
      }
    },
    "preview": {
      "extends": "production",
      "distribution": "internal",
      "env": {
        "API_URL": "https://staging.company.com/api"
      }
    }
    ... 
  }
  ... 
}
```

[환경 변수와 secret](/eas/environment-variables) 레퍼런스에서 이 주제를 더 자세히 설명하며, [Use EAS Update](/build/updates) 가이드에서는 이 기능을 `expo-updates`와 함께 사용할 때 고려할 점을 다룹니다.

## 더 보기

[EAS Build schema reference](/eas/json#eas-build) — EAS Build에서 사용할 수 있는 속성의 전체 레퍼런스를 확인하세요.
