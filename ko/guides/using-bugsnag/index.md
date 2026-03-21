---
modificationDate: December 18, 2024
title: BugSnag 사용하기
description: 종단 간 오류 보고와 analytics를 위한 BugSnag 설치 및 설정 가이드입니다.
---

# BugSnag 사용하기

종단 간 오류 보고와 analytics를 위한 BugSnag 설치 및 설정 가이드입니다.

[BugSnag](https://www.bugsnag.com)는 풍부한 종단 간 오류 보고와 analytics를 제공하여 오류를 빠르고 정확하게 재현하고 수정할 수 있게 해주는 안정성 모니터링 솔루션입니다. BugSnag은 [50개 이상의 플랫폼](https://www.bugsnag.com/platforms)을 위한 오픈소스 라이브러리로 전체 스택을 지원하며, 여기에는 [React Native](https://docs.bugsnag.com/platforms/react-native/react-native/)도 포함됩니다.

BugSnag을 사용하면 개발자와 엔지니어링 조직은 다음을 할 수 있습니다:

-   **안정화:** 새 기능을 만들 시점과 버그를 수정할 시점을 파악해 더 빠르게 혁신할 수 있습니다. release health dashboard, 안정성 점수와 목표, 이메일, Slack, PagerDuty 등의 내장 알림을 활용하세요.
-   **우선순위 지정:** 앱 안정성에 가장 큰 영향을 주는 버그를 식별하고 우선순위를 매겨 고객 경험을 개선할 수 있습니다. 근본 원인별로 그룹화되고 비즈니스 영향, 고객 세분화, A/B 테스트와 실험 결과에 따라 정렬된 이슈를 분석할 수 있습니다.
-   **수정:** 버그 재현과 수정에 드는 시간을 줄여 생산성을 높일 수 있습니다. 강력한 진단 데이터, 전체 stack trace, 자동 breadcrumb를 활용하세요.

## Integration

아래 통합 가이드에서 Expo 앱에 BugSnag을 추가해 JavaScript 오류를 보고하는 방법을 확인하세요. 또한 [EAS Update](/eas-update/introduction)로 게시한 업데이트용 source map 업로드 방법도 포함되어 있습니다.

BugSnag이 처음이라면 [계정을 만들거나](https://app.bugsnag.com/user/new/) [데모를 요청할 수 있습니다](https://www.bugsnag.com/demo-request).

[Expo BugSnag integration](https://docs.bugsnag.com/platforms/react-native/expo/) — Expo 앱에 BugSnag을 통합하는 공식 가이드를 참고하세요.
