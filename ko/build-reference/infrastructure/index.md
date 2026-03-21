---
modificationDate: September 17th, 2025
title: 빌드 서버 인프라
description: EAS를 사용할 때의 현재 빌드 서버 인프라를 알아보세요.
---

# 빌드 서버 인프라

EAS를 사용할 때의 현재 빌드 서버 인프라를 알아보세요.

## Builder IP 주소

빌드 서버 IP 주소 목록은 [이 파일](https://expo.dev/eas-build-worker-ips.txt)에서 확인할 수 있습니다. 이 목록은 자주 바뀌지 않을 것으로 예상합니다. 목록에는 각각 마지막 갱신 시점과, 해당 시점까지 목록이 바뀌지 않겠다고 약속하는 만료 시점을 나타내는 "Last-Modified" 및 "Expires" ISO 8601 타임스탬프가 포함됩니다.

Linux runner는 Google Cloud Platform에 호스팅됩니다. macOS runner는 자체 macOS 클라우드에 호스팅됩니다.

## 빌드 환경 구성하기

각 플랫폼용 이미지는 특정 버전의 Node.js, Yarn, CocoaPods, Xcode, Ruby, Fastlane 등을 포함합니다. 일부 버전은 [eas.json](/build/eas-json)에서 재정의할 수 있습니다. 원하는 전용 구성 옵션이 없다면 [npm hooks](/build-reference/npm-hooks)를 사용해 `apt-get`이나 `brew`로 시스템 의존성을 설치하거나 업데이트할 수 있습니다. 단, 이런 사용자 정의는 빌드 중에 적용되므로 빌드 시간이 증가합니다.

빌드용 이미지를 선택할 때는 아래에 제공된 전체 이름을 쓰거나 `auto`, `latest`, 특정 SDK용 `sdk-55` 같은 alias를 사용할 수 있습니다.

-   특정 이름을 사용하면 소규모 업데이트만 반영된 일관된 환경을 보장할 수 있습니다.
-   `auto` alias를 사용하면 프로젝트 구성, Expo SDK 버전, React Native 버전에 따라 빌드 이미지가 선택됩니다. 어떤 이미지가 사용되었는지는 **Spin up build environment** 빌드 로그 섹션에서 확인할 수 있습니다.
-   `latest` alias는 가장 최신 소프트웨어 버전을 가진 이미지에 할당됩니다.
-   `sdk-55` alias는 SDK 55 빌드에 가장 적합한 이미지에 할당됩니다.
-   `sdk-54` alias는 SDK 54 빌드에 가장 적합한 이미지에 할당됩니다.
-   `sdk-53` alias는 SDK 53 빌드에 가장 적합한 이미지에 할당됩니다.
-   `sdk-52` alias는 SDK 52 빌드에 가장 적합한 이미지에 할당됩니다.
-   SDK alias는 새 SDK가 릴리스될 때마다 업데이트됩니다.
-   `latest` alias는 새 이미지 릴리스마다 업데이트됩니다.

> **참고:** **eas.json**에 `image`를 지정하지 않으면 기본적으로 `auto` alias가 사용됩니다.

## Android 빌드 서버 구성

Android builder는 격리된 환경의 가상 머신에서 실행됩니다. 모든 빌드는 전용 VM 인스턴스를 하나씩 사용합니다.

-   빌드 리소스:
    
    -   [medium](/eas/json#resourceclass-1): 4 vCPUs, 16 GB RAM (프로젝트 설정의 "New Android Builds Infrastructure" 설정에 따라 [n2-standard-4](https://cloud.google.com/compute/docs/general-purpose-machines#n2_machine_types) 또는 [c3d-standard-4](https://cloud.google.com/compute/docs/general-purpose-machines#c3d_machine_types) (기본값) Google Cloud 머신 타입)
    -   [large](/eas/json#resourceclass-1): 8 vCPUs, 32 GB RAM (프로젝트 설정의 "New Android Builds Infrastructure" 설정에 따라 [n2-standard-8](https://cloud.google.com/compute/docs/general-purpose-machines#n2_machine_types) 또는 [c3d-standard-8](https://cloud.google.com/compute/docs/general-purpose-machines#c3d_machine_types) (기본값) Google Cloud 머신 타입)
-   [Kubernetes에 배포된 npm cache](/build-reference/caching#javascript-dependencies)
    
-   [Kubernetes에 배포된 Maven cache](/build-reference/caching#android-dependencies)
    
-   **~/.gradle/gradle.properties**의 전역 Gradle 구성:
    
    ```ini
    org.gradle.jvmargs=-Xmx14g -XX:MaxPermSize=512m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8
    org.gradle.parallel=true
    org.gradle.configureondemand=true
    org.gradle.daemon=false
    ```
    
-   **~/.npmrc**의 전역 npm 구성:
    
    ```ini
    registry=http://npm.production.caches.eas-build.internal
    ```
    
-   **~/.yarnrc.yml**의 전역 Yarn 구성:
    
    ```yaml
    unsafeHttpWhitelist:
      - '*'
    npmRegistryServer: 'http://npm.production.caches.eas-build.internal'
    enableImmutableInstalls: false
    ```
    

### Android 서버 이미지

#### `ubuntu-24.04-jdk-17-ndk-r27b-sdk-55` (`latest`, `sdk-55`)

Details

-   GCE image: `ubuntu-2404-noble-amd64-v20260128`
-   NDK 27.1.12297006
-   Node.js 20.19.4
-   Bun 1.3.8
-   Yarn 1.22.22
-   pnpm 10.28.2
-   npm 10.9.3
-   Java 17
-   node-gyp 12.2.0
-   Maestro 2.1.0

#### `ubuntu-24.04-jdk-17-ndk-r27b` (`sdk-54`)

Details

-   GCE image: `ubuntu-2404-noble-amd64-v20250805`
-   NDK 27.1.12297006
-   Node.js 20.19.4
-   Bun 1.2.20
-   Yarn 1.22.22
-   pnpm 10.14.0
-   npm 10.9.3
-   Java 17
-   node-gyp 11.3.0
-   Maestro 2.0.2

#### `ubuntu-22.04-jdk-17-ndk-r26b` (`sdk-53`)

Details

-   Docker image: `ubuntu:jammy-v20250112`
-   NDK 26.1.10909125
-   Node.js 20.19.2
-   Bun 1.2.4
-   Yarn 1.22.22
-   pnpm 9.15.5
-   npm 10.8.2
-   Java 17
-   node-gyp 11.1.0

#### Legacy `ubuntu-22.04-jdk-17-ndk-r26b`-like (`sdk-51`, `sdk-52`)

Details

-   Docker image: `ubuntu:jammy-v20250112`
-   NDK 26.1.10909125
-   Node.js 20.18.3
-   Bun 1.2.4
-   Yarn 1.22.22
-   pnpm 9.15.5
-   npm 10.8.2
-   Java 17
-   node-gyp 11.1.0

#### `ubuntu-22.04-jdk-17-ndk-r25b` (`sdk-50`)

Details

-   Docker image: `ubuntu:jammy-20220810`
-   NDK 25.1.8937393
-   Node.js 18.18.0
-   Bun 1.0.14
-   Yarn 1.22.19
-   pnpm 8.9.2
-   npm 9.8.1
-   Java 17
-   node-gyp 10.0.1

#### `ubuntu-22.04-jdk-11-ndk-r23b` (`sdk-49`)

Details

-   Docker image: `ubuntu:jammy-20220810`
-   NDK 23.1.7779620
-   Node.js 18.18.0
-   Bun 1.0.14
-   Yarn 1.22.19
-   pnpm 8.7.5
-   npm 9.8.1
-   Java 11
-   node-gyp 10.0.1

#### `ubuntu-22.04-jdk-17-ndk-r21e`

Details

-   Docker image: `ubuntu:jammy-20220810`
-   NDK 21.4.7075529
-   Node.js 18.18.0
-   Bun 1.0.14
-   Yarn 1.22.19
-   pnpm 8.9.2
-   npm 9.8.1
-   Java 17
-   node-gyp 10.0.1

#### `ubuntu-22.04-jdk-11-ndk-r21e`

Details

-   Docker image: `ubuntu:jammy-20220810`
-   NDK 21.4.7075529
-   Node.js 18.18.0
-   Bun 1.0.14
-   Yarn 1.22.19
-   pnpm 8.7.5
-   npm 9.8.1
-   Java 11
-   node-gyp 10.0.1

#### `ubuntu-22.04-jdk-8-ndk-r21e` (deprecated)

Details

-   Docker image: `ubuntu:jammy-20220810`
-   NDK 21.4.7075529
-   Node.js 18.18.0
-   Bun 1.0.14
-   Yarn 1.22.19
-   pnpm 7.0.0
-   npm 9.8.1
-   Java 8
-   node-gyp 10.0.1

#### `ubuntu-20.04-jdk-11-ndk-r23b` (deprecated)

Details

-   Docker image: `ubuntu:focal-20220823`
-   NDK 23.1.7779620
-   Node.js 18.18.0
-   Bun 1.0.14
-   Yarn 1.22.19
-   pnpm 7.0.0
-   npm 9.8.1
-   Java 11
-   node-gyp 10.0.1

#### `ubuntu-20.04-jdk-11-ndk-r21e` (deprecated)

Details

-   Docker image: `ubuntu:focal-20220823`
-   NDK 21.4.7075529
-   Node.js 18.18.0
-   Bun 1.0.14
-   Yarn 1.22.19
-   pnpm 7.0.0
-   npm 9.8.1
-   Java 11
-   node-gyp 10.0.1

#### `ubuntu-20.04-jdk-8-ndk-r21e` (deprecated)

Details

-   Docker image: `ubuntu:focal-20220823`
-   NDK 21.4.7075529
-   Node.js 18.18.0
-   Bun 1.0.14
-   Yarn 1.22.19
-   pnpm 7.0.0
-   npm 9.8.1
-   Java 8
-   node-gyp 10.0.1

#### `ubuntu-20.04-jdk-11-ndk-r19c` (deprecated)

Details

-   Docker image: `ubuntu:focal-20220823`
-   NDK 19.2.5345600
-   Node.js 18.18.0
-   Bun 1.0.14
-   Yarn 1.22.19
-   pnpm 7.0.0
-   npm 9.8.1
-   Java 11
-   node-gyp 10.0.1

#### `ubuntu-20.04-jdk-8-ndk-r19c` (deprecated)

Details

-   Docker image: `ubuntu:focal-20220823`
-   NDK 19.2.5345600
-   Node.js 18.18.0
-   Bun 1.0.14
-   Yarn 1.22.19
-   pnpm 7.0.0
-   npm 9.8.1
-   Java 8
-   node-gyp 10.0.1

## iOS 빌드 서버 구성

iOS builder VM은 격리된 환경의 Mac mini 호스트에서 실행됩니다. 모든 빌드는 새 macOS VM을 하나씩 사용합니다. 자세한 내용은 [iOS 전용 resource class](/eas/json#resourceclass-2)를 참고하세요.

-   빌드 리소스:
    
    -   [medium](/eas/json#resourceclass-2): 5 performance cores, 20 GiB RAM, 110 GB SSD
    -   [large](/eas/json#resourceclass-2): 10 performance cores, 40 GiB RAM, 110 GB SSD
-   [npm cache](/build-reference/caching#javascript-dependencies)
    
-   [CocoaPods cache](/build-reference/caching#ios-dependencies)
    
-   [`cocoapods-nexus-plugin`](https://github.com/expo/eas-build/tree/main/packages/cocoapods-nexus-plugin)
    
-   **~/.npmrc**의 전역 npm 구성:
    
    ```ini
    registry=http://npm.caches.eas-build.internal
    ```
    
-   **~/.yarnrc.yml**의 전역 Yarn 구성:
    
    ```yaml
    unsafeHttpWhitelist:
      - '*'
    npmRegistryServer: 'http://npm.caches.eas-build.internal'
    enableImmutableInstalls: false
    ```
    

### iOS 서버 이미지

#### `macos-sequoia-15.6-xcode-26.2` (`latest`, `sdk-55`)

Details

-   macOS Sequoia 15.6.1
-   Xcode 26.2 (17C52)
-   Node.js 20.19.4
-   Bun 1.3.8
-   Yarn 1.22.22
-   pnpm 10.28.2
-   npm 10.9.3
-   fastlane 2.231.1
-   CocoaPods 1.16.2
-   Ruby 3.2
-   node-gyp 12.2.0
-   Maestro 2.1.0

#### `macos-sequoia-15.6-xcode-26.1`

Details

-   macOS Sequoia 15.6.1
-   Xcode 26.1 (17B55)
-   Node.js 20.19.4
-   Bun 1.3.1
-   Yarn 1.22.22
-   pnpm 10.20.0
-   npm 10.9.3
-   fastlane 2.228.0
-   CocoaPods 1.16.2
-   Ruby 3.2
-   node-gyp 11.5.0
-   Maestro 2.0.9

#### `macos-sequoia-15.6-xcode-26.0` (`sdk-54`, `macos-sequoia-15.5-xcode-26.0`)

Details

-   macOS Sequoia 15.6
-   Xcode 26.0 (17A324)
-   Node.js 20.19.4
-   Bun 1.2.22
-   Yarn 1.22.22
-   pnpm 10.16.1
-   npm 10.9.3
-   fastlane 2.228.0
-   CocoaPods 1.16.2
-   Ruby 3.2
-   node-gyp 11.4.2
-   jq 1.8.0
-   Azul Zulu JDK 17.58.21 (OpenJDK 17.0.15)
-   Git 2.49.0
-   Git LFS 3.6.1
-   applesimutils 0.9.12
-   idb-companion 1.1.8
-   Maestro 2.0.3

#### `macos-sequoia-15.6-xcode-16.4` (recommended for SDK 54 if you don't want to use Xcode 26)

Details

-   macOS Sequoia 15.6
-   Xcode 16.4 (16F6)
-   Node.js 20.19.4
-   Bun 1.2.20
-   Yarn 1.22.22
-   pnpm 10.14.0
-   npm 10.9.3
-   fastlane 2.228.0
-   CocoaPods 1.16.2
-   Ruby 3.2
-   node-gyp 11.3.0
-   Maestro 1.41.0
-   jq 1.8.0
-   Azul Zulu JDK 17.58.21 (OpenJDK 17.0.15)
-   Git 2.49.0
-   Git LFS 3.6.1
-   applesimutils 0.9.10
-   idb-companion 1.1.8

#### `macos-sequoia-15.5-xcode-16.4` (`sdk-53`)

Details

-   macOS Sequoia 15.5
-   Xcode 16.4 (16E140)
-   Node.js 20.19.2
-   Bun 1.2.15
-   Yarn 1.22.22
-   pnpm 9.15.9
-   npm 10.8.2
-   fastlane 2.227.1
-   CocoaPods 1.16.2
-   Ruby 3.2
-   node-gyp 11.2.0
-   jq 1.8.0
-   Azul Zulu JDK 17.58.21 (OpenJDK 17.0.15)
-   Git 2.49.0
-   Git LFS 3.6.1
-   applesimutils 0.9.10
-   idb-companion 1.1.8

#### `macos-sequoia-15.4-xcode-16.3`

Details

-   macOS Sequoia 15.4.1
-   Xcode 16.3 (16E140)
-   Node.js 20.19.1
-   Bun 1.2.11
-   Yarn 1.22.22
-   pnpm 9.15.9
-   npm 9.8.1
-   fastlane 2.227.1
-   CocoaPods 1.16.2
-   Ruby 3.2
-   node-gyp 11.2.0
-   jq 1.7.1
-   Azul Zulu JDK 17.58.21 (OpenJDK 17.0.15)
-   Git 2.49.0
-   Git LFS 3.6.1
-   applesimutils 0.9.10
-   idb-companion 1.1.8

#### `macos-sequoia-15.3-xcode-16.2` (`sdk-52`)

Details

-   macOS Sequoia 15.3
-   Xcode 16.2 (16C5032a)
-   Node.js 20.18.3
-   Bun 1.2.4
-   Yarn 1.22.22
-   pnpm 9.15.5
-   npm 9.8.1
-   fastlane 2.226.0
-   CocoaPods 1.16.2
-   Ruby 3.2
-   node-gyp 11.1.0

#### `macos-sonoma-14.6-xcode-16.1`

Details

-   macOS Sonoma 14.6
-   Xcode 16.1 (16B40)
-   Node.js 18.18.0
-   Bun 1.1.33
-   Yarn 1.22.21
-   pnpm 9.12.3
-   npm 9.8.1
-   fastlane 2.225.0
-   CocoaPods 1.16.2
-   Ruby 3.2
-   node-gyp 10.2.0

#### `macos-sonoma-14.6-xcode-16.0`

Details

-   macOS Sonoma 14.6
-   Xcode 16.0 (16A242d)
-   Node.js 18.18.0
-   Bun 1.1.27
-   Yarn 1.22.21
-   pnpm 9.10.0
-   npm 9.8.1
-   fastlane 2.222.0
-   CocoaPods 1.15.2
-   Ruby 3.2
-   node-gyp 10.2.0

#### `macos-sonoma-14.5-xcode-15.4` (`sdk-51`, `sdk-50`, `sdk-49`)

Details

-   macOS Sonoma 14.5
-   Xcode 15.4 (15F31d)
-   Node.js 18.18.0
-   Bun 1.1.13
-   Yarn 1.22.21
-   pnpm 9.3.0
-   npm 9.8.1
-   fastlane 2.220.0
-   CocoaPods 1.14.3
-   Ruby 2.7
-   node-gyp 10.1.0

#### `macos-sonoma-14.4-xcode-15.3`

Details

-   macOS Sonoma 14.4.1
-   Xcode 15.3 (15E204a)
-   Node.js 18.18.0
-   Bun 1.0.35
-   Yarn 1.22.21
-   pnpm 8.14.1
-   npm 9.8.1
-   fastlane 2.219.0
-   CocoaPods 1.14.3
-   Ruby 2.7
-   node-gyp 10.0.1

#### `macos-ventura-13.6-xcode-15.2`

Details

-   macOS Ventura 13.6
-   Xcode 15.2 (15C500b)
-   Node.js 18.18.0
-   Bun 1.0.23
-   Yarn 1.22.21
-   pnpm 8.14.1
-   npm 9.8.1
-   fastlane 2.219.0
-   CocoaPods 1.14.3
-   Ruby 2.7
-   node-gyp 10.0.1

#### `macos-ventura-13.6-xcode-15.1`

Details

-   macOS Ventura 13.6
-   Xcode 15.1 (15C65)
-   Node.js 18.18.0
-   Bun 1.0.14
-   Yarn 1.22.19
-   pnpm 8.12.1
-   npm 9.8.1
-   fastlane 2.217.0
-   CocoaPods 1.14.3
-   Ruby 2.7
-   node-gyp 10.0.1

#### `macos-ventura-13.6-xcode-15.0`

Details

-   macOS Ventura 13.6
-   Xcode 15.0 (15A240d)
-   Node.js 18.18.0
-   Bun 1.0.14
-   Yarn 1.22.19
-   pnpm 8.7.6
-   npm 9.8.1
-   fastlane 2.216.0
-   CocoaPods 1.13.0
-   Ruby 2.7
-   node-gyp 10.0.1

### 지원되는 Xcode 버전

우리는 빌드 프로세스에서 사용했을 때 App Store Connect에 앱을 제출할 수 있게 해 주는 모든 안정적인 Xcode 릴리스를 지원하는 것을 목표로 합니다.

이는 일반적으로 최신 안정 버전 Xcode와 그 직전 버전(Apple이 새로운 [최소 Xcode 버전 요구 사항](https://developer.apple.com/news/upcoming-requirements/?id=04292024a)을 도입하기 전까지)을 지원한다는 뜻입니다.
