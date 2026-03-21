---
modificationDate: September 11, 2025
title: Sitemap
description: Expo Router로 앱을 디버그할 때 sitemap을 사용하는 방법을 알아보세요.
---

# Sitemap

Expo Router로 앱을 디버그할 때 sitemap을 사용하는 방법을 알아보세요.

네이티브에서는 [`uri-scheme`](https://www.npmjs.com/package/uri-scheme) CLI를 사용해 device에서 네이티브 링크 열기를 테스트할 수 있습니다.

예를 들어, iOS에서 Expo Go 앱을 `/form-sheet` route로 실행하고 싶다면 다음을 실행하세요:

```sh
npx uri-scheme open exp://192.168.87.39:19000/--/form-sheet --ios
```

> `192.168.87.39:19000`은 `npx expo start`를 실행할 때 표시되는 IP 주소로 바꾸세요.

Safari나 Chrome 같은 browser에서 직접 링크를 검색해 실제 device에서 deep linking을 테스트할 수도 있습니다. 자세한 내용은 [testing deep links](https://reactnavigation.org/docs/deep-linking)를 참고하세요.

## Sitemap

Expo Router는 현재 앱의 모든 route 목록을 제공하는 **/_sitemap**을 자동으로 주입합니다. 이는 디버깅에 유용합니다.

app config의 `expo-router` config plugin에 `sitemap: false`를 추가하면 sitemap을 제거할 수 있습니다:

```json
{
  "plugins": [
    [
      "expo-router",
      {
        "sitemap": false
      }
    ]
  ]
}
```
