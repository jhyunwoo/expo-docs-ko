---
modificationDate: March 05, 2026
title: update 배포하기
description: 사용자에게 update를 안전하게 배포하기 위한 단순하지만 강력한 프로세스를 알아보세요.
---

# update 배포하기

사용자에게 update를 안전하게 배포하기 위한 단순하지만 강력한 프로세스를 알아보세요.

production에서 여러 binary version의 앱을 운영하고 있다면(이는 흔한 일입니다. 사용자가 항상 최신 store release를 유지하는 것은 아니기 때문입니다), 어떤 버전에서 어떤 코드가 실행되고 있는지 이해하고 특정 버전을 hotfix 대상으로 정확히 지정할 수 있는 것이 중요합니다.

EAS Update는 어떤 앱 버전을 대상으로 삼아야 하는지 결정하고, 배포 상태를 파악하기 위한 bookkeeping을 돕고, 다양한 [배포 패턴](/eas-update/deployment-patterns)을 지원하기 위해 "channel", "branch", "runtime version"을 제공합니다.

선호하는 release 프로세스가 EAS Update에서 지원되지 않으면 어떻게 하나요?

release 관리는 소프트웨어 엔지니어링에서 매우 큰 주제이며, 각자 선호하는 방식이 조금씩 다릅니다. EAS Update는 [다양한 워크플로](/eas-update/deployment-patterns)를 지원하도록 설계되었지만, 이 가이드는 대부분의 앱에 맞는 가장 단순한 워크플로에 초점을 맞춥니다. 다만 EAS Update 서비스의 제약 안에서는 동작하지 않을 수 있는 다른 워크플로도 있습니다. 예를 들어 각 binary version은 항상 단 하나의 channel만 가리켜야 하며, channel을 동적으로 업데이트할 수는 없습니다.

