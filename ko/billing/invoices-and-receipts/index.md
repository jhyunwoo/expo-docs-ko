---
modificationDate: October 01, 2025
title: 결제 내역, 청구서 및 영수증 보기
description: 계정의 결제 내역을 확인하고, 청구서와 영수증을 다운로드하고, 청구 금액에 대한 환불을 요청하는 방법을 알아보세요.
---

# 결제 내역, 청구서 및 영수증 보기

계정의 결제 내역을 확인하고, 청구서와 영수증을 다운로드하고, 청구 금액에 대한 환불을 요청하는 방법을 알아보세요.

EAS 대시보드의 **Receipts**는 계정의 결제 내역 정보와 청구서 및 영수증 접근 기능을 제공합니다. 또한 결제 날짜, 결제 상태, 해당 결제의 총금액 정보도 제공합니다. 청구가 잘못되었다고 생각하는 경우에는 해당 금액에 대한 환불도 요청할 수 있습니다.

> **참고**: 계정에 대해 [Owner 또는 Admin 접근 권한](/accounts/account-types#manage-access)이 있어야만 **Receipts**에 접근할 수 있습니다.

## Receipts

계정의 결제 내역을 보려면 탐색 메뉴의 **Account settings** 또는 **Organization settings** 아래에서 [Receipts](https://expo.dev/settings/receipts)를 클릭하세요.

예를 들어 아래에는 [Organization 계정](/accounts/account-types#organizations)의 receipts가 표시됩니다:

### 청구서 다운로드 및 보기

특정 청구 기간의 청구서를 다운로드하고 보려면 [Receipts](https://expo.dev/settings/receipts)로 이동한 뒤 다음을 수행하세요:

-   청구서에 해당하는 청구 기간의 **Date**를 클릭하세요. 그러면 Stripe에서 호스팅하는 페이지로 이동합니다. 예를 들어 아래의 2024년 3월 22일 청구서는 이 페이지로 연결됩니다:

-   **Download invoice**를 클릭하세요. 청구서 PDF 사본을 받을 수 있습니다.

### 영수증 다운로드 및 보기

특정 청구 기간의 영수증을 다운로드하고 보려면 [Receipts](https://expo.dev/settings/receipts)로 이동한 뒤 다음을 수행하세요:

-   영수증에 해당하는 청구 기간의 **Date**를 클릭하세요. 그러면 Stripe에서 호스팅하는 해당 영수증으로 이동합니다. 예를 들어 아래의 2024년 3월 22일 영수증은 이 페이지로 연결됩니다:

-   **Download receipt.**를 클릭하세요. 영수증 PDF 사본을 받을 수 있습니다.

### 환불 요청

[Receipts](https://expo.dev/settings/receipts) 페이지에서 직접 환불을 요청할 수 있습니다. 승인 과정은 수동으로 진행되며, 우리 팀은 환불 전에 오류 여부를 조사합니다.

환불을 요청하려면:

-   영수증 옆의 점 세 개 메뉴를 클릭한 다음 **Request Refund:**를 클릭하세요.

-   **Request a refund** 양식에 환불 관련 세부 정보를 입력한 뒤 **Continue**를 클릭하세요:

-   청구 팀이 환불 요청을 받아 검토합니다. 환불이 승인되면 금액이 결제 수단으로 반환됩니다. 일반적으로 환불이 완전히 처리되기까지 5~10영업일이 걸립니다.

## 청구서 읽기

청구서에는 법적으로 등록된 사업자 이름, 주소, tax ID, 청구서 번호, 만기일 등이 포함됩니다. 또한 각 청구 항목 설명과 총 납부 금액도 포함됩니다. 일반적인 청구서에서는 금액이 다음과 같이 구분됩니다:

-   현재 플랜의 구독 금액(플랜을 구독 중인 경우)
-   초과 사용 요금(해당하는 경우)
-   플랜의 크레딧 한도

청구서가 어떤 형태로 보일 수 있는지 이해하기 위해 세 가지 예를 살펴보겠습니다. [Production](/billing/plans#production), [Enterprise](/billing/plans#enterprise), [Starter](/billing/plans#starter) 플랜을 구독 중이라면 아래 시나리오 중 하나가 적용될 수 있습니다.

### 구독 요금

첫 번째 예에서는 청구서 표에 Production 플랜의 구독 요금이 표시됩니다:

| Description | Quantity | Unit price | Amount |
| --- | --- | --- | --- |
| _FEB 1 - MAR 1, 2025_ |  |  |  |
| EAS Build - Build (Android: 5 large and 5 medium builds; iOS: 5 large and 5 medium builds) | 1 | $40.00 | $40.00 |
| EAS Build - Plan credit | 1 | -$40.00 | -$40.00 |
| _MAR 1 - APR 1, 2025_ |  |  |  |
| Expo Application Services - Production | 1 | $199.00 | $199.00 |
| **Total (USD)** |  |  | **$199.00** |

위 예시에서:

-   첫 번째 항목은 2025년 2월 1일부터 3월 1일까지 청구 기간의 EAS Build 사용량을 설명합니다. 이 기간 동안 생성된 Android 및 iOS 빌드 수와 그 비용에 대한 모든 세부 정보가 포함됩니다.
-   두 번째 항목은 2025년 2월 1일부터 3월 1일까지 청구 기간에 적용되는 Production 플랜의 크레딧 한도($100)를 설명합니다.
-   세 번째 항목은 2025년 3월 1일부터 4월 1일까지 다음 청구 기간에 대한 Production 플랜의 구독 요금을 설명합니다.

EAS Build 사용량($40)이 플랜의 $225 크레딧 금액을 초과하지 않으므로, 구독자는 Production 플랜의 구독 금액인 $199만 지불하면 됩니다.

### 초과 사용 요금

두 번째 예에서는 청구서 표에 초과 사용 요금이 포함된 Production 플랜 구독 요금이 표시됩니다:

| Description | Quantity | Unit price | Amount |
| --- | --- | --- | --- |
| _FEB 1 - MAR 1, 2025_ |  |  |  |
| EAS Build - Build (Android: 35 large; iOS 40 large and 35 medium builds) | 1 | $300.00 | $300.00 |
| EAS Build - Plan credit | 1 | -$225.00 | -$225.00 |
| _MAR 1 - APR 1, 2025_ |  |  |  |
| Expo Application Services - Production | 1 | $199.00 | $199.00 |
| **Total (USD)** |  |  | **$274.00** |

위 예시에서:

-   첫 번째 항목은 2025년 2월 1일부터 3월 1일까지 청구 기간의 EAS Build 사용량을 설명합니다. 이 기간 동안 생성된 Android 및 iOS 빌드 수와 그 비용에 대한 모든 세부 정보가 포함됩니다.
-   두 번째 항목은 2025년 2월 1일부터 3월 1일까지 청구 기간에 적용되는 Production 플랜의 크레딧 한도($225)를 설명합니다.
-   세 번째 항목은 2025년 3월 1일부터 4월 1일까지 다음 청구 기간에 대한 Production 플랜의 구독 요금을 설명합니다.

EAS Build 사용량이 2025년 2월 1일부터 3월 1일까지의 청구 기간에 해당하는 플랜 크레딧 금액을 초과하므로, 구독자는 초과 사용 요금과 다음 청구 기간의 Production 플랜 구독 금액을 함께 지불해야 합니다.

### Starter 요금

세 번째 예에서는 구독자가 Starter 플랜을 사용 중입니다. 청구 기간 동안 발생한 모든 비용이 청구서에 표시됩니다:

| Description | Quantity | Unit price | Amount |
| --- | --- | --- | --- |
| _FEB 1 - MAR 1, 2025_ |  |  |  |
| EAS Build - Build (Android: 10 medium builds; iOS 10 medium builds) | 1 | $45.00 | $45.00 |
| EAS Build - Plan credit | 1 | -$45.00 | -$45.00 |
| _MAR 1 - APR 1, 2025_ |  |  |  |
| Expo Application Services - Starter | 1 | $19.00 | $19.00 |
| **Total (USD)** |  |  | **$19.00** |

위 예시에서:

-   첫 번째 항목은 2025년 2월 1일부터 3월 1일까지 청구 기간의 EAS Build 사용량을 설명합니다. 이 기간 동안 생성된 Android 및 iOS 빌드 수와 그 비용에 대한 모든 세부 정보가 포함됩니다.
-   두 번째 항목은 2025년 2월 1일부터 3월 1일까지 청구 기간에 적용되는 Starter 플랜의 크레딧 한도($25)를 설명합니다.
-   세 번째 항목은 2025년 3월 1일부터 4월 1일까지 다음 청구 기간에 대한 Starter 플랜의 구독 요금을 설명합니다.

EAS Build 사용량이 플랜의 $45 크레딧 금액을 초과하지 않으므로, 구독자는 Starter 플랜의 구독 금액인 $19만 지불하면 됩니다.
