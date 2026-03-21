---
modificationDate: March 09, 2026
title: 팀과 preview 공유하기
description: EAS Update를 사용해 OTA update를 보내고 팀과 preview를 공유하는 방법을 알아봅니다.
---

# 팀과 preview 공유하기

EAS Update를 사용해 OTA update를 보내고 팀과 preview를 공유하는 방법을 알아봅니다.

update는 일반적으로 작은 버그를 수정하고 앱 스토어 릴리스 사이에 작은 변경 사항을 반영합니다. 이를 통해 JavaScript 코드, 스타일링, 이미지처럼 예제 앱의 비네이티브 부분을 업데이트할 수 있습니다.

이 장에서는 [EAS Update](/eas-update/introduction)를 사용해 팀과 변경 사항을 공유하겠습니다. 이렇게 하면 [우리와 팀이 변경 사항의 preview를 빠르게 공유](/review/overview)할 수 있습니다.

[시청하기: 팀과 preview를 공유하는 방법](https://www.youtube.com/watch?v=vPKh-tNm-yI) — 앱 스토어 릴리스 사이에 팀과 앱의 preview 버전을 공유할 수 있도록 EAS Update를 설정합니다.

## expo-updates 라이브러리 설치하기

프로젝트를 초기화하고 update를 전송하려면 [`expo-updates`](/versions/latest/sdk/updates) 라이브러리를 사용해야 합니다. 설치하려면 다음 명령을 실행하세요:

```sh
npx expo install expo-updates
```

## EAS Update 구성하기

프로젝트를 EAS Update로 초기화하려면 다음 단계를 따라야 합니다:

-   앱 구성에 동적 **app.config.js**를 사용하고 있으므로, 프로젝트를 EAS Update와 호환되게 하려면 [`updates`](/versions/latest/config/app#updates)와 [`runtimeVersion`](/eas-update/runtime-versions#setting-runtimeversion) 속성을 추가해야 합니다. EAS에서 이 속성과 값을 받아오고, 이를 **app.config.js**에 수동으로 복사하려면 다음 명령을 실행하세요:

```sh
eas update:configure
```

비동적(app.json) 프로젝트는 어떻게 하나요?

프로젝트가 동적 app config를 사용하지 않고(**app.config.js** 대신 **app.json** 사용) 있다면, 위 명령은 앱이 EAS Update와 호환되도록 구성하고 올바른 속성을 **app.json**과 **eas.json**에 추가합니다.

-   설정 과정을 계속하려면 `eas update:configure`를 다시 실행하세요. 모든 build profile의 **eas.json**에 [`channel`](/eas/json#channel)이 추가되어야 합니다:

```json
{
  "build": {
    "development": {
      ... 
      "channel": "development"
    },
    "ios-simulator": {
      ... 
    },
    "preview": {
      ... 
      "channel": "preview"
    },
    "production": {
      ... 
      "channel": "production"
    }
  }
  ... 
}
```

> `eas update:configure` 명령은 **eas.json**의 모든 build profile에 `channel`을 추가합니다. 하지만 우리의 `ios-simulator` profile은 `development` profile을 확장하므로 별도의 `channel`을 둘 이유가 없습니다. 위 구성에서 `ios-simulator.channel`은 안전하게 제거할 수 있습니다.

channel이란 무엇인가요?

[Channel](/eas-update/how-it-works#conceptual-overview)은 build들을 함께 묶는 데 사용됩니다. 예를 들어 Android build와 iOS build가 모두 앱 스토어에 올라가 있다면, 둘 다 production channel을 부여할 수 있습니다. 그러면 나중에 EAS Update에 production channel을 대상으로 하라고 지시하여, production channel을 가진 모든 build에 update가 적용되도록 할 수 있습니다.

## development build 만들기

마지막 build에는 `expo-updates` 라이브러리가 포함되어 있지 않으므로 새 development build를 만들어야 합니다. 다음 명령을 실행하세요:

```sh
eas build --platform android --profile development
```

> 여기서는 update 시연을 위해 Android device용 development build를 사용하고 있습니다. 하지만 `--platform all` 또는 `--platform ios`를 사용해 두 플랫폼 모두 또는 iOS만을 위한 build를 만들 수도 있습니다.

새로운 development build 버전이 만들어지면 반드시 device에 설치하세요.

## 앱의 JavaScript 코드 수정하기

이제 예제 앱의 JavaScript 코드를 수정해 봅시다. [Sticker Smash 앱](/tutorial/eas/introduction#prerequisites)을 사용하지 않는 경우에는 앱에서 변경 사항을 확인할 수 있도록 코드의 아무 부분이나 수정해도 됩니다.

예제 앱에서 첫 번째 버튼의 **Choose a photo** 텍스트를 **Select a photo**로 바꾸겠습니다.

```tsx
<Button theme="primary" label="Select a photo" onPress={pickImageAsync} />
```

## update 게시하기

이 변경 사항을 테스트용으로 팀과 공유하기 위해 새 build를 만드는 대신, update를 게시해 봅시다:

```sh
eas update --channel development --message "Change first button label"
```

위 명령에서는 `development` channel을 사용했습니다. 모든 update는 [channel 이름](/eas-update/how-it-works#publishing-an-update)과 연결됩니다. 이것은 우리가 git으로 만드는 모든 commit이 git branch와 연결되는 것과 비슷합니다.

따라서 build profile에서 `development` channel을 사용하고 그다음 update를 게시하면, EAS에 `development` channel을 가진 build들에 이 update를 전달하라고 요청하는 셈입니다. EAS Update channel을 만들면 자동으로 같은 이름의 branch에 매핑됩니다.

update가 게시되면 CLI가 관련 정보를 프롬프트로 보여줍니다.

**Website link**를 클릭하면 EAS dashboard의 **Over-the-air updates** > **Update groups** 아래에서 Update를 볼 수 있습니다:

## development build에서 live update 미리보기

development build에서 live update를 미리 보려면:

-   development build 안에서 Expo 계정에 로그인합니다.
-   **Extensions** 탭을 엽니다.
-   **EAS Update** 아래에 나열된 **Branch: development**를 찾습니다.
-   **Open**을 탭해 update에 접근합니다.

## preview 또는 production build와 변경 사항 공유하기

비development build(preview 또는 production)용 update는 앱이 시작되어 새 update가 있는지 요청할 때 device에 자동으로 다운로드됩니다.

preview 또는 production build를 실행 중인 팀 구성원은 우리가 해당 branch에 push한 변경 사항이 담긴 update를 받게 됩니다.

예를 들어 `preview` build의 경우 다음을 실행할 수 있습니다:

```sh
eas update --channel preview --message "Change first button label"
```

아래는 `preview` build용 update를 게시한 예시입니다. update를 테스트하려면 앱을 강제 종료한 뒤 두 번 다시 열어 다운로드와 변경 사항 반영을 확인하세요:

## 요약

10장: 팀과 preview 공유하기

플랫폼 전반에서 over-the-air update를 관리하고 게시할 수 있도록 EAS Update를 성공적으로 구성했고, review를 위해 update를 가져오는 방법도 살펴보았습니다.

다음 장에서는 GitHub 저장소에서 build를 트리거하는 과정을 알아봅니다.

[다음: GitHub 저장소에서 build 트리거하기](/tutorial/eas/using-github)
