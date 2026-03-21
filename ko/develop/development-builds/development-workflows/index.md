---
modificationDate: February 26, 2026
title: 도구, 워크플로, 확장 기능
description: development build 작업 시 사용할 수 있는 다양한 도구, 워크플로, 확장 기능을 자세히 알아보세요.
---

# 도구, 워크플로, 확장 기능

development build 작업 시 사용할 수 있는 다양한 도구, 워크플로, 확장 기능을 자세히 알아보세요.

development build를 사용하면 빠르게 반복 작업할 수 있습니다. 여기에 더해 팀으로 작업할 때 더 나은 개발자 경험을 제공하도록 development build의 기능을 확장하거나, 필요에 맞게 빌드를 사용자 지정할 수도 있습니다.

## 도구

### Tunnel URL

때로는 제한적인 네트워크 환경 때문에 development server에 연결하기 어려울 수 있습니다. `npx expo start` 명령은 development server를 전 세계 방화벽을 통과해 접근 가능한 공개 URL로 노출합니다. 기본 LAN 옵션으로 development server에 연결할 수 없거나, 개발 중인 구현 결과에 대해 다른 사람의 피드백을 받고 싶을 때 유용합니다.

tunneled URL을 얻으려면 command line에서 `npx expo start`에 [`--tunnel` 플래그](/more/expo-cli#tunneling)를 전달하세요.

### 게시된 update

EAS CLI의 `eas update` 명령은 현재 JavaScript 및 asset 파일 상태를 최적화된 "update"로 번들링합니다. 이 update는 Expo가 제공하는 hosting 서비스에 저장됩니다. 앱의 development build는 특정 commit을 checkout 하거나 개발 머신을 계속 켜 두지 않아도 게시된 update를 로드할 수 있습니다.

### update URL 직접 입력하기

development build가 실행되면 development server를 불러오거나 "Enter URL manually"를 선택할 수 있는 UI가 표시됩니다. 여기서 특정 branch를 실행하는 URL을 직접 입력할 수 있습니다. URL 형식은 다음과 같습니다:

```text
https://u.expo.dev/[your-project-id]?channel-name=[channel-name]

# Example
https://u.expo.dev/F767ADF57-B487-4D8F-9522-85549C39F43F?channel-name=main
```

프로젝트 ID를 얻으려면 [app config의 `expo.updates.url`](/versions/latest/config/app#url) 필드에 있는 URL을 사용하세요. channel 목록을 보려면 `eas channel:list`를 실행하세요.

### update URL로 deep link 하기

호환되는 custom client 빌드가 설치된 기기에서 `{scheme}://expo-development-client/?url={manifestUrl}` 형태의 URL을 열면 앱을 로드할 수 있습니다. 다음 매개변수를 전달해야 합니다:

| parameter | value |
| --- | --- |
| `scheme` | 클라이언트의 URL scheme(app config에서 [`slug`](/versions/latest/config/app#slug)에 설정한 값을 사용하며 기본값은 `exp+{slug}`) |
| `manifestUrl` | 로드할 update manifest의 URL을 URL-encoded 한 값. URL은 `https://u.expo.dev/[your-project-id]?channel-name=[channel-name]` 형태입니다 |

예시:

```text
exp+app-slug://expo-development-client/?url=https%3A%2F%2Fu.expo.dev%2F767ADF57-B487-4D8F-9522-85549C39F43F%2F%3Fchannel-name%3Dmain
```

위 예시에서 `scheme`은 `exp+app-slug`이고, `manifestUrl`은 ID가 `F767ADF57-B487-4D8F-9522-85549C39F43F`이며 channel이 `main`인 프로젝트를 가리킵니다.

#### 자동화 시나리오에서 update deep link 사용하기

CI/CD 워크플로 같은 자동화 환경에서 emulator나 simulator의 development build에서 update URL을 실행할 때는, 설치 후 development build를 처음 실행할 때 나타나는 onboarding 화면을 건너뛰기 위해 URL에 `disableOnboarding=1` query parameter를 추가할 수 있습니다.

#### 앱 전용 deep link

development build에서 deep link를 테스트할 때, 예를 들어 Expo Router 앱에서 특정 화면으로 이동하거나 OAuth 로그인 흐름 중 앱으로 redirect 되는 동작을 테스트할 때는, standalone build에 deep link를 걸 때와 정확히 같은 방식으로 URL을 구성하세요(예: `myscheme://path/to/screen`).

앱 전용 deep link가 동작하려면 프로젝트가 이미 development build 안에서 열려 있어야 합니다. 현재는 앱 전용 deep link로 development build를 cold launch하는 기능이 지원되지 않습니다. `expo-development-client`는 update URL 실행에 사용되는 예약 경로이므로, 앱 전용 deep link 경로에 이를 포함하지 마세요.

### QR 코드

development build가 쉽게 로드할 수 있는 QR 코드를 생성하기 위해 Expo가 제공하는 endpoint를 사용할 수 있습니다.

`https://qr.expo.dev/development-client`로 요청을 보내고 `appScheme`, `url` 같은 query parameter를 제공하면, development build에서 쉽게 스캔해 프로젝트 버전을 불러올 수 있는 QR 코드가 들어 있는 SVG 이미지를 응답으로 받습니다.

| parameter | value |
| --- | --- |
| `appScheme` | development build의 URL-encoded deeplinking scheme(app config에서 [`slug`](/versions/latest/config/app#slug)에 설정한 값을 사용하며 기본값은 `exp+{slug}`) |
| `url` | 로드할 update manifest의 URL을 URL-encoded 한 값. URL은 `https://u.expo.dev/[your-project-id]?channel-name=[channel-name]` 형태입니다 |

예시:

```text
https://qr.expo.dev/development-client?appScheme=exp%2Bapps-slug&url=https%3A%2F%2Fu.expo.dev%2FF767ADF57-B487-4D8F-9522-85549C39F43F0%3Fchannel-name%3Dmain
```

위 예시에서 `scheme`은 `exp+app-slug`이고, `url`은 ID가 `F767ADF57-B487-4D8F-9522-85549C39F43F`이며 channel이 `main`인 프로젝트를 가리킵니다.

## 예시 워크플로

다음은 팀이 development build를 최대한 활용할 수 있도록 도와주는 워크플로 예시 몇 가지입니다. 다른 팀에게도 유용할 만한 다른 흐름을 생각해냈다면, 지식을 공유할 수 있도록 [PR을 제출해 주세요](https://github.com/expo/expo/tree/main/CONTRIBUTING.md#-updating-documentation)!

### PR 미리보기

pull request가 업데이트될 때마다 EAS Update를 게시하도록 CI 프로세스를 구성하고, 호환되는 development build에서 변경 사항을 확인하는 데 사용할 QR 코드를 추가할 수 있습니다.

[pull request에 app preview 게시하기](/eas-update/github-actions#publish-previews-on-pull-requests) 안내를 참고하면 GitHub Actions에서 이 워크플로를 구현하거나 원하는 CI의 템플릿으로 활용할 수 있습니다.

## 확장 기능

확장 기능을 사용하면 development client에 추가 기능을 덧붙일 수 있습니다.

### dev menu 확장하기

`registerDevMenuItems` API를 사용하면 dev menu에 추가 버튼을 넣을 수 있습니다:

```tsx
import { registerDevMenuItems } from 'expo-dev-menu';

const devMenuItems = [
  {
    name: 'My Custom Button',
    callback: () => console.log('Hello world!'),
  },
];

registerDevMenuItems(devMenuItems);
```

그러면 dev menu에 등록한 버튼이 포함된 새 섹션이 생성됩니다:

> 이후 `registerDevMenuItems`를 다시 호출하면 이전 항목이 모두 덮어써집니다.

### EAS Update

EAS Update 확장 기능은 development client 안에서 게시된 update를 보고 불러오는 기능을 제공합니다. 설치하려면 `expo-updates`의 최신 publish를 사용해야 합니다:

```sh
npx expo install expo-dev-client expo-updates
```

#### EAS Update 구성하기

아직 프로젝트에서 EAS Updates를 구성하지 않았다면 [여기에서 추가 구성 방법을 확인하세요.](/eas-update/getting-started)

이제 development build에서 `Extensions` 패널을 통해 EAS Updates를 보고 불러올 수 있습니다.

## app config에서 runtimeVersion 설정하기

프로젝트의 development build를 만들면 JavaScript로 정의된 변경 사항이나 기타 asset 관련 변경 사항을 로드할 수 있는 안정적인 환경을 얻게 됩니다. 반면 **android**와 **ios** 디렉터리에서 직접 정의된 변경 사항이나, 설치한 package 또는 SDK에 의해 정의된 다른 변경 사항은 development build를 새로 만들어야 반영됩니다.

앱의 JavaScript 레이어와 네이티브 레이어 사이에 API 계약을 강제하려면 app config에 [`runtimeVersion`](/eas-update/runtime-versions) 값을 설정해야 합니다. 여러분이 만드는 각 빌드에는 이 값이 포함되며, development와 production 모두에서 같은 `runtimeVersion`을 가진 bundle만 로드하게 됩니다.
