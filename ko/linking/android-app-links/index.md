---
modificationDate: March 09, 2026
title: Android App Links
description: 표준 웹 URL에서 Expo 앱이 열리도록 Android App Links를 구성하는 방법을 알아보세요.
---

# Android App Links

표준 웹 URL에서 Expo 앱이 열리도록 Android App Links를 구성하는 방법을 알아보세요.

앱에 Android App Links를 구성하려면 다음이 필요합니다:

-   프로젝트의 app config에 `intentFilters`를 추가하고 `autoVerify`를 true로 설정합니다.
-   웹사이트와 네이티브 앱을 검증하기 위해 양방향 연결을 설정합니다.

[Watch: Set up Android App Links with Expo Router](https://www.youtube.com/watch?v=kNbEEYlFIPs&t=399) — autoVerify가 포함된 intent filters를 구성하고, 웹사이트와 앱 사이의 양방향 연결을 설정한 뒤, Android App Links를 검증합니다.

## app config에 `intentFilters` 추가하기

app config에 `android.intentFilters` 속성을 추가하고 `autoVerify` 속성을 `true`로 설정해 구성하세요. Android App Links가 올바르게 작동하려면 `autoVerify`를 지정해야 합니다.

다음 예시는 `webapp.io` 도메인 링크를 처리하는 옵션으로 앱이 기본 Android 대화상자에 표시되도록 하는 기본 구성입니다. 또한 [Android App Links](/linking/overview#android-app-links)가 [standard deep links](/linking/into-other-apps)와 다르기 때문에 일반 `https` 스킴을 사용합니다.

```json
{
  "expo": {
    "android": {
      "intentFilters": [
        {
          "action": "VIEW",
          "autoVerify": true,
          "data": [
            {
              "scheme": "https",
              "host": "*.webapp.io",
              "pathPrefix": "/records"
            }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

## 양방향 연결 설정하기

웹사이트와 Android 앱 사이의 **양방향 연결**을 설정하려면 다음이 필요합니다:

-   **웹사이트 검증:** 대상 웹사이트의 **/.well-known** 디렉터리 안에 **assetlinks.json** 파일을 만들고 호스팅해야 합니다. 이 파일은 특정 링크에서 열린 앱이 올바른 앱인지 검증하는 데 사용됩니다.
-   **네이티브 앱 검증:** 대상 웹사이트 도메인(URL)을 참조하는 일종의 코드 서명이 필요합니다.

### assetlinks.json 파일 만들기

웹사이트 검증용 **assetlinks.json** 파일(또는 [digital asset links](https://developers.google.com/digital-asset-links/v1/getting-started) 파일)을 **/.well-known/assetlinks.json**에 생성하세요. 이 파일은 특정 링크에 대해 열린 앱이 올바른지 검증하는 데 사용됩니다.

Expo Router로 웹사이트를 빌드하는 경우(또는 Remix, Next.js 같은 다른 최신 React 프레임워크를 사용하는 경우), **assetlinks.json**을 **public/.well-known/assetlinks.json**에 만드세요. 레거시 Expo webpack 프로젝트라면 **web/.well-known/assetlinks.json**에 파일을 만드세요.

`package_name` 값은 app config의 `android.package`에서 가져오세요.

`sha256_cert_fingerprints` 값은 앱의 signing certificate에서 가져오세요. Android 앱을 [EAS Build](/build/setup)로 빌드하고 있다면, 빌드를 만든 후 다음을 수행하세요:

-   `eas credentials -p android` 명령을 실행하고 build profile을 선택해 fingerprint 값을 가져옵니다.
-   `SHA256 Fingerprint` 아래에 표시된 fingerprint 값을 복사합니다.

Google Play Console에서 SHA256 certificate fingerprint를 얻는 대체 방법

코드 서명을 EAS로 관리하지 않는다면, 앱을 수동으로 빌드하고 [Google Play Console](https://play.google.com/console/)에 제출하여 **sha256_cert_fingerprints**를 찾을 수 있습니다:

-   Google Play Console 대시보드에서 **Release > Setup > App Signing**으로 이동합니다.
-   앱에 맞는 **Digital Asset Links JSON** 스니펫을 찾습니다.
-   `14:6D:E9:83...`처럼 보이는 값을 복사해 **public/.well-known/assetlinks.json** 파일의 `sha256_cert_fingerprints` 아래에 붙여 넣습니다.

**assetlinks.json** 파일에 `package_name`과 `sha256_cert_fingerprints`를 추가하세요:

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.example",
      "sha256_cert_fingerprints": [
        // Supports multiple fingerprints for different apps and keys
        "14:6D:E9:83:51:7F:66:01:84:93:4F:2F:5E:E0:8F:3A:D6:F4:CA:41:1A:CF:45:BF:8D:10:76:76:CD"
      ]
    }
  }
]
```

> 앱의 서로 다른 변형을 지원하기 위해 `sha256_cert_fingerprints` 배열에 여러 fingerprint를 추가할 수 있습니다. 자세한 내용은 [웹사이트 연결 선언 방법에 대한 Android 문서](https://developer.android.com/training/app-links/verify-android-applinks#web-assoc)를 참고하세요.

### assetlinks.json 파일 호스팅하기

도메인에 연결된 웹 서버로 **assetlinks.json** 파일을 호스팅하세요. 이 파일은 content-type이 `application/json`으로 제공되어야 하고 HTTPS 연결을 통해 접근할 수 있어야 합니다. 브라우저 주소창에 전체 URL을 입력해 이 파일에 접근할 수 있는지 확인하세요.

### 네이티브 앱 검증

[Android app verification](https://developer.android.com/training/app-links/verify-android-applinks#web-assoc) 프로세스를 실행하려면 Android 디바이스에 앱을 설치하세요.

앱이 실행되면, 들어오는 링크를 처리하고 사용자가 요청한 콘텐츠를 보여주는 방법에 대한 자세한 내용은 [Handle links into your app](/linking/into-your-app#handle-urls)을 참고하세요.

## 디버깅

Expo CLI를 사용하면 웹사이트를 배포하지 않고도 Android App Links를 테스트할 수 있습니다. [`--tunnel`](/more/expo-cli#tunneling) 기능을 사용하면 dev server를 공개적으로 접근 가능한 HTTPS URL로 포워딩할 수 있습니다.

환경 변수 `EXPO_TUNNEL_SUBDOMAIN=my-custom-domain`을 설정하세요. 여기서 `my-custom-domain`은 개발 중에 사용할 고유 문자열입니다. 이렇게 하면 dev server를 다시 시작해도 tunnel URL이 일정하게 유지됩니다.

[위에서 설명한 대로](/linking/android-app-links#add-intentfilters-to-the-app-config) app config에 `intentFilters`를 추가하세요. `host` 값은 Ngrok URL인 `my-custom-domain.ngrok.io`로 바꾸세요.

`--tunnel` 플래그로 dev server를 시작하세요:

```sh
npx expo start --tunnel
```

디바이스에서 development build를 컴파일하세요:

```sh
npx expo run:android
```

다음 `adb` 명령어를 사용해 intent activity를 시작하고 앱에서 링크를 열거나, 디바이스의 웹 브라우저에서 커스텀 도메인 링크를 직접 입력하세요.

```sh
adb shell am start -a android.intent.action.VIEW  -c android.intent.category.BROWSABLE -d "https://my-custom-domain.ngrok.io/"
```

## 문제 해결

Android App Links를 구현할 때 문제를 해결하는 데 도움이 되는 일반적인 팁은 다음과 같습니다:

-   웹사이트가 HTTPS로 제공되고 content-type이 `application/json`인지 확인하세요.
-   [Verify Android app links](https://developer.android.com/training/app-links/verify-android-applinks)
-   Android 검증은 적용되기까지 20초 이상 걸릴 수 있으므로, 완료될 때까지 충분히 기다리세요.
-   웹 파일을 업데이트했다면, 공급업체 측(Google) 서버 업데이트를 트리거하기 위해 네이티브 앱을 다시 빌드하세요.
