---
modificationDate: February 26, 2026
title: 웹사이트 배포하기
description: Expo 웹사이트를 프로덕션에 배포하는 방법을 알아보세요.
---

# 웹사이트 배포하기

Expo 웹사이트를 프로덕션에 배포하는 방법을 알아보세요.

Expo 웹 앱은 프로덕션 동작을 테스트하기 위해 로컬에서 제공할 수 있고, 호스팅 서비스에 배포할 수도 있습니다. 가장 폭넓은 기능 지원을 위해 [EAS Hosting](/eas/hosting)에 배포하는 것을 권장합니다. 직접 호스팅하거나 서드파티 서비스를 사용할 수도 있습니다.

[EAS로 즉시 배포하기](/eas/hosting/get-started) — EAS Hosting은 custom domain, SSL 등을 지원하며 웹 앱을 배포하는 가장 좋은 방법입니다.

> SDK 49 이하에서는 [`webpack` 빌드를 배포하는 가이드](/archive/publishing-websites-webpack)가 필요할 수 있습니다.

## Output targets

웹 앱의 export 방식을 설정하려면 [`web.output`](/versions/latest/config/app#output) target을 [app config](/workflow/configuration)에서 구성할 수 있습니다:

```json
{
  "expo": {
    "web": {
      "output": "server",
      "bundler": "metro"
    }
  }
}
```

Expo Router는 웹 앱을 위해 세 가지 output target을 지원합니다.

| Output | Expo Router | API Routes | 설명 |
| --- | --- | --- | --- |
| `single` (기본값) | ✓ | ✗ | output 디렉터리에 단일 **index.html**이 있는 Single Page Application(SPA)을 출력하며, 정적으로 색인 가능한 HTML은 없습니다. |
| `server` | ✓ | ✓ | **client** 및 **server** 디렉터리를 생성합니다. Client 파일은 개별 HTML 파일로 출력됩니다. API route는 custom Node.js server에서 호스팅하기 위한 개별 JavaScript 파일로 출력됩니다. |
| `static` | ✓ | ✗ | **app** 디렉터리의 모든 route에 대해 개별 HTML 파일을 출력합니다. |

> **참고**: `static` 및 `server` output mode에서는 `expo-router` plugin을 통해 모든 route response에 적용되는 [global HTTP headers](/router/web/server-headers)를 구성할 수 있습니다.

## Create a build

프로젝트 build를 만드는 것은 웹 앱을 배포하기 위한 첫 번째 단계입니다. 로컬에서 제공하든 호스팅 서비스에 배포하든, 프로젝트의 모든 JavaScript와 asset을 export해야 합니다. 이를 static bundle이라고 합니다. 다음 명령을 실행해 export할 수 있습니다:

웹용으로 프로젝트를 컴파일하려면 universal export 명령을 실행하세요:

```sh
npx expo export -p web
```

결과 프로젝트 파일은 **dist** 디렉터리에 위치합니다. **public** 디렉터리 안의 모든 파일도 **dist** 디렉터리로 복사됩니다.

> `/assets` 같은 일부 경로는 Metro에서 예약되어 있습니다. **public/assets/** 또는 다른 예약 경로에 파일을 두지 마세요. 전체 목록은 [Reserved paths](/router/reference/reserved-paths)를 참고하세요.

## Serve locally

웹사이트가 프로덕션에서 어떻게 호스팅될지를 로컬에서 빠르게 테스트하려면 `npx expo serve`를 사용하세요. static bundle을 제공하려면 다음 명령을 실행하세요:

```sh
npx expo serve
```

프로젝트가 동작하는 모습을 보려면 [`http://localhost:8081`](http://localhost:8081)을 여세요. 이것은 **HTTP only**이므로 permission, camera, location 및 많은 다른 보안 기능이 예상대로 동작하지 않을 수 있습니다.

## Hosting with EAS

프로덕션에 배포할 준비가 되면 EAS CLI로 웹사이트를 즉시 배포할 수 있습니다.

[EAS로 즉시 배포하기](/eas/hosting/get-started) — EAS Hosting은 custom domain, SSL 등을 지원하며 웹 앱을 배포하는 가장 좋은 방법입니다.

## Hosting on third-party services

### Netlify

[Netlify](https://www.netlify.com/)는 웹 앱을 배포하기 위한 비교적 비강제적인 플랫폼입니다. 프레임워크에 대해 거의 가정하지 않기 때문에 Expo 웹 앱과의 호환성이 가장 높습니다.

#### Netlify CDN으로 수동 배포

다음 명령을 실행해 Netlify CLI를 설치하세요:

```sh
npm install -g netlify-cli
```

single-page application을 위한 redirect를 구성하세요.

> 앱이 [static rendering](/router/web/static-rendering)을 사용한다면 이 단계는 건너뛸 수 있습니다.

`expo.web.output: 'single'`은 single-page application을 생성합니다. 즉, 모든 요청이 리디렉션되어야 하는 **dist/index.html** 파일이 하나만 있다는 뜻입니다. Netlify에서는 **./public/_redirects** 파일을 만들고 모든 요청을 **/index.html**로 리디렉션해 이를 처리할 수 있습니다.

```sh
/*    /index.html   200
```

이 파일을 수정했다면, **dist** 디렉터리로 안전하게 복사되도록 `npx expo export -p web`으로 프로젝트를 다시 빌드해야 합니다.

다음 명령을 실행해 웹 build 디렉터리를 배포하세요:

```sh
netlify deploy --dir dist
```

프로젝트를 온라인에서 볼 수 있는 URL이 표시됩니다.

#### Continuous delivery

Netlify는 git에 push하거나 새 pull request를 열 때 build와 배포도 수행할 수 있습니다:

-   [새 Netlify 프로젝트 시작하기](https://app.netlify.com/signup).
-   Git 호스팅 서비스를 선택하고 저장소를 선택하세요.
-   **Build your site**를 클릭하세요.

### Vercel

[Vercel](https://vercel.com/)은 단일 명령 배포 흐름을 제공합니다.

[Vercel CLI](https://vercel.com/docs/cli)를 설치하세요.

```sh
npm install -g vercel@latest
```

single-page application을 위한 redirect를 구성하세요.

앱 루트에 **vercel.json** 파일을 만들고 다음 설정을 추가하세요:

```json
{
  "buildCommand": "expo export -p web",
  "outputDirectory": "dist",
  "devCommand": "expo",
  "cleanUrls": true,
  "framework": null,
  "rewrites": [
    {
      "source": "/:path*",
      "destination": "/"
    }
  ]
}
```

앱이 [static rendering](/router/web/static-rendering)을 사용한다면, 추가 [dynamic route configuration](/router/web/static-rendering#dynamic-routes)을 넣고 싶을 수 있습니다.

웹사이트를 배포하세요.

```sh
vercel
```

이제 프로젝트를 온라인에서 볼 수 있는 URL이 표시됩니다. build가 완료되면 그 URL을 브라우저에 붙여 넣으면 배포된 앱을 볼 수 있습니다.

### AWS Amplify Console

[AWS Amplify Console](https://console.amplify.aws)는 full-stack serverless 웹 앱을 지속적으로 배포하고 호스팅하기 위한 Git 기반 워크플로를 제공합니다. Amplify는 컴퓨터가 아니라 저장소에서 PWA를 배포합니다. 이 가이드에서는 GitHub 저장소를 사용합니다. 시작하기 전에 [GitHub에서 새 repo를 만드세요](https://github.com/new).

저장소 루트에 [**amplify-explicit.yml**](https://github.com/expo/amplify-demo/blob/master/amplify-explicit.yml) 파일을 추가하세요. 생성된 **dist** 디렉터리를 **.gitignore** 파일에서 제거하고 그 변경 사항을 commit했는지 확인하세요.

로컬 Expo 프로젝트를 GitHub 저장소에 push하세요. 아직 GitHub에 push하지 않았다면, [기존 프로젝트를 GitHub에 추가하는 GitHub 가이드](https://docs.github.com/en/get-started/importing-your-projects-to-github/importing-source-code-to-github/adding-locally-hosted-code-to-github)를 따르세요.

[Amplify Console](https://console.aws.amazon.com/amplify/home)에 로그인한 뒤 기존 앱을 선택하거나 새 앱을 만드세요. Amplify가 GitHub 계정 또는 repo를 소유한 조직에서 읽을 수 있도록 permission을 부여하세요.

저장소를 추가하고, branch를 선택한 다음, 앱의 **dist** 디렉터리 경로를 입력하기 위해 **Connecting a monorepo?**를 선택하고 **Next**를 선택하세요.

Amplify Console이 프로젝트의 **amplify.yml** 파일을 감지합니다. **Allow AWS Amplify to automatically deploy all files hosted in your project root directory**를 선택한 뒤 **Next**를 선택하세요.

설정을 검토하고 **Save and deploy**를 선택하세요. 이제 앱이 `https://branchname.xxxxxx.amplifyapp.com` URL에 배포됩니다. 이제 웹 앱을 방문하거나, 다른 branch를 배포하거나, Expo 모바일 및 웹 앱 전반에 걸쳐 통합 backend environment를 추가할 수 있습니다.

**Learn how to get the most out of Amplify Hosting** 드롭다운의 단계를 따라 **Add a custom domain with a free SSL certificate** 등을 설정하세요.

### Firebase hosting

[Firebase Hosting](https://console.firebase.google.com/)은 웹 프로젝트를 위한 프로덕션급 웹 콘텐츠 호스팅입니다.

[Firebase Console](https://console.firebase.google.com)에서 firebase 프로젝트를 만들고, 다음 [instructions](https://firebase.google.com/docs/hosting)에 따라 Firebase CLI를 설치하세요.

CLI를 사용해 다음 명령을 실행하여 Firebase 계정에 로그인하세요:

```sh
firebase login
```

그런 다음 다음 명령을 실행해 firebase 프로젝트를 호스팅용으로 초기화하세요:

```sh
firebase init
```

설정은 Expo 웹사이트를 어떻게 빌드했는지에 따라 달라집니다:

1.  public path를 묻는 경우 반드시 **dist** 디렉터리를 지정하세요.
2.  **Configure as a single-page app (rewrite all urls to /index.html)**라는 프롬프트가 나오면, `web.output: "single"`(기본값)을 사용한 경우에만 **Yes**를 선택하세요. 그렇지 않으면 **No**를 선택하세요.

기존 **package.json**의 `scripts` 속성에 `predeploy` 및 `deploy` 속성을 추가하세요. 각 값은 다음과 같습니다:

```json
"scripts": {
  ... 
  "predeploy": "expo export -p web",
  "deploy-hosting": "npm run predeploy && firebase deploy --only hosting",
}
```

배포하려면 다음 명령을 실행하세요:

```sh
npm run deploy-hosting
```

배포를 확인하려면 console output의 URL을 여세요. 예: `https://project-name.firebaseapp.com`.

호스팅용 header를 변경하고 싶다면 **firebase.json**의 `hosting` 섹션에 다음 설정을 추가하세요:

```json
"hosting": [
    {
      ... 
      "headers": [
        {
          "source": "/**",
          "headers": [
            {
              "key": "Cache-Control",
              "value": "no-cache, no-store, must-revalidate"
            }
          ]
        },
        {
          "source": "**/*.@(jpg|jpeg|gif|png|svg|webp|js|css|eot|otf|ttf|ttc|woff|woff2|font.css)",
          "headers": [
            {
              "key": "Cache-Control",
              "value": "max-age=604800"
            }
          ]
        }
      ],
    }
  ]
```

### GitHub Pages

[GitHub Pages](https://pages.github.com/)를 사용하면 GitHub 저장소에서 바로 웹사이트를 게시할 수 있습니다.

프로젝트에서 새 git 저장소를 초기화하고 GitHub 저장소로 push하도록 설정하는 것부터 시작하세요. 이미 GitHub 저장소와 변경 사항을 동기화하고 있다면 이 단계는 건너뛰세요.

GitHub 웹사이트에서 저장소를 만드세요. 그런 다음 프로젝트 루트 디렉터리에서 다음 명령을 실행하세요:

```sh
git init
git remote add origin https://github.com/username/expo-gh-pages.git
```

위 명령은 새 Git 저장소를 초기화하고, source code를 지정한 GitHub 저장소로 push하도록 설정합니다.

프로젝트에 개발 의존성으로 `gh-pages` 패키지를 설치하세요:

```sh
# npm
npm install --save-dev gh-pages

# yarn
yarn add -D gh-pages

# pnpm
pnpm add -D gh-pages

# bun
bun add -D gh-pages
```

프로젝트를 배포하려면 [`baseUrl`](/versions/latest/config/app#baseurl) 속성을 [app config](/workflow/configuration)에서 사용해 서브도메인으로 구성하세요. 값을 `/repo-name` 문자열로 설정합니다.

예를 들어 GitHub 저장소가 `expo-gh-pages`라면 다음과 같이 [experimental `baseUrl` property](/more/expo-cli#hosting-with-sub-paths)를 설정합니다:

```json
{
  "expo": {
    "experiments": {
      "baseUrl": "/expo-gh-pages"
    }
  }
}
```

**package.json** 파일의 `scripts`를 수정해 `predeploy` 및 `deploy` 스크립트를 추가하세요. 각각의 값은 다음과 같습니다:

```json
"scripts": {
 ... 
  "deploy": "gh-pages --nojekyll -d dist",
  "predeploy": "expo export -p web"
}
```

Expo는 생성된 파일에 underscore를 사용하므로, `--nojekyll` 플래그로 Jekyll을 비활성화해야 합니다.

웹 앱의 프로덕션 build를 만들고 GitHub Pages에 배포하려면 다음 명령을 실행하세요:

```sh
# npm
npm run deploy

# yarn
yarn run deploy

# pnpm
pnpm run deploy

# bun
bun run deploy
```

이 명령은 웹 앱 build를 GitHub 저장소의 `gh-pages` branch에 게시합니다. 이 branch에는 **dist** 디렉터리의 build artifact와 `gh-pages`가 생성한 **.nojekyll** 파일만 포함됩니다. 개발 source code는 포함되지 않습니다.

이제 웹 앱이 `gh-pages` branch에 게시되었으므로, GitHub Pages가 그 branch에서 앱을 제공하도록 설정하세요.

-   GitHub 저장소의 **Settings** 탭으로 이동하세요.
-   **Pages** 섹션까지 스크롤하세요.
-   **Source**가 **Deploy from a branch**로 설정되어 있는지 확인하세요.
-   **Branch** 섹션에서 **gh-pages**와 **root** 디렉터리를 선택하세요.
-   **Save**를 클릭하세요.

웹 앱이 게시되고 GitHub Pages 설정이 완료되면 GitHub Action이 웹사이트를 배포합니다. 진행 상황은 저장소의 **Actions** 탭으로 이동해 확인할 수 있습니다. 완료되면 웹 앱은 `http://username-on-github.github.io/repo-name` URL에서 사용할 수 있습니다.

이후의 배포와 업데이트에서는 `deploy` 명령을 실행하면 GitHub Action이 자동으로 시작되어 웹 앱을 갱신합니다.
