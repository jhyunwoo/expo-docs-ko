---
modificationDate: March 01, 2026
title: .easignore로 파일 무시하기
description: 빌드 과정에서 불필요한 파일을 무시하도록 EAS를 구성하는 방법을 알아보세요.
---

# .easignore로 파일 무시하기

빌드 과정에서 불필요한 파일을 무시하도록 EAS를 구성하는 방법을 알아보세요.

**.easignore** 파일은 [EAS](https://expo.dev/eas)가 프로젝트를 [EAS Build](/build/introduction) 서버에 업로드할 때 어떤 파일을 무시해야 하는지 정의합니다.

> 불필요한 파일을 무시하면 앱 아카이브 크기와 업로드 시간을 줄이는 데 도움이 됩니다.

기본적으로 [EAS CLI](/build/setup#install-the-latest-eas-cli)는 무시할 파일을 결정하기 위해 [**.gitignore**](https://git-scm.com/docs/gitignore) 파일(존재하는 경우)을 참조합니다. **.easignore** 파일을 만들면 EAS CLI는 **.gitignore**보다 이를 우선합니다. **.easignore** 파일을 만들 때는 **.gitignore**의 모든 파일과 디렉터리를 포함하고, 추가로 무시하고 싶은 파일을 덧붙이세요.

프로젝트 루트에 **.easignore** 파일을 만드세요.

**.gitignore** 파일의 내용을 **.easignore** 파일에 복사하세요. 그다음 빌드 과정에 불필요한 파일을 추가하세요.

```bash
# Copy everything from your .gitignore file here

# Ignore files and directories that EAS Build doesn't need to build your app
/docs

# Ignore native directories (if you are using EAS Build)
/android
/ios

# Ignore test coverage reports
/coverage
```

프로젝트에 **android**와 **ios** 디렉터리가 없다면 [EAS Build는 Prebuild를 실행](/workflow/continuous-native-generation#usage-with-eas-build)해 컴파일 전에 이 네이티브 디렉터리를 생성합니다.

파일을 저장한 뒤 새 빌드를 트리거하세요.

```sh
eas build --platform ios --profile development
```

이제 **.easignore** 파일 구성이 완료되었습니다.

## .easignore로 프로젝트 업로드에 파일 추가하기

**.easignore** 파일은 gitignore에 있는 것 외에 추가 파일을 무시하는 용도뿐 아니라, 소스 제어에 커밋되지 않은 파일을 EAS Build 업로드에 포함하는 데도 사용할 수 있습니다. 빌드 직전에 임시 파일을 생성하는 사용자 정의 스크립트가 있고, 그 파일이 빌드에 필요할 때 유용합니다. 소스 제어에 없는 파일을 EAS Build에 업로드하려면 **.gitignore**의 나머지 내용과 함께 **.easignore** 파일에 `!` 접두사를 붙여 추가하세요. `!` 접두사가 붙은 파일은 앞선 무시 규칙보다 우선하도록 마지막에 두어야 합니다.

```bash
# Copy everything from your .gitignore file here

/android
/ios

# Include a file not in source control
!temp_file.json
```
