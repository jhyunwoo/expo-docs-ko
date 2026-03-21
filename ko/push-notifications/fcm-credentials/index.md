---
modificationDate: October 06, 2025
title: FCM V1용 Google Service Account Key 얻기
description: FCM을 사용해 Android 알림을 보내기 위한 Google Service Account Key를 생성하거나 사용하는 방법을 알아보세요.
---

# FCM V1용 Google Service Account Key 얻기

FCM을 사용해 Android 알림을 보내기 위한 Google Service Account Key를 생성하거나 사용하는 방법을 알아보세요.

## 새 Google Service Account Key 만들기

다음은 FCM V1을 사용해 Android 알림을 보내기 위한 새 Google Service Account Key를 EAS에 구성하는 단계입니다.

앱용 새 Firebase 프로젝트를 [Firebase Console](https://console.firebase.google.com)에서 만듭니다. 앱용 Firebase 프로젝트가 이미 있다면 다음 단계로 진행하세요.

Firebase console에서 프로젝트의 **Project settings** > [**Service accounts**](https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk)를 엽니다.

**Generate New Private Key**를 클릭한 뒤, **Generate Key**를 클릭해 확인합니다. private key가 들어 있는 JSON 파일을 안전하게 보관하세요.

JSON 파일을 EAS에 업로드하고 Android 알림 전송용으로 구성합니다. 이 작업은 EAS CLI 또는 [EAS dashboard](https://expo.dev)에서 할 수 있습니다.

-   `eas credentials` 실행
-   `Android` > `production` > `Google Service Account` 선택
-   `Manage your Google Service Account Key for Push Notifications (FCM V1)` 선택
-   `Set up a Google Service Account Key for Push Notifications (FCM V1)` > `Upload a new service account key` 선택
-   이전에 JSON 파일을 프로젝트 디렉터리에 저장해 두었다면 EAS CLI가 파일을 자동으로 감지하고 선택하라고 프롬프트를 표시합니다. 계속하려면 Y를 누르세요.

> **Note**: JSON 파일에는 민감한 데이터가 들어 있으므로 저장소에 커밋되지 않도록 버전 소스 제어의 ignore 파일(예: **.gitignore**)에 추가하세요.

프로젝트의 **google-services.json** 파일을 구성합니다. Firebase Console에서 다운로드한 뒤 프로젝트 디렉터리 루트에 배치하세요.

이 파일은 Android 앱이 FCM에 등록되기 위해 필요합니다. 이 파일에는 Firebase 프로젝트의 공개 식별자가 들어 있으므로 저장소에 커밋해도 됩니다.

**Note**: **google-services.json**이 이미 설정되어 있다면 이 단계는 건너뛸 수 있습니다.

**app.json**에서 [`expo.android.googleServicesFile`](/versions/latest/config/app#googleservicesfile)에 **google-services.json**의 경로를 값으로 추가합니다.

```json
{
  "expo": {
  ...
  "android": {
    ...
    "googleServicesFile": "./path/to/google-services.json"
  }
}
```

이제 준비가 끝났습니다. FCM V1 프로토콜을 사용해 Expo Push Notifications를 통해 Android 기기로 알림을 보낼 수 있습니다.

## 기존 Google Service Account Key 사용하기

Google Cloud Console의 [IAM Admin page](https://console.cloud.google.com/iam-admin/iam?authuser=0)를 엽니다. Permissions 탭에서 수정하려는 **Principal**을 찾고 **Edit Principal**의 연필 아이콘을 클릭합니다.

**Add Role**을 클릭하고 드롭다운에서 **Firebase Messaging API Admin** 역할을 선택합니다. 그런 다음 **Save**를 클릭합니다.

FCM V1 알림 전송에 어떤 JSON credential 파일을 사용할지 EAS에 지정해야 합니다. 이 작업은 EAS CLI 또는 [EAS dashboard](https://expo.dev)에서 할 수 있습니다. 새 JSON 파일을 업로드하거나 이전에 업로드한 파일을 선택할 수 있습니다.

-   `eas credentials` 실행
-   `Android` > `production` > `Google Service Account` 선택
-   `Manage your Google Service Account Key for Push Notifications (FCM V1)` 선택
-   `Set up a Google Service Account Key for Push Notifications (FCM V1)` > `Upload a new service account key` 선택
-   EAS CLI가 로컬 머신의 파일을 자동으로 감지하고 선택하라고 프롬프트를 표시합니다. 계속하려면 Y를 누르세요.

> **Note**: JSON 파일에는 민감한 데이터가 들어 있으므로 저장소에 커밋되지 않도록 버전 소스 제어의 ignore 파일(예: **.gitignore**)에 추가하세요.

프로젝트의 **google-services.json** 파일을 구성합니다. Firebase Console에서 다운로드한 뒤 프로젝트 디렉터리 루트에 배치하세요.

이 파일은 Android 앱이 FCM에 등록되기 위해 필요합니다. 이 파일에는 Firebase 프로젝트의 공개 식별자가 들어 있으므로 저장소에 커밋해도 됩니다.

**Note**: **google-services.json**이 이미 설정되어 있다면 이 단계는 건너뛸 수 있습니다.

**app.json**에서 [`expo.android.googleServicesFile`](/versions/latest/config/app#googleservicesfile)에 **google-services.json**의 경로를 값으로 추가합니다.

```json
{
  "expo": {
    ...
    "android": {
      ... "googleServicesFile": "./path/to/google-services.json"
    }
  }
}
```

이제 준비가 끝났습니다. FCM V1 프로토콜을 사용해 Expo Push Notifications를 통해 Android 기기로 알림을 보낼 수 있습니다.
