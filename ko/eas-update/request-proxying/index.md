---
modificationDate: November 13, 2025
title: 요청 프록시
description: 자체 서버를 통해 EAS Update 서버로 가는 요청을 프록시하세요.
---

# 요청 프록시

자체 서버를 통해 EAS Update 서버로 가는 요청을 프록시하세요.

EAS Update는 요청 프록시를 지원합니다. 이를 통해 자체 서버를 거쳐 EAS Update 서버로 가는 요청을 프록시할 수 있습니다. 이는 custom header 추가, 요청 로깅, 추가 보안 구현, 요청 IP 익명화 같은 조치를 위해 유용할 수 있습니다.

## 요청 프록시 활성화하기

1.  요청을 처리할 두 개의 프록시 서버를 만드세요:

    -   update asset 요청(JavaScript bundle, image 등)을 처리하는 서버 하나.
        -   이 서버는 EAS Update asset 서버인 `assets.eascdn.net`으로 요청을 전달해야 합니다.
        -   이 서버는 모든 URL 내용(path, query parameter 등)을 그대로 전달해야 합니다.
        -   이 서버는 다음 request header를 모두 전달해야 합니다:
            -   `expo-` 또는 `eas-`로 시작하는 header, 또는
            -   정확히 `authorization` 또는 `a-im`인 header.
    -   update manifest 요청을 처리하는 서버 하나.
        -   이 서버는 EAS Update 서버인 `u.expo.dev`로 요청을 전달해야 합니다.
        -   이 서버는 모든 URL 내용(path, query parameter 등)을 그대로 전달해야 합니다.
        -   이 서버는 `expo-` 또는 `eas-` 접두사가 붙은 모든 header를 그대로 전달해야 합니다.
2.  **eas.json** 구성 파일에 아래 필드를 추가하고, placeholder를 실제 프록시 서버 URL로 바꾸세요:

    ```json
    {
      "cli": {
        ... 
        "updateAssetHostOverride": "updates-asset-proxy.example.com",
        "updateManifestHostOverride": "updates-manifest-proxy.example.com"
      }
    }
    ```

3.  변경 사항을 적용하려면 다음 명령을 실행하세요:

    ```sh
    eas update:configure
    ```

4.  프록시 동작을 테스트하기 위해 update를 게시하세요:

    ```sh
    eas update
    ```

5.  [EAS Update dashboard](https://expo.dev/accounts/%5Baccount%5D/projects/%5Bproject%5D/updates)에서 update group으로 이동한 뒤, 플랫폼 중 하나에서 "View Metadata"를 클릭해 확인하세요.

    -   **manifest.json**에는 재정의된 `manifestHostOverride`가 보여야 합니다.
    -   다른 asset에는 재정의된 `assetHostOverride`가 보여야 합니다.
