---
modificationDate: October 22, 2025
title: EAS Hosting 워커 런타임
description: EAS Hosting 워커 런타임과 Node.js 호환성에 대해 알아보세요.
---

# EAS Hosting 워커 런타임

EAS Hosting 워커 런타임과 Node.js 호환성에 대해 알아보세요.

EAS Hosting은 [Cloudflare Workers](https://developers.cloudflare.com/workers/) 위에 구축되어 있습니다. Cloudflare Workers는 원활한 확장성, 높은 신뢰성, 전 세계적으로 뛰어난 성능을 목표로 만들어진 현대적이고 강력한 서버리스 API 실행 플랫폼입니다.

Cloudflare Workers 런타임은 Node.js와 Chromium의 JavaScript를 구동하는 것과 동일한 V8 JavaScript 엔진 위에서 실행됩니다. 하지만 이 런타임은 전통적인 서버리스 Node.js 배포 환경에서 익숙한 환경과는 몇 가지 중요한 차이가 있습니다.

각 요청이 전체 JavaScript 프로세스에서 실행되는 대신, Workers는 V8 런타임의 기능인 작은 V8 아이솔레이트 안에서 요청을 실행하도록 설계되었습니다. 하나의 JavaScript 프로세스 안에서 동작하는 작은 격리 컨테이너처럼 생각하면 됩니다.

Workers가 동작하는 방식에 대한 자세한 내용은 [Cloudflare Workers](https://developers.cloudflare.com/workers/reference/how-workers-works/) 문서를 참고하세요.

## Node.js 호환성

Cloudflare는 [Winter TC](https://wintertc.org/)의 일부이며, Node.js보다는 브라우저와 서비스 워커의 JavaScript 실행 환경에 더 가깝습니다. 이런 제약 덕분에 Node.js보다 더 가볍고 여전히 익숙한 런타임이 제공됩니다. 이 공통 런타임은 오늘날 많은 JavaScript 런타임이 지원하는 최소 표준입니다.

즉, 익숙한 많은 Node.js API나 사용하는 일부 의존성은 EAS Hosting 런타임에서 직접 제공되지 않습니다. 다만 아직 모든 의존성이 웹 API를 일급으로 지원하지는 않으므로, 이 전환을 돕기 위해 Node.js 호환성 모듈이 존재하며 API 라우트에서 사용할 수 있습니다.

| Node.js built-in module | 지원 여부 | 구현 메모 |
| --- | --- | --- |
| `node:assert` | ✓ |  |
| `node:async_hooks` | ✓ |  |
| `node:buffer` | ✓ |  |
| `node:crypto` | ✓ | 일부 deprecated 알고리즘은 사용할 수 없음 |
| `node:console` |  | 부분적으로 동작하는 JS 셈으로 제공됨 |
| `node:constants` | ✓ |  |
| `node:diagnostics_channel` | ✓ | 일부 deprecated 알고리즘은 구현되어 있지 않음 |
| `node:dns` | ✓ | `Resolver`는 구현되어 있지 않으며, 모든 DNS 요청은 Cloudflare로 전송됨 |
| `node:events` | ✓ |  |
| `node:fs` | ✓ | 메모리 내 파일시스템과 함께 지원됨 |
| `node:http` | ✓ | 서버 기능을 제외하고 지원됨 |
| `node:http2` |  | 부분 지원. 서버 기능은 지원되지 않음 |
| `node:https` | ✓ | 서버 기능을 제외하고 지원됨 |
| `node:module` |  | `SourceMap`은 구현되어 있지 않으며, 그 외는 부분 지원 |
| `node:net` |  | `Server`와 `BlockList`는 구현되어 있지 않으며, 클라이언트 소켓은 부분 지원 |
| `node:os` | ✓ | Linux의 Node.js와 비슷한 모의 값을 제공하는 JS stub으로 제공됨 |
| `node:path` | ✓ |  |
| `node:path/posix` | ✓ |  |
| `node:path/win32` | ✓ |  |
| `node:process` | ✓ | JS stub으로 제공됨 |
| `node:punycode` | ✗ |  |
| `node:querystring` | ✓ |  |
| `node:readline` | ✗ | workers에는 `stdin`이 없으므로 동작하지 않는 JS stub으로 제공됨 |
| `node:stream` | ✓ |  |
| `node:stream/consumers` | ✓ |  |
| `node:stream/web` | ✓ |  |
| `node:string_decoder` | ✓ |  |
| `node:test` | ✓ |  |
| `node:timers` | ✓ |  |
| `node:tls` | ✓ | 서버 기능을 제외하고 지원됨 |
| `node:trace_events` |  | 동작하지 않는 JS stub으로 제공됨 |
| `node:tty` | ✓ | 출력을 Console API로 리디렉션하는 JS shim으로 제공됨 |
| `node:url` | ✓ |  |
| `node:util` | ✓ |  |
| `node:util/types` | ✓ |  |
| `node:worker_threads` | ✗ | workers가 스레딩을 지원하지 않으므로 동작하지 않는 JS stub으로 제공됨 |
| `node:zlib` | ✓ |  |

이 모듈들은 일반적으로 Node.js 원본 구현보다 정확도가 낮은 폴리필 또는 근사 구현을 제공합니다. 예를 들어 `fs`, `http`, `https` 모듈은 추가 제한이 있으며, 실제 Node.js 프로세스에서 실행하는 것과 동일한 환경은 아닌 Node.js 호환 레이어입니다.

위에 나열된 Node.js 모듈은 API 라우트 또는 API 라우트의 의존성 안에서 평소처럼 사용할 수 있으며, 적절한 호환성 모듈이 사용됩니다. 하지만 일부 모듈은 실질적인 기능을 거의 제공하지 않고 런타임 크래시를 막기 위한 호환 레이어 역할만 할 수도 있습니다.

여기에 언급되지 않은 모듈은 사용할 수 없거나 지원되지 않으며, 코드와 의존성은 이런 모듈이 제공된다고 가정해서는 안 됩니다.

> 앞으로 더 많은 Node.js 호환성 레이어가 추가될 수는 있지만, 이 비완전한 목록에 문서화되지 않은 모든 Node.js API는 동작하지 않는다고 보는 편이 맞습니다.

## 전역 객체

| JavaScript 런타임 전역 객체 | 지원 여부 | 구현 메모 |
| --- | --- | --- |
| `origin` | ✓ | 들어오는 요청의 `Origin` 헤더와 항상 동일함 |
| `process` | ✓ |  |
| `process.env` | ✓ | EAS Hosting environment variables로 채워짐 |
| `process.stdout` | ✓ | 로깅을 위해 출력을 Console API(`console.log`)로 리디렉션함 |
| `process.stderr` | ✓ | 로깅을 위해 출력을 Console API(`console.error`)로 리디렉션함 |
| `setImmediate` | ✓ |  |
| `clearImmediate` | ✓ |  |
| `Buffer` | ✓ | `node:buffer`의 `Buffer`로 설정됨 |
| `EventEmitter` | ✓ | `node:events`의 `EventEmitter`로 설정됨 |
| `global` | ✓ | `globalThis`로 설정됨 |
| `WeakRef` | ✓ |  |
| `FinalizationRegistry` | ✓ |  |
| `require` |  | 외부 require는 지원되지만 배포된 JS 파일과 내장 모듈로 제한됩니다. Node 모듈 해석은 지원되지 않습니다. |
| `require.cache` | ✗ |  |
