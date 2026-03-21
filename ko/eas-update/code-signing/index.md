---
modificationDate: December 09, 2024
title: EAS Update와 함께하는 end-to-end code signing
description: EAS Update에서 code signing과 key rotation이 어떻게 동작하는지 알아보세요.
---

# EAS Update와 함께하는 end-to-end code signing

EAS Update에서 code signing과 key rotation이 어떻게 동작하는지 알아보세요.

> EAS Update Code Signing은 EAS Production 또는 Enterprise 플랜을 구독 중인 account에서만 사용할 수 있습니다. [자세히 알아보기](https://expo.dev/pricing).

`expo-updates` 라이브러리는 [public-key cryptography](https://en.wikipedia.org/wiki/Public-key_cryptography)를 사용한 end-to-end code signing을 지원합니다. code signing을 사용하면 개발자가 자신의 key로 update를 암호학적으로 서명할 수 있습니다. 그런 다음 클라이언트에서 update를 적용하기 전에 서명을 검증하므로, ISP, CDN, 클라우드 provider, 심지어 EAS 자체도 앱이 실행하는 update를 변조할 수 없게 됩니다.

아래 단계는 private key와 그에 대응하는 certificate를 생성하고, 프로젝트가 code signing을 사용하도록 구성하고, 앱에 대해 서명된 update를 게시하는 과정을 안내합니다.

## private key와 이에 대응하는 certificate 생성하기

이 단계에서는 앱을 위한 key pair와 대응하는 code signing certificate를 생성합니다. 생성된 private key가 실수로 source control에 추가되지 않도록 `--key-output-directory` 플래그에는 source control 바깥의 디렉터리를 지정하세요.

```sh
npx expo-updates codesigning:generate \
--key-output-directory ../keys \
--certificate-output-directory certs \
--certificate-validity-duration-years 10 \
--certificate-common-name "Your Organization Name"
```

이 명령은 key pair와 함께 앱에 포함될 code signing certificate를 생성합니다:

-   `../keys/private-key.pem`: key pair의 private key.
    
-   `../keys/public-key.pem`: key pair의 public key.
    
-   `certs/certificate.pem`: 10년간 유효하도록 구성된 code signing certificate. 이 파일은 source control에 추가해야 합니다(적절한 경우).
    
-   생성된 private key는 비공개이며 안전하게 보관되어야 합니다. 위 명령은 key가 실수로 source control에 커밋되지 않도록 source control 바깥 디렉터리에 생성하고 저장할 것을 제안합니다. private key는 다른 민감한 정보(KMS, 비밀번호 관리자 등)를 저장하는 것과 같은 방식으로 보관하는 것을 권장하며, 어떻게 저장하느냐에 따라 (3) 단계에서 update를 게시하는 절차가 달라질 수 있습니다.
    
-   public key는 private key와 함께 저장할 수 있지만 민감한 정보는 아닙니다.
    
-   certificate는 프로젝트에 포함되어야 합니다(source control에 커밋). 이 파일에는 public key와 code signature를 검증하는 방법이 포함되어 있습니다. 서명된 update가 다운로드되면, 이 certificate를 사용해 update의 signature를 검증합니다.
    
-   certificate 유효 기간은 앱의 보안 요구 사항에 따라 달라질 수 있는 설정입니다.
    
    -   유효 기간이 짧을수록 [key rotation](/eas-update/code-signing#key-rotation)을 더 자주 해야 하지만, private key가 노출되더라도 만료가 더 빨라 노출 범위를 줄일 수 있으므로 더 나은 방식으로 여겨집니다.
    -   유효 기간이 짧으면 key를 더 자주 교체해야 하므로 앱의 릴리스 프로세스에 오버헤드가 추가됩니다. certificate가 만료된 binary는 새 update를 적용하지 못합니다.
    -   예를 들어 Expo는 공개 Expo Go 앱에는 이 값을 20년으로 설정하지만, binary가 더 자주 배포되는 내부 앱에는 1년만 설정합니다. Expo는 10년마다 key를 교체할 계획입니다.

## 프로젝트가 code signing을 사용하도록 구성하기

```sh
npx expo-updates codesigning:configure \
--certificate-input-directory certs \
--key-input-directory ../keys
```

  

**네이티브 프로젝트를 생성하기 위해 Continuous Native Generation (CNG)을 사용 중이라면**, `npx expo-updates codesigning configure` 명령이 생성한 **app.json** 구성만 있으면 충분합니다. 변경 사항은 다음 번 네이티브 프로젝트가 생성될 때 적용됩니다.

app.json에서 code signing 구성하기

위 명령을 실행하면 **app.json**에 code signing을 위한 추가 구성이 포함됩니다:

```json
{
  "expo": {
    "updates": {
      "codeSigningCertificate": "./certs/certificate.pem",
      "codeSigningMetadata": {
        "keyid": "main",
        "alg": "rsa-v1_5-sha256"
      }
    }
  }
}
```
  

**네이티브 프로젝트를 생성하기 위해 Continuous Native Generation (CNG)을 사용하지 않는다면**, 앱의 **AndroidManifest.xml** 및/또는 **Expo.plist** 파일에서 code signing을 직접 구성해야 합니다.

Android 네이티브 프로젝트에서 code signing 구성하기

**android/app/src/main/AndroidManifest.xml**의 `<application>` 요소에 두 개의 필드를 추가해야 합니다.

그 전에 certificate의 XML-escaped 버전을 생성해야 합니다. **certs/certificate.pem**의 내용을 복사해 모든 `\r` 문자를 `&#xD;`로, `\n`을 `&#xA;`로 수동 치환할 수도 있고, 아래 스크립트를 실행해 자동 처리할 수도 있습니다:

```sh
node -e "console.log(require('fs').readFileSync('./certs/certificate.pem', 'utf8')\
.replace(/\r/g, '
').replace(/\n/g, '
'));"
```

이제 아래 두 필드를 추가하고, `expo.modules.updates.CODE_SIGNING_CERTIFICATE` 필드의 `android:value`를 XML-escaped certificate로 바꾸세요. `expo.modules.updates.CODE_SIGNING_METADATA` 항목의 값은 수정할 필요가 없습니다.

```xml
<meta-data
  android:name="expo.modules.updates.CODE_SIGNING_CERTIFICATE"
  android:value="(insert XML-escaped certificate here)"
  />
<meta-data
  android:name="expo.modules.updates.CODE_SIGNING_METADATA"
  android:value="{"keyid":"main","alg":"rsa-v1_5-sha256"}"
  />
```
iOS 네이티브 프로젝트에서 code signing 구성하기

**ios/project-name/Supporting/Expo.plist**의 `<dict>` 요소에 두 개의 필드를 추가해야 합니다.

그 전에 certificate의 XML-escaped 버전을 생성해야 합니다. **certs/certificate.pem**의 내용을 복사해 모든 `\r` 문자를 `&#xD;`로 바꾸거나, 아래 스크립트를 실행해 자동 처리할 수도 있습니다:

```sh
node -e "console.log(require('fs').readFileSync('./certs/certificate.pem', 'utf8')\
.replace(/\r/g, '
'));"
```

이제 아래 두 필드를 추가하고, certificate 값을 XML-escaped certificate로 바꾸세요. `EXUpdatesCodeSigningMetadata` 필드는 수정할 필요가 없습니다.

```xml
<key>EXUpdatesCodeSigningCertificate</key>
    <string>-----BEGIN CERTIFICATE-----

(insert XML-escaped certificate, it should look something like this)

(spanning multiple lines with \r escaped but \n not escaped)

+-----END CERTIFICATE-----

</string>
    <key>EXUpdatesCodeSigningMetadata</key>
    <dict>
      <key>keyid</key>
      <string>main</string>
      <key>alg</key>
      <string>rsa-v1_5-sha256</string>
    </dict>
```
  

code signing 구성이 끝났다면, 새 runtime version으로 새 build를 만드세요. code signing certificate는 이 새 build 안에 포함됩니다.

## 앱에 대해 서명된 update 게시하기

```sh
eas update --private-key-path ../keys/private-key.pem
```

`eas update`로 EAS Update publish를 실행하는 동안, EAS CLI는 앱에 code signing이 구성되어 있음을 자동으로 감지합니다. 이어서 update의 무결성을 검증하고 private key를 사용해 디지털 서명을 생성합니다. 이 과정은 private key가 머신을 떠나지 않도록 로컬에서 수행됩니다. 생성된 signature는 update와 함께 저장되도록 자동으로 EAS로 전송됩니다.

## update가 로드되는지 확인하기

클라이언트에서 update를 다운로드하세요(이 단계는 라이브러리가 자동으로 수행합니다). code signing용으로 구성된 (2) 단계의 build는 사용 가능한 새 update가 있는지 확인합니다. 서버는 (3) 단계에서 게시한 update와 그에 대한 generated signature를 응답으로 돌려줍니다. 다운로드된 뒤 적용되기 전에, update는 포함된 certificate와 signature를 기준으로 검증됩니다. certificate와 signature가 유효하면 update가 적용되고, 그렇지 않으면 거부됩니다.

## 추가 정보

### Key rotation

key rotation은 update 서명에 사용하는 key pair를 바꾸는 과정입니다. 보통 다음과 같은 경우에 수행합니다:

-   Key 만료. 위 섹션의 (1) 단계에서 `certificate-validity-duration-years`를 10년으로 설정했습니다(원한다면 다른 값으로 구성할 수 있음). 즉 10년이 지나면, 해당 certificate에 대응하는 private key로 서명된 update는 앱이 다운로드한 뒤 더 이상 적용되지 않습니다. signing certificate 만료 전에 이미 다운로드된 update는 계속 정상 작동합니다. certificate가 만료되기 훨씬 전에 key를 교체하면 잠재적인 만료 문제를 미리 방지할 수 있고, 이전 certificate가 만료되기 전에 모든 사용자가 새 certificate를 쓰도록 보장하는 데 도움이 됩니다.
-   Private key 유출. update 서명에 사용한 private key가 실수로 공개되면 더 이상 안전하다고 볼 수 없고, 따라서 그 key로 서명된 update의 무결성도 보장할 수 없습니다. 예를 들어 악의적인 행위자가 악성 update를 만들어 유출된 private key로 서명할 수 있습니다.
-   보안 모범 사례로서의 key rotation. 위 다른 이유 중 하나에 대응해 수동으로 key rotation을 수행해야 하는 상황에서도 시스템이 견고하도록, key를 주기적으로 교체하는 것이 보안 모범 사례입니다.

이들 어느 경우든 절차는 비슷합니다:

1.  위 (1) 단계에서 생성한 기존 key와 certificate를 백업합니다.
2.  위 (1) 단계부터 다시 따라 새 key를 생성합니다. 디버깅을 돕기 위해 app config(**app.json**)의 `updates.codeSigningMetadata.keyid` 필드를 수정해 새 key의 `keyid`를 바꾸는 것도 좋습니다.
3.  code signing certificate는 앱 runtime의 일부이므로, 이 certificate를 사용하는 build에서는 새 runtime version을 설정해야 합니다. 그래야 새 build에서 새 key로 서명된 update만 실행되도록 보장할 수 있습니다.
4.  위 (3) 단계를 따라 새 key로 signed update를 게시합니다.

### code signing 제거하기

앱에서 code signing을 제거하는 과정은 [key rotation](/eas-update/code-signing#key-rotation)과 비슷하며, `null` key로 key rotation을 수행하는 것으로 생각할 수 있습니다.

1.  위 (1) 단계에서 생성한 기존 key와 certificate를 백업합니다.
2.  app config(**app.json**)에서 `updates.codeSigningMetadata` 필드를 제거합니다.
3.  certificate가 없는 새 앱은 새로운 별도 runtime이므로, 새 build에서 unsigned update만 실행되도록 build에 새 runtime version을 설정해야 합니다.
