---
modificationDate: January 29, 2026
title: 플랜, 청구 및 결제 FAQ
description: Expo Application Services (EAS) 플랜, 청구 및 결제에 대해 자주 묻는 질문 모음입니다.
---

# 플랜, 청구 및 결제 FAQ

Expo Application Services (EAS) 플랜, 청구 및 결제에 대해 자주 묻는 질문 모음입니다.

이 페이지는 [Expo Application Services (EAS)](/eas)의 플랜, 청구 및 결제에 대해 자주 묻는 질문을 다룹니다.

## 플랜

### 플랜은 어떻게 변경하나요?

Organization 계정의 플랜을 변경하려면 [Owner 또는 Admin 역할 권한](/accounts/account-types#manage-access)이 있는지 확인하세요. Personal 계정은 항상 **Owner** 역할을 가집니다. 자세한 내용은 [멤버의 역할 변경하기](/accounts/account-types#change-the-role-of-a-member)를 참고하세요.

역할을 확인한 뒤에는 업그레이드를 위해 [새 플랜으로 업그레이드하기](/billing/manage#upgrade-to-a-new-plan)를, 기존 플랜을 다운그레이드하려면 [플랜 다운그레이드하기](/billing/manage#downgrade-a-plan)를 참고하세요.

### 플랜은 어떻게 취소하나요?

자세한 내용은 [플랜 취소하기](/billing/manage#cancel-a-plan)를 참고하세요.

### 잘못된 계정에서 구독했다면 어떻게 하나요?

잘못된 계정에서 플랜을 구독했다면:

-   EAS 대시보드의 탐색 메뉴에서 **Account** 아래에 있는 계정 전환을 사용해 원래 구독하려던 계정으로 전환하세요.
-   [Billing](https://expo.dev/settings/billing)으로 이동한 뒤 **Current Plan** 아래에서 [올바른 플랜을 구독하는 단계](/billing/manage#upgrade-to-a-new-plan)를 따르세요.
-   잘못 구독한 계정에서는 **[Receipts](https://expo.dev/accounts/%5Baccount%5D/settings/receipts)** 로 이동해 [환불 요청](/billing/invoices-and-receipts#request-a-refund)을 시작하세요.

### Free 플랜을 사용 중이고 빌드나 업데이트가 조금만 더 필요합니다

Free 플랜을 사용 중이며 월간 무료 빌드 및 업데이트 할당량을 모두 사용했다면 [Starter 플랜](/billing/plans)으로 업그레이드하세요. 월 19달러로 빌드 크레딧 45달러와 EAS Update용 월간 활성 사용자 3,000명을 제공받습니다(Free 플랜은 1,000명). 요구 사항이 충족되면 [Starter 플랜에서 Free 플랜으로 다운그레이드](/billing/manage#cancel-a-plan)할 수 있습니다.

Free 플랜에서 Starter 플랜으로 업그레이드하려면 [새 플랜으로 업그레이드하기](/billing/manage#upgrade-to-a-new-plan)를 참고하세요.

Starter 플랜에서 Free 플랜으로 다운그레이드하려면 [플랜 취소하기](/billing/manage#cancel-a-plan)를 참고하세요.

### 유료 플랜의 EAS Build 크레딧을 다 썼습니다. Free 플랜으로 내려가 무료 빌드 크레딧을 사용할 수 있나요?

아니요. 유료 플랜을 구독 중이고 포함된 EAS Build 크레딧을 모두 사용했다면, 추가 빌드는 [사용량 기반 요금제](/billing/usage-based-pricing)로 청구됩니다.

구독을 취소하더라도 Free 플랜은 현재 청구 기간이 끝난 뒤에 적용됩니다. 유료 구독이 종료되고 계정이 Free 플랜으로 전환되면, Free 플랜의 월간 할당량을 사용할 수 있습니다(해당 플랜의 한도 및 초기화 일정에 따름). 자세한 내용은 [플랜 취소하기](/billing/manage#cancel-a-plan)를 참고하세요.

### 유료 구독으로 업그레이드할 때 남은 Free 플랜 크레딧을 이전할 수 있나요?

아니요. Free 플랜 크레딧은 다른 구독 플랜으로 이전할 수 없습니다. 모든 유료 플랜은 EAS Build 우선 빌드를 가능하게 하는 크레딧과, 더 많은 월간 활성 사용자 및 추가 대역폭을 통해 EAS Update 접근 범위를 넓혀 주는 혜택을 제공합니다.

## 청구

### 플랜의 청구 기간은 언제 시작되나요?

Free 플랜의 청구 기간은 매월 첫날에 시작됩니다.

[모든 유료 플랜](/billing/plans#plans)의 청구 기간은 해당 플랜을 구독한 날짜부터 시작됩니다.

### 청구 정보는 어떻게 업데이트하거나 tax ID를 추가하나요?

Organization 계정의 청구 정보를 업데이트하거나 tax ID를 추가하려면 [Owner 또는 Admin 역할](/accounts/account-types#manage-access)이 있는지 확인하세요. Personal 계정은 항상 **Owner** 역할을 가집니다. 역할을 확인한 뒤에는:

-   [계정의 Billing](https://expo.dev/settings/billing)으로 이동한 뒤 **Manage billing information**을 클릭하세요. 그러면 Stripe 포털로 이동합니다.
-   Stripe 포털의 **Billing information** 아래에서 **Update information**을 클릭해 청구 이름, 이메일, 주소, tax ID 같은 청구 관련 정보를 수정하세요.

자세한 내용은 [청구 정보 관리하기](/billing/manage#manage-billing-information)를 참고하세요.

### 지난번 청구서의 청구 정보를 업데이트할 수 있나요?

아니요. 청구 정보를 업데이트해도 다음 청구서부터 반영됩니다.

### 영수증을 이메일로 받을 수 있나요?

아니요. 계정의 Owner 또는 Admin이 직접 다운로드할 수 있습니다. 자세한 내용은 [청구서 다운로드하기](/billing/invoices-and-receipts#download-and-view-an-invoice)를 참고하세요.

### EAS Update를 사용해 EAS Build 사용량을 줄이려면 어떻게 하나요?

[EAS Update](/eas-update/introduction)와 [development builds](/develop/development-builds/introduction)를 사용하면 새 빌드를 만들지 않고도 새 코드를 테스트하고 배포할 수 있습니다. 대부분의 앱에서는 기본 네이티브 코드보다 JavaScript 코드가 더 자주 바뀌므로 이 방식이 더 적합합니다. EAS Update로 여러 테스트 채널을 만들면 팀에서 추가 빌드를 만들 필요를 줄일 수 있습니다. 앞으로는 [Expo Fingerprint](https://expo.dev/blog/fingerprint-your-native-runtime)를 사용해 이미 호환 가능한 네이티브 런타임이 있는지에 따라 빌드 또는 업데이트를 선택적으로 수행할 수도 있습니다.

자세한 내용은 [빌드 사용량 최적화 방법](/billing/usage-based-pricing#how-to-optimize-build-usage)을 참고하세요.

### 다음 청구 금액은 어떻게 예상할 수 있나요?

다음 청구 금액을 예상하려면 [Billing](https://expo.dev/settings/billing)으로 이동하세요. **Usage this month** 아래에서 [resource class](/build/eas-json#selecting-resource-class)에 따른 EAS Build 사용량, 월간 활성 사용자 및 글로벌 엣지 대역폭에 따른 EAS Update 사용량, 그리고 두 항목에 대해 지금까지 지출된 금액 요약을 볼 수 있습니다.

자세한 내용은 [사용량 기반 요금제 작동 방식](/billing/usage-based-pricing#how-usage-based-pricing-works)을 참고하세요.

### EAS Update의 월간 활성 사용자(MAU)란 무엇인가요?

월간 활성 사용자(MAU)는 하나의 월간 청구 기간 동안 EAS Update를 통해 적어도 한 번 업데이트를 다운로드한 앱의 고유 사용자를 의미합니다. 자세한 내용은 [청구 기간 동안 월간 활성 사용자를 계산하는 방법](/eas-update/introduction#how-are-monthly-active-users-counted-for)을 참고하세요.

## 결제

### 연간 결제가 가능한가요?

연간 플랜은 [Enterprise 플랜](/billing/plans#enterprise) 고객에게 제공됩니다. 자세한 내용은 [문의하기](https://expo.dev/contact)를 참고하세요.

### 결제 정보를 어떻게 업데이트하나요?

Organization 계정의 결제 정보를 업데이트하려면 [Owner 또는 Admin 역할](/accounts/account-types#manage-access)이 있는지 확인하세요. Personal 계정은 항상 **Owner** 역할을 가집니다. 역할을 확인한 뒤에는:

-   [계정의 **Billing**](https://expo.dev/settings/billing)으로 이동한 뒤 **Manage billing information**을 클릭하세요. 그러면 Stripe 포털로 이동합니다.
-   Stripe 포털의 **Payment method** 아래에서 **Add payment method**를 클릭해 새 결제 수단을 추가하세요.

자세한 내용은 [청구 정보 관리하기](/billing/manage#payment-method)를 참고하세요.

### Automated Clearing House(ACH)나 은행/전신 송금으로 결제할 수 있나요?

연간 플랜을 사용하는 [Enterprise 플랜](/billing/plans#enterprise) 고객은 신용카드 결제 대신 ACH로 결제할 수 있습니다. 자세한 내용은 [문의하기](https://expo.dev/contact)를 참고하세요.

### W-9나 기타 법적 문서가 필요합니다

W-9를 요청하려면 [문의하기](https://expo.dev/contact)를 이용하세요.

법적 약관은 [expo.dev/terms](https://expo.dev/terms)에서 확인할 수 있습니다.

### Expo가 제 카드 정보를 저장하나요?

아니요. Expo는 저장하지 않습니다. 결제 시스템은 Stripe를 사용하며, 카드 정보는 Stripe가 처리합니다. 자세한 내용은 [Stripe의 보안 처리 방식](https://docs.stripe.com/security)을 참고하세요.

### 이번 달 대형 빌드에 얼마를 지불했는지 어떻게 확인하나요?

대형 빌드 비용을 보려면 [Billing](https://expo.dev/settings/billing)으로 이동하세요. **Usage this month** 아래에서 [resource class](/build/eas-json#selecting-resource-class)에 따른 EAS Build 사용량 요약과 지출 금액을 확인할 수 있습니다.

## Add-ons

### 계정의 빌드 동시 실행 수를 늘리려면 어떻게 하나요?

이미 유료 EAS 플랜을 구독 중이라면 **Billing** 아래 [**Add-ons**](https://expo.dev/settings/billing) 섹션에서 추가 동시 실행 수를 구매할 수 있습니다.

Free 플랜이라면 먼저 유료 구독을 설정해야 합니다. [여기를 클릭](https://expo.dev/accounts/%5Baccount%5D/settings/billing/cart)해 새 플랜을 선택하세요. 그다음 결제 페이지에서 구독에 추가할 동시 실행 수를 선택하세요.

각 플랜에 기본 포함되는 동시 실행 수는 서로 다릅니다. 추가로 5개보다 더 많은 동시 실행 수가 필요하다면 [문의하기](https://expo.dev/contact)를 이용하세요.
