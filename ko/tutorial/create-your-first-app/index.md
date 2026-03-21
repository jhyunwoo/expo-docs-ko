---
modificationDate: March 06, 2026
title: 첫 번째 앱 만들기
description: 이 장에서는 새 Expo 프로젝트를 만드는 방법을 알아봅니다.
---

# 첫 번째 앱 만들기

이 장에서는 새 Expo 프로젝트를 만드는 방법을 알아봅니다.

이 장에서는 새 Expo 프로젝트를 만드는 방법과 이를 실행하는 방법을 배워보겠습니다.

[시청하기: 첫 번째 유니버설 Expo 앱 만들기](https://www.youtube.com/watch?v=m1-bc53EGh8) — 새 Expo 프로젝트를 처음부터 만들고 Android, iOS, 웹에서 실행합니다.

## 사전 준비

시작하려면 다음이 필요합니다:

-   실제 디바이스에 설치된 [Expo Go](https://expo.dev/go)
-   설치된 [Node.js (LTS version)](https://nodejs.org/en)
-   설치된 [VS Code](https://code.visualstudio.com/) 또는 선호하는 다른 코드 편집기나 IDE
-   터미널 창이 열린 macOS, Linux, 또는 Windows(PowerShell 및 [WSL2](https://expo.fyi/wsl))

이 튜토리얼은 여러분이 TypeScript와 React에 익숙하다고 가정합니다. 익숙하지 않다면 [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)과 [React 공식 튜토리얼](https://react.dev/learn)을 확인하세요.

## 새 Expo 앱 초기화하기

새 Expo 앱을 초기화하기 위해 [`create-expo-app`](/more/create-expo)을 사용하겠습니다. 이것은 새 React Native 프로젝트를 만들기 위한 command line 도구입니다. 터미널에서 다음 명령어를 실행하세요:

```sh
npx create-expo-app@latest StickerSmash
cd StickerSmash
```

이 명령은 [default](/more/create-expo#--template) template를 사용해 StickerSmash라는 새 프로젝트 디렉터리를 만듭니다. 이 template에는 Expo Router를 포함해 앱을 만드는 데 필요한 기본 boilerplate 코드와 라이브러리가 들어 있습니다. 이 튜토리얼을 진행하면서 필요에 따라 더 많은 라이브러리를 계속 추가하겠습니다.

> 현재 `create-expo-app@latest`는 SDK 54 프로젝트를 생성합니다. 이 튜토리얼은 SDK 54를 기준으로 설계되었으므로 `--template` flag가 필요하지 않습니다.

default template를 사용할 때의 장점

-   `expo` package가 설치된 새 React Native 프로젝트를 만듭니다
-   Expo CLI 같은 권장 도구가 포함됩니다
-   기본 내비게이션 시스템을 제공하기 위해 Expo Router의 tab navigator가 포함됩니다
-   Android, iOS, 웹 여러 플랫폼에서 프로젝트를 실행하도록 자동 구성됩니다
-   TypeScript가 기본 설정되어 있습니다

## asset 다운로드하기

[asset archive 다운로드](/static/images/tutorial/sticker-smash-assets.zip) — 이 튜토리얼 전체에서 이 asset들을 사용할 것입니다.

archive를 다운로드한 뒤:

1.  archive의 압축을 풀고 **your-project-name/assets/images** 디렉터리 안의 기본 asset을 교체합니다.
2.  코드 편집기나 IDE에서 프로젝트 디렉터리를 엽니다.

## reset-project script 실행하기

이 튜토리얼에서는 앱을 처음부터 만들고 file-based navigation을 추가하는 기본 개념을 이해해 보겠습니다. boilerplate 코드를 제거하기 위해 `reset-project` script를 실행해 봅시다:

```sh
npm run reset-project
```

위 명령을 실행하고 나면 **app** 디렉터리 안에는 두 개의 파일(**index.tsx**와 **_layout.tsx**)만 남게 됩니다. 스크립트가 **app**과 다른 디렉터리(**components**, **constants**, **hooks** — boilerplate 코드 포함)의 기존 파일을 **app-example** 디렉터리 안으로 옮깁니다. 우리는 진행하면서 직접 디렉터리와 component 파일을 만들 것이므로 이 디렉터리는 삭제해도 됩니다.

`reset-project` script는 무엇을 하나요?

`reset-project` script는 프로젝트의 **app** 디렉터리 구조를 초기화하고, 프로젝트 루트 디렉터리의 기존 boilerplate 파일을 **app-example**이라는 다른 하위 디렉터리로 복사합니다. 이 디렉터리는 메인 앱 구조의 일부가 아니므로 삭제해도 됩니다.

## 모바일과 웹에서 앱 실행하기

프로젝트 디렉터리에서 터미널로 [development server](/more/glossary-of-terms#development-server)를 시작하려면 다음 명령어를 실행하세요:

```sh
npx expo start
```

위 명령을 실행한 뒤:

1.  development server가 시작되고 터미널 창 안에 QR 코드가 표시됩니다.
2.  그 QR 코드를 스캔해 디바이스에서 앱을 엽니다. Android에서는 Expo Go > **Scan QR code** 옵션을 사용합니다. iOS에서는 기본 camera app을 사용합니다.
3.  웹 앱을 실행하려면 터미널에서 w를 누릅니다. 기본 웹 브라우저에서 웹 앱이 열립니다.

모든 플랫폼에서 실행되면 앱은 다음과 같이 보여야 합니다:

## index 화면 수정하기

**app/index.tsx** 파일은 앱 화면에 표시되는 텍스트를 정의합니다. 이 파일은 앱의 entry point이며 development server가 시작될 때 실행됩니다. `<View>`와 `<Text>` 같은 React Native core component를 사용해 배경과 텍스트를 표시합니다.

이 컴포넌트들에 적용되는 스타일은 웹에서 사용하는 CSS가 아니라 JavaScript object를 사용합니다. 하지만 웹에서 CSS를 사용해 본 적이 있다면 많은 속성이 익숙하게 보일 것입니다. 대부분의 React Native component는 값으로 JavaScript object를 받는 `style` prop을 허용합니다. 자세한 내용은 [React Native에서 스타일링](https://reactnative.dev/docs/style)을 참고하세요.

이제 **app/index.tsx** 화면을 수정해 봅시다:

1.  `react-native`에서 `StyleSheet`를 import하고 custom 스타일을 정의할 `styles` object를 만듭니다.
2.  `<View>`에 `styles.container.backgroundColor` 속성을 추가하고 값을 `#25292e`로 설정합니다. 이렇게 하면 배경색이 바뀝니다.
3.  `<Text>`의 기본 값을 "Home screen"으로 바꿉니다.
4.  `<Text>`에 `styles.text.color` 속성을 추가하고 값을 `#fff`(흰색)로 설정해 텍스트 색상을 바꿉니다.

```tsx
import { Text, View, StyleSheet } from 'react-native';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
});
```

> React Native는 웹과 같은 색상 형식을 사용합니다. hex triplet(`#fff`가 바로 그것입니다), `rgba`, `hsl`, 그리고 `red`, `green`, `blue`, `peru`, `papayawhip` 같은 named color를 지원합니다. 자세한 내용은 [React Native의 색상](https://reactnative.dev/docs/colors)을 참고하세요.

변경 사항을 저장하면, development server에 연결된 실행 중인 앱으로 변경 내용이 전송되어 적용됩니다:

## 요약

1장: 첫 번째 앱 만들기

새 Expo 프로젝트를 성공적으로 만들었고, React Native core component를 사용했으며, StickerSmash 앱을 개발할 준비가 되었습니다.

다음 장에서는 앱에 stack과 tab navigator를 추가하는 방법을 알아보겠습니다.

[다음: 내비게이션 추가하기](/tutorial/add-navigation)
