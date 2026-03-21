---
modificationDate: August 26, 2025
title: EAS Build 제한 사항
description: EAS Build의 현재 제한 사항을 알아보세요.
---

# EAS Build 제한 사항

EAS Build의 현재 제한 사항을 알아보세요.

EAS Build는 모든 React Native 프로젝트에서 작동하도록 설계되었습니다. 하지만 해결할 계획이 있는 몇 가지 제한 사항을 알고 있는 것이 좋습니다. 이러한 제한은 애플리케이션에서 서비스를 사용하지 못하게 하거나 불편을 초래할 수 있습니다.

## 빌드 워커 서버의 고정된 메모리 및 CPU 제한

빌드 프로세스에 많은 메모리가 필요하다면 사용 가능한 리소스가 앱을 빌드하기에 부족할 수 있습니다. 이 경우 **eas.json**에서 [`large` resource class](/eas/json#resourceclass)를 사용하는 것을 고려하세요. [Android 전용 resource class](/build-reference/infrastructure#android-build-server-configurations)와 [iOS 전용 resource class](/build-reference/infrastructure#ios-build-server-configurations)를 참고하세요.

자세한 내용은 [서버 인프라 레퍼런스](/build-reference/infrastructure)를 참고하세요. 이 문서에는 현재 Android(Ubuntu) 및 iOS(macOS) 빌드 서버의 최신 사양 정보가 들어 있습니다.

## 제한적인 의존성 캐싱

Android용 빌드 작업은 로컬 캐시에서 npm과 Maven 의존성을 설치합니다. iOS용 빌드 작업은 로컬 캐시에서 npm 의존성을 설치하고, cache server에서 CocoaPods 아티팩트를 설치합니다.

**node_modules** 디렉터리 같은 중간 아티팩트는(**package-lock.json**이나 **yarn.lock** 기반으로) 캐시되거나 복원되지 않습니다. 다만 이를 Git 저장소에 커밋하면 빌드 서버로 업로드됩니다.

자세한 내용은 [의존성 캐싱](/build-reference/caching)을 참고하세요.

## 최대 빌드 시간 2시간

빌드가 2시간보다 오래 걸리면 취소됩니다. 무료 플랜에서는 이 제한이 더 낮으며, 앞으로 변경될 수 있습니다.

## 계정당 플랫폼별 대기 중 빌드 최대 50개

특정 플랫폼에서 대기 중인 빌드가 50개를 넘으면, 대기 중인 빌드 수가 제한 아래로 내려갈 때까지 새 빌드는 거부됩니다.

## 워크스페이스를 지원하는 패키지 관리자는 특별한 설정이 필요할 수 있습니다

> **참고:** Bun, npm, pnpm, Yarn 이외의 패키지 관리자에 대한 공식 가이드는 제한적입니다.

EAS Build는 워크스페이스를 지원하는 패키지 관리자로 관리되는 모노레포를 지원합니다. 하지만 서드파티 모노레포 또는 워크스페이스 도구는 예상대로 동작하지 않거나 추가 설정이 필요할 수 있습니다. 모노레포와 워크스페이스를 설정하고 구성할 때는 복잡성이 증가하는 것이 일반적입니다. 설정하기 전에 사용하는 도구와 라이브러리가 모노레포 내에서 잘 동작하는지 확인하세요. [모노레포로 작업하기](/guides/monorepos)를 참고하세요.

## 변경 사항 알림 받기

이 항목들의 진행 상황에 대한 알림을 받고 싶다면 [expo.dev/eas](https://expo.dev/eas)에서 EAS 뉴스레터를 구독할 수 있습니다.
