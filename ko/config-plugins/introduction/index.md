---
modificationDate: July 08, 2025
title: config plugin 소개
description: Expo config plugin 소개입니다.
---

# config plugin 소개

Expo config plugin 소개입니다.

프로젝트에서 [Continuous Native Generation (CNG)](/workflow/continuous-native-generation)을 사용할 때, 네이티브 프로젝트(**android** 및 **ios** 디렉터리)의 변경 사항은 네이티브 프로젝트 파일을 직접 다루지 않고 적용됩니다. 대신 config plugin을 사용하면 기본 app config props로 구성할 수 있는 범위를 넘어 네이티브 프로젝트를 자동으로 구성할 수 있습니다.

## config plugin이란 무엇인가

config plugin은 [app config](/workflow/configuration)에 내장되어 있지 않은 최상위 사용자 지정 구성 지점입니다. config plugin을 사용하면 CNG 프로젝트에서 [prebuild](/workflow/continuous-native-generation#usage) 과정 중 생성되는 네이티브 프로젝트를 수정할 수 있습니다.

config plugin은 [app config](/workflow/configuration) 파일의 `plugins` 속성에서 참조되며, 하나 이상의 plugin function으로 구성됩니다. 이 plugin function은 JavaScript로 작성되며 prebuild 과정 중 실행됩니다.

## 용어집

일반적인 config plugin은 함께 동작하는 하나 이상의 plugin function으로 이루어집니다. 다음 다이어그램은 config plugin의 서로 다른 부분이 어떻게 상호작용하는지 보여 줍니다:

```
withMyPlugin ("myPlugin") [Config Plugin]
→ withAndroidPlugin, withIosPlugin [Plugin Function]
→ withAndroidManifest, withInfoPlist [Mod Plugin Function]
→ mods.android.manifest, mods.ios.infoplist [Mod]
```

아래 가이드에서는 위 다이어그램을 사용해 아래에서 설명하는 특정 용어를 강조합니다:

### Plugin

app config의 `plugins` 배열에서 참조되는 최상위 config plugin입니다. 이것이 plugin의 진입점입니다. 관례적으로 `with<Plugin Name>` 형식의 이름을 사용합니다. 예를 들어 `withMyPlugin`입니다. 하나 이상의 [plugin function](/config-plugins/introduction#plugin-function)으로 구성됩니다.

### Plugin function

config plugin 안의 하나 이상의 함수를 _plugin function_이라고 부릅니다. 이 함수는 플랫폼별 수정 로직을 감싸는 역할을 합니다. 기술적으로는 최상위 plugin 자체의 함수와 똑같이 생겼으며, 독립적인 plugin으로 사용할 수도 있습니다. plugin을 더 작은 함수로 나누는 것은 테스트와 디버깅에 종종 도움이 됩니다.

### Mod plugin function

`expo/config-plugins` 라이브러리의 wrapper function으로, `mods`를 사용해 네이티브 파일을 안전하게 수정하는 방법을 제공합니다. 개발자는 기본 `mods` 대신 config plugin에서 이 함수를 사용하게 됩니다.

### Mod

prebuild 중 네이티브 프로젝트 파일을 직접 수정하는 하위 플랫폼별 modifier(`mods.android.manifest`, `mods.ios.infoplist` 등)입니다.

## 왜 config plugin을 사용해야 하나

config plugin은 기본으로 포함되지 않은 네이티브 구성을 프로젝트에 추가할 수 있습니다. 앱 아이콘 생성, 앱 이름 설정, **AndroidManifest.xml** 및 **Info.plist** 구성 등에 사용할 수 있습니다.

CNG 프로젝트에서는 이러한 네이티브 프로젝트를 수동으로 수정하지 않는 것이 가장 좋습니다. 수동 수정 사항을 안전하게 유지하면서 다시 생성할 수 없기 때문입니다. config plugin을 사용하면 네이티브 프로젝트 변경 사항을 구성 파일에 모으고 `npx expo prebuild`를 실행할 때(수동 또는 CI/CD 과정에서 자동으로) 적용함으로써, 네이티브 프로젝트를 _예측 가능한 방식_으로 수정할 수 있습니다. 예를 들어 app config에서 앱 이름을 바꾼 뒤 `npx expo prebuild`를 실행하면 **AndroidManifest.xml**과 **Info.plist**를 수동 수정할 필요 없이 네이티브 프로젝트의 이름도 자동으로 바뀝니다.

## config plugin의 특징

config plugin은 다음 특징을 가집니다:

-   plugin은 [ExpoConfig](/workflow/configuration)를 받아 수정된 `ExpoConfig`를 반환하는 **동기식** 함수입니다. 드물게 네이티브 프로젝트와 통신하는 메서드가 비동기인 경우에는 plugin도 비동기일 수 있지만, 성능은 좋지 않습니다.
-   plugin 이름은 `with<Plugin Functionality>` 규칙을 따르는 것이 좋습니다. 예: `withFacebook`
-   plugin은 동기식이어야 하고 반환값은 serialize 가능해야 합니다. 단, [`mods`](/config-plugins/introduction#mods)를 추가하는 경우는 예외입니다.
-   plugin은 항상 app config 평가 단계에서 실행됩니다.
-   선택적으로 plugin에 두 번째 인자를 전달해 구성을 사용자 지정할 수 있습니다.
-   mod는 `npx expo prebuild`의 **syncing** 단계(prebuild process)에서만 평가되며, 코드 생성 중 네이티브 파일을 수정합니다. 따라서 config plugin에서 app config에 가하는 변경은 mod 바깥에서 수행해야 합니다. 그래야 prebuild가 아닌 구성 시나리오에서도 해당 변경이 실행됩니다.

## 시작하기

[config plugin 만들기](/config-plugins/plugins) — Expo 프로젝트에서 config plugin을 만들고 사용하는 방법에 대한 종합 가이드입니다.

[Mods](/config-plugins/mods) — mods가 어떻게 동작하는지, 어떻게 만드는지, 그리고 모범 사례를 다루는 종합 가이드입니다.

[개발 및 디버깅 모범 사례](/config-plugins/development-and-debugging) — config plugin 개발과 디버깅을 위한 모범 사례를 알아보세요.
