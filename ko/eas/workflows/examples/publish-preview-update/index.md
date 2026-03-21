---
modificationDate: March 09, 2026
title: EAS Workflows로 preview update 게시하기
description: EAS Workflows로 preview update를 게시하는 방법을 알아보세요.
---

# EAS Workflows로 preview update 게시하기

EAS Workflows로 preview update를 게시하는 방법을 알아보세요.

프로젝트를 변경한 뒤에는 [preview update](/review/share-previews-with-your-team)를 게시해 변경 사항의 preview를 팀과 공유할 수 있습니다. 이는 최신 변경 사항을 pull해서 로컬에서 실행하지 않고도 팀과 함께 변경 사항을 검토하고 싶을 때 유용합니다.

preview update는 development build UI와 EAS dashboard의 스캔 가능한 QR 코드에서 확인할 수 있습니다. 각 commit마다 preview를 게시하면 팀은 최신 변경 사항을 pull해서 로컬에서 실행하지 않고도 변경 사항을 검토할 수 있습니다.

[Expo Golden Workflow: 팀과 preview update 공유하기](https://www.youtube.com/watch?v=v_rzRcVSQYQ) — EAS Workflows로 각 commit마다 preview update를 게시해, 팀이 코드를 로컬로 pull하지 않고도 변경 사항을 검토할 수 있게 하는 방법을 알아보세요.

## 시작하기

사전 요구 사항

요구 사항 2개

1.

EAS Update 설정하기

preview update를 게시하려면 프로젝트에 [EAS Update](/eas-update/introduction)가 설정되어 있어야 합니다. 다음 명령으로 프로젝트를 구성할 수 있습니다.

```sh
eas update:configure
```

2.

새 development build 만들기

프로젝트 구성을 마친 뒤에는 각 플랫폼에 대한 새 [development build](/develop/development-builds/create-a-build)를 만드세요.

다음 workflow는 모든 branch의 모든 commit에 대해 preview update를 게시합니다.

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
