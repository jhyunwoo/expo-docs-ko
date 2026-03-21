---
modificationDate: January 29, 2026
title: 검토용 앱 배포 개요
description: 앱 스토어, internal distribution, EAS Update를 사용해 검토용으로 앱을 배포하는 방법을 알아보세요.
---

# 검토용 앱 배포 개요

앱 스토어, internal distribution, EAS Update를 사용해 검토용으로 앱을 배포하는 방법을 알아보세요.

이 페이지는 QA와 리뷰를 위해 앱의 preview 버전을 팀과 공유하는 세 가지 접근 방식을 설명합니다: 앱 스토어 테스트 트랙, internal distribution, 그리고 EAS Update를 사용하는 development build입니다.

릴리스 검토에 Expo Go를 사용할 수 있나요?

Expo Go는 학생과 학습자를 위한 playground이지, 프로덕션급 프로젝트를 만들기 위한 도구가 아닙니다. 앱의 리뷰 프로세스에는 유용하지 않습니다.

## App store testing tracks

앱 스토어 테스트 트랙을 통해 앱을 배포할 때는 release build만 사용할 수 있습니다. 이 방법으로는 development build를 배포할 수 없습니다. 대안으로는 release build와 development build 모두에서 동작하는 ["Internal distribution"](/review/overview#internal-distribution-with-eas-build)을 사용할 수 있습니다.

Android: Google Play Beta

정식 공개 릴리스 전에 [Google Play beta](https://support.google.com/googleplay/android-developer/answer/9845334?visit_id=638740965629093187-3840249980&rd=1)는 앱을 테스터에게 배포하는 또 다른 방법입니다. internal, closed, open 테스트 트랙 중 하나를 설정하고 앱에 접근할 수 있는 대상을 제어할 수 있습니다.

각 테스트 트랙에는 고유한 요구 사항이 있습니다. internal 트랙에서는 최대 100명의 테스터만 초대할 수 있습니다. closed와 open 트랙은 둘 다 더 큰 규모의 테스터 그룹을 지원합니다. closed 트랙에서는 테스터를 초대해야 하고, open 트랙에서는 누구나 프로그램에 참여할 수 있습니다.

Google Play beta를 사용하려면 앱을 AAB(Android App Bundle) 형식으로 Google Play Console에 업로드하고, 테스트 트랙을 설정한 뒤, 이메일이나 공유 가능한 링크를 통해 사용자를 초대해야 합니다. 테스터는 Play Store를 통해 앱을 설치할 수 있으며, Google Play Console에서 직접 피드백과 crash report를 수집할 수 있습니다.

iOS: TestFlight

TestFlight는 iOS 디바이스에 앱을 배포하는 또 다른 방법입니다. TestFlight 역시 유료 Apple Developer 계정을 요구합니다. TestFlight의 internal testing 옵션을 사용하면 Apple Developer 계정 팀 멤버 최대 100명까지 포함하는 테스트 그룹을 만들 수 있으며, 이들은 TestFlight 앱을 통해 앱을 다운로드합니다. 어떤 팀은 새 테스터를 추가할 때 새 빌드가 필요 없고 앱이 자동으로 업데이트되기 때문에 TestFlight를 선호합니다.

TestFlight에는 이메일 또는 공개 링크를 통해 최대 10,000명의 사용자와 앱을 공유할 수 있는 external testing 옵션도 있습니다.

TestFlight의 internal test 배포와 external test 배포 모두, 빌드를 공유하기 전에 앱을 [업로드](/submit/ios)하고 자동 검토를 기다려야 합니다. 다만 external test build는 배포 전에 더 정식의 App Store 검토(프로덕션 릴리스 전에 앱이 거쳐야 하는 검토와는 별개)를 추가로 통과해야 합니다.

[EAS Submit](/submit/introduction) — 앱을 앱 스토어 테스트 및 릴리스 트랙에 업로드하는 방법을 알아보세요.

## Internal distribution with EAS Build

[Internal distribution](/build/internal-distribution)은 EAS가 제공하는 기능으로, 개발자가 빌드를 만들고 URL로 쉽게 공유할 수 있게 해줍니다. 이 URL은 디바이스에서 열어 앱을 설치할 수 있습니다. 앱은 Android에서는 설치 가능한 APK로, iOS에서는 ad hoc provisioning된 앱으로 제공됩니다.

internal distribution build가 만들어지는 즉시 다운로드하고 설치할 수 있습니다. 어떤 양식도 작성하거나 승인/처리를 기다릴 필요가 없습니다. internal distribution을 사용하면 release build와 development build를 모두 공유할 수 있습니다.

[How to set up an internal distribution build](/build/internal-distribution) — EAS Build가 팀과 내부 배포를 위해 빌드를 공유 가능한 URL로 제공하는 방법을 알아보세요.

## Development builds and EAS Update

[development builds](/develop/development-builds/introduction)를 사용하면 [EAS Update](/eas-update/introduction)로 update를 게시해 리뷰 단계에서 앱 preview를 불러올 수 있습니다. internal distribution으로 development build를 공유해 설치한 뒤에는, 설치된 build와 호환되기만 하면 EAS Update로 게시한 어떤 update든 실행할 수 있습니다. [Runtime versions and updates](/eas-update/runtime-versions)에서 자세히 알아보세요.

EAS dashboard를 사용해 updates를 실행하고 특정 update에 대한 링크를 공유할 수 있습니다.

development build 내부에서 직접 updates를 탐색하고 실행할 수 있습니다.

PR과 commit에서 자동으로 updates를 게시하도록 GitHub Actions를 구성할 수 있습니다.

이 접근 방식은 `eas update`를 실행할 수 있는 속도만큼 빠르게 피드백에 대응할 수 있게 해주기 때문에 특히 강력합니다. 앱을 다시 빌드하거나 스토어 테스트 트랙에 업로드하지 않고도, 몇 초 만에 팀과 앱의 새 버전을 공유할 수 있습니다.

[Get started with EAS Update](/eas-update/getting-started) — expo-updates 라이브러리 사용을 시작하고 프로젝트에서 EAS Update를 사용하는 방법을 알아보세요. — expo-updates

[Use GitHub Actions](/eas-update/github-actions) — EAS Update로 updates를 게시하는 과정을 자동화하기 위해 GitHub Actions를 사용하는 방법을 알아보세요. 또한 updates 배포를 일관되고 빠르게 만들어 앱 개발에 더 많은 시간을 쓸 수 있게 해줍니다.

[Use expo-dev-client with EAS Update](/eas-update/expo-dev-client) — expo-dev-client — 프로젝트에서 expo-dev-client를 사용해 서로 다른 앱 버전을 실행하고 development build 안에서 게시된 update를 미리 보는 방법을 알아보세요. — expo-dev-client
