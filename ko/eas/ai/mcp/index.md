---
modificationDate: March 12, 2026
title: Expo와 함께 Model Context Protocol(MCP) 사용하기
description: AI 모델 기능을 강화하기 위해 Expo 프로젝트에 Model Context Protocol을 통합하는 가이드입니다.
---

# Expo와 함께 Model Context Protocol(MCP) 사용하기

AI 모델 기능을 강화하기 위해 Expo 프로젝트에 Model Context Protocol을 통합하는 가이드입니다.

> Expo MCP Server를 사용하려면 [EAS 유료 플랜](https://expo.dev/pricing)이 필요합니다.

[Model Context Protocol(MCP)](https://modelcontextprotocol.io/)은 AI 모델이 외부 데이터 소스와 통합할 수 있도록 해 주는 표준 프로토콜로, 더 정밀한 응답을 위한 강화된 컨텍스트를 제공합니다. 이 프로토콜을 사용하면 agent 같은 AI 지원 도구가 개발 환경을 더 깊이 이해할 수 있어, 코드베이스에 대해 더 나은 도움을 줄 수 있습니다.

Expo MCP Server는 Expo가 호스팅하는 원격 MCP 서버로, Claude Code, Cursor, VS Code 등 널리 쓰이는 AI 지원 도구와 통합되어 이 도구들이 Expo 프로젝트와 직접 상호작용할 수 있게 해 줍니다.

[Introducing Expo MCP Server: for accurate, context-aware AI responses](https://www.youtube.com/watch?v=dp9dpIgDxZQ) — Expo로 앱을 만들 때 AI 지원 도구를 더 정확하고 컨텍스트를 이해하는 방향으로 강화해 보세요.

## Expo MCP Server는 무엇을 하나요?

Expo MCP Server는 AI 지원 도구가 Expo SDK를 이해하도록 돕고, 모바일 simulator 및 React Native DevTools와 상호작용할 수 있게 해 줍니다. Expo MCP Server가 강화해 주는 작업의 예시는 다음과 같습니다:

**Expo로 개발하는 방법 배우기.** AI 지원 도구는 최신 공식 Expo 문서를 필요할 때 가져와 다음과 같은 프롬프트에 답하는 데 사용할 수 있습니다:

-   "How do I use Expo Router?"
-   "Search the Expo docs for implementing deep linking"
-   "Read the Expo Router docs page"
-   "What is Expo CNG?"

**dependency 관리하기.** Expo MCP Server는 권장 패키지 설치 방향을 안내하고, `npx expo install`을 사용해 알려진 호환 버전을 설치합니다.

-   "Add SQLite with basic CRUD operations"
-   "Install `expo-camera` and show me how to take photos"
-   "Add `expo-notifications` for push notifications"

**build와 워크플로 관리하기.** Expo MCP Server는 EAS build를 트리거하고 모니터링하며, workflow를 실행하고, TestFlight의 crash 데이터를 가져올 수 있습니다:

-   "Investigate why my most recent iOS build on EAS failed"
-   "Identify any patterns in recent failing workflows"
-   "Create a workflow that runs Maestro tests"
-   "Show me recent TestFlight crashes"
-   "Show TestFlight feedback for my app"

**시각적 검증과 테스트 자동화하기.** 멀티모달 AI 지원 도구는 simulator에서 실행 중인 앱의 스크린샷을 찍고 상호작용할 수 있습니다. Expo MCP Server에는 프로젝트 dependency에 `expo-mcp` 패키지를 추가하면 활성화되는 로컬 기능이 포함되어 있습니다.

-   "Add a blue circle view and make sure it renders correctly"
-   "Add a button and tap it to verify the interaction works"
-   "Add a counter button that increments on tap and verify the state updates correctly"

AI 지원 도구는 코드를 자율적으로 작성하고, UI가 올바른지 확인하기 위해 스크린샷을 캡처하고, 상호작용을 테스트하고, 발견한 문제를 수정할 수 있습니다.

[MCP 기능 전체 표](/eas/ai/mcp#available-mcp-capabilities)에는 Expo MCP Server가 AI 지원 도구에 제공하는 도구와 프롬프트가 문서화되어 있습니다.

## 사전 준비

Expo MCP Server를 사용하기 전에 다음이 준비되어 있는지 확인하세요:

-   EAS 유료 플랜이 포함된 Expo 계정
-   `npx create-expo-app@latest --template default@sdk-55`로 생성했거나 최신 `expo` 패키지 버전이 설치된 Expo 프로젝트
-   원격 MCP 서버를 지원하는 AI 지원 도구(Claude Code, Cursor, VS Code 등)

## 설치 및 설정

### Expo MCP Server 설치하기

Expo MCP Server는 다양한 AI 지원 도구와의 통합을 지원합니다. 아래의 일반 설정을 사용하거나, 사용하는 도구 항목을 펼쳐 자세한 지침을 확인하세요:

-   **Server type**: Streamable HTTP
-   **URL**: `https://mcp.expo.dev/mcp`
-   **Authentication**: OAuth

Claude Code 설정

```sh
claude mcp add --transport http expo-mcp https://mcp.expo.dev/mcp
```

설치 후 Claude Code 세션에서 `/mcp`를 실행해 인증하세요.

Cursor 설정

다음 링크를 클릭해 Cursor용 MCP 서버를 설치하세요:

VS Code 설정

1.  Command Palette를 엽니다(Cmd ⌘ + Shift + P 또는 Ctrl + Shift + P).
2.  **MCP: Add Server**를 실행합니다.
3.  **HTTP**를 선택합니다.
4.  서버 정보를 입력합니다:
    -   **URL**: `https://mcp.expo.dev/mcp`
    -   **Name**: expo-mcp

Codex 설정

```sh
codex mcp add expo-mcp --url https://mcp.expo.dev/mcp
```

위 명령은 MCP 서버를 Codex 설정 파일에 추가하고 Expo 계정으로 인증하라는 프롬프트를 띄웁니다.

### Expo로 인증하기

MCP 서버를 설치한 뒤에는 두 가지 방법 중 하나로 인증해야 합니다:

#### access token(권장)

Expo 계정에서 **Personal access token**을 생성하고 OAuth 흐름 중에 사용하세요.

-   access token을 생성하려면 EAS dashboard의 [Access tokens](https://expo.dev/accounts/%5Baccount%5D/settings/access-tokens) 설정 페이지를 여세요.
-   **Personal access tokens** 아래에서 **Create token**을 클릭합니다. token을 복사해 OAuth 흐름에서 사용하세요.

#### 자격 증명

Expo 계정 사용자 이름과 비밀번호를 사용하세요. 이 경우 서버가 access token을 자동으로 생성합니다.

### 로컬 기능 설정하기(권장)

> 로컬 기능은 **SDK 54 이상**에서만 사용할 수 있습니다.

iOS Simulator에서 스크린샷 찍기, DevTools 열기, 자동화 기능 같은 고급 기능을 포함한 სრული MCP 경험을 위해 로컬 Expo development server를 설정하세요:

```sh
cd /path/to/your-project
npx expo install expo-mcp --dev
npx expo whoami || npx expo login
EXPO_UNSTABLE_MCP_SERVER=1 npx expo start
```

> development server를 시작하거나 중지할 때마다 MCP 서버 연결을 **다시 연결하거나 재시작**해야 AI 지원 도구가 새로고침된 기능을 받을 수 있습니다.

## 서버 기능과 로컬 기능

Expo MCP Server는 설정 방식에 따라 두 가지 유형의 기능을 제공합니다:

### 서버 기능

서버 기능은 로컬 development server를 설정하지 않아도 원격 MCP 서버 연결만으로 사용할 수 있습니다. **search_documentation** 도구가 서버 기능의 한 예입니다.

### 로컬 기능

로컬 기능은 로컬 Expo development server가 실행 중이어야 하며, 로컬 개발 환경과 상호작용하는 고급 기능을 제공합니다:

-   **자동화 도구**: 스크린샷 찍기, view 탭하기, testID로 요소 찾기
-   **개발 도구**: React Native DevTools 열기
-   **프로젝트 분석**: `expo-router` sitemap 생성하기

이 기능들은 자동화 테스트, 시각적 검증, 더 깊은 프로젝트 introspection 같은 정교한 워크플로를 가능하게 합니다. 로컬 기능을 사용하려면 위의 [로컬 기능 설정하기(권장)](/eas/ai/mcp#set-up-local-capabilities-recommended) 섹션을 따라야 합니다.

## 사용 가능한 MCP 기능

> MCP 기능은 `expo-mcp` 패키지 업데이트나 MCP 서버 변경에 따라 달라질 수 있습니다. 아래 목록은 참고용이며 최신 상태가 아닐 수 있습니다.

### Tools

| Tool | Description | Example Prompt | Availability |
| --- | --- | --- | --- |
| `learn` | 특정 주제에 대한 Expo 사용 방법 배우기 | "learn how to use expo-router" | Server |
| `search_documentation` | 자연어로 Expo 문서 검색하기 | "search documentation for CNG" | Server |
| `read_documentation` | Expo 문서 단일 페이지를 markdown으로 가져오기 | "read the Expo Router docs page" | Server |
| `add_library` | `npx expo install`로 Expo 패키지를 설치하고 문서를 보여 주기 | "add sqlite and basic CRUD to the app" | Server |
| `build_info` | 특정 build의 세부 정보 가져오기 | "get the status of my latest iOS build" | Server |
| `build_list` | 프로젝트의 build 목록 보기 | "list the recent builds for this project" | Server |
| `build_logs` | 완료된 build의 로그 가져오기 | "show me the logs for the failed build" | Server |
| `build_run` | git reference에서 새 build 트리거하기 | "run a production build for iOS" | Server |
| `build_cancel` | 대기 중이거나 진행 중인 build 취소하기 | "cancel the build that is currently in progress" | Server |
| `build_submit` | build를 app store에 제출하기 | "submit the latest build to the App Store" | Server |
| `testflight_crashes` | TestFlight crash 데이터를 가져오거나 ID로 전체 stack trace 얻기 | "show me recent TestFlight crashes" | Server |
| `testflight_feedback` | 기기 정보와 comment가 포함된 TestFlight screenshot feedback 가져오기 | "show TestFlight feedback for my app" | Server |
| `workflow_create` | 새 workflow YAML 파일을 만들고 workflow 문법 배우기 | "create a CI/CD workflow for building and deploying" | Server |
| `workflow_info` | 특정 workflow 실행의 세부 정보 가져오기 | "get the status of the latest workflow run" | Server |
| `workflow_list` | 최근 workflow 실행 목록 보기 | "list the recent workflow runs" | Server |
| `workflow_logs` | workflow 실행의 특정 job 로그 가져오기 | "show me the logs for the build job in the workflow" | Server |
| `workflow_run` | git reference에서 workflow 실행 트리거하기 | "run the build-and-deploy workflow" | Server |
| `workflow_cancel` | 실행 중인 workflow 취소하기 | "cancel the running workflow" | Server |
| `workflow_validate` | workflow YAML 문법과 구성 검증하기 | "validate my workflow file" | Server |
| `expo_router_sitemap` | expo-router-sitemap 출력을 실행하고 표시하기 | "check the expo-router-sitemap output" | Local (requires `expo-router` library) |
| `open_devtools` | React Native DevTools 열기 | "open devtools" | Local |
| `automation_tap` | 특정 화면 좌표 탭하기 | "tap the screen at x=12, y=22" | Local |
| `automation_take_screenshot` | 전체 기기 스크린샷 찍기 | "take a screenshot and verify the blue circle view" | Local |
| `automation_find_view_by_testid` | testID로 view를 찾아 분석하기 | "dump properties for testID 'button-123'" | Local |
| `automation_tap_by_testid` | testID로 view 탭하기 | "click the view with testID 'button-123'" | Local |
| `automation_take_screenshot_by_testid` | testID로 특정 view 스크린샷 찍기 | "screenshot the view with testID 'button-123'" | Local |

### Prompts

AI 지원 도구가 [MCP prompts](https://modelcontextprotocol.io/specification/2025-06-18/server/prompts)를 지원한다면, [Claude Code의 slash command](https://docs.claude.com/en/docs/claude-code/mcp#use-mcp-prompts-as-slash-commands) 같은 추가 메뉴 옵션을 볼 수 있습니다:

| Prompt | Description | Availability |
| --- | --- | --- |
| `expo_router_sitemap` | expo-router-sitemap 출력을 실행하고 표시하기 | Local (requires `expo-router` library) |

## 제한 사항

현재 구현에는 다음과 같은 제한 사항이 있습니다:

-   한 번에 **단일 development server** 연결만 지원합니다.
-   로컬 기능의 iOS 지원은 simulator에만 제한됩니다(물리 기기는 아직 지원되지 않음).
-   로컬 기능의 iOS 지원은 macOS 호스트에서만 사용할 수 있습니다.

## 추가 리소스

[Model Context Protocol Documentation](https://modelcontextprotocol.io/) — MCP 명세와 프로토콜 세부 사항에 대해 자세히 알아보세요.
