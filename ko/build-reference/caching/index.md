---
modificationDate: March 01, 2026
title: 의존성 캐시하기
description: 의존성을 캐시해 빌드 속도를 높이는 방법을 알아보세요.
---

# 의존성 캐시하기

의존성을 캐시해 빌드 속도를 높이는 방법을 알아보세요.

빌드 작업이 프로젝트 컴파일을 시작하려면 먼저 모든 프로젝트 의존성이 디스크에 준비되어 있어야 합니다. 의존성을 확보하는 데 오래 걸릴수록 빌드 완료까지 더 오래 기다려야 하므로, 의존성 캐시는 빌드 속도를 높이는 중요한 요소입니다.

> 빌드를 안정적으로 빠르게 만들기 위해 캐시와 빌드 프로세스의 다른 부분도 계속 개선하고 있습니다.

## 사용자 정의 캐시

[eas.json](/build/eas-json)의 build profile 안에 있는 `cache` 필드를 사용하면 특정 파일과 디렉터리에 대한 캐시를 구성할 수 있습니다. 지정된 파일은 성공적인 빌드 후 영구 저장소에 저장되며, 이후 빌드에서 JavaScript 의존성이 설치된 다음 복원됩니다. 복원은 기존 파일을 덮어쓰지 않습니다. `cache.key` 값을 변경하면 캐시가 무효화됩니다. `cache` 객체의 다른 속성을 바꾸는 것 역시 캐시를 무효화합니다.

## JavaScript 의존성

EAS Build는 빌드 작업에서 JavaScript 의존성 다운로드 속도를 높이기 위해 npm 캐시 서버를 실행합니다. 기본적으로 npm 또는 Yarn 2+를 사용하는 프로젝트는 이 캐시를 사용합니다. 다만 Yarn 1(Classic)은 프로젝트의 **package.json**에 이 [workaround](/build-reference/npm-cache-with-yarn)를 적용해야 캐시를 사용할 수 있습니다.

빌드에서 npm 캐시 서버 사용을 비활성화하려면 **eas.json**에서 `EAS_BUILD_DISABLE_NPM_CACHE` 환경 변수 값을 `"1"`로 설정하세요.

```json
{
  "build": {
    "production": {
      "env": {
        "EAS_BUILD_DISABLE_NPM_CACHE": "1"
        ... 
      }
      ... 
    }
    ... 
  }
  ... 
}
```

### Immutable lockfiles

기본적으로 Node 패키지는 선호하는 패키지 매니저의 immutable lockfile 플래그/명령(예: `yarn --frozen-lockfile` 또는 `npm ci`)으로 설치됩니다. 이를 비활성화하려면 **eas.json**에서 `EAS_NO_FROZEN_LOCKFILE` 환경 변수를 `"1"`로 설정할 수 있습니다.

## Android 의존성

EAS Build는 빌드 작업의 Android 의존성 다운로드 속도를 높이기 위해 Maven 캐시 서버를 실행합니다.

현재 캐시 대상은 다음과 같습니다:

