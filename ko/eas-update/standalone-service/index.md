---
modificationDate: February 13, 2025
title: 다른 EAS 서비스 없이 EAS Update 사용하기
description: Build 같은 다른 EAS 서비스와 독립적으로 EAS Update를 사용하는 방법을 알아보세요.
---

# 다른 EAS 서비스 없이 EAS Update 사용하기

Build 같은 다른 EAS 서비스와 독립적으로 EAS Update를 사용하는 방법을 알아보세요.

EAS Update는 독립형 서비스로도 매우 잘 작동하므로, EAS Build 및 다른 EAS 서비스와 함께 사용해도 되고 그렇지 않아도 됩니다. 주요 기능은 모두 build pipeline에 독립적으로 동작하도록 설계되어 있으며, 다른 EAS 서비스를 사용하지 않는 대규모 조직에서도 production에서 사용되고 있습니다.

다른 EAS 서비스 없이 EAS Update를 사용할 때의 단점은 무엇인가요?

EAS Update와 Build는 서로 긴밀하게 연동되어 각 부분의 합보다 더 큰 경험을 제공합니다. 예를 들어 EAS Build로 build를 만들면 runtime version과 channel 같은 update 관련 여러 측면의 bookkeeping을 도와줍니다.

같은 channel과 runtime version을 사용하는 build는 [expo.dev](https://expo.dev/accounts/%5Baccount-name/projects/%5Bproject-name%5D/deployments)의 **Deployments** 섹션에 그룹화됩니다. build나 앱의 다른 측면에 대한 정보를 바탕으로 동작하는 이런 bookkeeping 및 insight 기능은, EAS Update를 다른 EAS 서비스와 독립적으로 사용하면 제공되지 않습니다.

그렇다고 해도 많은 조직은 이미 자체 CI/CD 인프라에 크게 투자하고 있거나, 다른 build pipeline을 사용하고 싶어 하는 다른 이유가 있을 수 있습니다. 그런 경우 EAS 서비스 간의 더 깊은 통합이 제공하는 이점이 다른 CI/CD provider로 옮기는 전환 비용만큼 가치 있지 않을 수도 있습니다.

## EAS Build 없이 EAS Update 사용하기

[설치 및 구성 단계](/eas-update/getting-started)의 대부분은 EAS Build 사용 여부와 상관없이 동일합니다. 주요 차이는 update [channel](/eas-update/eas-cli) 구성이 어떻게 이루어지느냐입니다. EAS Build를 사용할 때는 **eas.json**의 channel이 build 시점에 자동으로 build의 **AndroidManifest.xml**과 **Expo.plist**에 추가됩니다. EAS Build를 사용하지 않을 때는 [app config에서 request header를 설정](/eas-update/getting-started#configure-update-channels-in-appjson)해 이를 수동으로 구성한 뒤, 서버에서 channel을 수동으로 생성해야 합니다.

```sh
eas channel:create production
```
