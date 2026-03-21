---
modificationDate: March 09, 2026
title: Resend 사용하기
description: Expo Router의 API Routes로 프로그래밍 방식의 이메일 전송을 위해 Expo 및 React Native 앱에 Resend를 통합하는 방법을 알아보세요.
---

# Resend 사용하기

Expo Router의 API Routes로 프로그래밍 방식의 이메일 전송을 위해 Expo 및 React Native 앱에 Resend를 통합하는 방법을 알아보세요.

[Resend](https://resend.com/)는 개발자를 위해 설계된 이메일 API 플랫폼입니다. API를 통해 프로그래밍 방식으로 이메일을 보내고, 받고, 관리할 수 있게 해줍니다. 뉴스레터, 마케팅 이메일 등과 같은 사용 사례를 위한 transactional email 전송에 활용할 수 있습니다. 이 API는 이메일 이벤트용 webhook 설정, 전달률을 위한 도메인 관리, webhook을 통한 이메일 수신도 지원합니다.

이 가이드는 **Expo 및 React Native 프로젝트에 Resend를 통합하기 위한 핵심 단계**를 보여줍니다.

[Expo 앱에서 Resend로 이메일 보내기](https://www.youtube.com/watch?v=8sPD8SNcUFA) — Resend를 Expo Router API route와 통합해 프로그래밍 방식으로 이메일을 보내고 EAS Hosting에 배포하세요.

## Prerequisites

시작하기 전에 다음이 필요합니다:

-   [Expo Router](/router/installation)를 사용하는 프로젝트
-   EAS Hosting으로 API route를 배포하기 위한 [Expo 계정](https://expo.dev/signup)
-   전역 설치된 EAS CLI (`npm install -g eas-cli`)
-   [Resend 계정](https://resend.com/)

## Resend API key 만들기

[Resend dashboard](https://resend.com/api-keys) > **API Keys**로 이동한 뒤 **Create API Key**를 클릭해 API key를 생성하세요.

API key를 생성했다면 이를 Expo 프로젝트의 **.env.local** 파일에 저장하세요:

```shell
RESEND_API_KEY=YOUR_RESEND_API_KEY
```

> **참고:** **.env.local** 파일은 Git 같은 Version Control System(VCS)에 commit하지 마세요. API key는 민감한 정보이므로 공개되면 안 됩니다. 이 파일을 무시하도록 **.gitignore** 파일에 추가해야 합니다.

## Resend SDK 설치하기

Expo 프로젝트에서 다음 명령으로 Resend SDK를 설치하세요:

```sh
npx expo install resend
```

resend SDK 라이브러리는 server-only 라이브러리입니다. 앱의 서버 측 코드에서 이메일을 보낼 수 있게 해줍니다. 이 가이드는 이메일 제출을 처리하기 위해 [API Routes](/router/web/api-routes)를 사용하므로, Expo 프로젝트의 일부로 resend를 설치해야 합니다.

## API route 활성화 및 생성하기

Expo 프로젝트에서 API Routes를 사용하려면 [app config](/workflow/configuration) 파일에서 web.output을 server로 설정해야 합니다:

```json
{
  "web": {
    "output": "server"
  }
}
```

그런 다음 이메일 제출을 처리할 [API route를 생성하세요](/router/web/api-routes#create-an-api-route). **src/app** 디렉터리 안에 **api/audience+api.ts**라는 새 파일을 만드세요. `+api.ts` 확장자는 Expo Router가 해당 파일을 API Route로 인식하는 데 사용됩니다. 통합을 테스트하려면, 아래 최소 코드로 Resend SDK를 사용해 수신자에게 이메일을 보내는 코드를 추가할 수 있습니다:

```tsx
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const body = await request.json();
  const { email } = body;

  if (!email) {
    return Response.json({ success: false });
  }

  await resend.contacts.create({
    email: email,
    // Provide dynamic values on your own
    firstName: 'Steve',
    lastName: 'Wozniak',
    unsubscribed: false,
  });

  return Response.json({ success: true });
}
```

위 코드 조각에서 `POST` [request function](/router/web/api-routes#request-body)은 `/api/audience` route가 매치될 때 실행됩니다. 이 함수는 HTTP request body를 담고 있는 `Request` 객체를 인수로 받습니다. 그런 다음 request body에서 `email`을 추출해 Resend API로 전송하고 audience에 추가합니다.

## base URL 추가하기

Expo 앱에서 API route에 접근할 수 있도록, Expo 프로젝트에 base URL을 환경 변수로 추가해야 합니다. 다음 코드를 **.env.local** 파일에 추가하세요:

```shell
EXPO_PUBLIC_BASE_URL=https://example-resend.expo.app # Deployed URL via EAS Hosting
EXPO_PUBLIC_BASE_URL_LOCAL=http://localhost:8081 # Only required for testing locally
```

Resend 통합을 로컬에서 테스트하려면 `EXPO_PUBLIC_BASE_URL_LOCAL`을 사용해 로컬 development server를 가리킬 수 있습니다. 이 URL은 `npx expo start`를 실행할 때 제공됩니다. 이후 이 가이드에서 앱을 EAS Hosting에 배포할 때는 `EXPO_PUBLIC_BASE_URL`을 배포된 URL로 반드시 업데이트하세요.

프론트엔드 코드에서는 `EXPO_PUBLIC_` 접두사가 붙은 변수만 사용할 수 있다는 점에 유의하세요. 따라서 위 변수들과 Resend API key를 같은 **.env** 파일에 둘 수는 있지만, `RESEND_API_KEY`는 서버 측 코드(**+api**로 끝나는 파일)에서만 접근할 수 있습니다.

## Expo 프로젝트에 form 추가하기

다음 예제 코드는 앱 사용자에게서 이메일 주소를 수집하는 간단한 form을 보여줍니다. 실제 환경에서는 form에 validation과 error handling을 추가하는 것이 좋습니다. 예를 들어 다음 코드를 **src/app/index.tsx** 파일에 추가합니다:

```tsx
import { useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function Index() {
  const [email, setEmail] = useState('');
  const inputRef = useRef<TextInput>(null);

  const handleSubmit = async () => {
    if (!email) {
      alert('Email is required.');
      return;
    }

    if (inputRef.current) {
      inputRef.current.blur();
    }

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_URL_LOCAL}/api/audience`, // Switch to `EXPO_PUBLIC_BASE_URL` after deploying to EAS Hosting
        {
          method: 'POST',
          body: JSON.stringify({ email }),
        }
      );

      // You can handle other response validations here.

      await response.json();

      Alert.alert('Success', 'Email sent successfully.', [
        {
          text: 'Continue',
        },
      ]);
    } catch (error) {
      alert('Something went wrong.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        ref={inputRef}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Send email</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    width: '60%',
    height: '6%',
    borderRadius: 10,
    marginBottom: 10,
    margin: 20,
  },
  button: {
    padding: 10,
    backgroundColor: '#000000',
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});
```

## API route를 EAS Hosting에 배포하기

API route(`/api/audience`)를 URL을 통해 접근 가능하게 하려면 [EAS Hosting](/eas/hosting/get-started)에 배포할 수 있습니다.

1.  다음 명령을 실행해 웹 및 API asset을 export하세요. export된 파일은 **dist** 디렉터리 안에 저장되며 API route 파일도 이 디렉터리의 일부입니다:

```sh
npx expo export --platform web
```

2.  다음을 실행해 EAS Hosting으로 production deployment를 생성하세요:

```sh
eas deploy --prod
```

`eas deploy --prod` 명령은 다음을 수행합니다:

-   아직 없다면 자동으로 EAS 프로젝트를 생성합니다
-   프로젝트의 preview URL을 선택하라는 프롬프트를 표시합니다. 이 URL이 **.env.local** 파일의 `EXPO_PUBLIC_BASE_URL` 값과 동일해야 합니다. 그래야 프로덕션에 배포된 동안 Expo 앱에서 API route에 접근할 수 있습니다

> **참고:** 배포 전에 form 화면(**src/app/index.tsx**)에서 호스팅 도메인으로 `EXPO_PUBLIC_BASE_URL`을 사용해야 합니다.

## Resend에 대해 더 알아보기

Resend의 API와 사용법에 대한 자세한 내용은 [Resend의 공식 documentation](https://resend.com/docs/introduction)을 참고하세요.
