---
modificationDate: May 24, 2025
title: 계정 유형
description: Expo 계정의 다양한 유형과 사용 방법을 알아보세요.
---

# 계정 유형

Expo 계정의 다양한 유형과 사용 방법을 알아보세요.

Expo 계정은 Expo 프로젝트를 담는 컨테이너이며, 다양한 수준의 협업을 가능하게 합니다. Expo 계정에는 **Personal**과 **Organization** 두 가지 유형이 있습니다.

새 프로젝트를 어떤 계정 유형에 둘지는 프로젝트의 성격에 따라 달라집니다. 협업하거나 개발 팀을 위한 워크플로를 설정하려는 경우에는 항상 Organization 계정을 만드세요. 개인 프로젝트나 취미 프로젝트에는 Personal 계정이면 충분합니다.

## Personal 계정

Expo에서 [계정을 가입](https://expo.dev/signup)하면 Personal 계정이 자동으로 생성됩니다. 이 계정은 개인 프로젝트를 작업하기에 좋은 공간입니다.

> 어떤 이유로도 Personal 계정의 인증 자격 증명을 다른 사람과 공유하지 마세요.

## Organization

Organization 계정은 회사의 다른 구성원이나 개발자 그룹과 공유하려는 프로젝트를 보관하는 데 가장 적합합니다. 팀이 하나 이상의 프로젝트에서 협업하고 공유 자격 증명에 액세스할 수 있는 공동 컨테이너 역할을 합니다.

Organization 계정에 다른 구성원을 초대한 다음, 조직 내에서의 접근 수준을 부여하는 서로 다른 역할을 이들에게 줄 수 있습니다. 자세한 내용은 [Manage access의 역할 권한](/accounts/account-types#manage-access)을 참조하세요.

다음과 같은 경우 Organization 계정을 만드는 것이 유용합니다:

-   나중에 해당 Organization의 프로젝트에 대한 제어 권한을 이전해야 할 수도 있다고 생각하는 경우.
-   하나 이상의 프로젝트를 협업 팀과 공유하는 경우.
-   둘 이상의 [Owner](/accounts/account-types#manage-access)를 지정해야 하는 경우.
-   비용을 분리해야 하는 경우.
-   조직의 각 구성원에게 역할을 할당해 서로 다른 수준의 액세스를 부여하는 경우.
-   서로 다른 맥락에 맞게 프로젝트를 구성하는 경우. 예를 들어 서로 다른 클라이언트를 위해 작업할 때는 각 클라이언트마다 새 Organization을 만들 수 있습니다.
-   [EAS Subscription](/eas)을 공유하는 경우.

### 새 Organization 만들기

Personal 계정에 로그인한 상태라면 대시보드에서 새 Organization을 만들 수 있습니다:

-   탐색 메뉴에서 계정의 사용자 이름을 선택해 드롭다운 메뉴를 엽니다.
-   드롭다운 메뉴의 Organizations 아래에서 **Create Organization**을 선택합니다.

-   Organization의 이름을 추가하고 **Create** 버튼을 선택합니다.

새 Organization을 만든 후에는 해당 Organization의 새 대시보드 페이지로 이동합니다. 새 프로젝트를 Organization과 연결하려면 프로젝트의 **app.json**에서 `expo` 키 아래에 [`owner` key](/versions/latest/config/app#owner)를 추가해야 합니다.

### Personal 계정을 Organization으로 변환하기

프로젝트 액세스를 다른 구성원과 공유하고 각 구성원에게 역할 기반 권한을 할당하고 싶다면 Personal 계정을 Organization으로 변환할 수 있습니다.

Personal 계정의 **User settings**에서 [Convert your account into an organization](https://expo.dev/settings#convert-account) 섹션으로 이동해 프로세스를 시작하세요.

이 과정을 진행하는 동안, 여러분과 사용자들이 의존하고 있는 모든 기능이 계속 예상대로 동작하도록 매우 신중하게 처리합니다:

-   사용자에게 계속 업데이트와 푸시 알림을 전달할 수 있습니다.
-   Expo 서버에 저장된 Android 또는 iOS 자격 증명을 계속 사용할 수 있습니다.
-   개인 액세스 토큰이나 웹훅을 사용하는 모든 통합은 계속 동작하며, 새로 지정된 소유자로 이전됩니다.
-   EAS 구독은 중단 없이 계속 유지됩니다.
-   프로덕션 앱은 중단 없이 계속 동작합니다.

### 구성원 초대하기

다른 Expo 사용자를 Organization에 초대할 수 있습니다. 새 구성원을 초대하려면:

-   EAS 대시보드의 **Organization settings** 아래 [**Members**](https://expo.dev/settings/members)로 이동합니다.
-   **Invite** 버튼을 클릭합니다. 그러면 조직에 구성원을 초대하는 양식이 열립니다.
-   양식에서 초대하려는 사용자의 이메일을 입력하고, 조직에 참여했을 때 갖게 될 역할을 선택합니다. 자세한 내용은 [Manage access의 역할 권한](/accounts/account-types#manage-access)을 참조하세요.

새 구성원을 초대할 때는 다음 사항을 염두에 두세요:

-   Owner 또는 Admin 역할을 가진 구성원만 다른 사용자를 초대할 수 있습니다.
-   Owner 역할을 가진 구성원은 기존 구성원과 초대 대상자에게 모든 역할을 부여할 수 있습니다.
-   Admin 역할을 가진 구성원은 기존 구성원과 초대 대상자에게 Admin 역할 이하의 역할만 부여할 수 있습니다(Owner를 제외한 모든 역할).

### 구성원 역할 변경하기

구성원의 역할 권한을 변경하려면 [**Owner** 또는 **Admin** 역할](/accounts/account-types#manage-access)이 있는지 확인한 뒤 아래 단계를 따르세요:

-   EAS 대시보드의 **Organization settings** 아래 [**Members**](https://expo.dev/settings/members)로 이동합니다.
-   역할을 변경하려는 구성원 옆의 점 세 개 메뉴 아이콘을 클릭하고 역할을 변경합니다.

### 구성원 제거하기

구성원을 제거하려면 [**Owner** 또는 **Admin** 역할](/accounts/account-types#manage-access)이 있는지 확인한 뒤 아래 단계를 따르세요:

-   EAS 대시보드의 **Organization settings** 아래 [**Members**](https://expo.dev/settings/members)로 이동합니다.
-   제거하려는 구성원 옆의 점 세 개 메뉴 아이콘을 클릭합니다.
-   **Remove member**를 클릭합니다.

### 계정 이름 변경하기

계정 이름은 제한된 횟수만 변경할 수 있습니다. 계정 이름 변경은 Owner만 할 수 있습니다. 계정 이름을 변경하려면 **Organization settings** > [**Overview**](https://expo.dev/accounts/%5Baccount%5D/settings)로 이동한 뒤 [**Rename account**](https://expo.dev/accounts/%5Baccount%5D/settings#rename-account) 아래 안내를 따르세요.

### 계정 간 프로젝트 이전하기

프로젝트는 제한된 횟수만 이전할 수 있습니다. 계정 간에 프로젝트를 이전하려면 사용자는 원본 계정과 대상 계정 모두에서 Owner 또는 Admin이어야 합니다. [**Project settings**](https://expo.dev/accounts/%5Baccount%5D/projects/%5Bproject%5D/settings) > **General**로 이동한 뒤 **Transfer project** 아래 안내를 따르세요.

#### 주의 사항

> 프로젝트의 소유권을 Personal 또는 Organization 계정(원본)에서 다른 사람이나 회사(대상)로 이전하려는데 대상 계정에서 "Owner" 또는 "Admin" 권한이 없는 경우, 에스크로 계정(새 Organization 계정)을 만들 수 있습니다. 이렇게 하면 계정 간에 프로젝트를 이전하려면 사용자가 원본 계정에서는 "Owner"이고 대상 계정에서는 "Owner" 또는 "Admin"이어야 한다는 문제를 해결할 수 있습니다. 에스크로 계정을 만든 뒤에는 최종 대상 계정 구성원에게 에스크로 계정의 Owner 역할을 부여하고, 프로젝트를 안전하게 에스크로 계정으로 이전할 수 있습니다. 그러면 프로젝트를 받는 개인이나 회사는 대상 계정 자체에 대한 액세스 권한을 가진 적이 없더라도 에스크로 계정에서 자신의 대상 계정으로 프로젝트를 이전할 수 있습니다.

### 액세스 관리

구성원에 대한 액세스는 역할 기반 시스템을 통해 관리됩니다. 사용자는 Organization 계정 내에서 _owner_, _admin_, _developer_, _viewer_ 역할을 가질 수 있습니다.

| Role | Description |
| --- | --- |
| **Owner** | 계정이나 모든 프로젝트에 대해 어떤 작업이든 수행할 수 있으며, 삭제도 포함됩니다. |
| **Admin** | 유료 서비스 가입, 다른 사용자의 권한 변경, programmatic access 관리 등 계정의 대부분 설정을 제어할 수 있습니다. |
| **Developer** | 새 프로젝트를 만들고, 새 빌드를 수행하고, 업데이트를 릴리스하고, 자격 증명을 관리할 수 있습니다. |
| **Viewer** | Expo Go를 통해 프로젝트를 볼 수만 있으며 프로젝트를 어떤 방식으로도 수정할 수 없습니다. |

### 보안 활동

보안 활동은 계정 프로필에 발생한 변경 목록입니다. 여기에는 비밀번호, 이메일, 2FA 인증 설정 변경 등이 포함됩니다.

**Overview** > [**User settings**](https://expo.dev/settings) 아래에서 확인할 수 있습니다.
