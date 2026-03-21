---
modificationDate: September 30, 2025
title: 싱글 사인온(SSO)
description: 조직에서 팀의 Expo 사용자를 관리하기 위해 ID 공급자를 사용하는 방법을 알아보세요.
---

# 싱글 사인온(SSO)

조직에서 팀의 Expo 사용자를 관리하기 위해 ID 공급자를 사용하는 방법을 알아보세요.

싱글 사인온(SSO)은 [Production and Enterprise plan](https://expo.dev/pricing) 고객에게 제공됩니다.

시작하려면 아래의 [IdP용 구성 가이드](/accounts/sso#identity-provider-support)를 따라 Expo SSO용 ID 공급자(IdP)를 준비하고 필요한 정보를 수집하세요. 이 작업을 마치면 Organization의 소유자가 [SSO 활성화](/accounts/sso#setting-up-sso-on-an-organization) 안내를 따라 진행할 수 있습니다.

질문이나 문제가 있으면 [문의](https://expo.dev/contact)해 주세요. 조직 설정을 도와드리겠습니다.

## ID 공급자 지원

Expo SSO는 다음 ID 공급자를 지원합니다:

| Identity providers | Resources |
| --- | --- |
| [Okta](https://www.okta.com/) | [구성 가이드](https://expo.fyi/sso-setup-okta) |
| [OneLogin](https://www.onelogin.com/) | [구성 가이드](https://expo.fyi/sso-setup-onelogin) |
| [Microsoft Entra ID](https://www.microsoft.com/en-us/security/business/microsoft-entra) | [구성 가이드](https://expo.fyi/sso-setup-microsoft) |
| [Google Workspace](https://www.google.com/) | [구성 가이드](https://expo.fyi/sso-setup-google-ws) |

[OpenID Connect Discovery 1.0](https://openid.net/specs/openid-connect-discovery-1_0.html) 사양을 구현하고 있으며, 추가로 호환되는 ID 공급자를 검증하기 위해 작업 중입니다. 다른 ID 공급자를 사용하고 있고 SSO에 관심이 있다면 [알려 주세요](https://expo.dev/contact).

## 조직에서 SSO 설정하기

> Organization 계정에는 반드시 Owner 역할을 가진 비 SSO 사용자가 최소 한 명 있어야 합니다. 이 사용자는 초기 SSO 설정에 필요하며, SSO 구성이 변경되거나 SSO 사용을 중단하는 경우에도 조직에 대한 액세스가 중단되지 않도록 보장합니다.

Organization 계정 소유자로 로그인하세요. 계정의 EAS 대시보드에서 **Settings** > **Organization settings** > **Create SSO configuration for account**로 이동합니다.

**Create SSO configuration for account**에서 **Start** 버튼을 클릭합니다.

IdP 설정 중에 수집한 정보를 사용해 IdP의 구성 세부 정보를 입력합니다:

-   Client ID
-   Client secret
-   필요한 경우 IdP subdomain/tenant ID. 무엇을 입력해야 하는지 도움을 받으려면 Issuer 필드 위의 **?** 아이콘을 클릭하세요.

**Create SSO Configuration**을 클릭합니다.

이제 **Organization settings** > **Overview** 페이지에 **Update SSO configuration** 옵션이 표시됩니다. 클라이언트 시크릿이 변경되면 이 옵션을 사용해 업데이트하세요.

## SSO 사용자 로그인

### Expo 웹사이트

[expo.dev/sso-login](https://expo.dev/sso-login)으로 이동해 조직의 계정 이름을 입력하세요. 조직 이름이 미리 채워진 링크를 만들 수도 있습니다. 예를 들어 [expo.dev/sso-login/test-org](https://expo.dev/sso-login/test-org)는 `test-org`를 미리 채웁니다.

ID 공급자(IdP)에 로그인합니다.

Expo 사용자 이름을 선택하라는 안내가 표시됩니다. 이 이름이 Expo 계정의 사용자 이름이 됩니다.

### Expo CLI

Expo CLI를 사용할 때는 다음 명령으로 Expo 계정에 로그인할 수 있습니다.

```sh
npx expo login --sso
```

브라우저에서 Expo 웹사이트를 통해 로그인하라는 안내가 표시되며, 완료되면 CLI로 다시 리디렉션됩니다.

### EAS CLI

EAS CLI를 사용할 때는 다음 명령으로 Expo 계정에 로그인할 수 있습니다.

```sh
eas login --sso
```

브라우저에서 Expo 웹사이트를 통해 로그인하라는 안내가 표시되며, 완료되면 CLI로 다시 리디렉션됩니다.

### Expo Go

로그인 흐름을 진행할 때 로그인 페이지에서 **Continue with SSO** 버튼을 클릭하세요.

Expo 웹사이트에 로그인하려면 [위 단계](/accounts/sso#expo-website)를 따르세요.

## SSO 사용자 제한 사항

SSO 사용자는 일반 사용자와 유사합니다. 하지만 몇 가지 알려진 예외가 있습니다:

-   SSO 사용자는 자신의 SSO 조직에만 속할 수 있습니다. 또한 추가 Organization을 만들 수 없습니다.
-   SSO 사용자는 자신의 SSO 조직을 떠날 수 없습니다. 그렇게 하면 해당 SSO 사용자가 삭제됩니다.
-   SSO 사용자는 Expo 포럼에 로그인할 수 없습니다.
-   SSO 사용자는 개인 계정에 대해 EAS를 구독할 수 없습니다.

## SSO 관리

새로운 Organization과 기존 Organization 모두 로그인 옵션으로 SSO를 활성화할 수 있습니다. 기존 비 SSO 구성원이 있는 조직은 SSO를 활성화한 뒤 새 구성원에게 SSO 로그인 페이지를 안내할 수 있고, 기존 사용자는 계속 현재 Expo 자격 증명을 사용할 수 있습니다. 외부 기여자를 지원하기 위해 SSO가 활성화된 조직은 이메일을 통해 추가 비 SSO 사용자도 초대할 수 있습니다.

### 기존 사용자를 SSO로 전환하기

일반 사용자는 하나 또는 여러 개인, 팀, Organization 계정의 구성원일 수 있는 반면, SSO 사용자는 자신의 Organization 계정에만 속합니다. 따라서 기존 사용자를 SSO 사용자로 직접 변환할 수는 없습니다. 하지만 이미 조직의 구성원인 일반 사용자는 [SSO login page](https://expo.dev/sso-login)로 이동해 두 번째 사용자를 만들 수 있습니다. 이후 기존 일반 사용자는 조직에서 제거할 수 있습니다.

일반 Expo 계정에서 SSO 계정으로 전환하려면 다음 단계를 따르세요:

[expo.dev](https://expo.dev)에 이미 로그인되어 있는지 확인하세요. 로그인되어 있다면 로그아웃합니다.

[SSO login page](https://expo.dev/sso-login)로 이동해 조직 이름 입력, 새 Expo 사용자 이름 생성, ID 공급자 로그인 등의 안내를 따르세요.

기본적으로 새 SSO 사용자는 View Only 역할을 갖습니다. 다른 역할이 필요하면 Admin 또는 Owner에게 [**Members**](https://expo.dev/accounts/%5Baccount%5D/settings/members) 설정에서 역할을 업데이트해 달라고 요청하세요.

CLI에서 새 계정으로 전환하려면 `eas login --sso`를 실행합니다.

이 시점에서 Admin 또는 Owner는 조직에서 이전 사용자를 제거할 수 있습니다. [**Members**](https://expo.dev/accounts/%5Baccount%5D/settings/members) 설정에서 조직 구성원 목록은 사용자가 SSO 사용자인지 비 SSO 사용자인지를 표시합니다. Admin 또는 Owner는 이전 사용자 옆의 드롭다운을 클릭하고 **Remove member**를 클릭하면 됩니다.

더 이상 이전 사용자 계정이 필요하지 않다면 새 SSO 계정에서 로그아웃한 뒤, 이전 계정으로 로그인해 [**User settings**](https://expo.dev/settings)로 이동하세요. 아래로 스크롤한 다음 **Delete Account**를 클릭합니다. **이 작업을 하면 이전 사용자 계정 아래의 모든 프로젝트가 삭제됩니다.** Organization이 소유한 프로젝트에는 영향을 주지 않습니다.

> 새 SSO 사용자 계정에서 이전 사용자 이름을 재사용하고 싶다면, SSO 계정을 만들기 전에 이전 사용자로 [**User settings**](https://expo.dev/settings)에 가서 이름을 바꿀 수 있습니다. 또는 이전 사용자를 삭제한 뒤 SSO 사용자 계정의 Expo 사용자 이름을 변경할 수도 있습니다. Expo 사용자 이름은 고유해야 하지만, ID 공급자의 이메일 주소가 이전 사용자의 이메일 주소와 같아도 괜찮습니다.

### SSO 사용자 제거하기

누군가 조직을 떠났다면 IdP에서 해당 사용자를 제거하거나 비활성화하세요. IdP에서 구성한 토큰 갱신 기간에 따라, 제거된 사용자는 이후 Expo 계정에 대한 액세스를 잃게 됩니다. 그보다 먼저 제거하고 싶거나 계정의 사용자 목록을 정리하기 위해 제거하고 싶다면 조직의 **Members** 설정 페이지에서 처리할 수 있습니다:

[organization account **Members** settings](https://expo.dev/accounts/%5Baccount%5D/settings/members)로 이동합니다.

삭제하려는 구성원 옆의 드롭다운을 클릭하고 **Delete SSO user**를 클릭합니다.

> 이렇게 하면 해당 사용자의 개인 계정과 그와 관련된 모든 데이터가 삭제됩니다. Organization 계정의 모든 데이터는 영향을 받지 않습니다.

### 청구 변경 또는 SSO 사용 중단

SSO를 계속 사용하려면 활성화된 Production 또는 Enterprise Plan이 필요합니다. SSO 사용을 중단하거나 요금제를 변경하려면 [문의](https://expo.dev/contact)해 주세요.

SSO 활성화 여부와 관계없이 조직에 대한 액세스가 중단되지 않도록 하려면, SSO 조직에는 Owner 역할을 가진 비 SSO 사용자가 최소 한 명 구성원으로 남아 있어야 합니다.

### SSO Organization 삭제하기

Organization에 SSO가 설정된 후에는 계정 삭제를 Expo 팀이 수동으로 처리해야 합니다. 도움이 필요하면 [문의](https://expo.dev/contact)해 주세요.
