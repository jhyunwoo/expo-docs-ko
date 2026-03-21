---
modificationDate: March 01, 2026
title: CodePush에서 마이그레이션하기
description: CodePush에서 EAS Update로 마이그레이션하는 데 도움이 되는 가이드입니다.
---

# CodePush에서 마이그레이션하기

CodePush에서 EAS Update로 마이그레이션하는 데 도움이 되는 가이드입니다.

이 가이드는 CodePush를 사용하는 React Native 프로젝트를 [많은 장점](/eas-update/introduction#pitch)을 제공하는 EAS Update로 전환하는 방법을 설명합니다. 기본 React Native 프로젝트 구조를 사용하고 있다고 가정합니다. brownfield 네이티브 앱을 EAS Update로 마이그레이션하는 데 도움이 필요하다면 [기존 네이티브 앱에서 EAS Update 사용하기](/eas-update/integration-in-existing-native-apps)를 참고하세요.

CodePush와 EAS Update의 차이를 더 알아보려면 [CodePush와 EAS Update의 개념적 차이](/eas-update/codepush#conceptual-differences-between-codepush-and-eas-update)와 Expo Blog의 [What to do without CodePush 게시물](https://expo.dev/blog/what-to-do-without-codepush)을 참고하세요.

## 앱이 최신 Expo SDK 버전을 사용하고 있는지 확인하기

CodePush에서 EAS Update로 마이그레이션하려면 최신 Expo SDK 버전을 사용하는 것을 권장합니다. 오래된 Expo SDK와 React Native 버전에 대해서는 별도 안내가 제공되지 않습니다. 프로젝트가 사용 중인 오래된 Expo SDK 및 React Native 버전에 맞게 안내를 조정하면 마이그레이션에 성공할 수도 있지만, 오래된 버전과의 통합에 대한 추가적인 직접 지원은 enterprise 고객에게만 제공됩니다([문의하기](https://expo.dev/contact)).

## CodePush 제거하기

충돌과 예기치 않은 동작을 피하려면 EAS Update를 사용하는 경우 CodePush를 제거하는 것이 좋습니다. 앱이 주기적으로 두 서비스 모두에서 update를 가져오게 되어, 특히 서로 다른 구성을 사용하고 있다면 문제가 생길 수 있기 때문입니다.

`react-native-code-push` package를 제거해 프로젝트에서 CodePush SDK를 삭제하세요:

```sh
npm uninstall react-native-code-push
```

또한 JS와 네이티브 코드에서 CodePush 참조도 제거해야 합니다. 더 자세한 안내는 이 [GitHub comment](https://github.com/Microsoft/react-native-code-push/issues/1101#issuecomment-350204507)를 참고하세요.

## `app.json`에 `expo` key 추가하기

프로젝트에 `expo` 객체를 포함한 **app.json** 파일이 있는지 확인하세요. 아직 **app.json**에서 특별히 구성할 항목이 없다면, 아래처럼 비어 있는 `expo` 객체만 포함한 최소 파일을 만들어도 됩니다:

```json
{
  "expo": {
    //... any other existing keys you have
  }
}
```

## "Getting Started" 가이드 따라가기

[EAS Update Getting Started guide](/eas-update/getting-started)의 안내에 따라 프로젝트에서 EAS Update를 설정하세요.

## 앱 다시 제출하기

update provider를 CodePush에서 EAS Update로 바꾸었기 때문에, 최종 사용자에게 update 메커니즘이 기대한 대로 동작하도록 앱을 다시 빌드하고 각 app store(Google Play Store와 Apple App Store)에 새 build를 제출해야 합니다.

새 애플리케이션 build를 제출할 때는 각 store의 제출 가이드를 따르세요:

-   [Google Play Store에 제출하기](/submit/android)
-   [Apple App Store에 제출하기](/submit/ios)

앱 제출이 성공적으로 끝나면, 사용자는 EAS Update 통합이 포함된 최신 build를 다운로드해 사용할 수 있습니다. 앱이 예상대로 업데이트되지 않는다면 [구성을 검증하세요](/eas-update/debug).

## 자주 묻는 질문

EAS Update로 mandatory/critical update를 릴리스하려면 어떻게 하나요?

CodePush CLI에는 mandatory update를 릴리스할 수 있는 `--mandatory` 플래그가 있습니다. EAS Update로도 이 기능을 구현할 수 있지만 별도의 전용 플래그는 없습니다.

[mandatory/critical update에 대해 더 알아보기](/eas-update/download-updates#criticalmandatory-updates).

update에 메시지를 포함하려면 어떻게 하나요?

CodePush CLI에는 update에 메시지를 포함할 수 있는 `--description` 플래그가 있습니다. EAS Update에서는 app config의 `extra` 필드를 사용해 이 기능을 구현할 수 있습니다.

이 예제의 `--message` 플래그를 참고하세요: [`expo/UpdatesAPIDemo`](https://github.com/expo/UpdatesAPIDemo).

CodePush의 sync() 함수처럼 런타임에 사용 중인 'deployment'를 전환하려면 어떻게 하나요?

`Updates.setUpdateURLAndRequestHeadersOverride()`를 사용하면 가능합니다. [Override update configuration at runtime](/eas-update/override) 가이드에서 자세히 알아보세요.

EAS Update로 staging과 production 같은 서로 다른 환경을 어떻게 처리하나요?

EAS Update에서는 channel과 branch를 사용해 서로 다른 환경과 rollout을 관리할 수 있습니다. [자세히 알아보기](/eas-update/eas-cli).

EAS Update로 update를 롤백하려면 어떻게 하나요?

`eas update:rollback`을 사용해 update를 롤백할 수 있습니다. [이전 update로 롤백하기](/eas-update/rollbacks) 가이드에서 자세히 알아보세요.

EAS Update로 update를 점진적으로 rollout하려면 어떻게 하나요?

EAS Update는 update를 점진적으로 rollout하기 위한 다양한 전략을 지원하므로, 필요에 가장 잘 맞는 접근 방식을 선택할 수 있습니다. [자세히 알아보기](/eas-update/rollouts).

update를 언제 다운로드하고 적용할지 직접 제어하려면 어떻게 하나요?

앱 실행 중이나 백그라운드 상태에서 `Updates.checkForUpdateAsync()`를 사용해 update를 확인하는 등의 전략은 [Downloading updates](/eas-update/download-updates) 가이드에서 자세히 알아보세요.

EAS Update는 end-to-end code signing을 지원하나요?

네, EAS Update는 end-to-end code signing을 지원합니다. EAS Production 및 Enterprise 플랜 구독자에게 제공됩니다. [Code signing](/eas-update/code-signing) 가이드에서 자세히 알아보세요.

그 밖에 알아두어야 할 것이 있나요?

-   Expo Orbit: macOS, Windows, Linux용 데스크톱 launcher 앱입니다. 다른 기능과 함께 웹사이트에서 [update를 실행](/review/with-orbit)할 수 있습니다.
-   EAS 웹사이트에서 update 채택 현황을 모니터링할 수 있습니다. [자세히 알아보기](/eas-update/download-updates#monitoring-adoption-of-updates). 웹사이트에서 update를 rollout하거나 rollback할 수도 있습니다.
-   EAS Update를 사용해 웹과 비슷한 preview workflow를 만들 수 있습니다. [자세히 알아보기](/eas-update/preview).
-   EAS로 만든 각 update와 build에는 [fingerprint](/versions/latest/sdk/fingerprint)가 연결됩니다. 웹사이트 UI 또는 `eas fingerprint:compare`를 사용해 이 fingerprint를 diff하면 build와 update 사이에서 앱의 네이티브 runtime에 무엇이 바뀌었는지, build/update 호환성을 어떻게 이해해야 하는지, 그리고 언제 [`runtimeVersion`](/eas-update/runtime-versions)을 올려야 하는지 판단하는 데 도움이 됩니다.

## CodePush와 EAS Update의 개념적 차이

CodePush와 EAS Update는 둘 다 앱의 JavaScript 코드에 hotfix를 보낼 수 있는 서비스이지만, 약간 다른 접근 방식을 취하기 때문에 EAS Update로 이동할 때 릴리스 프로세스를 조정해야 할 수 있습니다.

업데이트가 stream 안에서 구성되는 방식의 차이

**CodePush는 deployment별로 단일 update stream을 가집니다**. 이는 build를 특정 deployment에 연결할 수 있고, build는 그 deployment에서 update를 가져온다는 뜻입니다. build가 대상으로 삼는 deployment를 바꾸고 싶다면 JavaScript API를 통해 런타임에 변경할 수 있습니다.

**EAS Update는 여러 update stream을 가집니다**. 하나는 source control branch에 대응하는 stream(이를 branch라고 부름)이고, 다른 하나는 branch를 가리키는 channel입니다. channel과 branch 사이의 매핑은 서버 측에서 처리되며, 하나의 channel이 runtime version별로 서로 다른 branch를 가리킬 수도 있습니다(또한 점진적 rollout을 지원하기 위한 더 고급 로직도 표현할 수 있음). build는 branch와 직접 연결되지 않고, channel과 연결됩니다. 각 build는 빌드 시점에 설정되는 하나의 channel을 가리키며, 런타임에 수정할 수 없습니다. 그 이유는 특정 branch(예: development, staging)가 자동으로 production에 나가지 않도록 보장하기 위해서입니다. 즉 preview update가 production 사용자에게 전달되지 않습니다. 이를 통해 preview와 production hotfix라는 EAS Update의 두 가지 주요 사용 사례를 분리할 수 있습니다.

런타임에 update가 선택되는 방식의 차이

릴리스 프로세스에 영향을 줄 수 있는 CodePush와 EAS Update의 핵심 차이점은 **CodePush에서는 클라이언트가 런타임에 대상 update deployment를 제어**하고, **EAS Update에서는 channel을 branch에 매핑하는 방식으로 서버 측에서 이를 제어**한다는 점입니다. 즉 EAS Update를 사용하는 앱 안에 현재 사용자 역할(예: 직원에게만 beta release 배포) 같은 런타임 조건에 따라 다른 update stream을 로드하라고 지시하는 코드를 넣을 수는 없습니다. 앱은 EAS Update 서버에서 해당 channel(예: production 또는 staging)에 매핑된 branch만 로드합니다.

대상 deployment를 런타임에 제어하는 기능은 staging 환경에서 CodePush와 함께 자주 사용됩니다. 이를 통해 비기술 직군 이해관계자도 Google Play Beta / TestFlight의 단일 build에서 기능을 테스트할 수 있습니다. EAS Update에서 현재 이와 가장 가까운 대안은 [development build](/eas-update/expo-dev-client)를 사용하는 것입니다. Expo는 현재 release build에서 이를 수행할 수 있는 방법도 작업 중입니다.
