---
modificationDate: June 10, 2024
title: 모노레포와 함께 EAS Build 설정하기
description: 모노레포와 함께 EAS Build를 설정하는 방법을 알아보세요.
---

# 모노레포와 함께 EAS Build 설정하기

모노레포와 함께 EAS Build를 설정하는 방법을 알아보세요.

모노레포와 함께 EAS Build를 설정하려면 아래에 설명된 표준 프로세스를 따르면 됩니다:

-   모든 EAS CLI 명령은 앱 디렉터리의 루트에서 실행하세요. 예를 들어 프로젝트가 git 저장소의 **apps/my-app** 안에 있다면, 그 디렉터리에서 `eas build`를 실행하세요.
-   **eas.json**, **credentials.json** 같은 EAS Build 관련 파일은 모두 앱 디렉터리 루트에 있어야 합니다. 모노레포에서 EAS Build를 사용하는 앱이 여러 개라면, 각 앱 디렉터리는 이 파일들의 자체 사본을 가져야 합니다.
-   **모노레포에서 managed 프로젝트를 빌드하는 경우**, [모노레포 작업하기](/guides/monorepos) 가이드를 참고하세요.
-   프로젝트에 제공된 것 이상의 추가 설정이 필요하다면, 프로젝트의 **package.json**에 `postinstall` 단계를 추가하여 다른 workspace의 필요한 의존성을 모두 빌드하세요. 예를 들면:

```json
{
  "scripts": {
    "postinstall": "cd ../.. && yarn build"
  }
}
```
