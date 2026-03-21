---
modificationDate: June 16, 2024
title: EAS CLI로 branch와 channel 관리하기
description: EAS CLI로 branch를 channel에 연결하고 update를 게시하는 방법을 알아보세요.
---

# EAS CLI로 branch와 channel 관리하기

EAS CLI로 branch를 channel에 연결하고 update를 게시하는 방법을 알아보세요.

EAS Update는 _branch_를 _channel_에 연결하는 방식으로 동작합니다. channel은 build 시점에 지정되며 build의 native code 안에 존재합니다. branch는 Git branch가 commit의 정렬된 목록인 것과 비슷하게, update의 정렬된 목록입니다. EAS Update에서는 어떤 channel이든 어떤 branch에든 연결할 수 있으므로, 서로 다른 build에 서로 다른 update를 제공할 수 있습니다.

위 다이어그램은 이 연결을 시각화한 것입니다. 여기서는 "production" channel을 가진 build가 "version-1.0"이라는 이름의 branch에 연결되어 있습니다. 준비가 되면 channel-branch 포인터를 조정할 수 있습니다. 더 많은 수정 사항을 테스트해 "version-2.0"이라는 branch에 준비해 두었다고 가정해 봅시다. 이 연결을 업데이트해 "production" channel을 가진 모든 build에서 "version-2.0" branch를 사용할 수 있도록 만들 수 있습니다.

## 프로젝트 update 상태 살펴보기

### channel 살펴보기

모든 channel 보기:

```sh
eas channel:list
```

특정 channel 보기:

```sh
eas channel:view [channel-name]
eas channel:view production
```

channel 만들기:

```sh
eas channel:create [channel-name]
eas channel:create production
```

### branch 살펴보기

모든 branch 보기:

```sh
eas branch:list
```

특정 branch와 그 안의 update 목록 보기:

```sh
eas branch:view [branch-name]
eas branch:view version-1.0
```

### update 살펴보기

특정 update 보기:

```sh
eas update:view [update-group-id]
eas update:view dbfd479f-d981-44ce-8774-f2fbcc386aa
```

## 프로젝트 update 상태 변경하기

### 새 update를 만들어 게시하기

```sh
eas update --branch [branch-name] --message "..."
eas update --branch version-1.0 --message "Fixes typo"
```

Git을 사용 중이라면 `--auto` 플래그를 사용해 branch 이름과 message를 자동으로 채울 수 있습니다. 이 플래그는 현재 Git branch를 branch 이름으로 사용하고, 최신 Git commit message를 message로 사용합니다.

```sh
eas update --auto
```

### branch 삭제하기

```sh
eas branch:delete [branch-name]
eas branch:delete version-1.0
```

### branch 이름 바꾸기

branch 이름을 바꿔도 어떤 channel-branch 연결도 끊기지 않습니다. "production"이라는 channel이 "version-1.0"이라는 branch에 연결되어 있고, 이후 "version-1.0"이라는 branch 이름을 "version-1.0-new"로 바꿨다면 "production" channel은 이름이 바뀐 "version-1.0-new" branch에 연결됩니다.

```sh
eas branch:rename --from [branch-name] --to [branch-name]
eas branch:rename --from version-1.0 --to version-1.0-new
```

### branch 안의 이전 update 다시 게시하기

이전 update를 모든 사용자에게 즉시 다시 제공할 수 있습니다. 이 명령은 이전 update를 가져와 다시 게시함으로써 해당 update가 branch에서 가장 최신 update가 되도록 만듭니다. 사용자가 앱을 다시 열면, 앱은 새로 다시 게시된 update를 보고 이를 다운로드합니다.

> Republish는 올바른 commit을 Git history 맨 위에 올려놓는 Git revert와 비슷합니다.

```sh
eas update:republish --group [update-group-id]
eas update:republish --branch [branch-name]
eas update:republish --group dbfd479f-d981-44ce-8774-f2fbcc386aa
eas update:republish --branch version-1.0
```

> 정확한 update group ID를 모른다면 `--branch` 플래그를 사용할 수 있습니다. 이 명령은 branch의 최근 update 목록을 보여 주고, 다시 게시할 update group을 선택할 수 있게 해 줍니다.
