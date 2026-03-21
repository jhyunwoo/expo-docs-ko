---
modificationDate: March 01, 2026
title: iOS capabilities
description: EAS Build에서 지원하는 내장 iOS capability와 이를 활성화하거나 비활성화하는 방법을 알아보세요.
---

# iOS capabilities

EAS Build에서 지원하는 내장 iOS capability와 이를 활성화하거나 비활성화하는 방법을 알아보세요.

iOS entitlement를 변경하면 프로덕션 빌드를 만들기 전에 이 변경 사항을 Apple 서버에 원격으로 업데이트해야 합니다. `eas build`를 실행하면 EAS Build가 Apple Developer Console의 capability를 로컬 entitlement 구성과 자동으로 동기화합니다. capability는 Apple이 제공하는 웹 서비스로, AWS나 Firebase 서비스와 비슷하다고 생각하면 됩니다.

> 이 기능은 `EXPO_NO_CAPABILITY_SYNC=1 eas build`로 비활성화할 수 있습니다.

## Entitlements

Expo 앱에서는 introspected app config에서 entitlement를 읽습니다. 이를 수정하려면 앱 구성 파일의 [`ios.entitlements`](/versions/latest/config/app#entitlements) 필드를 확인하세요. 프로젝트에서 `npx expo config --type introspect`를 실행한 다음 결과에서 `ios.entitlements` 객체를 찾아 introspected config를 볼 수 있습니다.

bare React Native 앱에서는 **ios/\*\*/\*.entitlements** 파일에서 entitlement를 읽습니다.

## 활성화

지원되는 entitlement가 entitlements 파일에 있으면 `eas build`를 실행할 때 Apple Developer Console에서 해당 capability가 활성화됩니다. capability가 이미 활성화되어 있으면 EAS Build는 이 단계를 건너뜁니다.

## 비활성화

앱에 대해 원격으로 capability가 활성화되어 있지만 네이티브 entitlements 파일에는 존재하지 않으면, `eas build`를 실행할 때 자동으로 해당 capability를 비활성화합니다.

## 지원되는 capabilities

EAS Build는 내장 지원이 있는 capability만 활성화합니다. 지원되지 않는 entitlement는 [Apple Developer Console](https://developer.apple.com/account/resources/identifiers/list)에서 수동으로 활성화해야 합니다.

| 지원 | Capability | Entitlement string |
| --- | --- | --- |
| ✓ | Access Wi-Fi Information | `com.apple.developer.networking.wifi-info` |
| ✓ | App Attest | `com.apple.developer.devicecheck.appattest-environment` |
| ✓ | App Groups | `com.apple.security.application-groups` |
| ✓ | Apple Pay Later Merchandising | `com.apple.developer.pay-later-merchandising` |
| ✓ | Apple Pay Payment Processing | `com.apple.developer.in-app-payments` |
| ✓ | Associated Domains | `com.apple.developer.associated-domains` |
| ✓ | AutoFill Credential Provider | `com.apple.developer.authentication-services.autofill-credential-provider` |
| ✓ | ClassKit | `com.apple.developer.ClassKit-environment` |
| ✓ | Communicates with Drivers | `com.apple.developer.driverkit.communicates-with-drivers` |
| ✓ | Communication Notifications | `com.apple.developer.usernotifications.communication` |
| ✓ | Custom Network Protocol | `com.apple.developer.networking.custom-protocol` |
| ✓ | Data Protection | `com.apple.developer.default-data-protection` |
| ✓ | DriverKit Allow Third Party UserClients | `com.apple.developer.driverkit.allow-third-party-userclients` |
| ✓ | DriverKit Family Audio (development) | `com.apple.developer.driverkit.family.audio` |
| ✓ | DriverKit Family HID Device (development) | `com.apple.developer.driverkit.family.hid.device` |
| ✓ | DriverKit Family HID EventService (development) | `com.apple.developer.driverkit.family.hid.eventservice` |
| ✓ | DriverKit Family Networking (development) | `com.apple.developer.driverkit.family.networking` |
| ✓ | DriverKit Family SCSIController (development) | `com.apple.developer.driverkit.family.scsicontroller` |
| ✓ | DriverKit Family Serial (development) | `com.apple.developer.driverkit.family.serial` |
| ✓ | DriverKit Transport HID (development) | `com.apple.developer.driverkit.transport.hid` |
| ✓ | DriverKit USB Transport (development) | `com.apple.developer.driverkit.transport.usb` |
| ✓ | DriverKit for Development | `com.apple.developer.driverkit` |
| ✓ | Extended Virtual Address Space | `com.apple.developer.kernel.extended-virtual-addressing` |
| ✓ | Family Controls | `com.apple.developer.family-controls` |
| ✓ | FileProvider TestingMode | `com.apple.developer.fileprovider.testing-mode` |
| ✓ | Fonts | `com.apple.developer.user-fonts` |
| ✓ | Group Activities | `com.apple.developer.group-session` |
| ✓ | HealthKit | `com.apple.developer.healthkit` |
| ✓ | HomeKit | `com.apple.developer.homekit` |
| ✓ | Hotspot | `com.apple.developer.networking.HotspotConfiguration` |
| ✓ | Increased Memory Limit | `com.apple.developer.kernel.increased-memory-limit` |
| ✓ | Inter-App Audio | `inter-app-audio` |
| ✓ | Journaling Suggestions | `com.apple.developer.journal.allow` |
| ✓ | Low Latency HLS | `com.apple.developer.low-latency-streaming` |
| ✓ | MDM Managed Associated Domains | `com.apple.developer.associated-domains.mdm-managed` |
| ✓ | Managed App Installation UI | `com.apple.developer.managed-app-distribution.install-ui` |
| ✓ | Maps | `com.apple.developer.maps` |
| ✓ | Matter Allow Setup Payload | `com.apple.developer.matter.allow-setup-payload` |
| ✓ | Media Device Discovery | `com.apple.developer.media-device-discovery-extension` |
| ✓ | Messages Collaboration | `com.apple.developer.shared-with-you.collaboration` |
| ✓ | Multipath | `com.apple.developer.networking.multipath` |
| ✓ | NFC Tag Reading | `com.apple.developer.nfc.readersession.formats` |
| ✓ | Network Extensions | `com.apple.developer.networking.networkextension` |
| ✓ | 5G Network Slicing | `com.apple.developer.networking.slicing.appcategory` or `com.apple.developer.networking.slicing.trafficcategory` |
| ✓ | On Demand Install Capable for App Clip Extensions | `com.apple.developer.on-demand-install-capable` |
| ✓ | Personal VPN | `com.apple.developer.networking.vpn.api` |
| ✓ | Push Notifications | `aps-environment` |
| ✓ | Push to Talk | `com.apple.developer.push-to-talk` |
| ✓ | Recalibrate Estimates | `com.apple.developer.healthkit.recalibrate-estimates` |
| ✓ | Sensitive Content Analysis | `com.apple.developer.sensitivecontentanalysis.client` |
| ✓ | Shallow Depth and Pressure | `com.apple.developer.submerged-shallow-depth-and-pressure` |
| ✓ | Shared with You | `com.apple.developer.shared-with-you` |
| ✓ | Sign In with Apple | `com.apple.developer.applesignin` |
| ✓ | SiriKit | `com.apple.developer.siri` |
| ✓ | System Extension | `com.apple.developer.system-extension.install` |
| ✓ | Tap to Pay on iPhone | `com.apple.developer.proximity-reader.payment.acceptance` |
| ✓ | Tap to Present ID on iPhone (Display Only) | `com.apple.developer.proximity-reader.identity.display` |
| ✓ | TV Services | `com.apple.developer.user-management` |
| ✓ | Time Sensitive Notifications | `com.apple.developer.usernotifications.time-sensitive` |
| ✓ | Wallet | `com.apple.developer.pass-type-identifiers` |
| ✓ | WeatherKit | `com.apple.developer.weatherkit` |
| ✓ | Wireless Accessory Configuration | `com.apple.external-accessory.wireless-configuration` |
| ✓ | iCloud | `com.apple.developer.icloud-container-identifiers` |
| ✗ | HLS Interstitial Previews | Unknown |

지원되지 않는 capability는 iOS를 지원하지 않거나, 대응되는 entitlement 값이 없습니다. [Apple의 공식 capability 목록](https://developer.apple.com/help/account/reference/supported-capabilities-ios)에서 전체 목록을 확인할 수 있습니다.

## Capability identifiers

Merchant ID, App Group, CloudKit Container는 모두 자동으로 등록되어 앱에 할당될 수 있습니다. 이러한 할당은 공식 App Store Connect API가 이런 작업을 지원하지 않기 때문에 Apple cookies 인증(로컬에서 실행)이 필요합니다.

## iOS capabilities 디버깅

capability 동기화와 관련된 더 자세한 로그를 보려면 `EXPO_DEBUG=1 eas build`를 실행할 수 있습니다.

이 기능 사용에 문제가 있다면 `EXPO_NO_CAPABILITY_SYNC=1` 환경 변수를 사용해 비활성화할 수 있습니다.

현재 활성화된 capability를 모두 보려면 [Apple Developer Console](https://developer.apple.com/account/resources/identifiers/list)로 이동해 앱의 bundle identifier와 일치하는 항목을 찾으세요. 그것을 클릭하면 현재 활성화된 capability 목록을 볼 수 있습니다.

## 수동 설정

Apple capability를 수동으로 활성화하는 방법은 두 가지이며, 두 방식 모두 기존 Apple provisioning profile을 다시 생성해야 합니다.

### Xcode

> 네이티브 **android** 및 **ios** 디렉터리를 지속적으로 생성하기 위해 [Expo Prebuild](/more/glossary-of-terms#prebuild)를 사용하지 않는 프로젝트에 권장되는 방법입니다.

1.  `xed ios`로 Xcode에서 **ios** 디렉터리를 엽니다. **ios** 디렉터리가 없다면 `npx expo prebuild -p ios`를 실행해 생성하세요.
2.  그런 다음 [capability 추가하기](https://help.apple.com/xcode/mac/current/#/dev88ff319e7)에 나와 있는 단계를 따르세요.

### Apple Developer Console

첫 단계는 각 capability에 해당하는 키/값 쌍을 **ios/[app]/[app].entitlements**(또는 멀티 타깃 앱의 경우 더 구체적인 entitlements 파일)에 추가하는 것입니다. 어떤 entitlement 키를 추가해야 하는지 판단하려면 [지원되는 Capabilities](/build-reference/ios-capabilities#supported-capabilities)를 참고할 수 있습니다.

1.  [Apple Developer Console](https://developer.apple.com/account/resources/identifiers/list)에 로그인합니다. "Certificates, IDs & Profiles"를 클릭한 다음 "Identifiers" 페이지로 이동합니다.
2.  앱의 bundle identifier와 일치하는 bundle identifier를 선택합니다.
3.  아래로 스크롤하여 capability를 활성화합니다. 일부 capability는 추가 설정이 필요할 수 있습니다.
4.  맨 위로 스크롤하여 "Save"를 누릅니다. "Modify App Capabilities"라는 대화상자가 표시되면 계속하려면 "Confirm"을 누르세요. 이 bundle identifier를 사용하는 provisioning profile은 코드 서명된 프로덕션 **.ipa**를 빌드하기 전에 다시 생성해야 유효해집니다.

capability 추가 과정이 올바르게 완료되지 않았다면 iOS 네이티브 빌드는 다음과 비슷한 오류와 함께 실패합니다:

```text
❌  error: Provisioning profile "*[expo] app.bacon.hello AppStore ..." doesn't support the Associated Domains capability.

❌  error: Provisioning profile "*[expo] app.bacon.hello AppStore ..." doesn't include the com.apple.developer.associated-domains entitlement.
```
