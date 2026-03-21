---
modificationDate: February 26, 2026
title: Localization
description: expo-localization을 사용해 Expo 프로젝트에서 localization을 시작하고 구성하는 방법을 알아보세요.
---

# Localization

expo-localization을 사용해 Expo 프로젝트에서 localization을 시작하고 구성하는 방법을 알아보세요.

앱을 다른 언어를 사용하거나 다른 문화권에서 온 사용자도 쉽게 사용할 수 있게 만들고 싶다면, localization을 적용해야 합니다. 앱을 localization하면 사용자의 기기 locale에 맞게 앱이 적응합니다. 사용자가 알고 이해하는 번역문과 통화를 보여주고, 숫자, 목록 등도 사용자가 익숙한 방식으로 형식화합니다.

이 가이드는 사용자 언어 설정에 접근하고 여러 언어를 지원하기 위해 `expo-localization` 라이브러리를 사용합니다. 또한 다국어 지원을 추가하는 예시로 `i18n-js`를 사용합니다.

## 사용자의 언어 가져오기

사용자의 현재 언어를 가져오려면 [`expo-localization`](/versions/latest/sdk/localization) 라이브러리를 사용하세요. 다음 명령으로 package를 설치합니다:

```sh
npx expo install expo-localization
```

그다음 앱에서 localization method와 데이터에 접근할 수 있습니다:

```tsx
import { getLocales } from 'expo-localization';

const deviceLanguage = getLocales()[0].languageCode;
```

`getLocales` method는 기기의 시스템 설정을 기준으로 현재 locale을 반환합니다. 최신 Android와 iOS 버전에서는 앱별 언어를 따로 설정할 수 있으므로, 보통 앱 안에서 현재 locale을 바꾸기 위한 custom UI를 따로 만들 필요가 없습니다.

때로는 앱별로 다른 localization 설정을 사용자가 선택할 수 있도록 UI를 만드는 것이 적절할 수 있습니다. 일반적인 원칙으로는 다음을 사용자가 바꿀 수 있게 하는 것이 좋습니다:

-   앱에서 어느 정도 이상 사용되는 localized 단위(예: 미터법/야드파운드법, 통화, 온도 등)
-   지원하려는 플랫폼에서 기본값을 가져오는 API가 없는 기타 환경설정(자세한 내용은 [`expo-localization`](/versions/latest/sdk/localization) API 문서를 확인하세요)

### 시스템 설정을 통한 앱별 언어 선택 활성화

Android와 iOS는 모두 시스템 설정을 통해 개별 앱의 선호 언어를 고를 수 있게 해줍니다. 이 기능을 지원하려면 앱이 지원하는 locale을 시스템에 선언해야 합니다.

이를 위해 [`expo-localization`](/versions/latest/sdk/localization#installation) config plugin을 사용하고, `supportedLocales` 속성을 `expo-localization` config plugin에 전달하세요. 지원 locale 배열을 직접 제공할 수도 있고, 플랫폼별 값을 지정하기 위해 `supportedLocales.ios`와 `supportedLocales.android` field를 사용할 수도 있습니다:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-localization",
        {
          "supportedLocales": {
            "ios": ["en", "ja"],
            "android": ["en", "ja"]
          }
        }
      ]
    ]
  }
}
```

> Android에서는 [locale naming guidelines](https://developer.android.com/guide/topics/resources/app-languages#locale-names)와 [가장 흔히 사용되는 locale 목록](https://developer.android.com/guide/topics/resources/app-languages#sample-config)을 참고하세요.
> 
> iOS에서는 language name 또는 ISO language designator를 사용하세요.

## 앱 번역하기

번역을 만들고 관리하는 일은 금세 큰 작업이 됩니다. 수동으로 처리할 수도 있지만, 이를 대신 처리해 줄 라이브러리를 사용하는 것이 가장 좋습니다.

앱이 영어와 일본어를 지원하도록 만들어 봅시다. 이를 위해 이 가이드는 `i18n-js` package를 사용합니다:

```sh
npx expo install i18n-js
```

자신의 요구에 가장 잘 맞는 것을 찾으려면 [다른 번역 라이브러리](/guides/localization#other-translation-libraries)도 살펴보세요.

그다음 앱의 언어를 설정합니다:

```tsx
import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';

