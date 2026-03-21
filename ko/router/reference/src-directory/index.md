---
modificationDate: February 26, 2026
title: Top-level src directory
description: Expo Router 프로젝트에서 최상위 src 디렉터리를 사용하는 방법을 알아보세요.
---

# Top-level src directory

Expo Router 프로젝트에서 최상위 src 디렉터리를 사용하는 방법을 알아보세요.

SDK 55 이상에서 [default template](/get-started/create-a-project)로 생성한 프로젝트에는 이미 **app**, **components**, **constants**, **hooks** 디렉터리를 담고 있는 최상위 **src** 디렉터리가 포함되어 있습니다. 추가 설정은 필요하지 않습니다.

**src** 디렉터리가 포함되지 않은 [custom template](/more/create-expo#--template) 또는 기존 프로젝트를 사용하고 있다면, 아래 단계에 따라 설정하세요.

## Using a top-level src directory

**app** 디렉터리를 **src/app**으로 옮기세요.

`src`

 `app`

  `_layout.tsx`

  `index.tsx`

 `components`

  `button.tsx`

`package.json`

**tsconfig.json** 파일에서 [TypeScript path aliases](/guides/typescript#path-aliases)를 루트 디렉터리가 아니라 **src** 디렉터리를 가리키도록 업데이트하세요. 기본 `@/*` alias를 사용한다면 이를 **./src/\***로 설정하세요:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

이렇게 하면 app 디렉터리를 **src** 안으로 옮긴 뒤에도 `@/` import가 계속 동작합니다.

development server를 다시 시작하세요.

```sh
npx expo start
npx expo export
```

### Notes

-   config 파일(**app.config.ts**, **app.json**, **package.json**, **metro.config.js**, **tsconfig.json**)은 루트 디렉터리에 그대로 두어야 합니다.
-   **src/app** 디렉터리는 루트 **app** 디렉터리보다 우선순위가 높습니다. 둘 다 있는 경우에는 **src/app** 디렉터리만 사용됩니다.
-   **public** 디렉터리는 루트 디렉터리에 그대로 두어야 합니다.
-   static rendering은 **src/app** 디렉터리가 존재하면 자동으로 이를 사용합니다.
-   [type aliases](/guides/typescript#path-aliases)도 루트 디렉터리가 아니라 **src** 디렉터리를 가리키도록 업데이트하는 것을 고려할 수 있습니다.

## Custom directory

> 기본 루트 디렉터리를 변경하는 것은 강하게 권장되지 않습니다. custom root 디렉터리를 사용하는 프로젝트에 관한 버그 리포트는 접수하지 않습니다.

Expo Router Config Plugin을 사용하면 root 디렉터리를 위험하게 사용자화할 수 있습니다. 다음 설정은 프로젝트 루트를 기준으로 root 디렉터리를 **src/routes**로 변경합니다.

```json
{
  "plugins": [
    [
      "expo-router",
      {
        "root": "./src/routes"
      }
    ]
  ]
}
```

이로 인해 예상치 못한 동작이 생길 수 있습니다. 많은 도구는 root 디렉터리가 **app** 또는 **src/app**이라고 가정합니다. 정확히 해당 버전의 Expo CLI에 포함된 도구만 config plugin을 존중합니다.
