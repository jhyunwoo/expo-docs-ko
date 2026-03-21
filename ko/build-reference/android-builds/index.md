---
modificationDate: October 22, 2025
title: Android 빌드 프로세스
description: EAS Build에서 Android 프로젝트가 어떻게 빌드되는지 알아보세요.
---

# Android 빌드 프로세스

EAS Build에서 Android 프로젝트가 어떻게 빌드되는지 알아보세요.

이 페이지는 EAS Build로 Android 프로젝트를 빌드하는 과정을 설명합니다. 빌드 서비스의 구현 세부 사항에 관심이 있다면 이 문서를 읽고 싶을 수 있습니다.

## 빌드 프로세스

EAS Build로 Android 프로젝트를 빌드하는 단계를 더 자세히 살펴보겠습니다. 먼저 프로젝트를 준비하기 위해 로컬 머신에서 일부 단계를 실행하고, 그다음 원격 서비스에서 프로젝트를 빌드합니다.

### 로컬 단계

첫 번째 단계는 여러분의 컴퓨터에서 발생합니다. EAS CLI는 다음 단계를 수행합니다:

1.  **eas.json**에서 `cli.requireCommit`이 `true`로 설정되어 있으면 git 인덱스가 깨끗한지 확인합니다. 즉, 커밋되지 않은 변경 사항이 없는지 확인합니다. 깨끗하지 않으면 EAS CLI는 로컬 변경 사항을 대신 커밋할지, 아니면 빌드 프로세스를 중단할지 선택지를 제공합니다.
    
2.  `builds.android.PROFILE_NAME.withoutCredentials`가 `true`로 설정되지 않은 한, 빌드에 필요한 자격 증명을 준비합니다.
    
    -   `builds.android.PROFILE_NAME.credentialsSource` 값에 따라 자격 증명은 로컬 **credentials.json** 파일 또는 EAS 서버 중 한 곳에서 가져옵니다. `remote` 모드가 선택되었지만 아직 자격 증명이 없으면 새 keystore를 생성하라는 안내가 표시됩니다.
