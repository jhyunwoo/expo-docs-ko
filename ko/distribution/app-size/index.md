---
modificationDate: May 07, 2025
title: 앱 크기 이해하기
description: 사용자에게 배포될 때 앱의 실제 크기가 얼마나 되는지 판단하는 방법과, 앱 크기에 대한 인사이트를 얻고 최적화하는 방법을 알아보세요.
---

# 앱 크기 이해하기

사용자에게 배포될 때 앱의 실제 크기가 얼마나 되는지 판단하는 방법과, 앱 크기에 대한 인사이트를 얻고 최적화하는 방법을 알아보세요.

개발자들이 흔히 갖는 걱정 중 하나는 앱이 app store에서 얼마나 많은 공간을 차지하는가입니다. 이 가이드는 다음 내용을 이해하는 데 도움을 줍니다:

-   서로 다른 build artifact가 어떤 용도로 사용되는지 이해하기
-   사용자에게 배포될 때 앱의 실제 크기 파악하기
-   앱 크기에 대한 인사이트를 얻고 최적화하기

## 왜 내 앱은 이렇게 큰가요?

**실제로는 아마 그렇지 않을 가능성이 큽니다!** 앱의 release build 결과물 artifact를 살펴볼 때, 네이티브 Android 및 iOS 개발에 익숙하지 않은 개발자들은 파일 크기에 놀라는 경우가 많습니다. 보통 app store에서 다운로드한다고 생각하는 앱보다 훨씬 크게 보이기 때문입니다. **하지만 이것은 app store에 배포될 실제 앱 크기가 아닙니다!** 사람들이 앱 크기를 이야기할 때는 app store에 업로드하거나 development 및 테스트 용도로 공유하는 파일 크기가 아니라, 사용자가 자신의 기기로 다운로드하게 될 앱의 크기를 의미합니다.

서로 다른 목적을 가진 여러 종류의 build artifact가 있으며, 이들 거의 모두는 사용자가 store에서 앱을 다운로드할 때 보게 되는 크기보다 큽니다. 이는 이러한 build들이 store에서 다운로드할 때처럼 특정 기기에 맞게 최적화된 것이 아니라, 일반적으로 앱이 다양한 기기에서 실행되도록 필요한 모든 코드와 리소스를 포함하기 때문입니다.

## Android 앱

Android build artifact에는 APK와 AAB 두 가지가 있습니다.

### `.apk` (Android Package)

