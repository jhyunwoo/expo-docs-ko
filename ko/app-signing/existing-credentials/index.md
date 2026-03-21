---
modificationDate: December 18, 2024
title: 기존 자격 증명 사용하기
description: 앱 서명 자격 증명을 EAS Build에 제공하는 다양한 방법을 알아보세요.
---

# 기존 자격 증명 사용하기

앱 서명 자격 증명을 EAS Build에 제공하는 다양한 방법을 알아보세요.

EAS Build에서는 빌드 작업에 앱 서명 자격 증명을 제공하는 방법으로 두 가지 옵션을 제공합니다:

1.  [자동으로 관리되는 자격 증명](/app-signing/managed-credentials): EAS가 앱 서명 자격 증명을 호스팅하고, 필요한 권한이 있는 팀원과 안전하게 공유해 줄 수 있습니다.
2.  [로컬 자격 증명](/app-signing/local-credentials): 프로젝트에 **credentials.json** 파일을 만들어 keystore(Android)와/또는 provisioning profile 및 distribution certificate(iOS)의 경로와 관련 비밀번호를 지정합니다. 이 정보는 각 빌드 작업이 실행될 때 로컬 머신에서 업로드되고, 빌드 작업이 끝나면 폐기됩니다.

어느 옵션을 선택하든, 기존 자격 증명 세트를 사용하기 위한 첫 단계는 이를 **credentials.json**에 로컬 자격 증명으로 설정하는 것입니다. 설정 방법에 대한 자세한 내용은 [로컬 자격 증명 가이드의 credentials.json 섹션](/app-signing/local-credentials#credentialsjson)을 참고하세요.

**credentials.json** 파일 구성이 끝나면 `eas credentials`를 실행하고 플랫폼을 선택한 뒤 `"Update credentials on Expo servers with values from credentials.json"`을 선택하여 원하는 경우 EAS가 이를 호스팅하고 관리하도록 업로드할 수 있습니다. [자격 증명 동기화에 대해 더 알아보기](/app-signing/syncing-credentials).