3.  저장소 사본을 포함하는 tarball을 생성합니다. 실제 동작은 사용 중인 [VCS 워크플로](https://expo.fyi/eas-vcs-workflow)에 따라 달라집니다.
    
4.  프로젝트 tarball을 비공개 AWS S3 버킷에 업로드하고 EAS Build에 빌드 요청을 보냅니다.
    

### 원격 단계

그다음 EAS Build가 요청을 가져오면 다음과 같은 일이 발생합니다:

1.  빌드를 위한 새 Docker 컨테이너를 만듭니다.
    
    -   모든 빌드는 빌드 도구(Java JDK, Android SDK, NDK 등)가 설치된 전용 새 컨테이너에서 실행됩니다.
2.  비공개 AWS S3 버킷에서 프로젝트 tarball을 다운로드해 압축을 풉니다.
    
3.  `NPM_TOKEN`이 설정되어 있다면 [**.npmrc**를 생성](/build-reference/private-npm-packages)합니다.
    
4.  **package.json**에 정의되어 있다면 `eas-build-pre-install` 스크립트를 실행합니다.
    
5.  프로젝트 루트에서 `npm install`을 실행합니다(`yarn.lock`이 있으면 `yarn install`).
    
6.  `npx expo-doctor`를 실행해 프로젝트 구성의 잠재적인 문제를 진단합니다.
    
7.  **managed** 프로젝트에 대한 추가 단계: `npx expo prebuild`를 실행해 프로젝트를 bare 프로젝트로 변환합니다. 이 단계에서는 버전 고정된 Expo CLI를 사용합니다.
    
8.  [build profile](/build/eas-json)의 `cache.key` 값으로 식별되는 이전 캐시를 복원합니다.
    
9.  **package.json**에 정의되어 있다면 `eas-build-post-install` 스크립트를 실행합니다.
    
10.  keystore를 복원합니다(빌드 요청에 포함되어 있었다면).
     
11.  [서명 구성을 **build.gradle**에 주입](/build-reference/android-builds#configuring-gradle)합니다.
     
12.  프로젝트 내부 **android** 디렉터리에서 `./gradlew COMMAND`를 실행합니다.
     
     -   `COMMAND`는 **eas.json**의 `builds.android.PROFILE_NAME.gradleCommand`에 정의된 명령입니다. 기본값은 AAB(Android App Bundle)를 생성하는 `:app:bundleRelease`입니다.
13.  **Deprecated:** **package.json**에 정의되어 있다면 `eas-build-pre-upload-artifacts` 스크립트를 실행합니다.
     
14.  [build profile](/build/eas-json)에 정의된 파일과 디렉터리의 캐시를 저장합니다. 이후 빌드는 이 캐시를 복원합니다.
     
15.  애플리케이션 아카이브를 AWS S3에 업로드합니다.
     
     -   아티팩트 경로는 **eas.json**의 `builds.android.PROFILE_NAME.applicationArchivePath`에서 구성할 수 있습니다. 기본값은 `android/app/build/outputs/**/*.{apk,aab}`입니다. 패턴 일치에는 [glob patterns](https://github.com/isaacs/node-glob#glob-primer)를 사용합니다.
16.  빌드가 성공했다면 **package.json**에 정의된 `eas-build-on-success` 스크립트를 실행합니다.
     
17.  빌드가 실패했다면 **package.json**에 정의된 `eas-build-on-error` 스크립트를 실행합니다.
     
18.  **package.json**에 정의된 `eas-build-on-complete` 스크립트를 실행합니다. `EAS_BUILD_STATUS` 환경 변수는 `finished` 또는 `errored`로 설정됩니다.
     
19.  build profile에 `buildArtifactPaths`가 지정되어 있다면 빌드 아티팩트 아카이브를 비공개 AWS S3 버킷에 업로드합니다.
     

## 프로젝트 자동 구성

새 Android 앱 바이너리를 빌드할 때마다 프로젝트가 올바르게 설정되어 있는지 검증하여 서버에서 빌드 프로세스를 매끄럽게 실행할 수 있도록 합니다. 이는 주로 bare 프로젝트에 적용되지만, managed 프로젝트를 빌드할 때도 유사한 단계가 실행됩니다.

### Android keystore

Android는 애플리케이션을 인증서로 서명할 것을 요구합니다. 그 인증서는 keystore에 저장됩니다. Google Play Store는 인증서를 기준으로 애플리케이션을 식별합니다. 이는 keystore를 잃어버리면 스토어에서 애플리케이션을 업데이트하지 못할 수도 있다는 뜻입니다. 다만 [Play App Signing](https://developer.android.com/studio/publish/app-signing#app-signing-google-play)을 사용하면 keystore 분실 위험을 줄일 수 있습니다.

애플리케이션의 keystore는 비공개로 유지해야 합니다. **어떤 경우에도 저장소에 커밋해서는 안 됩니다.** 디버그 keystore만이 예외인데, 이는 Google Play Store에 앱을 업로드할 때 사용하지 않기 때문입니다.

### Gradle 구성하기

앱 바이너리는 keystore로 서명되어야 합니다. 프로젝트를 원격 서버에서 빌드하기 때문에, 보안상 저장소에 커밋할 수 없는 자격 증명을 Gradle에 제공하는 방법이 필요했습니다. 원격 단계 중 하나에서 우리는 서명 구성을 **build.gradle**에 주입합니다. EAS Build는 **android/app/eas-build.gradle** 파일을 아래 내용으로 생성합니다:

```groovy
// Build integration with EAS

import java.nio.file.Paths

android {
  signingConfigs {
    release {
      // This is necessary to avoid needing the user to define a release signing config manually
      // If no release config is defined, and this is not present, build for assembleRelease will crash
    }
  }

  buildTypes {
    release {
      // This is necessary to avoid needing the user to define a release build type manually
    }
    debug {
      // This is necessary to avoid needing the user to define a debug build type manually
    }
  }
}

tasks.whenTaskAdded {
  android.signingConfigs.release {
    def credentialsJson = rootProject.file("../credentials.json");
    def credentials = new groovy.json.JsonSlurper().parse(credentialsJson)
    def keystorePath = Paths.get(credentials.android.keystore.keystorePath);
    def storeFilePath = keystorePath.isAbsolute()
      ? keystorePath
      : rootProject.file("..").toPath().resolve(keystorePath);

    storeFile storeFilePath.toFile()
    storePassword credentials.android.keystore.keystorePassword
    keyAlias credentials.android.keystore.keyAlias
    if (credentials.android.keystore.containsKey("keyPassword")) {
      keyPassword credentials.android.keystore.keyPassword
    } else {
      // key password is required by Gradle, but PKCS keystores don't have one
      // using the keystore password seems to satisfy the requirement
      keyPassword credentials.android.keystore.keystorePassword
    }
  }

  android.buildTypes.release {
    signingConfig android.signingConfigs.release
  }

  android.buildTypes.debug {
    signingConfig android.signingConfigs.release
  }
}
```

가장 중요한 부분은 `release` 서명 구성입니다. 이 구성은 프로젝트 루트의 **credentials.json** 파일에서 keystore와 비밀번호를 읽도록 설정되어 있습니다. 여러분이 이 파일을 직접 만들 필요는 없지만, EAS Build가 빌드를 실행하기 전에 이 파일을 생성하고 자격 증명을 채워 넣습니다.

이 파일은 **android/app/build.gradle**에서 다음과 같이 가져옵니다:

```groovy
// ...

apply from: "./eas-build.gradle"
```
