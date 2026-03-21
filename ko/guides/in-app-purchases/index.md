---
modificationDate: March 09, 2026
title: 인앱 구매 사용하기
description: Expo 앱에서 인앱 구매를 사용하는 방법을 알아보세요.
---

# 인앱 구매 사용하기

Expo 앱에서 인앱 구매를 사용하는 방법을 알아보세요.

인앱 구매(IAP)는 모바일 또는 데스크톱 애플리케이션 안에서 사용자가 디지털 상품이나 추가 기능을 구매할 수 있게 하는 거래입니다. 이 가이드는 Expo 앱에서 IAP를 구현할 때 사용할 수 있는 인기 라이브러리와 튜토리얼 목록을 제공합니다.

> 인앱 구매 라이브러리는 custom 네이티브 코드를 구성해야 합니다. Expo Go를 사용할 때는 네이티브 코드를 구성할 수 없습니다. 대신 [development build](/develop/development-builds/introduction)를 만들어 프로젝트에서 네이티브 라이브러리를 사용할 수 있게 하세요.

## 튜토리얼

[시청하기: Expo에서 인앱 구매 구현하기](https://www.youtube.com/watch?v=R3fLKC-2Qh0) — RevenueCat을 사용해 Expo 앱에서 인앱 구매와 구독을 설정하세요.

  

[Expo 인앱 구매 튜토리얼](https://www.revenuecat.com/blog/engineering/expo-in-app-purchase-tutorial/) — react-native-purchases 라이브러리와 RevenueCat으로 인앱 구매와 구독을 시작하는 가이드입니다. — react-native-purchases

## 라이브러리

다음 라이브러리는 앱에 매끄럽게 통합할 수 있도록 [CNG](/workflow/continuous-native-generation)와 [Config Plugins](/config-plugins/introduction)을 사용하는 Expo 앱에서, 인앱 구매 기능과 즉시 사용할 수 있는 호환성을 강력하게 지원합니다.

[react-native-purchases](https://github.com/RevenueCat/react-native-purchases) — react-native-purchases — Google Play Billing과 StoreKit API를 감싼 wrapper를 제공하고, 인앱 구매를 지원하는 RevenueCat 서비스와의 통합을 제공하는 오픈 소스 프레임워크입니다. 제품 관리, analytics, 그리고 앱 백엔드에서의 구매 검증처럼 client code를 넘어설 수 있는 인앱 구매 요구 사항을 단순화한 workflow를 지원합니다.

[expo-iap](https://github.com/hyochan/expo-iap) — expo-iap — development build와 함께 동작하는 React Native용 인앱 구매 라이브러리입니다.
