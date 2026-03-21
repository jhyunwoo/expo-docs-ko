---
modificationDate: June 24, 2025
title: 프로그래밍 방식 액세스
description: 액세스 토큰의 유형과 사용 방법을 알아보세요.
---

# 프로그래밍 방식 액세스

액세스 토큰의 유형과 사용 방법을 알아보세요.

CI를 설정하거나 프로젝트 관리를 돕는 스크립트를 작성할 때는 사용자 이름과 비밀번호를 사용해 인증하는 방법을 피하는 것을 권장합니다. 이런 자격 증명을 사용하면 누구나 로그인해서 계정을 사용할 수 있게 됩니다.

자격 증명을 제공하는 대신 각 통합 지점을 개별적으로 관리할 수 있도록 토큰을 생성할 수 있습니다. 이 토큰에 접근할 수 있는 사람은 누구나 계정에 대해 작업을 수행할 수 있습니다. 사용자 비밀번호와 같은 수준으로 주의해서 다루세요. 무엇인가 유출된 경우에는 이 토큰을 취소해 액세스를 차단할 수 있습니다.

## Personal access tokens

대시보드의 [Access tokens](https://expo.dev/settings/access-tokens)에서 Personal access tokens를 만들 수 있습니다. 이 토큰을 가진 사람은 누구나 여러분을 대신해 작업을 수행할 수 있습니다. 이는 Personal Account의 모든 콘텐츠뿐 아니라, 여러분이 액세스 권한을 부여받은 모든 Personal Accounts 또는 Organizations에도 적용됩니다.

## Robot users and access tokens

계정은 해당 계정이 소유한 리소스에 대해 작업을 수행할 Robot users를 만들 수 있습니다. Bot Users에는 수행이 허용된 작업을 제한하기 위해 [role](/accounts/account-types#manage-access)을 할당할 수 있습니다. Bot users는 어떤 Expo 제품에도 로그인할 수 없고, 스스로 어떤 프로젝트도 소유할 수 없으며, 액세스 토큰을 통해서만 인증할 수 있습니다.

## Access tokens 사용법

만든 모든 토큰을 사용해 EAS CLI로 작업을 수행할 수 있습니다. 토큰을 사용하려면 명령을 실행하기 전에 `EXPO_TOKEN="token"`과 같은 환경 변수를 정의해야 합니다.

`EXPO_TOKEN` 환경 변수를 설정하면 `eas login` 명령을 실행하지 않아도 토큰으로 인증된 모든 EAS CLI 명령을 실행할 수 있습니다. `eas login` 명령은 사용자 이름과 비밀번호 인증에만 사용됩니다. 둘 다 구성되어 있는 경우 `EXPO_TOKEN` 인증 방식이 사용자 이름과 비밀번호보다 우선합니다.

예를 들어 토큰을 발급받으면 다음 EAS CLI 명령을 실행해 빌드를 트리거할 수 있습니다:

```sh
EXPO_TOKEN=my_token eas build
```

GitHub Actions를 사용 중이라면 [`token` property를 구성](https://github.com/expo/expo-github-action#configuration-options)하여 모든 작업 단계에 이 환경 변수를 포함할 수 있습니다.

액세스 토큰이 유용한 일반적인 상황:

-   Expo 사용자 이름과 비밀번호를 제공하지 않고 CI에서 publish하거나 build하는 경우
-   가능한 한 안전하게 유지하기 위해 토큰을 갱신하는 경우. 비밀번호를 재설정하고 모든 세션에서 로그아웃할 필요가 없습니다.
-   제한된 권한으로 특정 사람(또는 스크립트)에게 프로젝트에 대한 일회성 액세스를 제공하는 경우

## 액세스 토큰 취소하기

토큰이 실수로 유출된 경우 사용자 이름과 비밀번호를 변경하지 않고도 토큰을 취소할 수 있습니다. 액세스 토큰을 취소하면 이 토큰을 사용한 계정에 대한 모든 액세스가 차단됩니다. 이렇게 하려면 대시보드의 [Access Token page](https://expo.dev/settings/access-tokens)로 이동해 취소하려는 토큰을 삭제하세요.