// Set the key-value pairs for the different languages you want to support.
const i18n = new I18n({
  en: { welcome: 'Hello' },
  ja: { welcome: 'こんにちは' },
});

// Set the locale once at the beginning of your app.
i18n.locale = getLocales().at(0)?.languageCode ?? 'en'; // you can also do getLocales()[0].languageCode ?? 'en'

console.log(i18n.t('welcome'));
```

이제 애플리케이션 전반에서 `i18n.t` 함수를 사용해 문자열을 번역할 수 있습니다.

예를 들어 이름처럼, 특정 항목은 localization하지 않아도 될 수 있습니다. 이런 경우에는 기본 언어에서 _한 번만_ 정의하고 `i18n.enableFallback = true;`를 사용해 재사용할 수 있습니다.

Android에서는 사용자가 기기의 언어를 바꿔도 앱이 재시작되지 않습니다. [`AppState`](https://reactnative.dev/docs/appstate#basic-usage) API를 사용해 앱 상태 변화를 감지하고, 앱 상태가 바뀔 때마다 `getLocales()` 함수를 호출할 수 있습니다.

iOS에서는 사용자가 기기의 언어를 바꾸면 앱이 재시작됩니다. 즉, 언어 변경을 반영하기 위해 React 컴포넌트를 업데이트하지 않고도 앱 시작 시 한 번만 언어를 설정하면 됩니다.

### 전체 예시

```tsx
import { View, StyleSheet, Text } from 'react-native';
import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';

// Set the key-value pairs for the different languages you want to support.
const translations = {
  en: { welcome: 'Hello', name: 'Charlie' },
  ja: { welcome: 'こんにちは' },
};
const i18n = new I18n(translations);

// Set the locale once at the beginning of your app.
i18n.locale = getLocales()[0].languageCode ?? 'en';

// When a value is missing from a language it'll fall back to another language with the key present.
i18n.enableFallback = true;
// To see the fallback mechanism uncomment the line below to force the app to use the Japanese language.
// i18n.locale = 'ja';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {i18n.t('welcome')} {i18n.t('name')}
      </Text>
      <Text>Current locale: {i18n.locale}</Text>
      <Text>Device locale: {getLocales()[0].languageCode}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  text: {
    fontSize: 20,
    marginBottom: 16,
  },
});
```

### 다른 번역 라이브러리

이 가이드에서는 `i18n-js`를 예시로 사용하지만, 다른 라이브러리들도 이 작업에 도움을 줄 수 있습니다. 번역 생성은 큰 노력입니다. 라이브러리를 고를 때 고려할 만한 몇 가지 기준은 다음과 같습니다:

-   문자열 관리와 자동화를 더 쉽게 할 수 있도록 번역 관리 도구와 통합되는가
-   문자열에 문맥을 제공할 수 있어 AI 번역 도구나 사람 검토자가 문맥을 이해하고 더 나은 번역을 제공할 수 있는가
-   개발자 경험: React / JSX 맥락에서의 사용성. 일부 라이브러리는 개발을 돕는 ESLint plugin과 기타 도구를 함께 제공합니다.
-   날짜나 숫자 localization은 걱정하지 말고, 표준화된 `Intl` API를 사용하세요.

다음은 고려해 볼 수 있는 다른 라이브러리의 일부 목록입니다:

-   [Lingui](https://lingui.dev/)는 React(React Server Components (RSC) 포함)를 일급으로 지원하는 성숙한 라이브러리이며 번역 관리 도구와도 잘 통합됩니다.
    
-   [fbtee](https://fbtee.dev/)는 강력하고 유연하며 직관적인 JavaScript 및 React용 국제화 프레임워크입니다.
    
-   [React i18next](https://react.i18next.com/)는 `i18next` 기반의 안정적이고 잘 관리되는 라이브러리입니다.
    

### 앱 메타데이터 번역하기

앱을 여러 국가나 지역에 배포하거나 다양한 언어를 지원하려는 경우, display name과 시스템 dialog 같은 항목에 대해 [localized](/versions/latest/sdk/localization) 문자열을 제공할 수 있습니다. 이는 [app config](/workflow/configuration) 파일에서 쉽게 설정할 수 있습니다. 먼저 `ios.infoPlist.CFBundleAllowMixedLocalizations: true`를 설정한 뒤, `locales`에 파일 경로 목록을 제공합니다.

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "CFBundleAllowMixedLocalizations": true
      }
    },
    "locales": {
      "ja": "./languages/japanese.json"
    }
  }
}
```