React Native 프로젝트에서 Gradle로 APK를 빌드할 때 기본 동작은 universal binary를 만드는 것입니다. 여기에는 앱이 지원하는 모든 종류의 기기에 필요한 모든 리소스가 포함됩니다. 예를 들어 모든 화면 크기, 모든 CPU 아키텍처, 모든 언어용 asset이 들어 있으며, 실제로 하나의 기기는 각각 한 종류만 필요로 합니다. 이 말은, 예를 들어 [Orbit](https://expo.dev/orbit)이나 `adb`를 직접 사용해 이 파일 하나를 누구에게나 공유하여 기기에 설치할 수 있고, 그대로 동작한다는 뜻입니다.

물론 수백만 명의 사용자를 상대하는 매우 인기 있는 app store를 운영한다면, 모든 사용자에게 같은 50 MB 파일을 보내고 싶지는 않을 것입니다. 특히 사용자가 APK 안의 리소스 중 일부만 사용하게 될 경우에는 더욱 그렇습니다. 그래서 Google Play Store와 다른 app store에는 "App Bundles"(Android)라는 기능이 있으며, 단일 binary를 업로드하면 store가 각 사용자의 기기 요구 사항에 맞는 custom binary를 생성해 줍니다.

### `.aab` (Android App Bundle)

Android에서는 Play Store에 새로 제출하는 모든 앱이 [Android App Bundle (.aab)](https://developer.android.com/platform/technology/app-bundle) 형식으로 빌드되어야 합니다. 각 store에 binary를 제출하고 나면, 다양한 기기 유형에 대한 다운로드 크기를 확인할 수 있습니다.

### Android 앱 다운로드 크기와 설치 크기 판단하기

보통 앱 개발자들이 중요하게 생각하는 것은 Play Store의 "download size"입니다(사용자가 store listing에서 앱을 다운로드하러 갈 때 보게 되는 크기). 이것은 Google Play가 AAB에서 생성해 사용자 기기에 맞게 조정한 APK의 크기입니다.

사용자에게 실제로 배포될 최종 앱 크기를 가장 정확하게 확인하는 유일한 방법은 앱을 store에 업로드하고 실제 기기에 다운로드해 보는 것입니다. Google Play는 개발자 dashboard에서도 예상 다운로드 크기에 대한 신뢰할 수 있는 추정치를 제공합니다. [Google Play Developer Console](https://play.google.com/console/)의 **Android vitals** 안 **App size** 페이지에서 확인할 수 있습니다. 자세한 내용은 [Optimize your app’s size and stay within Google Play app size limits](https://support.google.com/googleplay/android-developer/answer/9859372?hl=en)를 참고하세요.

React Native 0.73 이상으로 업그레이드한 뒤 APK 크기가 증가한 이유는 무엇인가요?

React Native 0.73에서는 Android `minSdkVersion`이 `23`으로 올라갔습니다. 그 부작용으로 [`extractNativeLibs`](https://developer.android.com/guide/topics/manifest/application-element#extractNativeLibs%60)의 기본값이 `false`로 바뀌었습니다.

> `false`로 설정되면 네이티브 라이브러리는 APK 안에 압축되지 않은 상태로 저장됩니다. APK는 더 커질 수 있지만, 런타임에 라이브러리를 APK에서 직접 불러오므로 애플리케이션 로딩 속도는 더 빨라집니다.

다음 표는 APK 크기는 커졌지만, [internal distribution](/build/internal-distribution)으로 배포받는 테스터의 다운로드 시간에 약간 영향을 줄 수 있는 반면, Google Play Store에서의 크기는 동일하게 유지되었음을 보여 줍니다.

| SDK | APK (debug variant) | APK (release variant) | AAB | Google Play |
| --- | --- | --- | --- | --- |
| 49 | 66 MB | 27.6 MB | 28.2 MB | 11.7 MB |
| 50 | 168.1 MB | 62.1 MB | 27.4 MB | 11.7 MB |

이전 동작으로 되돌리고 싶다면 **gradle.properties**에서 `useLegacyPackaging`을 `true`로 설정하거나 [`expo-build-properties`](/versions/latest/sdk/build-properties)를 사용하면 됩니다.

## iOS 앱

최소 React Native 앱(blank template으로 생성)의 App Store 다운로드 크기는 [4 MB보다 약간 작습니다](https://x.com/aleqsio/status/1844045829973344457).

iOS build artifact에는 APP와 IPA 두 가지가 있습니다.

### `.app` (iOS application bundle)

이것은 앱의 실제 application bundle입니다. iOS Simulator에 앱 build를 다운로드하고 설치할 때 받는 것이 바로 `.app` bundle입니다. 특정 아키텍처를 대상으로 할 수도 있고 universal binary일 수도 있습니다. `.app`의 크기만으로는 store에서의 앱 다운로드 크기가 실제로 얼마나 될지 많은 정보를 알 수는 없습니다. `.app` 파일은 실제 iOS 기기에 직접 설치할 수 없습니다.

### `.ipa` (iOS App Store Package)

IPA 파일은 iOS 기기에서 앱을 실행하는 데 필요한 `.app` bundle과 기타 리소스를 포함하는 [ZIP](https://en.wikipedia.org/wiki/ZIP)) 파일입니다. App Store, Ad Hoc, Enterprise, TestFlight 등 여러 배포 방식에 사용됩니다.

여기에는 provisioning profile과 entitlement 같은 보안 및 코드 서명 정보가 포함됩니다. App Store는 IPA 파일을 처리해 기기 유형별 더 작은 binary로 분리하므로, IPA 크기도 앱의 다운로드 크기를 나타내지 않습니다.

### iOS 앱 다운로드 크기와 설치 크기 판단하기

보통 앱 개발자들이 중요하게 생각하는 것은 App Store의 "download size"입니다(사용자가 store listing에서 앱을 다운로드하러 갈 때 보게 되는 크기). 이것은 store가 universal IPA에서 생성한 분할 IPA의 크기입니다.

사용자에게 실제로 배포될 최종 앱 크기를 가장 정확하게 확인하는 유일한 방법은 앱을 App Store에 업로드하고 실제 기기에 다운로드해 보는 것입니다. TestFlight에서도 정확한 추정치를 얻을 수 있습니다. [App Store Connect](https://appstoreconnect.apple.com/)에서 TestFlight로 이동해 build 번호를 클릭하여 build를 선택한 뒤 **Build Metadata** 탭으로 전환하고 **App File Sizes**를 클릭하세요. 그러면 기기 유형에 따라 예상 다운로드 크기와 설치 크기 목록이 표시됩니다. 실제 설치 크기는 기기의 iOS 버전에 따라 약간 달라질 수도 있습니다.

## 앱 크기 최적화하기

앱에 기능을 추가할수록 코드, 라이브러리, asset도 늘어나 앱 크기가 커질 수 있습니다. 앱 크기가 여러분과 사용자에게 중요하다면 정기적으로 크기를 검토하고 최적화하는 것이 좋습니다. 아래 섹션은 앱의 여러 측면을 최적화하기 위해 무엇을 할 수 있는지 이해하는 데 도움이 됩니다.

### 정적 asset

앱 크기가 불어나는 가장 흔한 원인 중 하나는 font, icon, image, video, sound 같은 asset입니다. 이는 코드에서 직접 import한 asset뿐 아니라 JavaScript 및 네이티브 라이브러리에서 비롯될 수도 있습니다. 앱의 assets 디렉터리만 검토해서는 전체 그림을 파악할 수 없습니다.

먼저 build artifact를 살펴 어떤 asset이 포함되어 있는지 확인하세요.

-   Android에서는 [Android APK Analyzer](https://developer.android.com/studio/debug/apk-analyzer) 또는 [apktool](https://apktool.org/)을 사용해 앱 내용을 검사할 수 있습니다
-   iOS에서는 IPA 파일 이름을 `app.ipa`에서 `app.zip`으로 바꾸고 압축을 풀어 내용을 검사할 수 있으며, macOS 유틸리티 `assetutil`로 **Assets.car**를 살펴볼 수 있습니다.

### JavaScript bundle 크기

JavaScript bundle을 분석하려면 [Expo Atlas를 사용하세요](/guides/analyzing-bundles). 아주 작을 것이라고 생각했던 라이브러리가 실제로는 bundle에 큰 영향을 준다거나, 사용을 중단한 뒤 제거하지 않은 라이브러리가 남아 있다거나 하는 점을 발견할 수 있습니다.

### 플랫폼별 최적화

React Native와 Expo와 별개로, 아래 도구를 사용해 Android와 iOS에서 앱을 최적화할 수 있습니다:

[Android Developers: Reduce your app size](https://developer.android.com/topic/performance/reduce-apk-size) — Android 앱 크기를 줄이는 방법에 대한 Google의 직접적인 조언입니다.

[Apple Developer: Reducing your app's size](https://developer.apple.com/documentation/xcode/reducing-your-app-s-size) — iOS 앱 크기를 줄이는 방법에 대한 Apple의 직접적인 조언입니다.
