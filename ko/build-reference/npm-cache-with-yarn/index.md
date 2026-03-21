---
modificationDate: December 18, 2024
title: Yarn 1 (Classic)에서 npm cache 사용하기
sidebar_label: Yarn 1 (Classic)용 npm cache
description: Yarn 1 (Classic)에서 registry를 재정의해 npm cache를 사용하는 방법을 알아보세요.
---

# Yarn 1 (Classic)에서 npm cache 사용하기

registry를 재정의해 Yarn 1 (Classic)에서 npm cache를 사용하는 방법을 알아보세요.

기본적으로 EAS npm cache는 Yarn 1 (Classic)에서는 동작하지 않습니다. **yarn.lock** 파일에 모든 라이브러리에 대한 registry URL이 들어 있기 때문입니다. Yarn 1은 이를 재정의할 방법을 제공하지 않으며, Yarn 팀도 Yarn 1에서 이를 지원할 계획이 없습니다. 하지만 이 문제는 Yarn 2+에서 해결되었습니다.

Yarn 1에서 npm cache를 활용하고 싶다면 **package.json**에 [`eas-build-pre-install` npm hook](/build-reference/npm-hooks)을 추가해 **yarn.lock** 안의 registry를 재정의하세요:

```json
{
  "scripts": {
    "eas-build-pre-install": "bash -c \"[ ! -z \\\"$EAS_BUILD_NPM_CACHE_URL\\\" ] && sed -i -e \\\"s#https://registry.yarnpkg.com#$EAS_BUILD_NPM_CACHE_URL#g\\\" yarn.lock\" || true"
  }
}
```
