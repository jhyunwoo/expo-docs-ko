---
modificationDate: January 29, 2026
title: 사용량 기반 요금제
description: 플랜 할당량을 초과한 고객에게 Expo가 어떻게 사용량 기반 청구를 적용하는지와, EAS Build 사용량을 모니터링하는 방법을 알아보세요.
---

# 사용량 기반 요금제

플랜 할당량을 초과한 고객에게 Expo가 어떻게 사용량 기반 청구를 적용하는지와, EAS Build 사용량을 모니터링하는 방법을 알아보세요.

Expo는 [플랜](/billing/plans) 허용량을 초과한 고객에게 사용량 기반 청구를 적용합니다. 이를 통해 고객은 한도를 걱정하거나 별도 계약 의무 없이 필요한 만큼 서비스를 사용할 수 있습니다.

사용량 기반 청구는 EAS Build와 EAS Update에 대해 활성화되어 있으며 월 단위로 청구됩니다. [계정의 Billing](https://expo.dev/settings/billing)에서 현재 사용량과 초과 사용 요금의 예상치를 제공합니다.

## 사용량 기반 요금제 작동 방식

### EAS Build

EAS Build에서는 더 높은 우선순위 수준에서 실행된 개별 빌드마다 정액 요금이 부과됩니다. 이 금액은 월별로 합산되어 청구 기간이 끝날 때 청구되며, 플랜을 취소하는 경우에는 그보다 더 빨리 청구될 수 있습니다.

> **참고**: 작업이 시작되기 전에 취소된 빌드에는 요금이 부과되지 않습니다.

[Starter, Production, Enterprise, Legacy 플랜](/billing/plans#plans) 구독자는 EAS Build 크레딧을 받습니다. 이 크레딧은 빌드 비용을 상쇄하는 데 사용할 수 있습니다. 크레딧은 청구 기간 시작 시 초기화되고 청구 기간 종료 시 만료됩니다. 지원되는 빌드 플랫폼과 사용 가능한 resource class의 가격 일정에 대한 자세한 내용은 [가격 페이지](https://expo.dev/pricing)를 참고하세요.

#### 예시: EAS Build 크레딧 사용량

Production 플랜을 구독한 계정이 한 청구 기간 동안 Android 중간 빌드 15개와 iOS 대형 빌드 10개를 사용한 경우를 생각해 보겠습니다:

| Description | Price | Quantity | Total |
| --- | --- | --- | --- |
| Android builds (medium) | $1 | 15 | $15 |
| iOS builds (large) | $4 | 10 | $40 |
| EAS Build Credit |  |  | -$55 |
| **Total (USD)** |  |  | **$0** |

Production 플랜에 크레딧이 포함되어 있으므로, 구독자는 25개 빌드에 대해 $0을 지불합니다.

#### 예시: EAS Build 크레딧 초과

다음은 크레딧 한도를 초과한 또 다른 예시입니다:

| Description | Price | Quantity | Total |
| --- | --- | --- | --- |
| Android builds (medium) | $1 | 20 | $20 |
| Android builds (large) | $2 | 10 | $20 |
| iOS builds (medium) | $2 | 30 | $60 |
| iOS builds (large) | $4 | 40 | $160 |
| EAS Build Credit |  |  | -$225 |
| **Total (USD)** |  |  | **$35** |

이 시나리오에서는 EAS Build Credit이 $225를 부담해 주기 때문에, 구독자는 $260이 아니라 100개 빌드에 대해 $35만 지불합니다.

### EAS Update

> **팁:** [가격 계산기](https://expo.dev/pricing#update)를 사용해 EAS Update 사용량을 추정해 보세요.

EAS Update의 사용량 기반 요금제는 월간 활성 사용자와 글로벌 엣지 대역폭, 두 가지 지표로 구성됩니다.

"updated users"는 청구 기간 동안 적어도 한 번 업데이트를 다운로드한 고유 사용자 수를 의미하며, 이는 "월간 활성 사용자"(MAU)라고도 부릅니다. 글로벌 엣지 대역폭은 구독 플랜의 기본 대역폭 할당량을 초과해 사용한 총 대역폭을 의미합니다. 월간 활성 사용자가 플랜의 기본 MAU 할당량을 초과하는 경우, 추가 사용자 1명당 40 MiB의 글로벌 엣지 대역폭이 포함됩니다.

> **참고**: 월간 활성 사용자는 한 청구 기간에 사용자당 한 번만 계산되며, 그 사용자가 몇 번 업데이트를 다운로드했는지는 영향을 주지 않습니다. EAS Update에서 "user"는 기기에 설치된 앱의 고유 설치본을 의미합니다.

각 플랜에는 구독에 포함되는 월간 활성 사용자 수와 글로벌 엣지 대역폭이 정해져 있습니다. 이 값은 플랜마다 다르며, 최신 수치는 [가격 페이지](https://expo.dev/pricing)에서 확인할 수 있습니다.

#### 예시: EAS Update 사용량

Starter 플랜 구독자가 EAS Update를 통해 5 MiB 크기의 업데이트 20개를 10,000명의 사용자에게 배포한 경우를 생각해 보겠습니다. 이 플랜 구독에는 월간 활성 사용자 3,000명과 월 100 GiB가 포함됩니다. 결과적으로 추가 사용에 대한 청구 금액은 다음과 같습니다:

| Description | Price | Quantity | Total |
| --- | --- | --- | --- |
| Updated users | $0.005 per user | 7,000 | $35 |
| Global edge bandwidth | $0.10 per GiB | 603.13 GiB | $60.31 |
| **Total (USD)** |  |  | **$95.31** |

10,000명 사용자 중 3,000명은 Starter 플랜에 포함됩니다. 따라서 7,000명이 사용량 기반 청구 대상으로 계산됩니다. 7,000명의 추가 updated users에 대해 요금을 지불하면 약 273.4 GiB(7000 users \* 40 MiB / 1024)의 대역폭도 함께 포함됩니다.

글로벌 엣지 대역폭 계산은 다음과 같습니다:

| Description | Calculation | Quantity |
| --- | --- | --- |
| Bandwidth used to send updates | 20 updates \* 5 MiB \* 10,000 users | 976.5625 GiB |
|  |  |  |
| Bandwidth included in plan |  | 100 GiB |
| Bandwidth included with 7,000 extra updated users | 7,000 \* 40 MiB | 273.4375 GiB |
| **Total** | **976.5625 - 100 - 273.4375** | **603.125 GiB** |

같은 구독자가 현재 청구 기간에 동일한 10,000명 사용자에게 5 MiB 크기의 21번째 업데이트를 보낸다면, 추가로 사용된 대역폭에 대해서만 비용을 지불합니다.

| Description | Calculation | Quantity |
| --- | --- | --- |
| Bandwidth used to send updates | 21 updates \* 5 MiB \* 10,000 users | 1,025.39 GiB |
|  |  |  |
| Bandwidth included in plan |  | 100 GiB |
| Bandwidth included with 7,000 extra updated users | 7,000 \* 40 MiB | 273.4375 GiB |
| **Total** | **1,025.39 - 100 - 273.4375** | **651.95 GiB** |

이는 Expo가 [고유한 월간 활성 사용자](/eas-update/introduction#how-are-monthly-active-users-counted-for)에 대해서만 요금을 부과하기 때문입니다. 따라서 이 경우 구독자의 추가 사용 청구 금액은 다음과 같습니다:

| Description | Price | Quantity | Total |
| --- | --- | --- | --- |
| Updated users | $0.005 per user | 7,000 | $35 |
| Global edge bandwidth | $0.10 per GiB | 651.95 GiB | $65.2 |
| **Total (USD)** |  |  | **$100.2** |

같은 구독자가 Production 플랜을 사용 중이라면 Production 플랜에는 월간 활성 사용자 50,000명과 1 TiB(1024 GiB)가 포함되어 있으므로 $0을 지불합니다. 따라서 추가 대역폭 사용이 없습니다.

## 사용량 모니터링

> **참고**: 표시되는 청구 예상치는 최대 24시간(하루)까지 지연될 수 있습니다.

현재 청구 기간의 사용량 요약을 보려면 [Billing](https://expo.dev/settings/billing)으로 이동하세요. **Usage** 아래에서 EAS Build와 EAS Update 사용량 요약을 모두 확인할 수 있습니다.

### EAS Build 사용 내역

현재 또는 이전 청구 기간의 상세한 EAS Build 사용량을 보려면:

-   탐색 메뉴에서 **Usage**를 클릭하세요.
-   **EAS Build** 섹션 아래에서 플랫폼과 resource class별 빌드 수 및 실행된 빌드 세부 정보를 확인할 수 있습니다.

### EAS Update 사용 내역

현재 또는 이전 청구 기간의 상세한 EAS Update 사용량을 보려면:

-   탐색 메뉴에서 **Usage**를 클릭하세요.
-   **EAS Update** 섹션 아래에서 updated users와 글로벌 엣지 대역폭 세부 정보를 확인할 수 있습니다.

### EAS Build 사용량 알림 활성화

EAS Build 사용량을 면밀히 모니터링하려면 **Plan credit usage** 알림을 활성화할 수 있습니다. 그러면 플랜의 EAS Build 크레딧이 80% 및 100% 사용되었을 때 이메일 알림을 받게 됩니다.

EAS Build 크레딧 사용량 알림을 활성화하려면:

-   계정 설정 아래 탐색 메뉴에서 **Email notifications**를 클릭하세요:
-   **EAS Build notifications** 아래에서 **Plan credit usage notifications**에 대해 **Subscribe**를 클릭하세요.

### 빌드 사용량 최적화 방법

[EAS Update](/eas-update/introduction)와 [development builds](/develop/development-builds/introduction)를 사용하면 완전히 새로운 빌드를 만들지 않고도 새 코드를 테스트하고 배포할 수 있습니다. 이렇게 하면 더 빠르게 반복하고 빌드 사용량을 줄일 수 있습니다.

대부분의 앱에서는 JavaScript 코드가 기본 네이티브 코드 및 구성보다 더 자주 변경됩니다. 코드 변경이 있을 때마다 새 빌드를 만들고 있다면, JavaScript와 네이티브 코드 사이의 서로 다른 반복 주기를 활용할 수 있도록 [EAS Update 사용](/eas-update/how-it-works)을 고려해 보세요. 그러면 해당 변경 사항을 빌드 대신 업데이트로 배포할 수 있습니다.

Continuous Integration(CI)/Continuous Deployment(CD)를 사용해 프로덕션 이전 코드를 빌드하는 경우에는, 네이티브 코드가 변경된 경우에만 빌드가 실행되도록 자동화하여 불필요한 사용량을 줄일 수 있습니다. [Expo Fingerprint](https://expo.dev/blog/fingerprint-your-native-runtime)를 사용해 네이티브 코드 변경 여부를 감지하는 워크플로를 CI/CD에 만들고, 변경이 있을 때만 빌드를 실행할 수 있습니다. 그렇지 않다면 네이티브 코드가 변경되지 않은 경우 업데이트를 게시하세요.

development build는 자신의 네이티브 런타임과 호환되는 어떤 EAS Update라도 실행할 수 있습니다. 여러 테스트 채널과 함께 EAS Update를 사용 중이라면, 테스터나 테스트 기기가 같은 development build를 사용하도록 해서 추가 빌드 생성 필요를 줄일 수 있습니다.

### 업데이트 사용량 최적화 방법

EAS Update를 사용할 때 포함하거나 제외할 특정 에셋을 관리할 수 있습니다. 이렇게 하면 업데이트 서버에 업로드되거나 앱으로 다운로드되는 에셋 수와, 사용되는 글로벌 엣지 대역폭을 줄일 수 있습니다.

스토리지와 대역폭 사용량을 최적화하려면 변경되지 않은 에셋을 제외하도록 선택할 수 있습니다. 예를 들어 바뀌지 않은 이미지나 비디오는 제외할 수 있습니다. 제외된 에셋은 업데이트 서버에 업로드되지 않고 앱에서도 다운로드되지 않습니다. 다만 업데이트에 포함되지 않은 에셋이 앱의 네이티브 빌드에 포함되어 있는지 반드시 확인해야 합니다.

> **참고**: 앱이 이미 새 업데이트에도 포함된 에셋을 다운로드한 적이 있다면, 앱은 해당 에셋을 다시 다운로드하지 않습니다. 따라서 계정의 대역폭 사용량에도 추가되지 않습니다.

`npx expo-updates assets:verify <dir>`를 사용해 필요한 모든 에셋이 업데이트에 포함되어 있는지 확인할 수 있습니다. 자세한 내용은 [에셋 선택 및 제외](/eas-update/asset-selection)를 참고하세요.
