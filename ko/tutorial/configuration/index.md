---
modificationDate: March 09, 2026
title: 상태 표시줄, 스플래시 화면, 앱 아이콘 설정하기
description: 이 튜토리얼에서는 상태 표시줄, 앱 아이콘, 스플래시 화면을 설정하는 기본 방법을 알아봅니다.
---

# 상태 표시줄, 스플래시 화면, 앱 아이콘 설정하기

이 튜토리얼에서는 상태 표시줄, 앱 아이콘, 스플래시 화면을 설정하는 기본 방법을 알아봅니다.

이 장에서는 앱을 앱 스토어에 배포하기 전에 상태 표시줄 테마 지정, 앱 아이콘 커스터마이징, 스플래시 화면 같은 몇 가지 앱 세부 사항을 다루겠습니다.

[시청하기: 유니버설 Expo 앱에 마무리 손질 더하기](https://www.youtube.com/watch?v=OgGCYdElcZo) — 앱 스토어에 배포하기 전에 상태 표시줄을 설정하고, 앱 아이콘을 커스터마이징하고, 스플래시 화면을 설정합니다.

## 상태 표시줄 설정하기

[`expo-status-bar`](/versions/latest/sdk/status-bar) 라이브러리는 `create-expo-app`으로 만든 모든 프로젝트에 기본으로 설치되어 있습니다. 이 라이브러리는 앱의 상태 표시줄 스타일을 설정하는 `StatusBar` 컴포넌트를 제공합니다.

**app/_layout.tsx** 안에서:

1.  `expo-status-bar`에서 `StatusBar`를 import합니다.
2.  `StatusBar`와 기존 `Stack` 컴포넌트를 [React의 Fragment component](https://react.dev/reference/react/Fragment)로 그룹화합니다.

```tsx
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
```

이제 Android와 iOS에서 앱을 살펴봅시다:

## 앱 아이콘

프로젝트 안의 **assets/images** 디렉터리에는 **icon.png** 파일이 있습니다. 이것이 앱 아이콘입니다. 1024px x 1024px 이미지이며 아래와 같은 모습입니다:

스플래시 화면 이미지와 마찬가지로 **app.json** 파일의 `"icon"` 속성이 앱 아이콘 경로를 설정합니다. 기본적으로 새 Expo 프로젝트는 `"./assets/images/icon.png"`에 대한 올바른 경로를 정의해 둡니다. 우리는 아무 것도 바꿀 필요가 없습니다.

> 나중에 앱 스토어용으로 앱을 빌드할 때, [Expo Application Services (EAS)](/eas)가 이 이미지를 사용해 각 디바이스에 최적화된 아이콘을 생성합니다.

Expo Go 안에서도 여러 곳에서 아이콘을 볼 수 있습니다. 아래는 Expo Go의 developer menu에 표시된 앱 아이콘 예시입니다:

## 스플래시 화면

스플래시 화면은 앱 콘텐츠가 로드되기 전에 표시됩니다. 중앙에 배치된 앱 아이콘 같은 더 작은 이미지를 사용합니다. 앱 콘텐츠를 표시할 준비가 되면 숨겨집니다.

[`expo-splash-screen`](/versions/latest/sdk/splash-screen) plugin은 `create-expo-app`으로 만든 모든 프로젝트에 이미 기본 설치되어 있습니다. 이 라이브러리는 스플래시 화면을 설정하기 위한 config plugin을 제공합니다.

**app.json**에서 `expo-splash-screen` plugin은 이미 앱 아이콘을 스플래시 화면 이미지로 사용하도록 설정되어 있으며([downloadable assets](/tutorial/create-your-first-app#download-assets)에 제공됨), 다음과 같은 코드 조각이 들어 있으므로 우리는 아무 것도 바꿀 필요가 없습니다:

```json
{
  "plugins": [
    ... 
    [
      "expo-splash-screen",
      {
        "image": "./assets/images/splash-icon.png"
        ... 
      }
    ]
  ]
}
```

하지만 **스플래시 화면을 테스트하려면 Expo Go나 [development build](/develop/development-builds/introduction)를 사용할 수 없습니다**. 이를 테스트하려면 preview 또는 production build를 만들어야 합니다. 스플래시 화면 설정과 테스트 방법을 더 알아보려면 아래 자료를 참고하는 것을 권장합니다:

-   스플래시 화면 아이콘이 어떻게 설정되는지 알아보려면 [스플래시 화면 아이콘 만들기](/develop/user-interface/splash-screen-and-app-icon#splash-screen) 가이드를 참고하세요.
-   preview build를 만드는 방법은 EAS Tutorial의 [Internal distribution](/tutorial/eas/internal-distribution-builds) 가이드를 참고하고, production build를 만들려면 [Android](/tutorial/eas/android-production-build)와 [iOS](/tutorial/eas/ios-production-build) 가이드를 참고하세요.

## 요약

9장: 상태 표시줄, 스플래시 화면, 앱 아이콘 설정하기

잘하셨습니다! 우리는 같은 코드베이스에서 Android, iOS, 웹에서 실행되는 앱을 만들었습니다.

튜토리얼의 다음 섹션에서는 여기서 다룬 개념과 간단히 언급한 다른 주제를 더 배울 수 있는 자료로 안내합니다.

[다음: 학습 자료](/tutorial/follow-up)
