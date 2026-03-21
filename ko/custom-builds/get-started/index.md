---
modificationDate: March 20, 2025
title: custom build 시작하기
description: custom build로 EAS Build를 확장하는 방법을 알아보세요.
---

# custom build 시작하기

custom build로 EAS Build를 확장하는 방법을 알아보세요.

custom build를 사용하면 build 프로세스 전, 중, 후에 명령을 실행해 프로젝트의 build 과정을 사용자 지정할 수 있습니다. 사용자 지정된 build는 EAS CLI에서 실행하거나 [EAS Workflows](/eas/workflows/get-started) 같은 React Native CI/CD 파이프라인에서 build를 실행할 때 사용할 수 있습니다.

## custom build config 만들기

시작하려면 **eas.json**과 같은 레벨에 **.eas/build/hello-world.yml**이라는 이름의 디렉터리들과 파일을 만드세요. EAS Build가 프로젝트에 custom build config가 포함되어 있다는 것을 식별하려면 두 디렉터리의 위치와 이름이 중요합니다.

**hello-world.yml** 안에는 custom build config를 작성합니다. 파일 이름 자체는 중요하지 않으므로 원하는 이름으로 지을 수 있습니다. 유일한 요구 사항은 파일 확장자가 **.yml**이어야 한다는 점입니다.

파일에 다음 custom build config step을 추가하세요:

```yaml
build:
  name: Hello World!
  steps:
    - run: echo "Hello, world!"
    # A built-in function (optional)
```

실제 시나리오에서는 build를 트리거하기 위해 [built-in function](/custom-builds/schema#built-in-eas-functions)을 호출하게 됩니다.

## eas.json에 `config` 속성 추가하기

custom build config를 사용하려면 build profile 아래의 **eas.json**에 `config` 속성을 추가하세요.

**test.yml** 파일의 custom config를 실행하기 위해 `build` 아래에 `test`라는 새 [build profile](/build/eas-json#build-profiles)을 만들어 보겠습니다:

```json
{
  "build": {
    ... 
    "test": {
      "config": "test.yml",
    },
}
```

플랫폼별로 별도 config를 사용하고 싶다면 Android와 iOS용 YAML config 파일을 각각 만들 수 있습니다. 예를 들면 다음과 같습니다:

```json
{
  "build": {
    ... 
    "test": {
      "ios": {
        "config": "hello-ios.yml",
      },
      "android": {
        "config": "hello-android.yml",
      }
    },
}
```

## custom build config를 테스트하기 위해 build 실행하기

custom build config를 테스트하려면 다음 명령을 실행하세요:

```sh
eas build -p android -e test
```

build가 완료되면 build 상세 페이지의 로그를 확인해 `echo "Hello World!"` 스크립트가 실행되었는지 검증할 수 있습니다.

## 더 알아보기

더 자세한 예시는 example repository를 확인하세요:

[Custom build example repository](https://github.com/expo/eas-custom-builds-example/tree/main) - 함수 설정, environment variable 사용, artifact 업로드 등 custom build 예제를 포함한 custom EAS Build 예제입니다.