`locales`에 제공하는 key는 [language identifier](https://developer.apple.com/documentation/xcode/choosing-localization-regions-and-scripts)여야 하며, 원하는 언어의 [2-letter language code](https://www.loc.gov/standards/iso639-2/php/code_list.php)에 선택적인 region code(예: `en-US`, `en-GB`)를 더한 형태입니다. value는 아래와 비슷한 JSON 파일을 가리켜야 합니다:

```json
{
  "ios": {
    "CFBundleDisplayName": "こんにちは",
    "NSContactsUsageDescription": "日本語のこれらの言葉",
    "Localizable.strings": {
      "HELLO_NOTIFICATION_KEY": "こんにちは世界"
    }
  },
  "android": {
    "app_name": "こんにちは",
    "HELLO_NOTIFICATION_KEY": "こんにちは世界"
  }
}
```

이제 앱이 일본어로 설정된 기기에 설치되면 앱의 display name이 `こんにちは`로 설정됩니다.

SDK 55 이상에서는 `Localizable.strings` object를 지정하는 iOS 전용 옵션이 있으며, 이 안의 항목으로 네이티브 localization 파일이 생성됩니다. 이 항목은 [iOS localized notification](https://developer.apple.com/documentation/usernotifications/generating-a-remote-notification#Localize-your-alert-messages)에 사용할 수 있습니다.

## RTL 지원 활성화하기

전 세계 여러 지역에서는 오른쪽에서 왼쪽으로 텍스트를 씁니다. 앱을 localization해서 RTL 언어에서도 기대한 모습으로 보이게 하려면, 앱이 layout과 텍스트 방향 변화를 올바르게 처리하는지 확인해야 합니다.

RTL 지원을 활성화하려면 [`expo-localization`](/versions/latest/sdk/localization#installation) config plugin을 사용하고 app config에서 `extra.supportsRTL` 속성을 활성화하세요:

```json
{
  "expo": {
    "extra": {
      "supportsRTL": true
    },
    "plugins": ["expo-localization"]
  }
}
```

이렇게 하면 Expo Go, Expo dev Client, 그리고 EAS Build 또는 `npx expo prebuild`로 빌드된 애플리케이션에서 RTL이 활성화됩니다.

애플리케이션이 시작되면 Expo는 현재 기기 locale이 올바르게 보이도록 RTL layout으로 렌더링되어야 하는지 확인합니다. 예를 들어 app config 파일에서 RTL 지원을 표시한 앱은 히브리어나 아랍어 locale에서 RTL 모드로 렌더링됩니다.

### RTL 레이아웃 강제하기

테스트를 위해, 혹은 RTL locale만 지원하는 애플리케이션이라면 app config에서 `extra.forcesRTL` 속성을 활성화해 RTL 레이아웃을 강제로 적용할 수도 있습니다:

```json
{
  "expo": {
    "extra": {
      "supportsRTL": true,
      "forcesRTL": true
    },
    "plugins": ["expo-localization"]
  }
}
```

RTL 설정 동적으로 재정의하기

애플리케이션 코드에서 기본 RTL 감지를 동적으로 재정의하고 싶다면 app config의 정적 구성을 사용할 수 없습니다. 대신 애플리케이션 코드에서 이 변경을 동적으로 적용해야 합니다.

이는 Expo Go에서는 동작하지 않습니다. Expo Go는 launcher나 개별 프로젝트를 열 때 RTL 환경설정을 재설정하기 때문입니다.

```tsx
import { Text, View, StyleSheet, I18nManager, Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Updates from 'expo-updates';

export default function App() {
  const shouldBeRTL = true;

  if (shouldBeRTL !== I18nManager.isRTL && Platform.OS !== 'web') {
    I18nManager.allowRTL(shouldBeRTL);
    I18nManager.forceRTL(shouldBeRTL);
    Updates.reloadAsync();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{I18nManager.isRTL ? ' RTL' : ' LTR'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    padding: 8,
  },
  paragraph: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
    width: '50%',
    backgroundColor: 'pink',
  },
});
```

## RTL locale에서 앱이 올바르게 동작하게 만들기

### 레이아웃과 view

locale에 따라 `<View>` 스타일 속성을 수동으로 조정할 필요는 없습니다. `justifyContent`, `alignItems` 같은 속성을 그대로 사용할 수 있고, 해당 속성값은 필요에 따라 동작이 바뀝니다.

-   LTR locale에서는 `start`와 `end`가 `left`와 `right`와 같습니다.
-   RTL locale에서는 `start`와 `end`가 `right`와 `left`와 같습니다.

> React Native에서 RTL이 어떻게 동작하는지 더 자세히 알고 싶다면 RTL 지원을 소개한 React Native [blog article](https://reactnative.dev/blog/2016/08/19/right-to-left-support-for-react-native-apps)을 참고하세요.

#### 웹 지원

RTL 레이아웃에 대한 웹 지원은 app config 변경 없이 사용할 수 있습니다.

Expo는 브라우저에서 Expo 프로젝트를 실행할 때 `react-native-web`을 사용합니다. `react-native-web`이 locale 방향에 맞게 자동으로 동작하도록 하려면 루트 `<View>` 컴포넌트에 `dir` 속성을 추가하세요.

```tsx
import { View } from 'react-native';
import { getLocales } from 'expo-localization';
// ...

return <View dir={getLocales()[0].textDirection || 'ltr'}>...</View>;
```

> `textDirection`은 Firefox와 오래된 브라우저 버전에서는 사용할 수 없습니다. 필요하면 [직접 감지하세요](https://stackoverflow.com/a/15726039).

### 텍스트 정렬

React Native의 `textDirection` 속성은 flex 속성처럼 사용할 수 있는 `start`나 `end` 값을 받지 않습니다. 대신 `left`는 사실상 `start`처럼 동작하며(LTR에서는 왼쪽, RTL에서는 오른쪽 정렬), `right`는 `end`처럼 동작합니다.

하지만 `textDirection` 속성의 기본 미설정 값은 실제 left를 의미합니다(LTR과 RTL 모두에서 왼쪽 정렬). 즉, 올바르게 정렬되게 하려면 각 `<Text>` tag에 `textDirection: left` 또는 `textDirection: right` 스타일이 설정되어 있어야 합니다.

이 스타일은 텍스트 문자열을 렌더링해야 하는 모든 곳에서 import해 쓸 수 있는 재사용 가능한 custom `<Text>` 컴포넌트 안에 정의하는 것이 가장 좋습니다.

```tsx
import { Text as RNText, TextProps as RNTextProps } from 'react-native';

const MobileText = (props: RNTextProps) => {
  return <RNText style={{ textAlign: 'left', ...props.style }} {...props} />;
};
export default MobileText;
```

#### 웹 지원

각 text tag마다 현재 locale identifier를 담은 `lang` 속성을 추가해야 합니다. 이 역시 재사용 가능한 custom 컴포넌트 안에 정의하는 것이 가장 좋습니다.

```tsx
import { getLocales } from 'expo-localization';

const deviceLanguage = getLocales()[0].languageCode;

const WebText = (props: RNTextProps) => {
  return <RNText lang={deviceLanguage} {...props} />;
};

export default WebText;
```

그다음 현재 플랫폼에 따라 mobile 또는 web Text 컴포넌트를 선택할 수 있습니다.

```tsx
const Text = Platform.OS === 'web' ? WebText : MobileText;
export default Text;
```

### locale 방향에 따라 asset 선택하기

LTR/RTL에 따라 다른 icon을 사용하거나 이 설정에 따라 스타일을 바꿔야 한다면 [`I18nManager.isRTL`](https://reactnative.dev/docs/next/i18nmanager#isrtl)을 사용해 현재 layout 방향을 가져올 수 있습니다.

```tsx
import { I18nManager } from 'react-native';
const isRTL = I18nManager.isRTL;
```

## Locale 설정과 단위

Expo는 사용자의 locale과 다른 환경설정을 읽을 수 있도록 `expo-localization` 라이브러리를 제공합니다. 동기식 `getLocales()`와 `getCalendars()` method를 사용해 사용자의 기기 현재 locale 설정을 가져올 수 있습니다:

-   `getLocales()`는 사용자가 선호하는 순서대로 locale 목록을 반환합니다. 목록에는 항상 최소 하나의 locale이 있습니다.
    
-   `getCalendars()`는 사용자가 선호하는 순서대로 calendar 목록을 반환합니다. 목록에는 항상 최소 하나의 calendar가 있습니다.
    

```ts
import { getLocales, getCalendars } from 'expo-localization';

const {
  languageTag,
  languageCode,
  textDirection,
  digitGroupingSeparator,
  decimalSeparator,
  measurementSystem,
  currencyCode,
  currencySymbol,
  regionCode,
} = getLocales()[0];

const { calendar, timeZone, uses24hourClock, firstWeekday } = getCalendars()[0];
```

제한 사항

`expo-localization`에서 자동 감지된 locale 환경설정에 의존할 때는 몇 가지 제한을 염두에 두어야 합니다.

-   아직은 사용자 환경설정에서 온도 단위를 읽는 방법이 없습니다. Android에서는 locale 기반 lookup table을 사용할 수 있지만, iOS에서는 사용자가 기기 환경설정에서 이를 바꿀 수 있습니다.
-   일부 속성은 현재 플랫폼에서 사용할 수 없을 때 null일 수 있습니다.

## Intl API

앱에서 Hermes를 사용한다면, 모든 플랫폼에서 [`Intl`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) API를 사용할 수 있습니다.

이 API는 목록, 날짜, 숫자, 금액, 단위, 복수형 등을 형식화하는 데 사용할 수 있는 유틸리티 집합을 제공합니다.

locale 문자열로 `default`를 전달하면 `Intl` API가 기기의 locale을 사용하므로, 현재 locale(예: `"en-US"`)을 가져오기 위해 `expo-localization`에 의존할 필요가 없습니다.

```ts
new Intl.NumberFormat('default', { style: 'currency', currency: 'EUR' }).format(5.0);
```

> 사용자가 무엇을 보기를 기대하는지 알고 있다면 `Intl` API를 사용해 문자열과 값을 형식화할 수 있습니다.
> 
> `Intl` API는 기기나 현재 locale에 대한 정보를 제공하지 않으므로, 현재 locale의 단위, 통화, 측정 체계를 가져오는 데 `Intl` API를 사용할 수는 없습니다.
> 
> 이를 위해서는 `expo-localization`, 웹의 JS 코드, 또는 Android와 iOS의 third-party/native custom code를 사용해야 합니다.
