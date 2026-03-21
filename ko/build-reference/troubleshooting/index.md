---
modificationDate: March 05, 2026
title: 빌드 오류와 크래시 문제 해결
description: EAS Build를 사용할 때 빌드 오류와 크래시를 문제 해결하기 위한 레퍼런스입니다.
---

# 빌드 오류와 크래시 문제 해결

EAS Build를 사용할 때 빌드 오류와 크래시를 문제 해결하기 위한 레퍼런스입니다.

문제가 생기면 보통 다음 두 가지 방식 중 하나로 나타납니다:

1.  빌드가 실패합니다.
2.  빌드는 성공하지만 런타임 오류가 발생합니다. 예를 들어 실행할 때 크래시가 나거나 멈춥니다.

[오류 원인을 좁혀 가는](https://expo.fyi/manual-debugging) 일반적인 조언은 여기에도 모두 적용됩니다. 이 문서는 평소의 문제 해결 과정과 기법에 더해 유용할 수 있는 정보를 제공합니다. 문제 해결은 일종의 기술이므로, 창의적으로 생각해야 할 때도 있습니다.

## 관련 오류 로그 찾기

더 진행하기 전에 오류 메시지를 정확히 찾고 읽었는지 확인해야 합니다. 이 과정은 빌드 실패를 조사하는지, 런타임 오류를 조사하는지에 따라 달라집니다.

### 런타임 오류

이 범주에 해당하는 흔한 질문은 다음과 같습니다. "앱은 로컬에서 잘 실행되는데 빌드를 실행하면 바로 크래시가 나요." 또는 "앱은 Expo Go에서는 동작하는데 빌드에서는 스플래시 화면에서 멈춰요." 앱이 성공적으로 빌드되지만 실행 시 크래시가 나거나 멈춘다면 런타임 오류로 간주합니다.

릴리스 빌드가 런타임에 크래시 날 때 로그를 찾는 방법은 디버깅 가이드의 ["Production errors" 섹션](/debugging/runtime-issues#production-errors)을 참고하세요.

이 방법으로도 유용한 정보를 찾지 못했다면 [크래시 원인을 단계별로 좁혀 가기](https://expo.fyi/manual-debugging)를 시도해 보세요.

### 빌드 오류

빌드 세부 정보 페이지로 이동하세요(아직 열려 있지 않다면 [build dashboard](https://expo.dev/accounts/%5Baccount%5D/projects/%5Bproject%5D/builds)에서 찾을 수 있습니다). 그리고 실패한 빌드 phase를 클릭해서 펼쳐 보세요. 많은 경우 가장 먼저 오류가 나타난 phase에 가장 유용한 정보가 들어 있고, 그 뒤에 실패한 phase들은 첫 번째 실패의 연쇄 결과인 경우가 많습니다.

어떤 phase이든 **로그 항목 앞에 `[stderr]`가 붙어 있는 경우가 흔하지만, 그렇다고 해서 반드시 그 로그가 오류를 가리키는 것은 아니라는 점을 기억하세요.** CLI 도구는 경고와 기타 진단 정보를 출력할 때 [stderr](https://en.wikipedia.org/wiki/Standard_streams#Standard_error_\(stderr\))를 자주 사용합니다.

예를 들어 Android 빌드에서 다음과 같은 내용을 볼 수 있습니다:

```sh
[stderr] Note: /build/workingdir/build/app/node_modules/@react-native-async-storage/async-storage/android/src/main/java/com/reactnativecommunity/asyncstorage/AsyncStorageModule.java uses or overrides a deprecated API.
[stderr] Note: Recompile with -Xlint:deprecation for details.
```

그 경고를 추적해 보고 싶을 수도 있고 아닐 수도 있지만, 이것은 빌드 실패의 원인이 아닙니다. 그렇다면 어떤 로그가 실제 원인인지 어떻게 알 수 있을까요? bare 프로젝트를 빌드하고 있다면 이미 이런 분석에 익숙할 것입니다. [managed project](/workflow/overview)를 빌드하는 경우에는 네이티브 코드를 직접 다루지 않고 JavaScript만 작성하므로 조금 까다로울 수 있습니다.

좋은 다음 단계는 **빌드가 네이티브 오류 때문에 실패했는지, JavaScript 오류 때문에 실패했는지 판단하는 것**입니다. JavaScript 빌드 오류 때문에 빌드가 실패하면 보통 다음과 같은 메시지가 보입니다:

```sh
❌ Metro encountered an error:
Unable to resolve module ./src/Routes from /Users/expo/workingdir/build/App.js
```

이 특정 오류는 앱이 **./src/Routes**를 import하려 했지만 찾지 못했다는 뜻입니다. 원인은 Git에 있는 파일 이름의 대소문자와 개발자 파일 시스템의 대소문자가 다르기 때문일 수 있고(예: Git에는 **Routes.js**가 아니라 **routes.js**가 있음), 프로젝트에 빌드 단계가 있는데 EAS Build에서 실행되도록 설정되지 않았기 때문일 수도 있습니다. 이 사례에서는 원래 **./src/Routes**가 **./src/Routes/index.js**를 import하려고 한 것이었는데, 그 경로가 개발자의 **.gitignore**에서 실수로 제외되어 있었습니다.

iOS 빌드에서는 build details 페이지가 로그의 축약 버전만 보여 준다는 점도 중요합니다. `xcodebuild`의 전체 출력은 10MB 수준이 될 수 있기 때문입니다. 때로는 필요한 정보를 찾기 위해 전체 Xcode 로그를 열어야 합니다. 예를 들어 JavaScript 빌드가 실패했지만 build details 페이지에 유용한 정보가 보이지 않을 수 있습니다. 전체 Xcode 로그를 열려면 빌드가 완료된 뒤 build details 페이지 맨 아래로 스크롤해서 보기 또는 다운로드를 클릭하세요.

managed 앱을 작업 중인데 빌드 오류가 JavaScript 오류가 아니라 네이티브 오류라면, 이는 프로젝트의 [config plugin](/config-plugins/introduction)이나 의존성과 관련이 있을 가능성이 큽니다. 이전에 성공했던 빌드 이후 새로 추가한 패키지가 로그에 나타나는지 주의해서 보세요. `npx expo-doctor`를 실행해 프로젝트의 Expo SDK 의존성 버전이 현재 Expo SDK 버전과 호환되는지도 확인하세요.

오류 로그를 확보했다면 이제 빌드를 직접 수정해 보거나 [forums](https://chat.expo.dev/)와 GitHub issues에서 관련 패키지를 검색해 더 깊이 파고들 수 있습니다. 아래에는 흔한 문제 원인 몇 가지를 정리했습니다.

모노레포를 사용하고 있나요?

모노레포는 매우 유용하지만, 그만의 문제도 함께 가져옵니다. 전체 모노레포를 EAS Build builder에 업로드하고, 설정하고, 그 위에서 빌드를 실행해야 합니다.

EAS Build는 컴파일된 JavaScript 번들과 manifest를 받는 방식이 아니라 소스 코드를 필요로 한다는 점에서 일반적인 CI 서비스와 더 비슷합니다. EAS Build는 Yarn workspace를 1급으로 지원하지만, [다른 모노레포 도구를 사용할 때의 결과는 달라질 수 있습니다](/build-reference/limitations).

자세한 내용은 [모노레포로 작업하기](/guides/monorepos)를 참고하세요.

메모리 부족(OOM) 오류

Gradle 로그에 "Gradle build daemon disappeared unexpectedly (it may have been killed or may have crashed)"가 표시되며 빌드가 실패한다면, 앱 JavaScript를 번들링하던 Node 프로세스가 종료되었기 때문입니다.

이는 앱 번들이 지나치게 크다는 신호인 경우가 많습니다. 앱 번들이 크면 최종 앱 바이너리도 커지고, 특히 저사양 Android 기기에서 부팅 시간이 느려집니다. 때로는 큰 텍스트 파일이 소스 코드처럼 취급될 때도 이런 오류가 발생할 수 있습니다. 예를 들어 webview에 로드하기 위해 1MB+ 크기의 HTML 문자열을 포함한 JavaScript 파일이나, 비슷한 크기의 JSON 파일이 그런 경우입니다.

번들이 얼마나 큰지, 그리고 크기가 어디서 오는지 세부 내역을 보려면 [Expo Atlas](/guides/analyzing-bundles)를 사용하세요.

EAS Build builder의 메모리 한도를 늘리려면 **eas.json**에서 [`large` resource class](/eas/json#resourceclass)를 사용하세요. 자세한 내용은 [Android 전용 resource class](/build-reference/infrastructure#android-build-server-configurations)와 [iOS 전용 resource class](/build-reference/infrastructure#ios-build-server-configurations)를 참고하세요.

`None of the files exist` 오류

`eas build`를 실행하면 프로젝트 파일이 Expo의 빌드 서버에 업로드됩니다. 하지만 **.gitignore**에 언급된 파일이나 디렉터리는 **업로드되지 않습니다**. 이는 API key 같은 민감한 정보가 앱 코드에 노출되는 것을 막기 위한 의도된 동작입니다.

프로젝트에서 **.gitignore**에 있는 파일을 import하면 빌드는 `None of these files exist` 오류와 함께 실패합니다. 이를 해결하는 방법은 여러 가지가 있습니다:

-   무시된 파일에 대한 import 문을 제거하고 프로젝트를 테스트하세요. 프로젝트가 정상적으로 동작한다면 그 import 문은 오래되었거나 사용되지 않는 코드였을 수 있습니다.
    
-   Metro가 해석하지 못한 파일이나 디렉터리를 **.gitignore**에서 제거하세요. 하지만 이렇게 하면 이 파일들에 포함된 민감한 정보가 프로젝트 소스 코드와 Git 커밋 이력에 남게 되므로 보안 위험이 있습니다.
    
-   파일을 `base64`로 인코딩하고, 그 문자열을 secret으로 저장한 다음, EAS Build hook에서 파일을 생성하세요. 자세한 내용은 [How can I upload files to EAS Build if they are gitignored?](https://expo.fyi/eas-build-archive.md#how-can-i-upload-files-to-eas-build-if-they-are-gitignored)를 참고하세요.
    
-   클라이언트 측에서 민감한 파일을 import하지 않도록 소스 코드를 리팩터링하세요. 파일이 서드파티 제공자의 자동 생성 코드이고, 그 제공자가 해당 파일을 자동으로 **.gitignore**에 추가했다면, 그 파일에는 민감한 정보가 들어 있을 가능성이 큽니다. 그런 파일은 클라이언트 측에 포함하면 안 됩니다. 앱 개발 중에는 환경 변수 사용이나 백엔드를 통한 제공 같은 안전한 방법을 따르세요. 자세한 내용은 [환경 변수에서 secret 사용하기](/eas/environment-variables#visibility-settings-for-environment-variables)를 참고하세요.
    

## 빌드 로그 비교하기

이전에 성공했던 EAS Build가 갑자기 실패하기 시작했다면, 두 빌드 사이에서 무엇이 바뀌었는지 확인하는 것이 근본 원인을 찾는 데 도움이 될 수 있습니다. EAS Build details 페이지의 **Compare** 버튼은 두 빌드를 나란히 비교해 빌드 로그와 구성의 차이를 보여 줍니다.

두 빌드를 비교하려면:

-   실패한 빌드의 [EAS dashboard](https://expo.dev/accounts/%5Baccount%5D/projects/%5Bproject%5D/builds)에서 build details 페이지를 엽니다.
-   **Compare** 버튼을 클릭해 비교 모달을 엽니다.
-   비교하려는 빌드의 build ID 또는 전체 build URL을 입력합니다. 이전에 성공했던 빌드를 선택하면 됩니다.
-   **Compare**를 클릭합니다.

위 스크린샷은 상단에 각 빌드의 메타데이터를, 하단에 빌드 phase별로 정리된 나란한 로그 비교를 보여 주는 화면입니다. 메타데이터에는 상태, 환경, Expo SDK 버전 등이 포함됩니다.

각 build phase 안에서는 다음과 같은 표시로 두 빌드 사이의 변경 내용을 보여 줍니다:

-   **Changed (X lines)**: 이 phase는 두 빌드 모두에서 실행되었지만 출력이 다릅니다.
-   **\+ Added**: 이 phase는 비교 대상 빌드에만 존재합니다(원래 빌드는 그 단계에 도달하기 전에 실패했습니다).
-   **- Removed**: 이 phase는 원래 빌드에만 존재합니다.

위 예시에서는 오른쪽의 실패한 빌드를 왼쪽의 성공한 빌드와 비교해, 설치된 패키지 차이와 강조 표시된 lock file 불일치를 확인할 수 있습니다.

## JavaScript 번들을 로컬에서 확인하기

`Task :app:bundleReleaseJsAndAssets FAILED`(Android) 또는 `Metro encountered an error`(iOS)와 함께 빌드가 실패했다면, Metro bundler가 앱 바이너리에 포함할 JavaScript 코드를 번들링하지 못했다는 뜻입니다. 보통 이 오류 메시지 뒤에는 구문 오류나 번들링 실패 이유를 설명하는 추가 정보가 따라옵니다. 아쉽게도 표준 React Native 프로젝트는 이 단계를 Gradle/Xcode 빌드 후반부에 수행하도록 구성되어 있어, 오류를 확인하기까지 시간이 꽤 걸릴 수 있습니다.

`npx expo export`를 실행하면 다른 모든 빌드 단계를 우회하고 로컬에서 프로덕션 번들을 빌드할 수 있으므로 이 오류를 훨씬 빨리 확인할 수 있습니다. 번들이 성공적으로 빌드될 때까지 이 명령을 반복 실행하면서 발견되는 구문 오류나 სხვა 문제를 해결하세요. 그런 다음 다시 EAS Build를 시도해 보세요.

## 프로젝트가 로컬에서 빌드되고 실행되는지 확인하기

로그만으로는 근본 원인을 즉시 이해하고 해결하기 어려웠다면, 이제 문제를 로컬에서 재현해 볼 차례입니다. 프로젝트가 로컬의 release 모드에서 빌드되고 실행된다면, 다음 조건이 모두 참일 때 EAS Build에서도 빌드됩니다:

-   관련 [빌드 도구 버전](/build/eas-json#configuring-your-build-tools)(예: Xcode, Node.js, npm, Yarn)이 두 환경에서 동일합니다.
-   관련 [환경 변수](/eas/environment-variables)가 두 환경에서 동일합니다.
-   EAS Build에 업로드되는 [archive](https://expo.fyi/eas-build-archive)에 동일한 관련 소스 파일이 포함되어 있습니다.

`npx expo run:android`와 `npx expo run:ios` 명령에 release용 variant/configuration 플래그를 지정하면 로컬 머신에서 프로젝트가 빌드되는지 확인할 수 있습니다. 이렇게 하면 EAS Build에서 실행되는 과정을 가장 가깝게 재현할 수 있습니다. 자세한 내용은 [Android 빌드 프로세스](/build-reference/android-builds)와 [iOS 빌드 프로세스](/build-reference/ios-builds)를 참고하세요.

```sh
npx expo run:android --variant release
npx expo run:ios --configuration Release
```

> [CNG](/workflow/continuous-native-generation)를 사용한다면 이 명령은 네이티브 프로젝트를 생성해 컴파일하기 위해 `npx expo prebuild`를 실행합니다. 문제 해결을 마친 뒤에는, 이 프로젝트들을 직접 관리하려는 것이 아니라면 [생성된 변경 사항을 정리](https://expo.fyi/prebuild-cleanup)하는 편이 좋습니다.
>
> 또는 `eas build --local`로 로컬 빌드를 실행할 수도 있습니다. 이 명령은 호스팅된 EAS Build 서비스에서 원격으로 실행되는 단계와 최대한 가깝게 일련의 단계를 수행합니다. 프로젝트를 임시 디렉터리로 복사하고 필요한 변경 사항도 그곳에서 적용합니다. [설정 방법과 디버깅에 활용하는 방법 알아보기](/build-reference/local-builds#using-local-builds-for-debugging).

네이티브 toolchain이 올바르게 설치되어 있는데도 로컬 머신에서 release 모드로 프로젝트를 빌드하고 실행할 수 없다면, EAS Build에서도 빌드되지 않습니다. 먼저 로컬에서 문제를 해결한 다음 EAS Build를 다시 시도하세요. 이 문서의 다른 조언도 로컬 문제를 해결하는 데 도움이 될 수 있지만, 대개는 네이티브 도구에 대한 이해나 Google, Stack Overflow, GitHub Issues를 신중하게 활용하는 능력이 필요합니다.

머신에 Xcode와 Android Studio가 설정되어 있지 않나요?

**로컬에 네이티브 toolchain이 설치되어 있지 않다면**, 예를 들어 Apple 컴퓨터가 없어서 머신에서 iOS 앱을 빌드할 수 없는 경우, 빌드 오류의 원인을 파악하기가 더 어려울 수 있습니다. 로컬에서 작은 변경을 하고 결과를 바로 보는 피드백 루프보다, EAS Build에서는 builder가 환경을 설정하고 프로젝트를 다운로드하고 의존성을 설치한 뒤 빌드를 시작해야 하므로 훨씬 느립니다.

적절한 네이티브 도구를 설치할 수 있고 설치할 의향이 있다면 [React Native 환경 설정 가이드](https://reactnative.dev/docs/environment-setup)를 참고하세요.

앱은 로컬에서 빌드되는데 EAS Build에서는 안 되는 경우

기본적으로 EAS Build는 앱을 ([Android](/build-reference/android-builds) 또는 [iOS](/build-reference/ios-builds)) 빌드하기 위해 비교적 단순한 절차를 따릅니다. 로컬에서 `npx expo run:android --variant release`와 `npx expo run:ios --configuration Release`는 동작하지만 EAS Build에서는 실패한다면, 이제 여러분의 머신에만 있고 EAS Build용 프로젝트 설정에는 아직 반영되지 않은 구성이 무엇인지 좁혀 봐야 합니다.

-   프로젝트를 새 디렉터리에 `git clone`으로 새로 받아 실행해 보세요. 가능하다면 다른 머신에서 해 보는 것이 좋습니다. 필요한 각 단계를 주의 깊게 확인하고, 그 단계들이 EAS Build에도 설정되어 있는지 검증하세요.
-   [환경 변수](/guides/environment-variables)가 올바르게 구성되어 있는지 확인하세요.
-   Node.js, npm, Yarn, Xcode, Java 등 도구 버전이 두 환경에서 같은지 확인하세요.
-   [EAS Build에 업로드하는 archive](https://expo.fyi/eas-build-archive)에 동일한 관련 소스 파일이 포함되어 있는지 확인하세요.

프로덕션 앱이 development 앱과 다른 이유는 무엇인가요?

[`npx expo start --no-dev`](/workflow/development-mode#production-mode)로 앱을 시작하면 앱의 JS 부분이 프로덕션에서 어떻게 실행될지 테스트할 수 있습니다. 이렇게 하면 bundler가 JavaScript를 제공하기 전에 minify하며, 특히 `__DEV__` 불리언으로 보호된 코드를 제거합니다. 이로 인해 대부분의 로깅, HMR, Fast Refresh 기능이 제거되어 디버깅은 조금 어려워지지만, 프로덕션 번들을 더 빠르게 반복 확인할 수 있습니다.

## 여전히 문제가 있나요?

이 가이드는 결코 완전하지 않으며, 경험 수준에 따라 앱을 정상 동작시키는 데 여전히 어려움을 겪을 수 있습니다.

여기 있는 조언을 모두 따라 했다면, 이제 다른 개발자에게 문제를 설명하고 도움을 요청하기에 좋은 상태입니다.

### 좋은 질문을 하는 방법

커뮤니티와 Expo 팀에 도움을 요청하려면 [Discord and Forums](https://chat.expo.dev/)에 참여하세요. Expo 팀은 질이 높고 잘 정리된 질문과 이슈에 최대한 응답하려고 노력하지만, [support plan](https://expo.dev/support-terms#target-response-time-guidelines-for-subscriptions)에 가입하지 않았다면 응답이 보장되지는 않습니다. Expo 팀원이 질문을 보도록 하려면 [expo.dev/contact](https://expo.dev/contact)에서 티켓을 제출할 수도 있습니다.

문제 해결 도움을 요청할 때는 다음 정보를 꼭 공유하세요:

-   **빌드 페이지 링크**. 이 링크는 팀 구성원이나 Expo 직원만 접근할 수 있습니다. 좀 더 공개적으로 공유하고 싶다면 스크린샷을 찍으세요. 좀 더 비공개로 공유하고 싶다면 [secure@expo.dev](mailto:secure@expo.dev)로 이메일을 보내고, 채팅이나 포럼의 도움 요청에도 그 사실을 적어 주세요. `eas build --local`로 로컬 빌드를 수행 중이라면 이 항목은 생략할 수 있지만, 대신 그 사실은 꼭 알려 주세요.
-   **오류 로그**. 빌드 또는 런타임 오류와 관련 있을 것 같은 내용이라면 모두 포함하세요. 제공할 수 없다면 왜 그런지 설명하세요.
-   **최소 재현 예제 또는 저장소 링크**. 문제 해결책을 가장 빨리 얻는 방법은 다른 개발자도 그 문제를 재현할 수 있게 만드는 것입니다. 팀에서 일해 본 적이 있다면 이미 체감했을 것입니다. 많은 경우 재현 가능한 예제를 제공하지 못하면 도움을 주는 것이 불가능할 수 있으며, 질문과 답변을 반복하는 과정 자체가 비효율적일 수 있습니다. 재현 예제를 만드는 방법은 [manual debugging guide](https://expo.fyi/manual-debugging)와 Stack Overflow의 [Minimal Viable Reproducible Example](https://stackoverflow.com/help/minimal-reproducible-example) 가이드를 참고하세요.

명확하고, 정확하고, 도움이 되게 작성하세요. Stack Overflow의 [How to ask a good question](https://stackoverflow.com/help/how-to-ask) 가이드에 있는 일반적인 조언도 그대로 적용됩니다.
