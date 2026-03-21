---
modificationDate: November 26, 2025
title: Bun 사용하기
description: Expo와 EAS에서 Bun을 사용하는 가이드입니다.
---

# Bun 사용하기

Expo와 EAS에서 Bun을 사용하는 가이드입니다.

[Bun](https://bun.sh/)은 JavaScript runtime이며 [Node.js](https://nodejs.org/en)를 대체할 수 있는 drop-in 대안입니다. Expo 프로젝트에서는 Bun을 npm 패키지 설치와 Node.js 스크립트 실행에 사용할 수 있습니다. Bun을 사용할 때의 장점은 npm, pnpm, Yarn보다 더 빠른 패키지 설치 속도와 [Node.js 대비 최소 4배 빠른 시작 시간](https://bun.sh/docs#design-goals)이며, 이는 로컬 개발 경험을 크게 향상시켜 줍니다.

## Prerequisites

> **참고:** Bun은 프로젝트의 대부분의 사용 사례에서 Node.js를 대체하지만, 현재 시점에는 `bun create expo`와 `bun expo prebuild` 명령을 위해 여전히 [Node.js LTS 버전](https://nodejs.org/) 설치가 필요합니다. 이 명령들은 프로젝트 템플릿을 내려받기 위해 `npm pack`을 사용합니다.

Bun을 사용해 새 앱을 만들려면 [로컬 머신에 Bun을 설치하세요](https://bun.sh/docs/installation#installing).

## Bun으로 새 Expo 프로젝트 시작하기

새 프로젝트를 만들려면 다음 명령을 실행하세요:

```sh
bun create expo-app my-app
```

`bun run`으로 **package.json** 스크립트도 실행할 수 있습니다:

```sh
bun run ios
```

Expo 라이브러리를 설치하려면 `bun expo install`을 사용할 수 있습니다:

```sh
bun expo install expo-audio
```

## EAS builds에서 Bun 사용하기

EAS는 코드베이스의 lockfile을 기준으로 어떤 package manager를 사용할지 결정합니다. EAS가 Bun을 사용하게 하려면 코드베이스에서 `bun install`을 실행해 **bun.lockb**(Bun lockfile)을 생성하세요. 이 lockfile이 코드베이스에 있는 한, 빌드에서 package manager로 Bun이 사용됩니다. 다른 package manager가 만든 lockfile은 반드시 삭제하세요.

### EAS에서 Bun 버전 커스터마이즈하기

EAS를 사용할 때 Bun은 기본적으로 설치됩니다. 빌드 이미지에서 어떤 Bun 버전이 사용되는지 알려면 [Android server images](/build-reference/infrastructure#android-server-images)와 [iOS server images](/build-reference/infrastructure#ios-server-images)를 참고하세요.

EAS에서 [정확한 Bun 버전](/eas/json#bun)을 사용하려면 **eas.json**에서 build profile 설정 아래에 버전 번호를 추가하세요. 예를 들어 아래 설정은 `development` build profile에 Bun 버전 `1.0.0`을 지정합니다:

```json
{
  "build": {
    "development": {
      "bun": "1.0.0"
      ... 
    }
    ... 
  }
}
```

## Trusted dependencies

다른 package manager와 달리 Bun은 설치된 라이브러리의 lifecycle script를 자동으로 실행하지 않는데, 이는 보안 위험으로 간주되기 때문입니다. 하지만 설치 중인 패키지에 실행하고 싶은 `postinstall` 스크립트가 있다면, **package.json**의 [`trustedDependencies`](https://bun.sh/guides/install/trusted) 배열에 해당 라이브러리를 명시적으로 포함해야 합니다.

예를 들어 `packageA`를 설치했고, 이 패키지가 `packageB`에 의존하며 `packageB`가 `postinstall` 스크립트를 가지고 있다면, `trustedDependencies`에 `packageB`를 추가해야 합니다.

**package.json**에 trusted dependency를 추가하려면 다음을 넣으세요:

```json
"trustedDependencies": ["your-dependency"]
```

그런 다음 lockfile을 제거하고 의존성을 다시 설치하세요:

```sh
rm -rf node_modules
rm bun.lockb
bun install
```

## Common errors

### Sentry와 Bun을 사용할 때 EAS Build가 실패하는 경우

`sentry-expo` 또는 `@sentry/react-native`를 사용 중이라면, 이들은 빌드 중 source map을 Sentry로 업로드하는 `@sentry/cli`에 의존합니다. `@sentry/cli` 패키지에는 "source map 업로드" 스크립트를 사용할 수 있게 해주는 `postinstall` 스크립트가 있으며, 이 스크립트가 실행되어야 합니다.

이 문제를 해결하려면 **package.json**의 [trusted dependencies](/guides/using-bun#trusted-dependencies) 배열에 `@sentry/cli`를 추가하세요:

```json
"trustedDependencies": ["@sentry/cli"]
```
