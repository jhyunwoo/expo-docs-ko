---
modificationDate: May 24, 2021
title: Expo 구조화된 헤더 필드 값
description: 버전 0
---

# Expo 구조화된 헤더 필드 값

버전 0

HTTP용 Structured Field Values(구조화된 필드 값), [IETF RFC 8941](https://tools.ietf.org/html/rfc8941)은 HTTP header 문법을 표준화하고 중첩된 데이터를 일관되게 표현하기 위한 제안입니다.

아직 작업이 진행 중이므로, Expo는 [IETF RFC 8941](https://tools.ietf.org/html/rfc8941)에 정의된 protocol 가운데 아래 하위 집합만 구현한 자체 custom 버전을 유지합니다:

-   모든 키
-   문자열, 정수, 소수
-   사전형 구조
