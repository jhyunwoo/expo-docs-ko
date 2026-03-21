---
modificationDate: August 08, 2025
title: 감사 로그
description: 감사 로그를 사용해 계정 활동을 추적하고 분석하는 방법을 알아보세요.
---

# 감사 로그

감사 로그를 사용해 계정 활동을 추적하고 분석하는 방법을 알아보세요.

> 감사 로그는 [Enterprise plan](https://expo.dev/pricing) 고객에게 제공됩니다.

감사 로그는 계정이 Expo Application Services(EAS)로 수행한 작업을 기록합니다. 기록되는 데이터에는 영향을 받은 엔터티, 엔터티에 대해 수행된 수정 유형, 작업을 수행한 주체, 활동이 발생한 시점에 대한 정보가 포함됩니다.

## 핵심 사항

-   감사 로그는 생성만 가능하며 수정하거나 삭제할 수 없습니다. 계정 내에서 발생하는 이벤트를 모니터링하고 문제를 디버깅하는 데 도움이 되는 단일한 진실의 원천 역할을 합니다.
-   **감사 로그는 Enterprise plan 고객에게 제공됩니다**. 구독하면 Expo가 내부적으로 사용하던 일부 로그를 즉시 사용할 수 있고, 다른 유형의 로그는 구독이 활성화된 후부터 수집되기 시작합니다.
-   감사 로그는 1.5년 동안 보관됩니다. 계정이 삭제되면 감사 로그는 90일 후 삭제됩니다.
-   접근하려면 **Account settings**/**Organization settings** > [**Audit logs**](https://expo.dev/accounts/%5Baccount%5D/settings/audit-logs)로 이동하세요.

## 사용 사례

### 권한 모니터링

감사 로그는 조직 내 사용자 초대와 권한 변경을 추적할 수 있습니다. 보안 이벤트의 한 예로는 침해된 직원 계정이 공격자를 조직에 초대하고 그 권한을 [Admin](/accounts/account-types#manage-access)으로 변경하는 상황이 있을 수 있습니다.

이 시나리오에서 감사 로그는 어떤 직원 계정이 공격자를 초대했고 권한을 수정했는지 기록합니다. 감사 로그는 변경 불가능하므로 공격자는 이 기록된 이력을 삭제할 수 없습니다. 다른 조직 구성원들은 감사 로그를 검토해 어떤 계정이 침해되었는지 파악하고, 공격자의 권한을 취소하고 직원 계정을 보호하는 조치를 취할 수 있습니다.

### 액세스 이력

Expo 조직 계정에는 개별 팀에 할당된 배포 인증서를 통해 개발 액세스가 제어되는 많은 프로젝트가 포함될 수 있습니다. 기기가 이러한 팀에 참여하도록 권한을 받을 때는, 이력이 필요한 기록 보존을 위해 액세스가 언제 부여되고 제거되었는지 추적하는 것이 중요합니다. 기기가 현재 Apple 팀에 포함되어 있지 않더라도, 내부 보안 사고가 발생한 경우 이전에 누가 해당 팀에 액세스했는지 확인하는 것이 유용할 수 있습니다.

Expo 팀 설정에 나열된 Apple 기기는 현재 계정에 등록된 기기만 보여 주지만, 감사 로그가 도입되면서 Apple 팀과 기기의 과거 수정 이력을 확인할 수 있게 되었습니다.

## 감사 로그 엔터티

앞으로 더 많은 엔터티를 추가하는 작업을 진행하고 있지만, 현재는 다음 엔터티가 이미 활성화되어 있습니다:

-   Account
-   Account subscription
-   Android App Credentials
-   Android Keystore
-   App Store Connect API key
-   Apple Device
-   Apple Distribution Certificate
-   Apple Provisioning Profile
-   Apple Team
-   EAS Hosting Alias
-   EAS Hosting Custom Domain
-   EAS Hosting Deployment
-   EAS Update Branch
-   EAS Update Channel
-   Google Service Account key
-   iOS App Credentials
-   LogRocket Organization
-   LogRocket Project
-   Organization SSO Configuration
-   Project
-   User Invitation
-   User Permission
-   Workflow
-   Workflow Revision

### 구조

감사 로그 항목에는 다음 필드가 포함됩니다:

| Field | Description |
| --- | --- |
| Actor | 특정 작업을 수행한 계정 주체입니다. |
| Entity Type | `CREATE`, `UPDATE`, `DELETE` 중 하나의 수정 유형으로 변경된 객체입니다. |
| Action Type | 수정 유형입니다: `CREATE`, `UPDATE`, `DELETE`. |
| Message | **Action**에 따라 달라지는 정보를 포함합니다. |
| Created At | 특정 작업이 수행된 시점입니다. |

또한 감사 로그 행을 클릭하면 해당 로그와 관련된 메타데이터를 볼 수 있습니다.

## 내보내기

**감사 로그는 Enterprise plan 고객에게 제공됩니다**. 구독하면 Expo가 내부적으로 사용하던 일부 로그를 즉시 사용할 수 있고, 다른 유형의 로그는 구독이 활성화된 이후 수집됩니다.

Expo 대시보드 밖에서 검토할 수 있도록 감사 로그를 내보낼 수 있습니다. 감사 로그를 내보내려면:

1.  사이드바 메뉴에서 **Account/Organization settings** 아래의 [**Audit logs**](https://expo.dev/accounts/%5Baccount%5D/settings/audit-logs)를 클릭합니다.
2.  감사 로그 페이지 오른쪽 위의 **Export** 버튼을 클릭합니다.
    
3.  원하는 기간 범위를 선택합니다. 내보내기는 최대 30일까지의 기간 범위로 사용할 수 있습니다.
4.  감사 로그가 다운로드 가능한 파일로 내보내집니다.

내보낸 파일에는 **Message** 필드를 제외하고 Audit logs 페이지에 표시되는 모든 필드가 포함됩니다.

> **참고:** 현재 내보내기는 Expo 웹사이트를 통해서만 사용할 수 있습니다. 감사 로그를 프로그래밍 방식으로 내보낼 수 있는 API는 없습니다.
