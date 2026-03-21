---
modificationDate: January 15, 2025
title: 웹훅
description: EAS Build 및 Submit 완료 알림을 받기 위해 웹훅을 구성하는 방법을 알아보세요.
---

# 웹훅

EAS Build 및 Submit 완료 알림을 받기 위해 웹훅을 구성하는 방법을 알아보세요.

EAS는 build 또는 submission이 완료되자마자 웹훅을 통해 알려줄 수 있습니다. 웹훅은 프로젝트별로 구성해야 합니다. 예를 들어 `@johndoe/awesomeApp`과 `@johndoe/coolApp` 모두에 대해 알림을 받고 싶다면 각 디렉터리에서 다음 명령을 실행하세요.

```sh
eas webhook:create
```

이 명령을 실행하면 웹훅 이벤트 유형을 선택하라는 프롬프트가 나타납니다(`--event BUILD|SUBMIT` 매개변수를 제공한 경우는 제외). 다음으로 HTTP POST 요청을 처리할 웹훅 URL을 입력하세요(또는 `--url` 플래그로 지정). 또한 아직 `--secret` 플래그로 제공하지 않았다면 웹훅 서명 secret도 입력해야 합니다. 이 값은 최소 16자 이상이어야 하며, EAS가 `expo-signature` HTTP 헤더 값으로 보내는 요청 본문 서명을 계산하는 데 사용됩니다. 이 [signature를 사용해 웹훅 요청이 진짜인지 검증](/eas/webhooks#webhook-server)할 수 있습니다.

EAS는 HTTP POST 요청으로 웹훅을 호출합니다. 모든 데이터는 요청 본문에 담겨 전달됩니다. EAS는 데이터를 JSON 객체로 전송합니다. 웹훅이 200-399 범위를 벗어나는 HTTP 상태 코드로 응답하면, exponential back-off와 함께 몇 차례 더 전송을 시도합니다.

추가로 payload의 hash signature를 담은 `expo-signature` HTTP 헤더도 보냅니다. 이 signature를 사용하면 요청의 진위를 검증할 수 있습니다. 이 signature는 요청 본문에 대해 웹훅 secret을 HMAC key로 사용해 계산한 hex-encoded HMAC-SHA1 digest입니다.

> 위 웹훅을 로컬에서 테스트하고 싶다면 [ngrok](https://ngrok.com/docs) 같은 서비스를 사용해 `localhost:8080`을 터널링하고, `ngrok`이 제공하는 URL로 공개 접근 가능하게 만들 수 있습니다.

다음 명령을 실행하면 언제든 웹훅 URL과/또는 웹훅 secret을 변경할 수 있습니다.

```sh
eas webhook:update --id WEBHOOK_ID
```

다음 명령을 실행하면 웹훅 ID를 확인할 수 있습니다.

```sh
eas webhook:list
```

웹훅으로 더 이상 요청을 보내지 않게 하려면 아래 명령을 실행하고 목록에서 해당 웹훅을 선택하세요.

```sh
eas webhook:delete
```

## Webhook payload

Build webhook payload

build webhook payload는 아래 예시와 비슷하게 생길 수 있습니다.

```json
{
  "id": "147a3212-49fd-446f-b4e3-a6519acf264a",
  "accountName": "dsokal",
  "projectName": "example",
  "buildDetailsPageUrl": "https://expo.dev/accounts/dsokal/projects/example/builds/147a3212-49fd-446f-b4e3-a6519acf264a",
  "parentBuildId": "75ac0be7-0d90-46d5-80ec-9423fa0aaa6b", // available for build retries
  "appId": "bc0a82de-65a5-4497-ad86-54ff1f53edf7",
  "initiatingUserId": "d1041496-1a59-423a-8caf-479bb978203a",
  "cancelingUserId": null, // available for canceled builds
  "platform": "android", // or "ios"
  "status": "errored", // or: "finished", "canceled"
  "artifacts": {
    "buildUrl": "https://expo.dev/artifacts/eas/wyodu9tua2ZuKKiaJ1Nbkn.aab", // available for successful builds
    "logsS3KeyPrefix": "production/f9609423-5072-4ea2-a0a5-c345eedf2c2a"
  },
  "metadata": {
    "appName": "example",
    "username": "dsokal",
    "workflow": "managed",
    "appVersion": "1.0.2",
    "appBuildVersion": "123",
    "cliVersion": "0.37.0",
    "sdkVersion": "41.0.0",
    "buildProfile": "production",
    "distribution": "store",
    "appIdentifier": "com.expo.example",
    "gitCommitHash": "564b61ebdd403d28b5dc616a12ce160b91585b5b",
    "gitCommitMessage": "Add home screen",
    "runtimeVersion": "1.0.2",
    "channel": "default", // available for EAS Update
    "releaseChannel": "default", // available for legacy updates
    "reactNativeVersion": "0.60.0",
    "trackingContext": {
      "platform": "android",
      "account_id": "7c34cbf1-efd4-4964-84a1-c13ed297aaf9",
      "dev_client": false,
      "project_id": "bc0a82de-65a5-4497-ad86-54ff1f53edf7",
      "tracking_id": "a3fdefa7-d129-42f2-9432-912050ab0f10",
      "project_type": "managed",
      "dev_client_version": "0.6.2"
    },
    "credentialsSource": "remote",
    "isGitWorkingTreeDirty": false,
    "message": "release build", // message attached to the build
    "runFromCI": false
  },
  "metrics": {
    "memory": 895070208,
    "buildEndTimestamp": 1637747861168,
    "totalDiskReadBytes": 692224,
    "buildStartTimestamp": 1637747834445,
    "totalDiskWriteBytes": 14409728,
    "cpuActiveMilliseconds": 12117.540078,
    "buildEnqueuedTimestamp": 1637747792476,
    "totalNetworkEgressBytes": 355352,
    "totalNetworkIngressBytes": 78781667
  },
  // available for failed builds
  "error": {
    "message": "Unknown error. Please see logs.",
    "errorCode": "UNKNOWN_ERROR"
  },
  "createdAt": "2021-11-24T09:53:01.155Z",
  "enqueuedAt": "2021-11-24T09:53:01.155Z",
  "provisioningStartedAt": "2021-11-24T09:54:01.155Z",
  "workerStartedAt": "2021-11-24T09:54:11.155Z",
  "completedAt": "2021-11-24T09:57:42.715Z",
  "updatedAt": "2021-11-24T09:57:42.715Z",
  "expirationDate": "2021-12-24T09:53:01.155Z",
  "priority": "high", // or: "normal", "low"
  "resourceClass": "android-n2-1.3-12",
  "actualResourceClass": "android-n2-1.3-12",
  "maxRetryTimeMinutes": 3600 // max retry time for failed/canceled builds
}
```

Submit webhook payload

submit webhook payload는 아래 예시와 비슷하게 생길 수 있습니다.

```json
{
  "id": "0374430d-7776-44ad-be7d-8513629adc54",
  "accountName": "dsokal",
  "projectName": "example",
  "submissionDetailsPageUrl": "https://expo.dev/accounts/dsokal/projects/example/builds/0374430d-7776-44ad-be7d-8513629adc54",
  "parentSubmissionId": "75ac0be7-0d90-46d5-80ec-9423fa0aaa6b", // available for submission retries
  "appId": "23c0e405-d282-4399-b280-5689c3e1ea85",
  "archiveUrl": "http://archive.url/abc.apk",
  "initiatingUserId": "7bee4c21-3eaa-4011-a0fd-3678b6537f47",
  "cancelingUserId": null, // available for canceled submissions
  "turtleBuildId": "8c84111e-6d39-449c-9895-071d85fd3e61", // available when submitting a build from EAS
  "platform": "android", // or "ios"
  "status": "errored", // or: "finished", "canceled"
  "submissionInfo": {
    // available for failed submissions
    "error": {
      "message": "Android version code needs to be updated",
      "errorCode": "SUBMISSION_SERVICE_ANDROID_OLD_VERSION_CODE_ERROR"
    },
    "logsUrl": "https://submission-service-logs.s3-us-west-1.amazonaws.com/production/submission_728aa20b-f7a9-4da7-9b64-39911d427b19.txt"
  },
  "createdAt": "2021-11-24T10:15:32.822Z",
  "updatedAt": "2021-11-24T10:17:32.822Z",
  "completedAt": "2021-11-24T10:17:32.822Z",
  "maxRetryTimeMinutes": 3600 // max retry time for failed/canceled submissions
}
```

## Webhook server

다음은 서버를 구현하는 방법의 예시입니다.

```js
const crypto = require('crypto');
const express = require('express');
const bodyParser = require('body-parser');
const safeCompare = require('safe-compare');

const app = express();
app.use(bodyParser.text({ type: '*/*' }));
app.post('/webhook', (req, res) => {
  const expoSignature = req.headers['expo-signature'];
  // process.env.SECRET_WEBHOOK_KEY has to match SECRET value set with `eas webhook:create` command
  const hmac = crypto.createHmac('sha1', process.env.SECRET_WEBHOOK_KEY);
  hmac.update(req.body);
  const hash = `sha1=${hmac.digest('hex')}`;
  if (!safeCompare(expoSignature, hash)) {
    res.status(500).send("Signatures didn't match!");
  } else {
    // Do something here.  For example, send a notification to Slack!
    // console.log(req.body);
    res.send('OK!');
  }
});
app.listen(8080, () => console.log('Listening on port 8080'));
```
