---
modificationDate: May 23, 2025
title: development build에서 update 미리보기
description: expo-dev-client 라이브러리를 사용해 게시된 EAS Update를 development build 안에서 미리 보는 방법을 알아보세요.
---

# development build에서 update 미리보기

expo-dev-client 라이브러리를 사용해 게시된 EAS Update를 development build 안에서 미리 보는 방법을 알아보세요.

[`expo-dev-client`](/develop/development-builds/introduction) 라이브러리를 사용하면 development build를 만들어 프로젝트의 여러 버전을 실행할 수 있습니다. 호환되는 EAS Update라면 어떤 것이든 development build에서 미리 볼 수 있습니다.

이 가이드는 **Extensions** 탭을 사용하거나 특정 Update URL을 구성해, 게시된 update를 development build 안에서 로드하고 미리 보는 데 필요한 단계를 안내합니다.

## 사전 준비

-   기기나 Android Emulator 또는 iOS Simulator에 [development build를 만들고 설치](/develop/development-builds/create-a-build)하세요.
-   development build에 [`expo-updates` 라이브러리](/eas-update/getting-started#configure-your-project)가 설치되어 있는지 확인하세요.

## Extensions 탭이란 무엇인가요?

development build 안에서 `expo-updates` 라이브러리를 사용할 때, **Extensions** 탭은 게시된 update를 자동으로 로드하고 미리 볼 수 있는 기능을 제공합니다.

### Extensions 탭을 사용해 update 미리보기

프로젝트에서 비네이티브 변경 사항을 로컬에서 만들고, 그런 다음 [`eas update`를 사용해 게시](/eas-update/getting-started#publish-an-update)하세요. update는 branch에 게시됩니다.

update를 게시한 뒤 development build를 열고 **Extensions**로 이동한 후 **Login**을 눌러 development build 안에서 Expo 계정으로 로그인하세요. 이 단계는 **Extensions** 탭이 Expo 계정 아래의 해당 프로젝트와 연결된 게시된 update를 불러오려면 필요합니다.

로그인한 뒤에는 **Extensions** 탭 안에 EAS Update 섹션이 나타나고, 최신 게시 update 중 하나 이상이 표시됩니다. 미리 보고 싶은 update 옆의 **Open**을 누르세요.

**Extensions** 탭에서는 branch의 모든 게시 update 목록을 볼 수 있습니다. **Extensions** 탭에서 branch 이름을 누르세요.

## EAS dashboard를 사용해 update 미리보기

아래 단계에 따라 EAS dashboard를 사용해서도 update를 미리 볼 수 있습니다:

-   update를 게시하는 명령을 실행한 뒤 CLI에 표시된 게시 update 링크를 클릭하세요. 그러면 EAS dashboard의 **Updates** 페이지에서 해당 update의 세부 정보가 열립니다.
-   **Preview**를 클릭하세요. 그러면 **Preview** 대화상자가 열립니다.
-   update를 미리 보려면, 기기의 카메라로 QR 코드를 스캔하거나 플랫폼을 선택해 [**Open with Orbit** 아래에서 update를 실행](/review/with-orbit)하세요.

## update URL 구성하기

앞 섹션에서 설명한 방법의 대안으로, development build에서 EAS Update를 열 수 있는 특정 URL을 직접 구성할 수 있습니다. URL은 다음과 같은 형태가 됩니다:

```sh
[slug]://expo-development-client/?url=[https://u.expo.dev/project-id]/group/[group-id]
my-app://expo-development-client/?url=https://u.expo.dev/675cb1f0-fa3c-11e8-ac99-6374d9643cb2/group/47839bf2-9e01-467b-9378-4a978604ab11
```

이 URL의 각 부분이 무엇을 하는지 이해할 수 있도록 나누어 보겠습니다:

| Part of URL | Description |
| --- | --- |
| `slug` | app config에서 찾을 수 있는 프로젝트의 [slug](/versions/latest/config/app#slug)입니다. |
| `://expo-development-client/` | deep link가 [`expo-dev-client`](/versions/latest/sdk/dev-client) 라이브러리와 함께 동작하려면 필요합니다. |
| `?url=` | `url` query parameter를 정의합니다. |
| `https://u.expo.dev/675cb1f0-fa3c-11e8-ac99-6374d9643cb2` | project의 app config 안 [`updates.url`](/versions/latest/config/app#url)에 들어 있는 updates URL입니다. |
| `/group/47839bf2-9e01-467b-9378-4a978604ab11` | update의 group ID입니다. |

URL을 구성한 뒤에는 이를 복사해 development build의 launcher 화면에 있는 **Enter URL Manually** 아래에 직접 붙여 넣으세요.

대안으로 [URL용 QR 코드를 생성](/more/qr-codes)해 기기의 카메라로 스캔할 수도 있습니다. 스캔하면 development build가 지정된 channel로 열립니다.

## 예시

[작동하는 예시 보기](https://github.com/jonsamp/test-expo-dev-client-eas-update) — EAS Update와 함께 expo-dev-client를 사용하는 작동 예시를 확인하세요. — expo-dev-client
