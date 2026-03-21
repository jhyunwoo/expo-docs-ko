---
modificationDate: March 03, 2025
title: 롤백
description: branch를 이전 update 또는 build에 포함된 embedded update로 롤백하세요.
---

# 롤백

branch를 이전 update 또는 build에 포함된 embedded update로 롤백하세요.

EAS Update가 지원하는 롤백에는 두 가지 유형이 있습니다:

-   이전에 게시한 update로 롤백하기.
-   build에 포함된 embedded update로 롤백하기.

## 롤백 시작하기

롤백을 시작하려면 다음 명령을 실행하세요:

```sh
eas update:rollback
```

터미널에서 대화형 가이드가 롤백 유형을 선택하고 실제로 롤백을 수행하는 과정을 도와줍니다.

## 이전에 게시한 update로 롤백하기

위 명령은 이전에 게시된 update를 다시 게시하여, 클라이언트를 기능적으로 해당 update로 롤백합니다.

## build에 포함된 update로 롤백하기

위 명령은 클라이언트에게 build에 포함된 update를 실행하도록 지시합니다.

## 롤백 후 다시 게시하기

롤백 이후 다시 게시하면, 모든 클라이언트는 새 update를 받게 됩니다.
