---
modificationDate: March 12, 2025
title: update 미리보기
description: development, preview, production build에서 update를 미리 보는 방법을 알아보세요.
---

# update 미리보기

development, preview, production build에서 update를 미리 보는 방법을 알아보세요.

update를 production에 배포하기 전에, 보통은 production과 유사한 환경에서 먼저 테스트하고 싶을 것입니다. 이 가이드는 update를 미리 보는 다양한 접근 방식을 간략히 설명하고, 각 방식에 대한 더 자세한 가이드로 연결해 줍니다.

## development build에서 update 미리보기

development build는 pull request, EAS dashboard, 또는 `expo-dev-client` 라이브러리가 제공하는 내장 UI를 통해 update를 미리 보기에 아주 좋은 방법입니다.

[development build에서 update 미리보기](/eas-update/expo-dev-client) — development build에서 update를 미리 보는 방법을 알아보세요.

[GitHub Actions를 사용해 update 게시 자동화하기](/eas-update/github-actions) — GitHub Actions를 사용해 EAS Update 게시를 자동화하는 방법을 알아보세요

[Orbit를 사용해 EAS dashboard에서 preview update 실행하기](/review/with-orbit) — macOS, Windows, Linux 데스크톱 앱 Expo Orbit로 update를 실행하는 방법을 알아보세요

## preview build에서 update 미리보기

비기술 사용자들은 보통 development build와 직접 상호작용하고 싶어 하지 않으며, [App store testing track](/review/overview#app-store-testing-tracks) 또는 [internal distribution](/review/overview#internal-distribution-with-eas-build)이 있는 preview build에서 변경 사항을 테스트하고 싶어 합니다.

팀 규모가 작다면 한 번에 단 하나의 preview build만 app store testing track이나 internal distribution에 배포해도 충분할 수 있습니다. 그런 다음 그 preview build가 사용하는 channel에 update를 게시하면 됩니다. [preview build에 대해 자세히 알아보세요](/review/overview).

대안으로, preview build에 사용자가 로드할 다른 update나 channel을 선택할 수 있는 메커니즘을 넣을 수 있습니다. 이는 [app runtime](/eas-update/runtime-versions)이 자주 바뀌지 않고, 같은 앱에서 서로 다른 여러 update를 로드할 수 있는 경우에 유용합니다. [자세히 알아보세요](/eas-update/override).

[runtime에 update 구성 재정의하기](/eas-update/override) — runtime에 update URL과 channel을 재정의하는 방법을 알아보세요.

## production build에서 update 미리보기

일부 팀은 update를 모든 최종 사용자에게 배포하기 전에, 먼저 production에서 소수의 internal 사용자에게 rollout해 보기를 원합니다. 이를 구현하는 한 가지 방법은 알려진 일부 사용자에 대해 runtime에 [update channel을 재정의](/eas-update/override)하는 것입니다. **이 경로로 진행하기 전에 반드시 [보안 고려 사항](/eas-update/override#security-considerations)을 확인하세요.** 또한 이 방식은 앱이 제거 후 재설치가 필요한 상태가 될 수 있으므로, internal 사용자가 아닌 사용자에게는 권장되지 않습니다.

또 다른 접근 방식은 [Persistent Staging Flow](/eas-update/deployment-patterns#persistent-staging-flow) 같은 배포 패턴을 사용하는 것입니다. 이 패턴은 항상 production 앱의 한 버전이 staging channel을 가리키도록 유지하는 방식입니다.

[Persistent Staging Flow](/eas-update/deployment-patterns#persistent-staging-flow) — production 앱의 한 버전이 항상 staging channel을 가리키도록 Persistent Staging Flow를 사용하는 방법을 알아보세요.
