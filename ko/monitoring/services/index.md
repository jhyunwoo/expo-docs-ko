---
modificationDate: May 21, 2025
title: 모니터링 서비스
description: 출시 후 Expo 및 React Native 앱의 사용 현황을 모니터링하는 방법을 알아보세요.
---

# 모니터링 서비스

출시 후 Expo 및 React Native 앱의 사용 현황을 모니터링하는 방법을 알아보세요.

앱이 출시되고 나면 익명화된 사용 데이터를 추적하여 사용자가 앱을 어떻게 사용하는지에 대한 인사이트를 얻을 수 있습니다. 이 데이터에는 어떤 업데이트가 사용 중인지, 사용자가 언제 버그를 경험하는지 등이 포함됩니다.

## EAS Insights

Expo는 [`expo-insights`](/eas-insights/introduction) 라이브러리를 제공하며, 이 라이브러리는 [EAS Update](/deploy/send-over-the-air-updates)와 관련된 정보를 추적합니다. 이 데이터에는 앱 버전, 플랫폼, OS 버전, 업데이트 채택 현황이 포함됩니다. 이를 설치하고 앱 스토어에 프로덕션 빌드를 출시하면 프로젝트 대시보드에서 추가 데이터를 볼 수 있습니다.

다음 가이드로 시작하세요.

[EAS Insights](/eas-insights/introduction) — EAS Insights를 사용해 앱을 모니터링하는 방법을 알아보세요.

## LogRocket

[LogRocket](https://logrocket.com)을 사용하면 더 많은 인사이트를 얻을 수 있습니다. LogRocket은 사용자가 앱을 사용하는 동안 세션을 기록하고 버그를 식별합니다. 업데이트 ID로 세션을 필터링할 수 있고, EAS 대시보드에서 LogRocket 계정을 연결해 앱의 세션 데이터에 빠르게 접근할 수도 있습니다.

다음 가이드로 시작하세요.

[Using LogRocket](/guides/using-logrocket) — LogRocket을 사용해 앱을 모니터링하는 방법을 알아보세요.

## Sentry

[Sentry](http://getsentry.com/)는 프로덕션 배포를 재현하고 크래시를 수정하는 데 필요한 정보를 실시간으로 제공하는 크래시 리포팅 플랫폼입니다.

사용자가 앱을 사용하는 동안 마주치는 예외나 오류를 알려 주고, 이를 웹 대시보드에서 정리해 보여 줍니다. 보고되는 예외에는 stacktrace, 디바이스 정보, 버전, 기타 관련 컨텍스트가 자동으로 포함됩니다. 또한 현재 route나 사용자 ID처럼 앱에 특화된 추가 컨텍스트도 제공할 수 있습니다.

다음 가이드로 시작하세요.

[Using Sentry](/guides/using-sentry) — Sentry를 사용해 앱을 모니터링하는 방법을 알아보세요.

## Vexo

[Vexo](https://www.vexo.co/)는 사용자가 Expo 앱과 어떻게 상호작용하는지 이해하고, 마찰 지점을 파악하고, 참여도를 개선하는 데 도움을 줍니다. 간단한 두 줄 통합만으로 실시간 사용자 분석을 제공하며, 사용자 활동, 앱 성능, 채택 추세에 대한 인사이트와 함께 heatmap, session replay 등의 기능이 포함된 완전한 대시보드를 제공합니다.

다음 가이드로 시작하세요.

[Using Vexo](/guides/using-vexo) — Vexo를 사용해 앱을 모니터링하는 방법을 알아보세요.

## BugSnag

[BugSnag](https://www.bugsnag.com/)은 풍부한 end-to-end 오류 리포팅과 분석을 제공하여 오류를 빠르고 정확하게 재현하고 수정할 수 있게 해주는 안정성 모니터링 솔루션입니다. BugSnag은 React Native를 포함한 50개 이상의 플랫폼을 위한 오픈소스 라이브러리로 전체 스택을 지원합니다.

다음 가이드로 시작하세요.

[Using BugSnag](/guides/using-bugsnag) — BugSnag을 사용해 앱을 모니터링하는 방법을 알아보세요.
