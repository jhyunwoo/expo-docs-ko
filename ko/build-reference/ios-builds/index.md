---
modificationDate: October 22, 2025
title: iOS 빌드 프로세스
description: EAS Build에서 iOS 프로젝트가 어떻게 빌드되는지 알아보세요.
---

# iOS 빌드 프로세스

EAS Build에서 iOS 프로젝트가 어떻게 빌드되는지 알아보세요.

이 페이지는 EAS Build로 iOS 프로젝트를 빌드하는 과정을 설명합니다. 빌드 서비스의 구현 세부 사항에 관심이 있다면 이 문서를 읽고 싶을 수 있습니다.

## 빌드 프로세스

EAS Build로 iOS 프로젝트를 빌드하는 단계를 더 자세히 살펴보겠습니다. 먼저 프로젝트를 준비하기 위해 로컬 머신에서 일부 단계를 실행하고, 그다음 원격 서비스에서 프로젝트를 빌드합니다.

### 로컬 단계

첫 번째 단계는 여러분의 컴퓨터에서 발생합니다. EAS CLI는 다음 단계를 수행합니다:

1.  **eas.json**에서 `cli.requireCommit`이 `true`로 설정되어 있으면 git 인덱스가 깨끗한지 확인합니다. 즉, 커밋되지 않은 변경 사항이 없는지 확인합니다. 깨끗하지 않으면 EAS CLI는 로컬 변경 사항을 대신 커밋할지, 아니면 빌드 프로세스를 중단할지 선택지를 제공합니다.
    
2.  빌드에 필요한 자격 증명을 준비합니다.
    
    -   `builds.ios.PROFILE_NAME.credentialsSource` 값에 따라 자격 증명은 로컬 **credentials.json** 파일 또는 EAS 서버 중 한 곳에서 가져옵니다. `remote` 모드가 선택되었지만 아직 자격 증명이 없으면 새로 생성하라는 안내가 표시됩니다.
3.  **Bare** 프로젝트에는 추가 단계가 필요합니다. Xcode 프로젝트가 EAS 서버에서 빌드 가능하도록 구성되어 있는지 확인합니다(올바른 bundle identifier와 Apple Team ID가 설정되어 있는지 보장하기 위해서입니다).
    
