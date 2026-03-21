---
modificationDate: October 12, 2025
title: iOS App Extensions
description: EAS Build와 함께 app extension을 사용해 사용자 정의 기능을 추가하는 방법을 알아보세요.
---

# iOS App Extensions

EAS Build와 함께 app extension을 사용해 사용자 정의 기능을 추가하는 방법을 알아보세요.

App extension을 사용하면 앱 밖에서도 사용자 정의 기능과 콘텐츠를 확장해, 사용자가 다른 앱이나 iOS 시스템 기능과 상호작용하는 동안에도 이를 사용할 수 있게 할 수 있습니다. EAS Build는 bare 프로젝트와 managed 프로젝트 모두에서 app extension을 포함할 수 있도록 지원합니다.

## Managed 프로젝트(실험적 지원)

일반적인 단순 managed 프로젝트에는 하나의 애플리케이션 target과 app extension이 없습니다. [config plugin](/config-plugins/introduction)(또는 자체 config plugin으로 extension을 생성하는 라이브러리)을 작성해 프로젝트에 app extension을 추가할 수 있습니다. Config plugin을 사용하면 빌드 작업의 "Prebuild" 단계에서 생성되는 Xcode 프로젝트에 target을 추가할 수 있습니다.

앱 구성에서 `extra.eas.build.experimental.ios.appExtensions`로 app extension을 선언하면, EAS CLI는 _빌드가 시작되기 전에_ (즉, Xcode 프로젝트가 생성되기 전에) 어떤 app extension이 존재하는지 알 수 있게 되어 필요한 자격 증명을 생성하고 검증할 수 있습니다. Config plugin도 앱 구성을 수정할 수 있으며, 대부분의 경우 extension을 추가하는 라이브러리를 사용한다면 해당 config plugin이 앱 구성에 extension 선언에 필요한 설정도 함께 추가합니다. 라이브러리를 직접 작성하고 있다면 이를 고려하는 것을 권장합니다. 아래는 이를 **app.json**에 직접 선언할 경우의 예시입니다:

```json
{
  "expo": {
    ...
    "extra": {
      "eas": {
        "build": {
          "experimental": {
            "ios": {
              "appExtensions": [
                {
                  "targetName": "myappextension",
                  "bundleIdentifier": "com.myapp.extension",
                  "entitlements": {
                    "com.apple.example": "entitlement value"
                  }
                }
              ]
            }
          }
        }
      }
    }
  }
}
```

## Bare 프로젝트

bare 프로젝트를 빌드할 때 EAS CLI는 Xcode 프로젝트에 구성된 app extension을 자동으로 감지하고 각 target에 필요한 모든 자격 증명을 생성합니다. 또는 **credentials.json**에서 직접 제공할 수도 있습니다. 자세한 내용은 [Multi target project](/app-signing/local-credentials#multi-target-project)를 참고하세요.
