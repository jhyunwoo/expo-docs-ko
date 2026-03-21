---
modificationDate: December 03, 2025
title: PR preview용 GitHub Action
description: GitHub Actions를 사용해 EAS Update 게시를 자동화하는 방법을 알아보세요.
---

# PR preview용 GitHub Action

GitHub Actions를 사용해 EAS Update 게시를 자동화하는 방법을 알아보세요.

GitHub Action은 GitHub에서 이벤트가 발생할 때마다 실행되는 cloud function입니다. GitHub Actions를 구성하면 "production" 같은 branch에 본인이나 팀원이 merge할 때 build와 update 게시를 자동화할 수 있습니다. 이렇게 하면 배포 프로세스가 일관되고 빨라져 앱 개발에 더 많은 시간을 쓸 수 있습니다.

이 가이드는 pull request에서 preview를 게시하도록 GitHub Actions를 설정하는 방법을 안내합니다.

## pull request에서 preview 게시하기

또 다른 일반적인 사용 사례는 pull request마다 새 update를 만드는 것입니다. 이렇게 하면 코드를 merge하기 전에, 그리고 로컬에서 프로젝트를 시작하지 않고도, 기기에서 pull request의 변경 사항을 테스트할 수 있습니다. 아래는 pull request가 열릴 때마다 update를 게시하는 단계입니다:

프로젝트 루트에 **.github/workflows/preview.yml** 경로의 파일을 만드세요.

**preview.yml** 안에 다음 snippet을 복사해 붙여 넣으세요:

```yaml
name: preview
on: pull_request

jobs:
  update:
    name: EAS Update
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    steps:
      - name: Check for EXPO_TOKEN
        run: |
          if [ -z "${{ secrets.EXPO_TOKEN }}" ]; then
            echo "You must provide an EXPO_TOKEN secret linked to this project's Expo account in this repo's secrets. Learn more: https://docs.expo.dev/eas-update/github-actions"
            exit 1
          fi

      - name: Checkout repository
        uses: actions/checkout@v5

      - name: Setup Node
        uses: actions/setup-node@v6
        with:
          node-version: 22
          cache: yarn

      - name: Setup EAS
        uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Install dependencies
        run: yarn install

      - name: Create preview
        uses: expo/expo-github-action/preview@v8
        with:
          command: eas update --auto
```

위 스크립트에서는:

-   workflow event `on`을 사용해 pull request가 열리거나 업데이트될 때마다 실행합니다.
-   `update` job 안에서 Node.js version, Expo의 GitHub Action, dependencies를 GitHub Action의 내장 cache를 사용해 설정합니다.
-   [preview subaction](https://github.com/expo/expo-github-action/tree/main/preview#readme)이 `eas update --auto`를 실행합니다. 이 subaction은 update의 기본 정보와 update를 스캔할 QR 코드가 담긴 comment를 pull request에 추가합니다.

> job에 `permissions` 섹션을 추가하는 것을 잊지 마세요. 이 설정이 있어야 job이 pull request에 comment를 추가할 수 있습니다.

이전 섹션에서 이미 `EXPO_TOKEN`을 설정했다면 이 단계는 건너뛰어도 됩니다. GitHub Actions를 Expo 계정으로 인증하려면 유효한 `EXPO_TOKEN` 하나만 있으면 됩니다.

아직 없다면, 위 스크립트가 실행될 수 있도록 `EXPO_TOKEN` environment variable을 제공해야 합니다.

-   [https://expo.dev/settings/access-tokens](https://expo.dev/settings/access-tokens)으로 이동하세요.
-   **Create token**을 클릭해 새 personal access token을 만드세요.
-   생성된 token을 복사하세요.
-   프로젝트 정보에 맞게 "your-username"과 "your-repo-name"을 바꿔 [https://github.com/your-username/your-repo-name/settings/secrets/actions](https://github.com/your-username/your-repo-name/settings/secrets/actions)으로 이동하세요.
-   **Repository secrets** 아래에서 **New repository secret**을 클릭하세요.
-   이름이 **EXPO_TOKEN**인 secret을 만들고, 값으로 방금 복사한 access token을 붙여 넣으세요.

이제 GitHub Action 설정이 완료되어야 합니다. 개발자가 pull request를 만들 때마다 이 action이 update를 빌드하고 게시해서, EAS branch에 접근할 수 있는 build를 가진 모든 reviewer가 사용할 수 있게 합니다.

> 일부 저장소나 조직에서는 GitHub Workflows를 명시적으로 활성화하고 third-party Actions를 허용해야 할 수 있습니다.

## Yarn 대신 Bun 사용하기

패키지 관리자에서 Yarn 대신 [Bun](/guides/using-bun)을 사용하려면, push 시 update 게시와 pull request preview 모두에 대해 아래 단계를 따르세요:

**update.yml** 또는 **preview.yml**의 `Setup Node` 단계를 다음 snippet으로 바꾸세요:

```yaml
- name: Setup Bun
  uses: oven-sh/setup-bun@v1
  with:
    bun-version: latest
```

Bun으로 dependency를 설치하려면 **Install dependencies** 단계를 다음 snippet으로 바꾸세요:

```yaml
- name: Install dependencies
  run: bun install
```
