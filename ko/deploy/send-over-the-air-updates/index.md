---
modificationDate: March 02, 2026
title: Over-the-air update 보내기
description: 사용자에게 중요한 bug fix와 개선 사항을 push하기 위해 over-the-air update를 보내는 방법을 알아보세요.
---

# Over-the-air update 보내기

사용자에게 중요한 bug fix와 개선 사항을 push하기 위해 over-the-air update를 보내는 방법을 알아보세요.

중요한 bug fix와 개선 사항이 포함된 over-the-air update를 사용자에게 보낼 수 있습니다.

## Get started

> 이미 [previews](/review/share-previews-with-your-team)를 게시했거나 [build](/deploy/build-project)를 만든 적이 있다면, updates를 이미 설정했을 수 있으므로 이 섹션은 건너뛸 수 있습니다.

updates를 설정하려면 다음 [EAS CLI](/develop/tools#eas-cli) 명령을 실행하세요:

```sh
eas update:configure
```

명령이 완료된 뒤에는 다음 섹션으로 진행하기 전에 새 build를 만들어야 합니다.

## Update 보내기

update를 보내려면 다음 [EAS CLI](/develop/tools#eas-cli) 명령을 실행하세요:

```sh
eas update --channel production
```

이 명령은 update를 만들고 `production` channel에서 update를 받도록 구성된 앱 build에서 사용할 수 있게 합니다. 이 channel은 [**eas.json**](/eas/json#channel)에 정의되어 있습니다.

앱을 강제 종료한 뒤 두 번 다시 열어 update가 동작하는지 확인할 수 있습니다. update는 두 번째 실행 시 적용되어야 합니다.

## Update 자동으로 보내기

[EAS Workflows](/eas/workflows/introduction)를 사용하면 update를 자동으로 보낼 수 있습니다. 먼저 [configure your project](/eas/workflows/get-started)를 진행하고, 프로젝트 루트에 **.eas/workflows/send-updates.yml**이라는 파일을 추가한 다음, 아래 workflow 구성을 넣으세요:

```yaml
name: Send updates

on:
  push:
    branches: ['main']

jobs:
  send_updates:
    name: Send updates
    type: update
    params:
      channel: production
```

위 workflow는 프로젝트의 `main` branch에 commit이 있을 때마다 `production` update channel에 대해 over-the-air update를 보냅니다. 다음 EAS CLI 명령으로 이 workflow를 수동 실행할 수도 있습니다:

```sh
eas workflow:run send-updates.yml
```

[workflows examples guide](/eas/workflows/examples/introduction)에서 일반적인 패턴에 대해 더 알아보세요.

## Learn more

[rollout an update](/eas-update/rollouts), [optimize assets](/eas-update/optimize-assets) 등 더 많은 내용은 [update guides](/eas-update/introduction)에서 배울 수 있습니다.
