---
modificationDate: March 05, 2026
title: 다른 앱으로 링크하기
description: 다른 앱의 URL scheme을 기반으로 앱에서 URL을 처리하고 여는 방법을 알아보세요.
---

# 다른 앱으로 링크하기

다른 앱의 URL scheme을 기반으로 앱에서 URL을 처리하고 여는 방법을 알아보세요.

앱에서 다른 앱으로 링크하는 처리는 대상 앱의 URL을 사용해 이뤄집니다. 앱에서 이러한 URL을 여는 데 사용할 수 있는 방법은 두 가지입니다:

-   [`expo-linking`](/versions/latest/sdk/linking) API 사용
-   Expo Router의 [`Link` component](/develop/app-navigation) 사용

## expo-linking API 사용하기

[`expo-linking`](/versions/latest/sdk/linking) API는 네이티브 linking API(웹의 `window.history` 등)에 대한 범용 추상화를 제공하고, 앱이 설치된 다른 앱과 상호작용할 수 있도록 유틸리티를 제공합니다.

아래 예시는 운영 체제의 기본 브라우저에서 [common URL scheme](/linking/into-other-apps#common-url-schemes)을 [`Linking.openURL`](/versions/latest/sdk/linking#linkingopenurlurl)로 엽니다:

```tsx
import { Button, View, StyleSheet } from 'react-native';
import * as Linking from 'expo-linking';

export default function Home() {
  return (
    <View style={styles.container}>
      <Button title="Open a URL" onPress={() => Linking.openURL('https://expo.dev/')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

## Expo Router의 `Link` component 사용하기

프로젝트가 [Expo Router](/router/introduction)를 사용한다면 URL을 열 때 `Link` component를 사용하세요. 이 component는 네이티브 플랫폼에서는 `<Text>` component를, 웹에서는 `<a>` element를 감쌉니다. 또한 URL scheme을 처리하기 위해 `expo-linking` API도 사용합니다.

아래 예시는 운영 체제의 기본 브라우저에서 [common URL scheme](/linking/into-other-apps#common-url-schemes) (HTTPS)을 엽니다:

```tsx
import { Button, View, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function Home() {
  return (
    <View style={styles.container}>
      <Link href="https://expo.dev">Open a URL</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

## 일반적인 URL scheme

모든 플랫폼에서 핵심 기능에 접근할 수 있게 해주는 내장 URL scheme이 있습니다. 다음은 자주 사용되는 scheme 목록입니다:

| Scheme | Description | Example |
| --- | --- | --- |
| `https` / `http` | 웹 브라우저 앱을 엽니다. | `https://expo.dev` |
| `mailto` | 메일 앱을 엽니다. | `mailto:support@expo.dev` |
| `tel` | 전화 앱을 엽니다. | `tel:+123456789` |
| `sms` | SMS 앱을 엽니다. | `sms:+123456789` |

일반적인 URL scheme을 처리할 Android intent 지정하기

Android 11(API level 30) 이상에서는 앱이 처리할 intent를 **AndroidManifest.xml** 파일에 지정해야 합니다. 이는 [creating a config plugin](/config-plugins/plugins#creating-a-config-plugin)으로 처리할 수 있습니다.

다음 config plugin 예시는 intent를 정의해 이메일 앱과 전화 앱으로의 링크를 활성화합니다:

```ts
import { withAndroidManifest, ConfigPlugin } from 'expo/config-plugins';

const withAndroidQueries: ConfigPlugin = config => {
  return withAndroidManifest(config, config => {
    config.modResults.manifest.queries = [
      {
        intent: [
          {
            action: [{ $: { 'android:name': 'android.intent.action.SENDTO' } }],
            data: [{ $: { 'android:scheme': 'mailto' } }],
          },
          {
            action: [{ $: { 'android:name': 'android.intent.action.DIAL' } }],
          },
        ],
      },
    ];

    return config;
  });
};

module.exports = withAndroidQueries;
```

config plugin을 만든 후 `plugins` 속성 아래에서 [커스텀 config plugin을 import](/config-plugins/plugins#call-the-config-plugin-from-your-dynamic-app-config)하세요:

```json
{
  "expo": {
    "plugins": [
      "./my-plugin.ts"
      ... 
    ]
  }
}
```

> **Tip**: Android에서는 `expo-intent-launcher`를 사용해 디바이스의 **특정 설정 화면**을 열 수 있습니다. 사용 가능한 intent 목록은 [`expo-intent-launcher` API reference](/versions/latest/sdk/intent-launcher#enums)를 참고하세요.

## 커스텀 URL scheme

> 열고 싶은 앱의 커스텀 scheme을 알고 있다면 다음 방법 중 하나로 링크할 수 있습니다: [Using `expo-linking` API](/linking/into-other-apps#using-expo-linking-api) 또는 [Using `Link` from Expo Router](/linking/into-other-apps#using-expo-routers-link-component).

일부 서비스는 자사 앱의 커스텀 URL scheme 사용 방법에 대한 문서를 제공합니다. 예를 들어 [Uber의 deep linking 문서](https://developer.uber.com/docs/riders/ride-requests/tutorials/deep-links/introduction#standard-deep-links)는 특정 픽업 위치와 목적지로 직접 연결하는 방법을 설명합니다:

```shell
uber://?client_id=<CLIENT_ID>&action=setPickup&pickup[latitude]=37.775818&pickup[longitude]=-122.418028&pickup[nickname]=UberHQ&pickup[formatted_address]=1455%20Market%20St%2C%20San%20Francisco%2C%20CA%2094103&dropoff[latitude]=37.802374&dropoff[longitude]=-122.405818&dropoff[nickname]=Coit%20Tower&dropoff[formatted_address]=1%20Telegraph%20Hill%20Blvd%2C%20San%20Francisco%2C%20CA%2094133&product_id=a1111c8c-c720-46c3-8534-2fcdd730040d&link_text=View%20team%20roster&partner_deeplink=partner%3A%2F%2Fteam%2F9383
```

위 예시에서 사용자의 디바이스에 Uber 앱이 설치되어 있지 않다면, 앱은 설치를 위해 Google Play Store 또는 Apple App Store로 사용자를 보낼 수 있습니다. 이런 시나리오를 처리하려면 [`react-native-app-link`](https://github.com/FiberJW/react-native-app-link) 라이브러리 사용을 권장합니다.

iOS용 커스텀 scheme 지정하기

iOS에서는 [`Linking.canOpenURL`](/versions/latest/sdk/linking#linkingcanopenurlurl)을 사용해 다른 앱의 linking scheme을 조회하려면 **InfoPlist**에 추가 구성이 필요합니다. app config의 [`ios.infoPlist`](/versions/latest/config/app#infoplist) 속성을 사용해 앱이 조회할 수 있도록 허용된 scheme 목록을 지정할 수 있습니다. 예를 들면 다음과 같습니다:

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "LSApplicationQueriesSchemes": ["uber"]
      }
    }
  }
}
```

이 목록을 지정하지 않으면 디바이스에 대상 앱이 설치되어 있어도 `Linking.canOpenURL`이 `false`를 반환할 수 있습니다.

> **Tip**: 위에서 설명한 구성을 iOS 디바이스에서 테스트하려면 [development build를 사용](/develop/development-builds/introduction)하세요. Expo Go에서는 테스트할 수 없습니다.

## URL 만들기

[`Linking.createURL`](/versions/latest/sdk/linking#linkingcreateurlurl)을 사용하면 앱을 열거나 다시 앱으로 리디렉션하는 데 사용할 URL을 만들 수 있습니다. 이 메서드는 다음으로 해석됩니다:

-   **Production and development builds**: `myapp://`, 여기서 `myapp`은 app config에 정의된 [custom scheme](/linking/into-your-app#add-a-scheme-in-app-config)입니다.
-   **Development in Expo Go**: `exp://127.0.0.1:8081`

`Linking.createURL`을 사용하면 URL을 하드코딩하지 않아도 됩니다. 이 메서드에 선택적 매개변수를 전달해 반환된 URL을 수정할 수 있습니다.

앱에 데이터를 전달하려면 URL에 path나 query string 형태로 덧붙일 수 있습니다. `Linking.createURL`이 동작하는 URL을 자동으로 구성해 줍니다. 예를 들면 다음과 같습니다:

```tsx
const redirectUrl = Linking.createURL('path/into/app', {
  queryParams: { hello: 'world' },
});
```

환경에 따라 이는 다음과 같이 해석됩니다:

-   **Production and development builds**: `myapp://path/into/app?hello=world`
-   **Development in Expo Go**: `exp://127.0.0.1:8081/--/path/into/app?hello=world`

테스트에 Expo Go를 사용하고 있나요?

안정적인 URL이 필요한 앱(예: auth provider 리디렉션)의 경우, Expo Go 대신 커스텀 scheme이 포함된 development build를 사용하세요. 커스텀 scheme을 만들고 테스트하는 방법에 대한 자세한 내용은 [Linking into your app](/linking/into-your-app)을 참고하세요.

## 앱 내 브라우저

`expo-linking` API를 사용하면 운영 체제의 기본 웹 브라우저 앱으로 URL을 열 수 있습니다. [`expo-web-browser`](/versions/latest/sdk/webbrowser) 라이브러리를 사용하면 앱 내 브라우저에서 URL을 열 수 있습니다. 예를 들어 앱 내 브라우저는 안전한 [authentication](/guides/authentication)에 유용합니다.

앱 내 브라우저에서 URL 열기 예시

아래 예시는 `expo-web-browser`를 사용한 앱 내 브라우저 열기와, `expo-linking`을 사용한 기본 또는 선호 브라우저 열기 동작을 시뮬레이션합니다:

```tsx
import { Button, View, StyleSheet } from 'react-native';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

export default function Home() {
  return (
    <View style={styles.container}>
      <Button
        title="Open URL with the system browser"
        onPress={() => Linking.openURL('https://expo.dev')}
        style={styles.button}
      />
      <Button
        title="Open URL with an in-app browser"
        onPress={() => WebBrowser.openBrowserAsync('https://expo.dev')}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginVertical: 10,
  },
});
```

## 웹에서의 추가 링크 기능

웹에서 우클릭으로 복사하거나 hover로 미리보기 같은 추가 링크 기능을 제공하려면 [`expo-router`](/router/introduction) 라이브러리의 `Link` component를 사용할 수 있습니다.

```tsx
import { Link } from 'expo-router';

export default function Home() {
  return <Link href="https://expo.dev">Go to Expo</Link>;
}
```

또는 [`@expo/html-elements`](https://www.npmjs.com/package/@expo/html-elements) 라이브러리를 사용해 범용 `<A>` element를 사용할 수 있습니다:

```tsx
import { A } from '@expo/html-elements';

export default function Home() {
  return <A href="https://expo.dev">Go to Expo</A>;
}
```

`<A>` component는 웹에서는 `<a>`를 렌더링하고, 네이티브 플랫폼에서는 `expo-linking` API를 사용하는 상호작용 가능한 `<Text>`를 렌더링합니다.
