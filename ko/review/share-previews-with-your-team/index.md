---
modificationDate: March 02, 2026
title: 팀과 preview 공유하기
description: branches에 updates를 게시해 팀과 앱 preview를 공유하세요.
---

# 팀과 preview 공유하기

branches에 updates를 게시해 팀과 앱 preview를 공유하세요.

branch에서 변경 사항을 만든 뒤에는 update를 게시해서 팀과 공유할 수 있습니다. 이렇게 하면 리뷰 중에 변경 사항에 대한 피드백을 받을 수 있습니다.

아래 단계는 변경 사항의 preview를 게시한 뒤 이를 팀과 공유하는 기본 흐름을 설명합니다. 더 포괄적인 자료는 [Preview updates](/eas-update/preview) 가이드를 참고하세요.

## 변경 사항의 preview 게시하기

현재 변경 사항의 preview는 다음 [EAS CLI](/develop/tools#eas-cli) 명령을 실행해 게시할 수 있습니다:

```sh
eas update --auto
```

이 명령은 현재 branch 이름 아래에 update를 게시합니다.

## 팀과 공유하기

preview가 게시되면 터미널 창에 다음과 같은 출력이 표시됩니다:

```sh
✔ Published!
...
EAS Dashboard      https://expo.dev/accounts/your-account/projects/your-project/updates/708b05d8-9bcf-4212-a052-ce40583b04fd
```

리뷰어에게 **EAS dashboard** 링크를 공유하세요. 링크를 연 뒤에는 **Preview** 버튼을 클릭할 수 있습니다. 그러면 디바이스에서 preview를 열 수 있도록 스캔할 QR 코드가 표시됩니다.

## previews 자동으로 만들기

[EAS Workflows](/eas/workflows/introduction)를 사용하면 모든 commit마다 preview를 자동으로 만들 수 있습니다. 먼저 [프로젝트를 구성](/eas/workflows/get-started)한 다음, 프로젝트 루트에 **.eas/workflows/publish-preview-update.yml**이라는 파일을 추가하고, 아래 workflow configuration을 넣으세요:

```yaml
name: Publish preview update

on:
  push:
    branches: ['*']

jobs:
  publish_preview_update:
    name: Publish preview update
    type: update
    params:
      branch: ${{ github.ref_name || 'test' }}
```

위 workflow는 모든 branch의 모든 commit마다 update를 게시합니다. 다음 EAS CLI 명령으로 이 workflow를 수동 실행할 수도 있습니다:

```sh
eas workflow:run publish-preview-update.yml
```

[workflows examples guide](/eas/workflows/examples/introduction)에서 일반적인 패턴을 더 알아보세요.

## 더 알아보기

[Preview updates](/eas-update/preview) — development, preview, production build에서 updates를 미리 보는 방법을 알아보세요.
