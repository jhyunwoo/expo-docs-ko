# Expo Docs Korean Mirror

`https://docs.expo.dev/`의 공개 Markdown 문서를 수집해서 한국어로 번역하고, URL 구조를 그대로 유지한 Markdown 미러를 생성하는 CLI입니다.

## Commands

- `npm run discover`: 공개 sitemap을 읽고 `manifest/routes.json`을 생성합니다.
- `npm run translate`: manifest를 기준으로 원문을 수집하고, 중복을 제거한 뒤 OpenAI API로 번역합니다.
- `npm run verify`: 원문과 번역본의 구조 일치를 검사하고 `reports/verification.json`을 생성합니다.
- `npm run sync`: `discover -> translate -> verify`를 순서대로 실행합니다.

## Required environment variables

- OpenAI 사용 시: `OPENAI_API_KEY`, `OPENAI_MODEL`
- Ollama 사용 시: `OLLAMA_MODEL` (default: `gpt-oss:20b`)

## Optional environment variables

- `TRANSLATION_PROVIDER` (`auto`, `openai`, `ollama`)
- `OPENAI_BASE_URL` (default: `https://api.openai.com/v1`)
- `OLLAMA_BASE_URL` (default: `http://127.0.0.1:11434`)
- `CONCURRENCY` (default: `4`)
- `MAX_CHUNK_CHARS` (default: `12000`)
- `ROUTE_LIMIT`
- `ROUTE_FILTER`

## Output layout

- `manifest/routes.json`: sitemap route manifest
- `ko/<route>/index.md`: translated Korean Markdown mirror
- `reports/verification.json`: verification report
- `.cache/`: source markdown, chunk checkpoints, and dedupe cache
