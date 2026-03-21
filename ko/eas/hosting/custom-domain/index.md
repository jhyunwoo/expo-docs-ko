---
modificationDate: October 22, 2025
title: 커스텀 도메인
description: 프로덕션 deployment에 커스텀 도메인을 설정하는 방법을 알아보세요.
---

# 커스텀 도메인

프로덕션 deployment에 커스텀 도메인을 설정하는 방법을 알아보세요.

기본적으로 EAS Hosting의 프로덕션 deployment는 `my-app.expo.app`처럼 보입니다. 여기서 `my-app`은 선택한 preview 서브도메인 이름입니다. 도메인을 소유하고 있다면 이를 프로덕션 deployment의 커스텀 도메인으로 할당할 수 있습니다.

각 프로젝트에는 정확히 하나의 커스텀 도메인만 연결할 수 있으며, 이 도메인은 프로덕션 deployment에 할당됩니다.

> **참고**: 커스텀 도메인 설정은 프리미엄 기능이며 무료 플랜에서는 사용할 수 없습니다. 서로 다른 플랜과 혜택에 대한 자세한 내용은 [EAS pricing](https://expo.dev/pricing)을 참고하세요.

## 사전 요구 사항

프로덕션 deployment가 있는 EAS Hosting 프로젝트

커스텀 도메인은 항상 프로덕션 deployment를 로드합니다. 따라서 프로젝트에 커스텀 도메인을 추가하려면 먼저 production으로 승격된 deployment가 있어야 합니다.

도메인 이름

사용하려는 도메인 이름을 직접 소유하고 있어야 합니다.

## 커스텀 도메인 할당하기

1.  프로젝트 대시보드에서 [Hosting settings](https://expo.dev/accounts/%5BaccountName%5D/projects/%5BprojectName%5D/hosting/settings)로 이동합니다.
    
2.  프로덕션 deployment가 없다면 먼저 이를 할당하라는 안내가 표시됩니다.
    
3.  **Custom domain** 아래에 설정하려는 커스텀 도메인을 입력합니다. apex 도메인과 서브도메인을 모두 지원합니다. `example.com`을 소유하고 있다면 다음 중 하나를 선택할 수 있습니다.
    
    -   `example.com`: apex 도메인
    -   `anything.example.com`: 서브도메인
4.  다음으로 DNS 제공업체에서 몇 가지 DNS 레코드를 입력하라는 안내가 표시됩니다.
    
    -   **Verification**: 도메인 소유권을 증명하기 위해 사용합니다.
    -   **SSL**: SSL 인증서를 설정하기 위해 사용합니다.
    -   **CNAME**(서브도메인) 또는 **A record**(apex 도메인): 도메인을 프로덕션 deployment로 연결합니다.
5.  모든 검사가 통과할 때까지 새로고침 버튼을 누르세요. DNS 제공업체에 따라 이 단계는 보통 몇 분 정도면 끝납니다.
    

> 도메인 이름 전환 시 **zero downtime**이 필요하다면, 표에 제시된 순서대로 이 레코드들을 하나씩 입력하는 것이 중요합니다. 즉 먼저 **Verification TXT** 레코드를 추가하고, UI에서 verification 레코드가 확인될 때까지 "Refresh"를 누르세요. 그다음 **SSL CNAME** 레코드를 추가해 확인될 때까지 기다리고, 마지막에 세 번째 레코드를 설정하세요. 다운타임이 중요하지 않거나 해당되지 않는다면 세 개의 DNS 레코드를 한 번에 모두 추가해도 됩니다.

앱에 커스텀 도메인을 할당하고 나면, 커스텀 도메인은 **production** deployment로 라우팅됩니다.

### 커스텀 도메인 DNS 레코드

대시보드에 표시되는 세 개의 레코드 중 두 개는 도메인 소유권을 검증하기 위한 것입니다. **Verification TXT** 레코드는 읽어 올 수 있는 커스텀 토큰을 추가해, 당신이 제어하는 도메인에서 도메인을 설정하고 있음을 증명합니다. **SSL CNAME** 레코드는 인증 기관에 도메인 소유권을 증명하며, 이를 Domain Control Validation(DCV)이라고도 합니다. 이 레코드는 갱신과 검증이 자동화된 프로세스에 위임되기 때문에 CNAME 레코드이며, 덕분에 인증서 만료를 방지할 수 있습니다.

두 레코드 모두 설정하려는 커스텀 도메인의 서브도메인에 생성됩니다.

-   `example.com`을 설정하는 경우 각각 `_cf-custom-hostname.example.com`과 `_acme-challenge.example.com`에 레코드를 생성해야 합니다.
-   `anything.example.com`을 설정하는 경우 각각 `_cf-custom-hostname.anything.example.com`과 `_acme-challenge.anything.example.com`에 레코드를 생성해야 합니다.

마지막으로 대시보드에 표시되는 세 번째 DNS 항목은 항상 도메인을 EAS Hosting으로 연결하는 실제 DNS 레코드입니다.

-   apex 도메인의 경우 대시보드는 일반적으로 `172.66.0.241`을 가리키는 **A record**를 권장합니다.
-   서브도메인의 경우 대시보드는 일반적으로 `origin.expo.app`을 가리키는 **CNAME record**를 권장합니다.

이 두 레코드는 기능상 동일하지만, 일부 DNS 제공업체는 apex 도메인에서 CNAME 레코드 설정을 허용하지 않습니다.

### Alias와 와일드카드 서브도메인

> **2025년 3월 19일** 이전에 이미 커스텀 도메인을 설정해 두었다면, 와일드카드 도메인 설정 안내를 따르기 전에 프로젝트의 [Hosting settings](https://expo.dev/accounts/%5BaccountName%5D/projects/%5BprojectName%5D/hosting/settings)에서 "Refresh" 버튼을 눌러야 합니다.

프로젝트당 하나의 커스텀 도메인만 설정할 수 있지만, 프로덕션 alias 외의 다른 alias 요청을 처리하도록 추가 서브도메인 DNS 레코드를 설정할 수 있습니다. 요청은 서브도메인과 이름이 일치하는 alias에 할당된 deployment로 라우팅됩니다.

예를 들어 [`staging` alias를 만든 뒤](/eas/hosting/deployments-and-aliases#aliases) alias용 CNAME 레코드를 다음처럼 설정할 수 있습니다.

-   apex 도메인(예: `example.com`)을 설정했다면 `staging.example.com`에 `origin.expo.app`을 가리키는 CNAME 레코드를 생성합니다.
-   서브도메인(예: `anything.example.com`)을 설정했다면 `staging.anything.example.com`에 `origin.expo.app`을 가리키는 CNAME 레코드를 생성합니다.

생성한 어떤 alias로도 모든 서브도메인 요청을 보내고 싶다면, 대신 와일드카드 CNAME 레코드를 설정할 수 있습니다.

-   apex 도메인(예: `example.com`)을 설정했다면 `*.example.com`에 `origin.expo.app`을 가리키는 CNAME 레코드를 생성합니다.
-   서브도메인(예: `anything.example.com`)을 설정했다면 `*.anything.example.com`에 `origin.expo.app`을 가리키는 CNAME 레코드를 생성합니다.

와일드카드 CNAME 레코드는 항상 `*`로 시작하며 어떤 서브도메인이든 뜻합니다. 커스텀 도메인의 서브도메인이 `origin.expo.app`을 가리키도록 설정되어 있는 한, EAS Hosting은 이름이 일치하는 alias에 할당된 deployment로 요청을 보내려고 시도합니다.

예외는 `www` 서브도메인입니다. `www` 서브도메인을 설정했고 `www`라는 이름의 alias가 없다면, 요청은 308 응답과 함께 커스텀 도메인으로 리디렉션되며 프로덕션 deployment에 대한 요청으로 처리됩니다. 커스텀 도메인의 `www` 서브도메인에 대해서만 자동 리디렉션을 설정하려면 `www.<yourdomain>`에 `origin.expo.app`을 가리키는 CNAME 레코드를 생성하세요.
