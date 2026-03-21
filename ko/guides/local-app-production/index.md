---
modificationDate: October 22, 2025
title: 로컬에서 릴리스 빌드 만들기
description: Expo 앱의 릴리스(production) 빌드를 로컬에서 만드는 방법을 알아보세요.
---

# 로컬에서 릴리스 빌드 만들기

Expo 앱의 릴리스(production) 빌드를 로컬에서 만드는 방법을 알아보세요.

앱의 릴리스 빌드(즉 production build)를 로컬에서 만들려면, 컴퓨터에서 별도의 단계를 따라야 하며 모든 네이티브 앱을 만드는 데 필요한 도구를 사용해야 합니다. 이 가이드는 Android와 iOS에 필요한 단계를 제공합니다.

## Android

Android용 릴리스 빌드를 로컬에서 만들려면 [upload key](https://developer.android.com/studio/publish/app-signing#certificates-keystores)로 서명하고 Android Application Bundle(**.aab**)을 생성해야 합니다. 아래 단계를 따르세요:

### 사전 요구 사항

-   `keytool` 명령에 접근할 수 있도록 [OpenJDK 배포판](/get-started/set-up-your-environment?mode=development-build&buildEnv=local#install-watchman-and-jdk)이 설치되어 있어야 합니다.
-   **android** 디렉터리가 생성되어 있어야 합니다. [CNG](/workflow/continuous-native-generation)를 사용 중이라면 `npx expo prebuild`를 실행해 생성하세요.

### Upload key 만들기

이미 EAS Build로 빌드를 만들었나요? credential을 내려받고 다음 단계로 건너뛰세요.

이미 EAS Build로 빌드를 만들었다면, upload key와 그 비밀번호, key alias, key 비밀번호가 들어 있는 credential을 다운로드하려면 아래 단계를 따르세요:

1.  터미널에서 `eas credentials -p android`를 실행하고 build profile을 선택합니다.
2.  **credentials.json** > **Download credentials from EAS to credentials.json**을 선택합니다.
3.  다운로드한 **keystore.jks** 파일을 **android/app** 디렉터리로 이동합니다.
4.  다음 단계에서 필요하므로 **credentials.json**에서 upload keystore password, key alias, key password 값을 복사해 둡니다.

Expo 프로젝트 디렉터리 안에서 다음 `keytool` 명령을 실행해 upload key를 생성하세요:

```sh
sudo keytool -genkey -v -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

이 명령을 실행하면 keystore 비밀번호를 입력하라는 메시지가 표시됩니다. 이 비밀번호는 upload key를 보호합니다. 다음 단계에서 필요하므로 여기서 입력한 비밀번호를 기억해 두세요.

이 명령은 프로젝트 디렉터리에 **my-upload-key.keystore**라는 이름의 keystore 파일도 생성합니다. 이 파일을 **android/app** 디렉터리로 이동하세요.

> **android** 디렉터리를 Git 같은 버전 관리 시스템에 commit한다면, 이 keystore 파일은 commit하지 마세요. 이 파일에는 upload key가 들어 있으므로 비공개로 유지해야 합니다.

### gradle 변수 업데이트

**android/gradle.properties** 파일을 열고 파일 끝에 다음 gradle 변수를 추가하세요. `*****`는 이전 단계에서 설정한 올바른 keystore 및 key 비밀번호로 바꾸세요.

이 변수들은 upload key에 대한 정보를 담고 있습니다:

```ruby
# If you've downloaded the credentials from `eas credentials` command, see comments below for each value.

MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore     # Path to the "keystore" file
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias                # Replace with value of the `keystore.keyAlias` field in the credentials.json file
MYAPP_UPLOAD_STORE_PASSWORD=*****                  # Replace with value of the `keystore.password` field in the credentials.json file
MYAPP_UPLOAD_KEY_PASSWORD=*****                    # Replace with value of the `keystore.keyPassword` field in the credentials.json file
```

> **android** 디렉터리를 Git 같은 버전 관리 시스템에 commit한다면 위 정보를 commit하지 마세요. 대신 컴퓨터의 **~/.gradle/gradle.properties** 파일을 만들고 위 변수를 այնտեղ에 추가하세요.

### build.gradle에 signing config 추가하기

**android/app/build.gradle** 파일을 열고 다음 구성을 추가하세요:

### 릴리스 Android Application Bundle(aab) 생성하기

**android** 디렉터리 안으로 이동한 뒤 Gradle의 `bundleRelease` 명령을 실행해 **.aab** 형식의 릴리스 빌드를 만드세요:

```sh
cd android
./gradlew app:bundleRelease
```

이 명령은 **android/app/build/outputs/bundle/release** 디렉터리 안에 app-release.aab를 생성합니다.

### Google Play Console에 앱 수동 제출하기

Google Play Store는 **.aab** 파일을 처음 제출할 때 수동 앱 제출을 요구합니다.

[Android 앱 수동 제출](https://expo.fyi/first-android-submission) — FYI 가이드의 단계를 따라 앱을 처음으로 Google Play Store에 수동 제출하세요.

## iOS

Apple App Store용 iOS 릴리스 빌드를 로컬에서 만들려면, 서명과 제출 과정을 처리하는 Xcode를 사용해야 합니다.

### 사전 요구 사항

-   유료 Apple Developer 멤버십
-   컴퓨터에 [Xcode 설치](/get-started/set-up-your-environment?platform=ios&device=physical&mode=development-build&buildEnv=local#set-up-xcode-and-watchman)
-   **ios** 디렉터리가 생성되어 있어야 합니다. [CNG](/workflow/continuous-native-generation)를 사용 중이라면 `npx expo prebuild`를 실행해 생성하세요.

### Xcode에서 iOS workspace 열기

Expo 프로젝트 디렉터리 안에서 다음 명령을 실행해 Xcode에서 `your-project.xcworkspace`를 여세요:

```sh
xed ios
```

Xcode에서 iOS 프로젝트를 연 뒤:

1.  왼쪽 sidebar에서 앱의 workspace를 선택합니다.
2.  **Signing & Capabilities**로 이동하고 **All** 또는 **Release**를 선택합니다.
3.  **Signing** > **Team**에서 Apple Developer team이 선택되어 있는지 확인합니다. Xcode가 자동 관리되는 Provisioning Profile과 Signing Certificate를 생성합니다.

### 릴리스 scheme 구성하기

앱의 릴리스 scheme을 구성하려면:

1.  메뉴 바에서 **Product** > **Scheme** > **Edit Scheme**를 엽니다.
2.  sidebar에서 **Run**을 선택한 뒤, dropdown을 사용해 **Build configuration**을 **Release**로 설정합니다.

### 릴리스용 앱 빌드하기

앱을 릴리스용으로 빌드하려면 메뉴 바에서 **Product** > **Build**를 여세요. 이 단계는 앱 binary를 릴리스용으로 빌드합니다.

### App Store Connect를 사용한 앱 제출

빌드가 완료되면 App Store Connect를 사용해 앱을 TestFlight로 배포하거나 App Store에 제출할 수 있습니다:

1.  메뉴 바에서 **Product** > **Archive**를 엽니다.
2.  **Archives** 아래에서 오른쪽 sidebar의 **Distribute App**을 클릭합니다.
3.  **App Store Connect**를 클릭하고 창에 표시되는 안내를 따르세요. 이 단계는 앱 스토어 기록을 만들고 앱을 App Store에 업로드합니다.
4.  이제 App Store Connect 계정으로 이동해 Apps 아래에서 앱을 선택하고, TestFlight를 사용한 테스트 제출 또는 App Store Connect dashboard의 단계에 따라 최종 릴리스 준비를 진행할 수 있습니다.
