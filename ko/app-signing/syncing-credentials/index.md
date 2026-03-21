---
modificationDate: June 22, 2023
title: 원격 소스와 로컬 소스 간 자격 증명 동기화
description: 원격 소스와 로컬 소스 간에 자격 증명을 동기화하는 방법을 알아보세요.
---

# 원격 소스와 로컬 소스 간 자격 증명 동기화

원격 소스와 로컬 소스 간에 자격 증명을 동기화하는 방법을 알아보세요.

자동으로 관리되는 자격 증명을 사용하면 자격 증명은 EAS 서버에 원격으로 호스팅됩니다. 하지만 로컬에서 빌드를 실행하기 위해 이 자격 증명을 내려받고 싶은 상황이 생길 수 있습니다. 반대로 로컬 자격 증명을 사용한다면 **credentials.json**에 지정한 자격 증명을 EAS에 업로드해 대신 관리하게 하고 싶을 수도 있습니다. 이 두 가지 모두 `eas credentials` 명령으로 가능합니다.

## 자격 증명 다운로드

자동으로 관리되는 자격 증명을 다운로드하려면 프로젝트 루트에서 `eas credentials`를 실행하고 플랫폼을 선택한 뒤 `"Credentials.json: Upload/Download credentials between EAS servers and your local json"`을 고르고, 이어서 `"Download credentials from EAS to credentials.json"`을 선택하세요. 다른 플랫폼의 자격 증명도 필요하다면 명령을 다시 실행하면 됩니다.

Android 자격 증명은 프로젝트가 **credentials.json**에서 자격 증명을 읽기 때문에 즉시 사용할 수 있습니다.

iOS 자격 증명은 로컬에서 설정하려면 두 단계가 더 필요합니다. 먼저 distribution certificate를 keychain에 설치해야 합니다. 그다음 프로젝트의 Xcode를 열고 "Signing & Capabilities" 섹션으로 이동해 provisioning profile을 가져오고 선택하세요.

## 자격 증명 업로드

**credentials.json**의 자격 증명을 업로드해 EAS가 관리하도록 하려면 프로젝트 루트에서 `eas credentials`를 실행하고 플랫폼을 선택한 뒤 `"Credentials.json: Upload/Download credentials between EAS servers and your local json"`을 고르고, 이어서 `"Upload credentials from credentials.json to EAS"`를 선택하세요. 다른 플랫폼의 자격 증명도 필요하다면 명령을 다시 실행하면 됩니다.