-   `maven-central` - [https://repo1.maven.org/maven2/](https://repo1.maven.org/maven2/)
-   `google` - [https://maven.google.com/](https://maven.google.com/)
-   `jcenter` - [https://jcenter.bintray.com/](https://jcenter.bintray.com/)
-   `plugins` - [https://plugins.gradle.org/m2/](https://plugins.gradle.org/m2/)

빌드에서 Maven 캐시 서버 사용을 비활성화하려면 **eas.json**에서 `EAS_BUILD_DISABLE_MAVEN_CACHE` 환경 변수 값을 `"1"`로 설정하세요.

```json
{
  "build": {
    "production": {
      "env": {
        "EAS_BUILD_DISABLE_MAVEN_CACHE": "1"
        ... 
      }
      ... 
    }
    ... 
  }
  ... 
}
```

## ccache로 C/C++ 컴파일 아티팩트 캐시하기

[ccache](https://ccache.dev/)는 이전 컴파일 결과를 캐시하여 네이티브 코드 재컴파일 속도를 높여 주는 컴파일러 캐시입니다. EAS는 기본적으로 ccache 구성을 지원합니다.

다음 환경 변수를 사용해 빌드가 ccache 캐시를 자동 저장 및 복원하도록 구성할 수 있습니다:

-   `EAS_USE_CACHE`: `1`로 설정하면 빌드 작업 중 캐시 결과 복원과 저장을 모두 활성화합니다.
-   `EAS_RESTORE_CACHE`: 빌드 시작 시 캐시 복원을 제어합니다. 활성화하려면 `1`, 비활성화하려면 `0`으로 설정합니다. `EAS_USE_CACHE`보다 우선합니다.
-   `EAS_SAVE_CACHE`: 빌드 종료 시 캐시를 저장할지 제어합니다. 활성화하려면 `1`, 비활성화하려면 `0`으로 설정합니다. `EAS_USE_CACHE`보다 우선합니다.

### EAS Workflows

EAS Workflows에서는 [`eas/restore_cache`](/eas/workflows/syntax#easrestore_cache)와 [`eas/save_cache`](/eas/workflows/syntax#eassave_cache)를 사용하세요.

**Android 예시:**

```yaml
jobs:
  build_android:
    type: build
    steps:
      - uses: eas/checkout
      - uses: eas/restore_build_cache
      # This is equivalent to the step above. You can also use /restore_cache for other caching purposes by defining your own key pattern and path
      # - uses: eas/restore_cache
      #   with:
      #     key: android-ccache-${{ hashFiles('yarn.lock') }}
      #     restore_keys: android
      #     path: /home/expo/.cache/ccache
      - uses: eas/build
      - uses: eas/save_build_cache
      # - uses: eas/save_cache
      #   with:
      #    key: android-ccache-${{ hashFiles('yarn.lock') }}
      #    path: /home/expo/.cache/ccache
```

**iOS 예시:**

```yaml
jobs:
  build_ios:
    type: build
    steps:
      - uses: eas/checkout
      - uses: eas/restore_build_cache
      # This is equivalent to the step above. You can also use /restore_cache for other caching purposes by defining your own key pattern and path
      # - uses: eas/restore_cache
      #   with:
      #     key: ios-ccache-${{ hashFiles('yarn.lock') }}
      #     restore_keys: ios
      #     path: /Users/expo/Library/Caches/ccache
      - uses: eas/build
      - uses: eas/save_build_cache
      # - uses: eas/save_cache
      #   with:
      #    key: ios-ccache-${{ hashFiles('yarn.lock') }}
      #    path: /Users/expo/Library/Caches/ccache
```

### Custom builds

빌드 단계를 직접 관리하는 custom build에서는 ccache를 활성화하기 위해 [`eas/restore_build_cache`](/custom-builds/schema#easrestore_build_cache)와 [`eas/save_build_cache`](/custom-builds/schema#eassave_build_cache)를 추가하세요.

```yaml
build:
  name: Build with ccache
  steps:
    - eas/checkout
    - eas/restore_build_cache
    - eas/build
    - eas/save_build_cache
```

캐시 키는 패키지 매니저 lock file의 해시를 사용해 의존성 기반의 고유 키를 생성합니다. 의존성이 바뀌면 새로운 캐시가 생성되지만, `restore_keys`를 사용해 이전 캐시로 폴백할 수 있습니다.

### 캐시 키 매칭

캐시를 복원할 때 캐시 시스템은 일치하는 캐시 항목을 찾기 위해 정해진 검색 순서를 따릅니다. 캐시 키는 자동 생성되거나(`eas/restore_build_cache` 또는 `eas/save_build_cache` 사용 시), `key` 매개변수로 명시적으로 제공됩니다(`eas/restore_cache` 또는 `eas/save_cache` 사용 시).

검색 순서는 다음과 같습니다:

1.  **정확한 일치**: 먼저 캐시 키와 정확히 일치하는 항목을 찾습니다(자동 생성 또는 명시적 지정).
2.  **Restore keys**: 정확히 일치하는 항목이 없으면 `restore_keys`를 순서대로 확인하여 가장 최근의 prefix 일치를 찾습니다.

제공한 `key`와 정확히 일치하는 항목이 있으면 직접적인 캐시 적중으로 간주되어 즉시 캐시를 복원합니다. 부분 일치나 `restore_keys`를 통한 일치인 경우에도 캐시는 복원되지만, 효율은 다소 떨어질 수 있습니다.

#### Restore keys 사용하기

> **참고:** Restore key 매칭은 캐시 시스템이 자동으로 처리하므로 수동 설정이 필요하지 않습니다. 여기서는 기대되는 동작을 설명하기 위한 참고입니다.

restore key `android-ccache-`는 `android-ccache-` 문자열로 시작하는 모든 키와 일치합니다. 예를 들어 `android-ccache-fd3052de`와 `android-ccache-a9b253ff` 모두 이 restore key와 일치합니다. 이 경우 가장 최근에 생성된 캐시가 사용됩니다. 이 예시의 키들은 다음 순서로 검색됩니다:

1.  **`android-ccache-${{ hashFiles('yarn.lock') }}`** 는 특정 해시와 일치합니다.
2.  **`android-ccache-`** 는 `android-ccache-` prefix를 가진 캐시 키와 일치합니다.
3.  **`android-`** 는 `android-` prefix를 가진 모든 키와 일치합니다.

### 캐시 제한

접근 제한은 서로 다른 Git branch나 사용자 사이에 논리적 경계를 만들어 캐시 격리와 보안을 제공합니다. 앱과 사용자 보안을 위해 이 동작을 이해하고 활용하는 것이 중요합니다.

#### GitHub 실행

빌드가 GitHub에서 실행되면 캐시는 해당 빌드가 실행 중인 branch 범위로 제한됩니다. 빌드는 다음 위치에서 생성된 캐시를 복원할 수 있습니다:

-   현재 branch
-   기본 branch(`main` 또는 `master`)

#### EAS CLI 실행

빌드가 `eas-cli`에서 트리거되면 캐시는 빌드를 실행한 사용자 범위로 제한됩니다. 이렇게 사용자 범위로 격리된 캐시는 개발 중 또는 사용자 간에 빌드와 캐시 수정 사항이 의도치 않게 공유되지 않도록 해줍니다.

#### 기본 branch 캐시

빌드가 사용자 범위 캐시를 복원하지 못하면, GitHub 빌드가 기본 branch에서 생성한 캐시로 자동 폴백합니다. 이렇게 하면 사용자 범위 캐시가 아직 없더라도 신뢰할 수 있는 출처가 만든 캐시를 활용할 수 있습니다.

#### 공유 사용자 동작

하나의 사용자 주체가 여러 사람 사이에서 공유되는 경우(예: access token 사용 또는 GitHub Actions에서 빌드 트리거)에도 사용자 범위 캐시 규칙은 그대로 적용됩니다. 즉, 그 공유 계정 아래에서 동작하는 빌드는 더 이상 격리된 캐시를 갖지 않으며 의도치 않은 아티팩트를 공유할 위험이 있습니다. 이를 피하기 위해 공유 사용자를 이용하는 production build에서는 캐시를 복원하지 않고, 깨끗한 새 캐시만 저장하도록 지정된 작업을 두는 것을 권장합니다.

### 캐시 생성을 위한 지정 작업

캐시 복원을 비활성화하고 저장만 수행하도록 구성하면 깨끗한 새 캐시를 게시하는 작업을 만들 수 있습니다.

**Production build에서 캐시 복원 비활성화하기:**

다음 환경 변수를 구성해 특정 build profile에서 캐시 복원을 비활성화할 수 있습니다:

```json
{
  "build": {
    "production": {
      "env": {
        "EAS_RESTORE_CACHE": "0",
        "EAS_SAVE_CACHE": "1"
      }
    },
    "preview": {
      "env": {
        "EAS_USE_CACHE": "1"
      }
    }
  }
}
```

**지정된 작업에서만 캐시 저장하기:**

신뢰할 수 있는 출처만 캐시를 게시하도록 하려면, main branch의 특정 작업에서만 캐시를 저장하는 workflow를 구성할 수 있습니다.

```yaml
jobs:
  build_production:
    type: build
    if: ${{ github.ref_name == 'main' }}
    env:
      EAS_RESTORE_CACHE: '0'
      EAS_SAVE_CACHE: '1'
    params:
      platform: android
      profile: production
```

> **참고:** `EAS_SAVE_CACHE: '1'`을 설정해도 이 작업만 독점적으로 캐시를 저장하게 되는 것은 아닙니다. 같은 환경 변수를 사용하는 다른 작업도 캐시를 저장하고 덮어쓸 수 있습니다.

## iOS 의존성

EAS Build는 대부분의 CocoaPods 아티팩트를 캐시 서버에서 제공합니다. 이는 `pod install` 시간의 일관성을 높이고 전반적인 속도 향상에도 도움이 됩니다. 자체 **.netrc** 또는 **.curlrc** 파일을 제공하는 경우에는 이 캐시가 자동으로 우회됩니다.

빌드에서 CocoaPods 캐시 서버 사용을 비활성화하려면 **eas.json**에서 `EAS_BUILD_DISABLE_COCOAPODS_CACHE` 환경 변수 값을 `"1"`로 설정하세요.

```json
{
  "build": {
    "production": {
      "env": {
        "EAS_BUILD_DISABLE_COCOAPODS_CACHE": "1"
        ... 
      }
      ... 
    }
    ... 
  }
  ... 
}
```

[prebuild](/more/glossary-of-terms#prebuild)를 사용해 **ios** 디렉터리를 [빌드 시 원격으로 생성](/build-reference/ios-builds)하는 경우, 일반적으로 프로젝트의 **Podfile.lock**을 소스 제어에 커밋하지 않습니다. 결정적 빌드를 위해 **Podfile.lock**을 캐시하는 것이 유용할 수 있지만, 이 경우 로컬 개발에서는 lockfile을 사용하지 않기 때문에 언제 변경이 필요한지 판단하고 특정 의존성을 업데이트하는 능력이 제한되는 트레이드오프가 있습니다. 이 파일을 캐시하면 가끔 캐시를 비워야 해결되는 빌드 오류가 발생할 수 있습니다. **Podfile.lock**을 캐시하려면 **eas.json**의 build profile에서 `cache.paths` 목록에 **./ios/Podfile.lock**을 추가하세요.

```json
{
  "build": {
    "production": {
      "cache": {
        "paths": ["./ios/Podfile.lock"]
        ... 
      }
      ... 
    }
    ... 
  }
  ... 
}
```
