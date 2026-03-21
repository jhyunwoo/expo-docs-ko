---
modificationDate: February 28, 2026
title: Git submodule 사용하기
description: EAS Build에서 git submodule을 사용하도록 구성하는 방법을 알아보세요.
---

# Git submodule 사용하기

EAS Build에서 git submodule을 사용하도록 구성하는 방법을 알아보세요.

기본 Version Control Systems(VCS) 워크플로를 사용할 때는 작업 디렉터리의 내용이 Git submodule 내용까지 포함해 그대로 EAS Build에 업로드됩니다. 하지만 CI에서 빌드하거나, **eas.json**에서 `cli.requireCommit`를 `true`로 설정했거나, submodule이 비공개 저장소에 있는 경우에는 빈 디렉터리 업로드를 피하기 위해 submodule을 초기화해야 합니다.

## Submodule 초기화

EAS Build builder에서 submodule을 초기화하려면:

submodule 저장소에 접근 권한이 있는 base64 인코딩된 비공개 SSH 키로 [secret](/eas/environment-variables#visibility-settings-for-environment-variables)을 만드세요.

예를 들어 submodule을 체크아웃하는 [`eas-build-pre-install` npm hook](/build-reference/npm-hooks)을 추가하세요:

```bash
#!/usr/bin/env bash

mkdir -p ~/.ssh

# Real origin URL is lost during the packaging process, so if your
# submodules are defined using relative urls in .gitmodules then
# you need to restore it with:

# git remote set-url origin git@github.com:example/repo.git

# restore private key from env variable and generate public key
umask 0177
echo "$SSH_KEY_BASE64" | base64 -d > ~/.ssh/id_rsa
umask 0022
ssh-keygen -y -f ~/.ssh/id_rsa > ~/.ssh/id_rsa.pub

# add your git provider to the list of known hosts
ssh-keyscan github.com >> ~/.ssh/known_hosts

git submodule update --init
```
