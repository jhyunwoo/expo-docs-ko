---
modificationDate: February 26, 2026
title: Fonts
description: 로컬 파일이나 Google Font package를 사용해 앱에 custom font를 통합하는 방법을 알아보세요.
---

# Fonts

로컬 파일이나 Google Font package를 사용해 앱에 custom font를 통합하는 방법을 알아보세요.

Android와 iOS에는 각 플랫폼 고유의 기본 font가 포함되어 있습니다. 일관된 사용자 경험을 제공하고 앱 브랜딩을 강화하기 위해 custom font를 사용할 수 있습니다.

이 가이드는 프로젝트에 custom font를 추가하고 로드하는 여러 방법을 다루며, font와 관련된 추가 정보도 제공합니다.

## custom font 추가하기

프로젝트에 custom font를 추가하는 방법은 두 가지입니다:

-   로컬 asset에 font 파일을 추가합니다. 예를 들어 **assets/fonts** 디렉터리에 font 파일을 둘 수 있습니다.
-   Google Font package를 설치합니다. 예를 들어 [`@expo-google-fonts/inter`](https://www.npmjs.com/package/@expo-google-fonts/inter) package를 설치할 수 있습니다.

### 지원되는 font 형식

Expo SDK는 Android, iOS, web 플랫폼 전반에서 OTF와 TTF font 형식을 공식 지원합니다. font가 다른 형식이라면, 프로젝트에서 해당 형식을 지원하기 위해 고급 구성을 직접 설정해야 합니다.

### Variable fonts

OTF와 TTF의 variable font 구현을 포함한 variable font는 모든 플랫폼에서 지원되지 않습니다. 모든 플랫폼에서 완전한 지원이 필요하다면 static font를 사용하세요. 또는 [fontTools](https://fonttools.readthedocs.io/en/latest/varLib/mutator.html) 같은 유틸리티를 사용해 variable font에서 원하는 특정 axis 구성을 추출하고 이를 별도 font 파일로 저장할 수 있습니다.

### OTF와 TTF 중 무엇을 선택해야 하나요?

사용 중인 font에 OTF와 TTF 버전이 모두 있다면 OTF를 우선 사용하는 것이 좋습니다. **.otf** 파일은 **.ttf** 파일보다 더 작습니다. 경우에 따라 OTF가 특정 상황에서 약간 더 잘 렌더링되기도 합니다.

## 로컬 font 파일 사용하기

파일을 프로젝트의 **assets/fonts** 디렉터리에 복사하세요.

> **assets/fonts** 디렉터리 경로는 React Native 앱에서 font 파일을 두는 일반적인 관례입니다. 자체 규칙을 따르고 있다면 다른 위치에 두어도 됩니다.

프로젝트에서 로컬 font 파일을 사용하는 방법은 두 가지입니다:

-   [`expo-font` config plugin](/versions/latest/sdk/font#configuration-in-app-config)으로 font 파일을 포함합니다(Android와 iOS 전용).
-   런타임에 [`useFonts`](/versions/latest/sdk/font#usefontsmap) hook으로 font 파일을 로드합니다(Android, iOS, web).

### `expo-font` config plugin 사용하기

`expo-font` config plugin은 프로젝트의 네이티브 코드에 하나 이상의 font 파일을 포함할 수 있게 해 줍니다. Android와 iOS에서는 `ttf`와 `otf`를 지원하고, `woff`와 `woff2`는 iOS에서만 지원됩니다.

> **참고:** Config plugin은 네이티브 플랫폼(Android와 iOS)에서만 실행됩니다. web에서는 대신 [`useFonts` hook](/develop/user-interface/fonts#with-usefonts-hook)을 사용하세요.

이 방법은 다음과 같은 장점이 있어 앱에 font를 추가하는 권장 방식입니다:

-   앱이 기기에서 시작되자마자 font를 바로 사용할 수 있습니다.
-   앱 시작 시 비동기로 font를 로드하기 위한 추가 코드가 필요하지 않습니다.
-   앱 안에 번들되어 있으므로 앱이 설치된 모든 기기에서 font를 일관되게 사용할 수 있습니다.

하지만 이 방법에는 다음과 같은 제한도 있습니다:

-   [development build를 만들어야](/develop/development-builds/create-a-build) 하므로 Expo Go에서는 동작하지 않습니다.

프로젝트에 font를 포함하려면 아래 단계를 따르세요:

프로젝트에 custom font 파일을 추가한 뒤 `expo-font` 라이브러리를 설치합니다.

```sh
npx expo install expo-font
```

[app config](/versions/latest/config/app#plugins) 파일에 config plugin을 추가하세요. 구성에는 하나 이상의 font 정의 배열을 받는 [`fonts`, `android` 또는 `ios`](/versions/latest/sdk/font#configurable-properties) 속성을 사용해 font 파일 경로가 포함되어야 합니다. 각 font 파일 경로는 프로젝트 루트 기준 상대 경로입니다.

아래 예제는 font를 지정하는 모든 유효한 방법을 보여 줍니다. `fontFamily`와 다른 속성을 명시한 객체 배열로도, font 파일 경로 배열로도 지정할 수 있습니다.

Android에서는 `fontFamily`, `weight`, 그리고 선택적으로 `style`(기본값은 `"normal"`)을 지정할 수 있으며, 이 경우 font는 네이티브 [XML resource](https://developer.android.com/develop/ui/views/text-and-emoji/fonts-in-xml)로 포함됩니다. 경로만 배열로 제공하면 Android에서는 파일명이 font family 이름이 됩니다. iOS는 항상 font 파일 자체에서 font family 이름을 추출합니다.

font를 `fontFamily`만으로 참조하려면 font 경로 배열을 제공하세요(아래의 `FiraSans-MediumItalic.ttf` 참고). 그리고 [어떤 font family 이름을 사용해야 하는지에 대한 권장 사항](/develop/user-interface/fonts#how-to-determine-which-font-family-name-to-use)을 따르세요.

`fontFamily`, `weight`, `style` 조합으로 font를 참조하고 싶다면 객체 배열을 제공하세요(아래의 `Inter` 참고).

```json
{
  "expo": {
    "plugins": [
      [
        "expo-font",
        {
          "fonts": [
            "./assets/fonts/FiraSans-MediumItalic.ttf"
          ],
          "android": {
            "fonts": [
              {
                "fontFamily": "Inter",
                "fontDefinitions": [
                  {
                    "path": "./assets/fonts/Inter-BoldItalic.ttf",
                    "weight": 700,
                    "style": "italic"
                  },
                  {
                    "path": "./assets/fonts/Inter-Bold.ttf",
                    "weight": 700
                  }
                ]
              }
            ]
          },
          "ios": {
            "fonts": ["./assets/fonts/Inter-Bold.ttf", "./assets/fonts/Inter-BoldItalic.ttf"]
          }
        }
      ]
    ]
  }
}
```

config plugin으로 font를 포함한 뒤에는 [새 development build를 만들고](/develop/development-builds/create-a-build) 기기, Android Emulator, 또는 iOS Simulator에 설치하세요.

`fontFamily` style prop을 지정해 `<Text>`에서 font를 사용할 수 있습니다. 아래 예제는 위 구성에 정의된 font와 대응됩니다.

```tsx
<Text style={{ fontFamily: 'Inter', fontWeight: '700' }}>Inter Bold</Text>
<Text style={{ fontFamily: 'Inter', fontWeight: '700', fontStyle: 'italic' }}>Inter Bold Italic</Text>
<Text style={{ fontFamily: 'FiraSans-MediumItalic' }}>Fira Sans Medium Italic</Text>
```

기존 React Native 프로젝트에서 이 방법을 사용하고 있나요?

-   **Android:** font 파일을 **android/app/src/main/assets/fonts**에 복사하세요.
-   **iOS:** Apple Developer 문서의 [Adding a Custom Font to Your App](https://developer.apple.com/documentation/uikit/text_display_and_fonts/adding_a_custom_font_to_your_app)을 참고하세요.

#### 어떤 font family 이름을 사용해야 하는지 결정하는 방법

-   위에서 설명한 것처럼 font를 파일 경로 배열로 제공하면, Android에서는 파일명(확장자 제외)이 font family 이름이 됩니다. iOS에서는 font family 이름이 font 파일 자체에서 읽힙니다. 두 플랫폼에서 font family 이름을 일관되게 유지하려면 font 파일 이름을 해당 font의 [PostScript name](/develop/user-interface/fonts#what-is-postscript-name-of-a-font)과 같게 지정하는 것을 권장합니다.
    
-   객체 문법을 사용한다면 "Family Name"을 제공하세요. 이는 macOS의 Font Book 앱, [fontdrop.info](https://fontdrop.info/) 또는 다른 프로그램에서 확인할 수 있습니다.
    

font 파일의 PostScript name이란 무엇인가요?

font 파일의 **PostScript name**은 Adobe의 PostScript 표준을 따르는, font에 할당된 고유 식별자입니다. 운영체제와 앱이 font를 참조할 때 사용합니다. font의 **display name**과는 다릅니다.

예를 들어 Inter Black font 파일의 PostScript name은 `Inter-Black`입니다.

_macOS의 Font Book 앱 스크린샷._

### `useFonts` hook 사용하기

`expo-font` 라이브러리의 `useFonts` hook은 font 파일을 비동기로 로드할 수 있게 해 줍니다. 이 hook은 로딩 상태를 추적하고 앱이 초기화될 때 font를 로드합니다.

이 방식은 모든 Expo SDK 버전과 Expo Go에서 동작합니다. `useFonts` hook을 사용해 프로젝트에서 font를 로드하려면 아래 단계를 따르세요:

프로젝트에 custom font 파일을 추가한 뒤 `expo-font`와 `expo-splash-screen` 라이브러리를 설치합니다.

```sh
npx expo install expo-font expo-splash-screen
```

[`expo-splash-screen`](/versions/latest/sdk/splash-screen) 라이브러리는 font가 로드되어 준비될 때까지 앱 렌더링을 막는 데 사용할 수 있는 `SplashScreen` component를 제공합니다.

프로젝트의 root layout(**src/app/_layout.tsx**) 같은 최상위 component에서 `useFonts` hook을 사용해 font 파일을 매핑하세요:

```tsx
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {useEffect} from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Inter-Black': require('./assets/fonts/Inter-Black.otf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    ... 
  )
}
```

React component에서 `fontFamily` style prop을 사용해 `<Text>`에 font를 적용하세요:

```tsx
<Text style={{ fontFamily: 'Inter-Black' }}>Inter Black</Text>
```

## Google Fonts 사용하기

Expo는 [Google Fonts](https://fonts.google.com/)에 있는 모든 font를 1급으로 지원합니다. [`@expo-google-fonts`](https://github.com/expo/google-fonts) 라이브러리를 통해 사용할 수 있습니다. 이 라이브러리의 어떤 font package든 사용해 font와 그 variant를 빠르게 통합할 수 있습니다.

프로젝트에서 Google Font를 사용하는 방법은 두 가지입니다:

-   설치한 font를 [`expo-font` config plugin](/versions/latest/sdk/font#configuration-in-appjsonappconfigjs)으로 포함합니다.
-   런타임에 [`useFonts`](/versions/latest/sdk/font#usefontsmap) hook으로 설치한 font를 비동기로 로드합니다.

### `expo-font` config plugin 사용하기

> **참고:** `expo-font` config plugin으로 Google Font를 포함하는 것은 직접 custom font를 포함하는 것과 동일한 장점과 제한을 가집니다. 자세한 내용은 [로컬 font 파일에 `expo-font` config plugin 사용하기](/develop/user-interface/fonts#with-expo-font-config-plugin)를 참고하세요.

font package를 설치하세요. 예를 들어 Inter Black font를 사용하려면 아래 명령으로 [`@expo-google-fonts/inter`](https://www.npmjs.com/package/@expo-google-fonts/inter) package를 설치합니다.

```sh
npx expo install expo-font @expo-google-fonts/inter
```

[app config](/versions/latest/config/app#plugins) 파일에 config plugin을 추가하세요. 구성에는 하나 이상의 font 파일 배열을 받는 [`fonts`](/versions/latest/sdk/font#configurable-properties) 속성을 사용해 font 파일 경로가 포함되어야 합니다. font 파일 경로는 `node_modules` 디렉터리 안의 font package를 기준으로 정의됩니다. 예를 들어 font package 이름이 `@expo-google-fonts/inter`라면 파일명은 **Inter_900Black.ttf**입니다.

```json
{
  "plugins": [
    [
      "expo-font",
      {
        "fonts": ["node_modules/@expo-google-fonts/inter/900Black/Inter_900Black.ttf"]
      }
    ]
  ]
}
```

config plugin으로 font를 포함한 뒤에는 [새 development build를 만들고](/develop/development-builds/create-a-build) 기기, Android Emulator, 또는 iOS Simulator에 설치하세요.

Android에서는 font 파일명, 예를 들어 `Inter_900Black`를 사용할 수 있습니다. iOS에서는 font와 해당 weight 이름([PostScript name](/develop/user-interface/fonts#what-is-postscript-name-of-a-font))을 사용하세요. 아래 예제는 플랫폼마다 올바른 font family 이름을 선택하기 위해 [`Platform`](https://reactnative.dev/docs/platform-specific-code#platform-module)을 사용하는 방법을 보여 줍니다:

```tsx
import { Platform } from 'react-native';

// Inside a React component:
<Text
  style={{
    fontFamily: Platform.select({
      android: 'Inter_900Black',
      ios: 'Inter-Black',
    }),
  }}>
  Inter Black
</Text>
```

### `useFonts` hook 사용하기

> **참고:** `useFonts` hook으로 Google Font를 로드하는 것은 직접 custom font를 포함하는 것과 동일한 장점과 제한을 가집니다. 자세한 내용은 [로컬 font 파일에 `useFonts` hook 사용하기](/develop/user-interface/fonts#with-usefonts-hook)를 참고하세요.

각 Google Fonts package는 font를 비동기로 로드하기 위한 `useFonts` hook을 제공합니다. 이 hook은 로딩 상태를 추적하고 앱이 초기화될 때 font를 로드합니다. 또한 font package가 font 파일을 함께 import하므로, 별도로 font 파일을 import할 필요가 없습니다.

Google Fonts package와 `expo-font`, `expo-splash-screen` 라이브러리를 설치하세요.

```sh
npx expo install @expo-google-fonts/inter expo-font expo-splash-screen
```

[`expo-splash-screen`](/versions/latest/sdk/splash-screen) 라이브러리는 font가 로드되어 준비될 때까지 앱 렌더링을 막는 데 사용할 수 있는 `SplashScreen` component를 제공합니다.

font package를 설치한 뒤 프로젝트의 root layout(**src/app/_layout.tsx**) 같은 최상위 component에서 `useFonts` hook을 사용해 font를 매핑하세요:

```tsx
// Rest of the import statements
import { Inter_900Black, useFonts } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import {useEffect} from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_900Black,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    ... 
  )
}
```

React component에서 `fontFamily` style prop을 사용해 `<Text>`에 font를 적용하세요:

```tsx
<Text style={{ fontFamily: 'Inter_900Black' }}>Inter Black</Text>
```

## 추가 정보

### 최소 예제

[expo-font usage](/versions/latest/sdk/font#usage) — expo-font — custom font를 사용하는 최소 예제는 Expo Fonts API reference의 usage 섹션을 참고하세요.

### OTF와 TTF를 넘어

font가 OTF나 TTF 외의 형식이라면, 동작하도록 하려면 [Metro bundler 구성을 사용자 지정해 해당 형식을 추가 asset으로 포함](/guides/customizing-metro#adding-more-file-extensions-to-assetexts)해야 합니다. 어떤 경우에는 플랫폼이 지원하지 않는 font 형식을 렌더링하려 하면 앱이 충돌할 수 있습니다.

참고용으로, 아래 표는 각 네이티브 플랫폼에서 동작하는 형식 목록을 제공합니다:

| Format | Android | iOS | Web |
| --- | --- | --- | --- |
| bdf | ✗ | ✗ | ✗ |
| dfont | ✓ | ✗ | ✗ |
| eot | ✗ | ✗ | ✓ |
| fon | ✗ | ✗ | ✗ |
| otf | ✓ | ✓ | ✓ |
| ps | ✗ | ✗ | ✗ |
| svg | ✗ | ✗ | ✓ |
| ttc | ✗ | ✗ | ✗ |
| ttf | ✓ | ✓ | ✓ |
| woff | ✗ | ✓ | ✓ |
| woff2 | ✗ | ✓ | ✓ |

### 플랫폼 기본 내장 font

custom `fontFamily`를 지정해 custom font를 쓰고 싶지 않다면 플랫폼의 기본 font가 사용됩니다. 각 플랫폼에는 내장 font 집합이 있습니다. Android의 기본 font는 Roboto이고, iOS는 SF Pro입니다.

플랫폼 기본 font는 대개 읽기 쉽습니다. 하지만 시스템 기본 font가 읽기 쉬운 font가 아닌 다른 font로 바뀔 수도 있다는 점을 염두에 두세요. 이 경우 custom font를 사용하면 사용자가 보게 될 결과를 정확히 제어할 수 있습니다.

### `@expo/vector-icons` 초기 로드 처리하기

`@expo/vector-icons` 라이브러리의 icon이 처음 로드될 때 앱에서는 보이지 않는 icon처럼 나타납니다. 한 번 로드되면 이후 앱의 모든 사용에서 cache됩니다. 앱 첫 로드에서 보이지 않는 icon이 나타나는 것을 피하려면, 초기 로딩 화면에서 [`useFonts`](/versions/latest/sdk/font#usefontsmap)로 미리 로드하세요. 예를 들면 다음과 같습니다:

```tsx
import { useFonts } from 'expo-font';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function RootLayout() {
  useFonts([require('./assets/fonts/Inter-Black.otf', Ionicons.font)]);

  return (
    ... 
  )
}
```

이제 React component에서 `Ionicons` 라이브러리의 어떤 icon이든 사용할 수 있습니다:

```tsx
<Ionicons name="checkmark-circle" size={32} color="green" />
```

[Icons](/guides/icons) — vector icon, custom icon font, icon image, icon button을 포함해 Expo 앱에서 다양한 종류의 icon을 사용하는 방법을 알아보세요.

### web에서 원격 font를 직접 로드하기

> **원격 font를 로드한다면, 반드시 CORS가 올바르게 구성된 origin에서 제공되고 있는지 확인하세요**. 그렇지 않으면 web 플랫폼에서 원격 font가 제대로 로드되지 않을 수 있습니다.

로컬 asset에서 font를 로드하는 것이 앱에서 font를 로드하는 가장 안전한 방법입니다. font를 로컬 asset으로 포함하면 앱을 앱 스토어에 제출한 뒤, 이 font들이 앱 다운로드와 함께 번들되어 즉시 사용할 수 있습니다. CORS나 다른 잠재적인 문제를 걱정할 필요가 없습니다.

하지만 web에서 직접 font 파일을 로드하려면 아래 예제처럼 `require('./assets/fonts/FontName.otf')`를 font URL로 바꾸면 됩니다.

```tsx
import { useFonts } from 'expo-font';
import { Text, View, StyleSheet } from 'react-native';

export default function App() {
  const [loaded, error] = useFonts({
    'Inter-SemiBoldItalic': 'https://rsms.me/inter/font-files/Inter-SemiBoldItalic.otf?v=3.12',
  });

  if (!loaded || !error) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={{ fontFamily: 'Inter-SemiBoldItalic', fontSize: 30 }}>Inter SemiBoldItalic</Text>
      <Text style={{ fontSize: 30 }}>Platform Default</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```
