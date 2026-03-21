---
modificationDate: March 06, 2026
title: Expo Skills for AI agents
description: Expo와 React Native 앱을 빌드, 배포, 디버그하기 위해 Expo가 제공하는 공식 AI agent skill 목록입니다.
---

# Expo Skills for AI agents

Expo와 React Native 앱을 빌드, 배포, 디버그하기 위해 Expo가 제공하는 공식 AI agent skill 목록입니다.

Expo Skills는 AI agent가 Expo와 React Native 앱을 정확하고 효율적으로 빌드, 배포, 디버그하는 방법을 익히도록 해주는 구조화된 instruction file입니다. Claude Code, Cursor, Codex, 그리고 다른 AI agent와 함께 동작합니다.

## Install Expo Skills

Plugin marketplace에서 Expo Skills를 추가하려면 다음 명령을 실행하세요:

```sh
/plugin marketplace add expo/skills
```

그런 다음 특정 plugin을 설치하세요:

```sh
/plugin install expo-app-design
/plugin install upgrading-expo
/plugin install expo-deployment
```

## Available Expo Skills

다음 skill을 plugin별로 정리해 두었습니다:

| Skill | Description | Plugin |
| --- | --- | --- |
| [`building-native-ui`](https://github.com/expo/skills/tree/main/plugins/expo-app-design/skills/building-native-ui) | [Expo Router](/router/introduction)로 아름다운 앱을 빌드할 때 사용하세요. 기본 개념, styling, component, navigation, animation, pattern, native tab을 다룹니다. | `expo-app-design` |
| [`native-data-fetching`](https://github.com/expo/skills/tree/main/plugins/expo-app-design/skills/native-data-fetching) | Network request, API call, data fetching을 구현하거나 디버그할 때 사용하세요. fetch API, React Query, SWR, error handling, caching, offline support, Expo Router data loader를 다룹니다. | `expo-app-design` |
| [`expo-api-routes`](https://github.com/expo/skills/tree/main/plugins/expo-app-design/skills/expo-api-routes) | EAS Hosting과 함께 Expo Router의 [API routes](/router/web/api-routes)를 만들 때 사용하세요. | `expo-app-design` |
| [`expo-dev-client`](https://github.com/expo/skills/tree/main/plugins/expo-app-design/skills/expo-dev-client) | 로컬 또는 TestFlight를 통해 [development client](/develop/development-builds/use-development-builds)를 빌드하고 배포할 때 사용하세요. | `expo-app-design` |
| [`expo-tailwind-setup`](https://github.com/expo/skills/tree/main/plugins/expo-app-design/skills/expo-tailwind-setup) | 보편적인 styling을 위해 `react-native-css`와 NativeWind로 [Tailwind CSS](/guides/tailwind)를 설정할 때 사용하세요. | `expo-app-design` |
| [`use-dom`](https://github.com/expo/skills/tree/main/plugins/expo-app-design/skills/use-dom) | Expo [DOM components](/guides/dom-components)를 사용해 native 또는 web의 webview에서 web code를 실행할 때 사용하세요. | `expo-app-design` |
| [`expo-ui-jetpack-compose`](https://github.com/expo/skills/tree/main/plugins/expo-app-design/skills/expo-ui-jetpack-compose) | Expo 앱에서 [Jetpack Compose](/versions/latest/sdk/ui/jetpack-compose) View와 modifier에 사용할 수 있습니다. | `expo-app-design` |
| [`expo-ui-swift-ui`](https://github.com/expo/skills/tree/main/plugins/expo-app-design/skills/expo-ui-swift-ui) | Expo 앱에서 [SwiftUI](/versions/latest/sdk/ui/swift-ui) View와 modifier에 사용할 수 있습니다. | `expo-app-design` |
| [`expo-deployment`](https://github.com/expo/skills/tree/main/plugins/expo-deployment/skills/expo-deployment) | [EAS](/eas)를 통해 Google Play Store, Apple App Store, web hosting, API route에 배포할 때 사용하세요. | `expo-deployment` |
| [`expo-cicd-workflows`](https://github.com/expo/skills/tree/main/plugins/expo-deployment/skills/expo-cicd-workflows) | CI/CD 자동화를 위한 [EAS Workflows](/eas/workflows/introduction) YAML file을 만들 때 사용하세요. | `expo-deployment` |
| [`upgrading-expo`](https://github.com/expo/skills/tree/main/plugins/upgrading-expo/skills/upgrading-expo) | [Expo SDK 버전 업그레이드](/workflow/upgrading-expo-sdk-walkthrough), dependency 문제 수정, breaking change 처리에 사용하세요. | `upgrading-expo` |

## Example prompts

Expo Skills를 설치한 뒤 다음 prompt를 시도해 보세요. AI agent가 자동으로 적절한 skill을 사용합니다:

| Example prompt | Skill used |
| --- | --- |
| Build a settings screen with a form and navigation | `building-native-ui` |
| Set up Tailwind CSS in my Expo project | `expo-tailwind-setup` |
| Embed a recharts chart in my native app using web code | `use-dom` |
| Add a SwiftUI picker component to my Expo app | `expo-ui-swift-ui` |
| Use Material Design 3 components with Jetpack Compose | `expo-ui-jetpack-compose` |
| How do I deploy my Expo app to the Apple App Store? | `expo-deployment` |
| Create a CI/CD workflow that builds on every PR | `expo-cicd-workflows` |
| Upgrade my project to the latest Expo SDK | `upgrading-expo` |

## Additional resources

[expo/skills GitHub repository](https://github.com/expo/skills) — expo/skills — 사용 가능한 모든 Expo Skills의 소스를 살펴보거나 issue를 보고하세요.

[Expo MCP Server](/eas/ai/mcp) — Coding agent가 Expo와 EAS 서비스에 직접 접근할 수 있게 해주는 보조 AI tooling입니다.