우회 수단으로, [Expo Updates Protocol](/technical-specs/expo-updates-1)과 호환되는 자체 update 서비스를 호스팅하고 `expo-updates` 구성을 그 서비스로 지정할 수 있습니다. protocol 수준에서 update 선택과 관련해 존재하는 개념은 "Runtime Version"과 "Platform"뿐이며, channel과 branch를 만든 방식과 마찬가지로 그 위에 자신만의 개념을 자유롭게 만들 수 있습니다. [커스텀 expo-updates 서버 만들기에 대해 자세히 알아보세요](https://github.com/expo/custom-expo-updates-server).

## 단순한 release 프로세스

이 가이드에서는 **channel**과 **runtime version**을 사용하고 _branch_는 대부분 무시하는 단순하지만 강력한 release 프로세스를 설명합니다. 이렇게 하면 개념적 부담을 최소화하면서도 EAS Update의 장점을 대부분 얻을 수 있습니다. 필요가 생기면 이 프로세스를 발전시켜 나가거나 [다른 배포 패턴](/eas-update/deployment-patterns)으로 이동할 수 있습니다.

왜 이 release 프로세스에서는 branch를 무시하나요?

EAS Update를 사용하는 가장 단순한 방법은 "branch" 개념을 무시하고 "channel"에 집중하는 것입니다. branch는 여전히 존재하지만, 배포를 관리하기 위해 이를 직접 다룰 필요는 없습니다. channel이 가리키는 branch를 channel과 같은 이름으로 유지하고, 둘을 하나의 개념처럼 생각하면 됩니다.

EAS Update branch는 Git branch에 대응하도록 만들어졌으며, 팀이 Git branch에서 같은 이름의 EAS Update branch로 직접 변경 사항을 게시할 수 있게 하려는 목적이 있었습니다. 이는 [update 미리보기](/eas-update/preview)에는 도움이 될 수 있지만, 많은 앱에서는 Git과 이 정도 수준의 통합이 꼭 필요하지는 않습니다. 개발자는 보통 staging 또는 production 버전의 앱에 hotfix를 수동으로 릴리스할 수 있으면 충분하며, 같은 결과를 위해 branch를 관리하는 대신 필요할 때 `eas update --channel staging` 또는 `eas update --channel production`을 실행할 수 있습니다.

## 프로젝트 구성하기

channel은 update가 어떤 환경을 대상으로 하는지("production" 또는 "staging" 등)를 나타내고, runtime version은 update가 어떤 앱 버전을 대상으로 하는지("1.0.0" 또는 "1.0.1" 등)를 나타냅니다.

### channel 구성

아직 실행하지 않았다면 프로젝트에서 `eas update:configure`를 실행하세요.

**EAS Build를 사용한다면**, configure 명령이 적용하는 기본 구성은 여기서 우리가 사용하려는 것과 거의 같습니다. 각 profile은 같은 이름의 channel을 가리키므로, 앱의 production release는 "production" channel을 가리키게 됩니다. 여기에 "staging" channel을 가리키는 "staging" profile만 추가하면 됩니다.

예시 eas.json 구성

다음 구성은 아직 프로젝트를 구성하지 않았다면 `eas update:configure`가 대략 생성해 주는 내용입니다.

```json
{
  "build": {
    "production": {
      "channel": "production"
    },
    "staging": {
      "channel": "staging"
    },
    "preview": {
      "channel": "preview",
      "distribution": "internal"
    }
  }
}
```

**EAS Build를 사용하지 않는다면**, [native project configuration](/eas-update/getting-started#configure-the-update-channel)에서 사용하는 channel을 수정해야 합니다. production에 릴리스할 때는 native config의 channel 이름을 "production"으로 업데이트하고, staging에 릴리스할 때는 native config의 channel 이름을 "preview"로 업데이트해야 합니다. EAS Build와 EAS Update를 함께 사용하면 제품을 최대한 잘 활용할 수 있다는 점은 언급할 만하지만, 필수는 아닙니다.

### runtime version 구성

기본적으로 `eas update:configure`는 app config에 `"runtimeVersion": { "policy": "appVersion" }`를 설정합니다. 이것이 권장 구성입니다. 앱의 runtime version이 항상 앱 버전과 같도록 보장하고, 앱을 릴리스할 때마다 고유한 runtime version을 대상으로 삼을 수 있게 해 주기 때문입니다. 여기서 앱 버전은 사용자가 app store에서 보게 되는 앱의 native version을 의미하며 build number나 version code는 포함하지 않습니다. 예를 들어 runtime version으로는 `"1.0.0"`이 사용되며, `"1.0.0(1)"`은 사용되지 않습니다(`1`은 build number 또는 version code).

예시 app.json 구성

```json
{
  "expo": {
    "runtimeVersion": {
      "policy": "appVersion"
    }
  }
}
```

fingerprint runtime version policy는 어떤가요?

이것이 앞으로 runtime version policy의 미래가 되길 바라지만, 지금은 `"appVersion"` policy를 사용하는 것을 권장합니다. `"fingerprint"` policy는 실험적이며 아직 널리 권장되지는 않습니다.

## preview 배포하기

preview용 update는 internal distribution release build 또는 development build에서 미리 볼 수 있습니다. store beta track에 배포하는 대신 internal distribution을 사용하면 internal tester에게 앱을 배포하는 마찰을 줄일 수 있으며, 예를 들어 pull request마다 build를 공유하거나 작업 중인 초기 콘셉트를 공유하고 싶은 경우에 적합합니다.

### internal distribution release build

위에서 설명했듯이 preview build는 "preview" channel을 가리키게 됩니다. 내부에 배포된 preview 앱의 여러 버전을 동시에 유지하고 싶다면 기능 이름에 따라 channel 이름을 바꿀 수 있습니다. 예를 들어 feature A를 작업할 때 build의 channel을 "preview-feature-a"로 설정하고, feature B를 작업할 때는 "preview-feature-b"로 설정할 수 있습니다.

### development build에서 preview하기

development build는 runtime version이 호환되기만 하면 어떤 channel의 update든 불러올 수 있습니다. 자세한 내용은 [update 미리보기](/eas-update/preview)에서 알아보세요.

## staging에 배포하기

`eas update --channel staging`을 실행해 staging에 update를 게시하세요. 그러면 대상 runtime version을 가진 staging build 사용자에게 hotfix가 즉시 제공됩니다.

staging 환경은 Google Play Beta 또는 TestFlight, 즉 각 app store의 "beta track"이 됩니다. 대안으로 internal distribution을 사용할 수도 있지만, production 릴리스를 위해 코드를 staging하는 경우에는 일반적으로 store beta track에 배포하는 것이 권장됩니다. 이렇게 하면 사용자가 내부 배포 절차를 알지 못해도 앱에 접근할 수 있기 때문입니다(반면 internal distribution을 사용하면 사용자가 expo.dev URL에서 앱을 다운로드해야 합니다).

staging build를 만드는 일반적인 관행 중 하나는 production build를 store에 업로드할 때마다 항상 staging build도 함께 만드는 것입니다. 이렇게 하면 production build와 동일한 runtime을 가진 staging build를 보유할 수 있고, 이를 사용해 production에 rollout하기 전에 update를 테스트할 수 있습니다. EAS Build를 사용한다면 이는 `eas build --profile production --auto-submit`을 실행할 때마다 `eas build --profile staging --auto-submit`도 함께 실행하는 것을 의미합니다.

## production에 배포하기

`eas update --channel production`을 실행해 새 update를 번들링하고 production으로 푸시하세요. 그러면 같은 runtime version을 가진 production build 사용자에게 hotfix가 즉시 제공됩니다.

**이미 staging에 수정 사항을 게시하고 그곳에서 검증했다면**, 반드시 같은 commit에서 다시 게시해야 합니다.

이 release 프로세스에서는 staging과 production에서 동일한 환경 변수와 code signing 구성을 사용하는 것을 권장합니다. 그래야 staging에서 검증한 update가 production에서도 정확히 동일하게 동작함을 보장할 수 있습니다. 이렇게 구성했다면 새 update를 생성하는 대신 `eas update:republish --destination-channel production`으로 update를 promote할 수 있습니다. 이렇게 하면 staging에서 테스트한 것과 정확히 동일한 bundle이 production에서 사용됩니다.

`eas update --channel production`을 실행해 production에 update를 게시하세요. 그러면 같은 runtime version을 가진 production build 사용자에게 hotfix가 즉시 제공됩니다.

### runtime version

새 production build를 만들 때는 앱의 각 릴리스마다 고유한 runtime version을 갖도록 [app version](/build-reference/app-versions#app-versions)을 올리는 것을 권장합니다.

### update 점진적으로 rollout하기

[update별 rollout](/eas-update/rollouts#per-update-rollouts)을 사용해 점점 더 많은 사용자 비율에 update를 점진적으로 배포할 수 있습니다. 예를 들어 `eas update --rollout-percentage 10`은 update를 사용자 10%에게 rollout하며, 이후 `eas update:edit`을 사용해 rollout 비율을 수정할 수 있습니다. 자세한 내용은 [Rollouts](/eas-update/rollouts)에서 알아보세요.

다른 종류의 rollout도 있나요?

또 다른 rollout 유형은 "branch-based rollouts"라고 합니다. 이는 update branch 중심의 배포 전략이 필요하며, 이 가이드에서는 사용하지 않으며 대부분의 사용 사례에서 필요하지도 않습니다.

update별 rollout과 branch-based rollout의 차이는, update별 rollout은 단일 update에서 동작한다는 점입니다(update ID `123`이 `production` channel/branch 사용자 10%에게 rollout됨). 반면 branch-based rollout은 다른 branch로 전환하는 것을 rollout합니다(update의 흐름인 branch `hotfix-123`이 `production` channel 사용자 10%에게 rollout되며, `hotfix-123`은 update ID `123` 또는 `124`를 가리킬 수 있습니다).

### 이전 update version으로 롤백하기

실수로 어느 환경에든 update를 게시했다면 `eas update:rollback`을 실행해 이전 update로 롤백을 시작할 수 있습니다.

자세한 내용은 [Rollbacks](/eas-update/rollbacks)에서 알아보세요.

## 다음 단계

-   [여기서 설명한 내용과 매우 유사한 Persistent staging release process에 대해 자세히 알아보세요](/eas-update/deployment-patterns#persistent-staging-flow).
-   [development build에서 preview update를 사용하는 방법을 살펴보세요](/eas-update/preview).