4.  저장소 사본을 포함하는 tarball을 생성합니다. 실제 동작은 사용 중인 [VCS 워크플로](https://expo.fyi/eas-vcs-workflow)에 따라 달라집니다.
    
5.  프로젝트 tarball을 비공개 AWS S3 버킷에 업로드하고 EAS Build에 빌드 요청을 보냅니다.
    

### 원격 단계

그다음 EAS Build가 요청을 가져오면 다음과 같은 일이 발생합니다:

1.  빌드를 위한 새 macOS VM을 만듭니다.
    
    -   모든 빌드는 빌드 도구(Xcode, Fastlane 등)가 설치된 전용 새 macOS VM에서 실행됩니다.
2.  비공개 AWS S3 버킷에서 프로젝트 tarball을 다운로드해 압축을 풉니다.
    
3.  `NPM_TOKEN`이 설정되어 있다면 [**.npmrc**를 생성](/build-reference/private-npm-packages)합니다.
    
4.  **package.json**에 정의되어 있다면 `eas-build-pre-install` 스크립트를 실행합니다.
    
5.  프로젝트 루트에서 `npm install`을 실행합니다(**yarn.lock**이 있으면 `yarn install`).
    
6.  `npx expo-doctor`를 실행해 프로젝트 구성의 잠재적인 문제를 진단합니다.
    
7.  자격 증명을 복원합니다.
    
    -   새 keychain을 만듭니다.
    -   배포 인증서를 keychain에 가져옵니다.
    -   Provisioning Profile을 **~/Library/MobileDevice/Provisioning Profiles** 디렉터리에 씁니다.
    -   배포 인증서와 Provisioning Profile이 서로 일치하는지 확인합니다(모든 Provisioning Profile은 특정 배포 인증서에 할당되며, 다른 인증서로는 iOS 빌드에 사용할 수 없습니다).
8.  **managed** 프로젝트에 대한 추가 단계: `npx expo prebuild`를 실행해 프로젝트를 bare 프로젝트로 변환합니다. 이 단계에서는 버전 고정된 Expo CLI를 사용합니다.
    
9.  [build profile](/build/eas-json)의 `cache.key` 값으로 식별되는 이전 캐시를 복원합니다.
    
10.  프로젝트 내부 **ios** 디렉터리에서 `pod install`을 실행합니다.
     
11.  **package.json**에 정의되어 있다면 `eas-build-post-install` 스크립트를 실행합니다.
     
12.  Provisioning Profile의 ID로 Xcode 프로젝트를 업데이트합니다.
     
13.  **ios/Gymfile**이 아직 존재하지 않으면 **ios** 디렉터리에 **Gymfile**을 생성합니다([기본 Gymfile](/build-reference/ios-builds#default-gymfile) 섹션 참고).
     
14.  **ios** 디렉터리에서 `fastlane gym`을 실행합니다.
     
15.  **Deprecated:** **package.json**에 정의되어 있다면 `eas-build-pre-upload-artifacts` 스크립트를 실행합니다.
     
16.  [build profile](/build/eas-json)에 정의된 파일과 디렉터리의 캐시를 저장합니다. **Podfile.lock**은 기본적으로 캐시됩니다. 이후 빌드는 이 캐시를 복원합니다.
     
17.  애플리케이션 아카이브를 비공개 AWS S3 버킷에 업로드합니다.
     
     -   아티팩트 경로는 **eas.json**의 `builds.ios.PROFILE_NAME.applicationArchivePath`에서 구성할 수 있습니다. 기본값은 **ios/build/App.ipa**입니다. `applicationArchivePath`에는 glob과 유사한 패턴을 지정할 수 있습니다. 패턴 일치에는 [glob patterns](https://github.com/isaacs/node-glob#glob-primer)를 사용합니다.
18.  빌드가 성공했다면 **package.json**에 정의된 `eas-build-on-success` 스크립트를 실행합니다.
     
19.  빌드가 실패했다면 **package.json**에 정의된 `eas-build-on-error` 스크립트를 실행합니다.
     
20.  **package.json**에 정의된 `eas-build-on-complete` 스크립트를 실행합니다. `EAS_BUILD_STATUS` 환경 변수는 `finished` 또는 `errored`로 설정됩니다.
     
21.  build profile에 `buildArtifactPaths`가 지정되어 있다면 빌드 아티팩트 아카이브를 비공개 AWS S3 버킷에 업로드합니다.
     

## Fastlane으로 iOS 프로젝트 빌드하기

우리는 iOS 프로젝트를 빌드하기 위해 [Fastlane](https://fastlane.tools/)을 사용합니다. 더 정확히 말하면 `fastlane gym` 명령을 사용합니다([자세한 내용은 Fastlane 문서 참조](https://docs.fastlane.tools/actions/gym/)). 이 명령을 사용하면 **Gymfile**에서 빌드 구성을 선언할 수 있습니다.

EAS Build는 여러분이 직접 만든 **Gymfile**도 사용할 수 있습니다. 이 파일을 **ios** 디렉터리에 두기만 하면 됩니다.

### 기본 Gymfile

**ios/Gymfile** 파일이 없으면 iOS builder가 아래와 비슷한 기본 파일을 생성합니다:

```rb
suppress_xcode_output(true)
clean(true)

scheme("app")

export_options({
  method: "app-store",
  provisioningProfiles: {
    "com.expo.eas.builds.test.application" => "dd83ed9c-4f89-462e-b901-60ae7fe6d737"
  }
})

export_xcargs "OTHER_CODE_SIGN_FLAGS=\"--keychain /tmp/path/to/keychain\""

disable_xcpretty(true)

output_directory("./build")
output_name("App")
```
