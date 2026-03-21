---
modificationDate: January 29, 2026
title: 대역폭 사용량 추정하기
description: EAS Update의 대역폭 사용량을 추정하는 방법을 알아보세요.
---

# 대역폭 사용량 추정하기

EAS Update의 대역폭 사용량을 추정하는 방법을 알아보세요.

## update 대역폭 사용량 이해하기

EAS Update를 사용하면 앱의 비네이티브 부분(JavaScript, 스타일링, 이미지 등)을 OTA 방식으로 업데이트할 수 있습니다. 이 가이드는 대역폭이 어떻게 소비되는지, 그리고 소비량을 어떻게 최적화할 수 있는지 설명합니다.

## 대역폭 계산 세부 내역

각 구독 플랜에는 월별 청구 기간마다 미리 정해진 대역폭 할당량이 포함되며, 여기에 월간 활성 사용자(MAU) 할당량이 함께 제공됩니다([MAU 계산 방식 자세히 알아보기](/eas-update/introduction#how-are-monthly-active-users-counted-for)). 기본 할당량을 초과하는 MAU는 [사용량 기반 요금](https://expo.dev/pricing#update)에 따라 청구되며, 추가된 각 MAU마다 기본 대역폭 할당량에 40 MiB가 더해집니다. 이 대역폭이 추가 대역폭 요금이 발생하기 전에 사용자가 다운로드할 수 있는 update 수를 결정합니다.

다음은 update당 대역폭 사용량을 추정하는 방법입니다:

-   **Update 크기:** 대역폭 소비의 핵심 요소는 기기에 아직 없는 update asset의 크기입니다. update가 앱의 JavaScript 부분만 수정한다면, 사용자는 새 JavaScript만 다운로드합니다. 예시를 시작해 보겠습니다. export 중 생성된 비압축 JavaScript 부분이 **10 MB**라고 가정해 봅시다. 압축을 하면 크기가 더 줄어듭니다.

-   **압축 비율:** 압축 수준은 파일 유형에 따라 달라집니다. JavaScript와 Hermes bytecode(React Native 앱에서 흔히 사용됨)는 압축할 수 있지만, 이미지와 아이콘은 자동으로 압축되지 않습니다. 위 예시에서 Hermes bytecode bundle은 예상 **2.6배 압축 비율**을 달성하며, 실제 다운로드 크기는 다음과 같이 줄어듭니다:

    ```text
    10 MB / 2.6 ≈ 3.85 MB update bandwidth size
    ```

주어진 대역폭 할당량을 바탕으로, 월별 청구 기간 안에서 추가 대역폭 요금이 부과되기 전에 몇 개의 update를 다운로드할 수 있는지 추정할 수 있습니다. 예를 들어 production 플랜에서 60,000 MAU가 있다면, 500,000 MAU와 **월 1 TiB(1,024 GiB)의 대역폭**이 포함됩니다. 사용량 기반 요금으로 구매한 추가 10,000 MAU에는 **MAU당 40 MiB의 대역폭**이 더 주어집니다. 다운로드 가능한 update 총수는 다음과 같습니다:

```text
(1,024 GiB × 1,024 MiB/GiB) + (10,000 MAU × 40 MiB/MAU) = 1,448,576 MiB per month
1,448,576 MiB / 3.85 MiB ≈ 376,254 updates
```

## 실제 update 크기 측정하기

Hermes bundle의 실제 압축 크기를 확인하려면 다음 명령을 실행하세요:

```sh
brotli -5 -k bundle.hbc
gzip -9 -k bundle.hbc
ls -lh bundle.hbc.br bundle.hbc.gz
```

이 명령은 Hermes bundle의 **Brotli 및 Gzip 압축** 버전(**bundle.hbc.br** 및 **bundle.hbc.gz**)을 생성하고 각 크기를 표시합니다. 이를 사용하면 앱의 실제 update 크기에 맞춰 대역폭 계산을 더 정교하게 할 수 있습니다.

## 대역폭 소비에 영향을 주는 요소

실제 대역폭 사용량은 다음 이유로 달라집니다:

-   **사용자 행동:** 이론적 계산은 모든 사용자가 모든 update를 다운로드한다고 가정합니다. 하지만 많은 사용자는 앱을 다시 열 때에만 update를 받으며, 그 과정에서 중간 update를 건너뛰는 경우가 많습니다. 따라서 실제 대역폭 사용량은 보통 이론상 최대치보다 훨씬 낮습니다.
-   **누락된 asset:** update에 build나 이전에 다운로드한 update에 이미 포함되어 있지 않은 font, image 같은 asset이 들어 있다면 이들도 함께 다운로드해야 합니다.

## 대역폭 사용량 최적화하기

1.  **먼저 사용량 모니터링하기:** 대역폭을 관리하는 가장 쉬운 방법은 [사용량 지표](https://expo.dev/accounts/%5Baccount%5D/settings/usage)를 추적하고 비정상적인 급증이나 비효율을 식별하는 것입니다.
2.  **asset 크기 최적화하기:** [이 가이드](/eas-update/optimize-assets)를 참고해 asset 크기를 줄이세요.
3.  **필요 시 asset 제외하기:** [asset selection](/eas-update/asset-selection)을 사용해 각 update에 포함되는 asset 수를 줄이세요. 이는 고급 최적화이므로, 먼저 다른 접근 방식을 시도해 보는 것이 좋습니다.
