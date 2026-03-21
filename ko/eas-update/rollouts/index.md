---
modificationDate: July 07, 2025
title: 롤아웃
description: 롤아웃 메커니즘을 사용해 사용자에게 update를 점진적으로 배포하는 방법을 알아보세요.
---

# 롤아웃

롤아웃 메커니즘을 사용해 사용자에게 update를 점진적으로 배포하는 방법을 알아보세요.

롤아웃을 사용하면 변경 사항을 전체 사용자에게 릴리스하기 전에, 일부 사용자에게 먼저 배포해 버그나 기타 문제를 잡아낼 수 있습니다.

EAS는 사용 사례에 따라 **update별 롤아웃과 branch 기반 롤아웃 메커니즘**을 제공합니다.

## update별 롤아웃

이 롤아웃 메커니즘을 사용하면 update를 게시할 때 해당 update를 받을 사용자 비율을 지정하고, 이후 그 비율을 점진적으로 늘릴 수 있습니다.

### 시작하기

update 기반 롤아웃을 시작하려면 평소의 `eas update` 명령에 `--rollout-percentage` 플래그를 추가하세요:

```sh
eas update --rollout-percentage=10
```

이 예시에서는 게시 시 update가 최종 사용자 중 10%에게만 제공됩니다.

### 진행하기

update 기반 롤아웃의 비율을 수정하려면 다음을 실행하세요:

```sh
eas update:edit
```

수정할 update를 선택하고 새 비율을 입력하는 과정을 안내받게 됩니다.

### 종료하기

update 기반 롤아웃을 종료할 때는 두 가지 선택지가 있습니다:

-   **완전히 롤아웃하기**: 위에서 설명한 방식대로 롤아웃을 진행하고 비율을 100으로 설정하면 이 최종 상태를 만들 수 있습니다.
-   **이전 상태로 되돌리기**: 이를 위해 `eas update:revert-update-rollout`을 실행하면 이전 상태로 되돌리는 과정을 안내받게 됩니다.

### 추가 참고 사항

-   한 번에 하나의 branch에서는 하나의 update만 롤아웃할 수 있습니다.
-   롤아웃이 진행 중일 때는, 같은 runtime version을 가진 새 update를 게시하기 전에 반드시 위 옵션 중 하나로 종료해야 합니다. 이렇게 해야 실수로 롤아웃 상태를 덮어쓰는 일을 방지할 수 있습니다.
-   롤아웃 상태를 보려면 `eas update:list` 또는 `eas update:view` 명령을 사용하세요.
-   기존 update가 있는 branch에서 생성된 롤아웃을 되돌리면 control update가 다시 게시됩니다. 이렇게 하면 모든 클라이언트가 이전 상태로 되돌아가게 됩니다.
-   현재 update가 없는 branch에서도 롤아웃을 시작할 수 있으며, 이 경우 첫 번째 update가 지정한 사용자 비율에 롤아웃됩니다. 이를 되돌리면 rollback-to-embedded update가 생성되어 클라이언트를 이전 상태(embedded update)로 되돌립니다.

## branch 기반 롤아웃

이 롤아웃 메커니즘을 사용하면 새 branch의 update 집합을 일부 최종 사용자 비율에 점진적으로 롤아웃하고, 나머지 사용자는 현재 branch에 그대로 남겨둘 수 있습니다.

### 시작하기

branch 기반 롤아웃을 시작하려면 다음 EAS CLI 명령을 실행하세요:

```sh
eas channel:rollout
```

터미널의 대화형 가이드가 channel 선택, 롤아웃할 branch 선택, 그리고 롤아웃 사용자 비율 설정을 도와줍니다. 롤아웃 비율을 늘리거나 줄이려면 명령을 다시 실행하고 `Edit` 옵션을 선택해 비율을 조정하세요.

### 종료하기

대화형 가이드에서 `End` 옵션을 선택하면 롤아웃을 종료하는 두 가지 방법이 제공됩니다:

-   **Republish and revert:** 새 branch 상태에 확신이 있을 때 이 옵션을 사용하세요. 그러면 새 branch의 최신 update가 이전 branch에 다시 게시되고, 모든 사용자가 이전 branch를 가리키게 됩니다.
-   **Revert:** 새 branch의 update를 무시하고 사용자를 이전 branch로 되돌립니다.

### 추가 참고 사항

-   한 번에 하나의 channel에서는 하나의 branch만 롤아웃할 수 있습니다.
-   롤아웃 상태를 보려면 `eas channel:rollout` 명령을 사용하세요.
-   롤아웃이 진행 중일 때는 예를 들어 `eas update --branch [branch]`를 실행해 롤아웃 중인 branch와 현재 branch 모두에 update를 게시할 수 있습니다.
-   `eas update --channel [channel]`은 롤아웃이 진행 중일 때 사용할 수 없습니다. 어떤 branch에 update를 연결해야 하는지 결정할 수 없기 때문입니다.
