---
modificationDate: October 23, 2025
title: iOS AppDelegate subscribers
description: Expo modules API를 사용해 들어오는 링크와 알림 같은 앱 관련 iOS 시스템 이벤트를 구독하는 방법을 알아보세요.
---

# iOS AppDelegate subscribers

Expo modules API를 사용해 들어오는 링크와 알림 같은 앱 관련 iOS 시스템 이벤트를 구독하는 방법을 알아보세요.

들어오는 링크와 알림처럼 앱과 관련된 특정 iOS 시스템 이벤트에 응답하려면, `AppDelegate`에서 해당 메서드를 처리해야 합니다.

React Native module API는 이러한 메서드에 연결할 수 있는 메커니즘을 제공하지 않으므로, React Native 라이브러리의 설정 안내에는 종종 `AppDelegate` 파일에 코드를 복사하는 단계가 포함됩니다. 설정과 유지보수를 단순화하고 자동화하기 위해, Expo Modules API는 라이브러리가 `AppDelegate` 함수 호출을 구독할 수 있는 메커니즘을 제공합니다. 이 기능이 동작하려면 앱의 `AppDelegate`는 `ExpoAppDelegate`를 상속해야 하며, 이는 Expo Modules를 사용하는 데 필요한 조건입니다.

`ExpoAppDelegate`는 [`UIApplicationDelegate`](https://developer.apple.com/documentation/uikit/uiapplicationdelegate) protocol의 대부분의 함수를 구현하고, 그 호출을 모든 subscriber에 전달합니다.

## 시작하기

먼저 Expo 모듈을 만들었거나 React Native module API를 사용하는 라이브러리에 Expo modules API를 통합해 두어야 합니다. [자세히 알아보기](/modules/overview#setup).

`ExpoModulesCore`의 `ExpoAppDelegateSubscriber`를 확장하는 새로운 public Swift 클래스를 만들고, 그 이름을 [module config](/modules/module-config)의 `apple.appDelegateSubscribers` 배열에 추가하세요. `pod install`을 실행하면 subscriber가 애플리케이션 프로젝트 안의 **ExpoModulesProvider.swift** 파일에 생성됩니다.

이제 subscriber 클래스에 delegate 함수를 추가해 이벤트를 구독할 수 있습니다. 구독할 수 있는 함수의 전체 목록은 [`ExpoAppDelegate.swift`](https://github.com/expo/expo/blob/main/packages/expo/ios/AppDelegates/ExpoAppDelegate.swift)에서 재정의된 함수를 참고하세요. 제공될 경우 부작용을 일으킬 수 있는 app delegate 함수는 아직 지원되지 않습니다(예: [`application(_:viewControllerWithRestorationIdentifierPath:coder:)`](https://developer.apple.com/documentation/uikit/uiapplicationdelegate/1623062-application)).

> Objective-C 클래스는 지원되지 않습니다.

## 결과 값

값을 반환해야 하는 delegate 함수에는 여러 subscriber의 응답을 조정하고 가능한 한 모두를 만족시키기 위한 추가 로직이 들어 있습니다. 이런 경계 상황의 좋은 예는 다음 두 가지입니다:

#### `application(_:didFinishLaunchingWithOptions:) -> Bool`

[Apple 문서](https://developer.apple.com/documentation/uikit/uiapplicationdelegate/1622921-application)에 따르면, 앱이 URL 리소스를 처리하거나 사용자 활동을 이어갈 수 없다면 `false`를 반환하고, 그렇지 않다면 `true`를 반환해야 합니다. 앱이 원격 알림 때문에 실행된 경우에는 반환값이 무시됩니다. 이런 상황에서는 subscriber 중 적어도 하나가 `true`를 반환하면 `ExpoAppDelegate`도 `true`를 반환합니다.

#### `application(_:didReceiveRemoteNotification:fetchCompletionHandler:)`

이 메서드는 원격 알림이 도착했음을 app delegate에 알리고, 앱이 새 데이터를 가져올 기회를 제공합니다. 가져오기 작업이 완료되면 실행할 completion block을 전달받습니다. 이 block은 가져오기 요청 결과를 가장 잘 설명하는 값으로 호출되어야 합니다. 가능한 값은 `UIBackgroundFetchResult.newData`, `UIBackgroundFetchResult.noData`, `UIBackgroundFetchResult.failed`입니다. 이 시나리오에서 `ExpoAppDelegate`는 각 subscriber에 새 completion block을 전달하고, 모두가 완료될 때까지 기다린 뒤 결과를 수집하고 나서 원래 completion block을 호출합니다. 최종 결과는 subscriber에서 수집된 결과에 따라 다음 순서로 결정됩니다:

-   subscriber 중 적어도 하나가 completion block을 `failed` 결과로 호출했다면, delegate도 `failed`를 반환합니다.
-   `newData` 결과가 하나라도 있으면 delegate는 `newData`를 반환합니다.
-   그 외에는 `noData`가 반환됩니다.

> 다른 함수가 subscriber의 결과를 어떻게 처리하는지 확인하려면, 직접 코드를 읽어보는 것을 권장합니다: [`ExpoAppDelegate.swift`](https://github.com/expo/expo/blob/main/packages/expo/ios/AppDelegates/ExpoAppDelegate.swift).

## 예시

```swift
import ExpoModulesCore

public class AppLifecycleDelegate: ExpoAppDelegateSubscriber {
  public func applicationDidBecomeActive(_ application: UIApplication) {
    // The app has become active.
  }

  public func applicationWillResignActive(_ application: UIApplication) {
    // The app is about to become inactive.
  }

  public func applicationDidEnterBackground(_ application: UIApplication) {
    // The app is now in the background.
  }

  public func applicationWillEnterForeground(_ application: UIApplication) {
    // The app is about to enter the foreground.
  }

  public func applicationWillTerminate(_ application: UIApplication) {
    // The app is about to terminate.
  }

  public func applicationDidReceiveMemoryWarning(_ application: UIApplication) {
    // The app has received a memory warning.
  }
}
```

```json
{
  "apple": {
    "appDelegateSubscribers": ["AppLifecycleDelegate"]
  }
}
```
