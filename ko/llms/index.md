---
modificationDate: March 06, 2026
title: AI 에이전트와 LLM을 위한 문서
description: AI 에이전트와 LLM이 Expo 문서에 효율적으로 접근하고 소비하는 방법입니다.
---

# AI 에이전트와 LLM을 위한 문서

AI 에이전트와 LLM이 Expo 문서에 효율적으로 접근하고 소비하는 방법입니다.

전체 웹 페이지를 가져오는 것보다 더 적은 토큰 비용으로 AI 에이전트와 LLM이 Expo 문서에 접근할 수 있도록, 다음 엔드포인트와 도구를 사용하세요.

## 빠른 시작

사용 중인 도구에 맞는 방법을 선택하세요:

| Method | Best for | How |
| --- | --- | --- |
| 페이지별 markdown | 채팅 인터페이스(ChatGPT, Claude.ai)와 코딩 에이전트 | 모든 문서 페이지 URL 끝에 `/index.md`를 붙입니다. |
| Copy Markdown 드롭다운 | 단일 페이지로 빠르게 프롬프트 작성하기 | 모든 문서 페이지 상단에서 **Copy page** > **Copy Markdown**을 클릭합니다. |
| 섹션 번들 | 프로젝트 규칙과 코딩 에이전트 | 섹션 단위 `llms-*.txt` URL 또는 범용 인덱스(`/llms.txt`)를 AI 도구 설정에 추가합니다. |

## 페이지별 markdown

모든 문서 페이지에는 페이지 URL 끝에 `/index.md`를 붙여 접근할 수 있는 경량 markdown 버전이 있습니다. 예를 들면:

```text
https://documentation.expo.dev/develop/development-builds/create-a-build/index.md
```

이 방법은 특정 주제나 페이지에 대한 컨텍스트를 AI 에이전트에 제공하고 싶지만, 해당 페이지의 전체 HTML을 넘겨 과도한 정보를 주고 싶지 않을 때 유용합니다.

## 문서 번들

Expo에서는 대규모 언어 모델(LLM)과 이를 사용하는 앱을 위한 문서를 제공하는 [llms.txt](https://llmstxt.org/) 이니셔티브를 지원합니다. 아래는 사용 가능한 문서 파일 목록입니다.

### 사이트 전체 번들

| Endpoint | Description | Size |
| --- | --- | --- |
| [/llms.txt](/llms.txt) | 사용 가능한 모든 문서 파일 목록이 있는 인덱스 페이지입니다. | ~94 kB |
| [/llms-full.txt](/llms-full.txt) | Expo Router, Expo Modules API, 개발 프로세스 등을 포함한 Expo 전체 문서입니다. | ~1.9 MB |

### 섹션 전체 번들

| Endpoint | Description | Size |
| --- | --- | --- |
| [/llms-eas.txt](/llms-eas.txt) | Expo Application Services (EAS) 전체 문서입니다. | ~974 kB |
| [/llms-sdk.txt](/llms-sdk.txt) | 최신 Expo SDK 전체 문서입니다. | ~2.6 MB |

이전 Expo SDK 버전을 찾고 있나요?

-   [/llms-sdk-v54.0.0.txt](/llms-sdk-v54.0.0.txt): Expo SDK v54.0.0 문서
    
-   [/llms-sdk-v53.0.0.txt](/llms-sdk-v53.0.0.txt): Expo SDK v53.0.0 문서
    
-   [/llms-sdk-v52.0.0.txt](/llms-sdk-v52.0.0.txt): Expo SDK v52.0.0 문서
    
-   [/llms-sdk-v51.0.0.txt](/llms-sdk-v51.0.0.txt): Expo SDK v51.0.0 문서
