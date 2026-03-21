---
modificationDate: September 10, 2025
title: App stores 모범 사례
description: app store에 앱을 제출할 때의 모범 사례를 알아보세요.
---

# App stores 모범 사례

app store에 앱을 제출할 때의 모범 사례를 알아보세요.

이 가이드는 app store에 앱을 제출할 때의 모범 사례를 제공합니다. 제출용 네이티브 binary를 생성하는 방법은 [첫 빌드 만들기](/build/setup)를 참고하세요.

> **면책 조항:** 심사 가이드라인과 규칙은 자주 업데이트되며, 여러 규칙의 집행이 때로는 일관되지 않을 수 있습니다. 특정 프로젝트가 두 플랫폼 중 어느 쪽에서든 승인된다는 보장은 없으며, 앱의 동작에 대한 최종 책임은 여러분에게 있습니다. 다만 심사 피드백을 반영해 필요할 때마다 앱을 다시 제출할 수는 있습니다.

[앱 버전 관리하기](/build-reference/app-versions) — 앱의 네이티브 runtime version을 구성하는 방법을 알아보세요.

[App Store presence](/eas/metadata) — command line에서 Apple App Store metadata를 관리하세요.

[Permissions](/guides/permissions) — app config를 사용해 네이티브 permission과 시스템 대화상자 메시지를 다듬으세요.

[App icons](/develop/user-interface/splash-screen-and-app-icon) — app store에는 홈 화면 icon에 대한 엄격한 규칙이 있습니다.

[Splash screen](/develop/user-interface/splash-screen-and-app-icon) — splash screen API를 사용해 매끄러운 로딩 경험을 만드세요.

[App store assets](/guides/store-assets) — 앱의 store 페이지용 screenshot과 preview를 만드는 방법을 알아보세요.

[앱 현지화하기](/guides/localization) — 서로 다른 언어와 지역에 맞는 앱 버전을 준비하세요.

[Apple: Review guidelines](https://developer.apple.com/distribute/app-review/) — App Store 심사를 위해 앱을 준비하는 방법에 대한 Apple의 공식 가이드입니다.

## 반응형 디자인

작은 화면(예: iPhone SE)과 큰 화면(예: iPhone X)을 가진 기기나 simulator에서 앱을 테스트해 보는 것이 좋습니다. component가 의도한 대로 렌더링되는지, 버튼이 가려지지 않는지, 모든 텍스트 필드에 접근 가능한지 확인하세요.

휴대전화뿐 아니라 태블릿에서도 앱을 사용해 보세요. `ios.supportsTablet: false`가 설정되어 있더라도, 앱은 iPad에서 여전히 phone 해상도로 렌더링되며 사용 가능해야 합니다.

> 앱이 iPad 폼팩터를 목표로 하지 않더라도, iPad에서 요소가 제대로 렌더링되지 않으면 Apple이 앱을 거절할 수 있습니다. 반드시 iPad(또는 iPad simulator)에서 앱을 테스트하세요.

## 개인정보 처리방침

2018년 10월 3일부터 모든 신규 iOS 앱과 앱 업데이트는 App Store Review Guidelines를 통과하기 위해 개인정보 처리방침을 갖추어야 합니다.

### 앱 개인정보 질문

2020년 12월 8일부터 신규 앱 제출과 업데이트에는 App Store Connect에서 개인정보 처리 방식에 대한 정보를 제공해야 합니다. 자세한 내용은 [App privacy details on the App Store](https://developer.apple.com/app-store/app-privacy-details/)를 참고하세요.

Apple은 앱을 제출할 때 일련의 질문을 합니다. 사용하는 라이브러리에 따라 답변은 달라질 수 있습니다. 예를 들어 `expo-updates`를 사용한다면 **Yes, we collect data from this app**를 선택해야 하며, 이어서 **Crash Data**를 선택하는 것이 적절합니다.
