---
modificationDate: July 04, 2024
title: 프록시 Troubleshooting
description: 권장 도구 모음을 사용해 프록시를 troubleshooting하는 방법을 알아보세요.
---

# 프록시 Troubleshooting

권장 도구 모음을 사용해 프록시를 troubleshooting하는 방법을 알아보세요.

## macOS 프록시 설정(Sierra)

> 문제가 생기면 System Network Preferences에서 Automatic Proxy Configuration `your-corporate-proxy-uri:port-number/proxy.pac`를 사용해 "Automatic Proxy settings"로 되돌릴 수 있습니다.

### 개요

사내 Wi-Fi 네트워크에 연결된 상태에서 로컬 iOS Simulator에서 이를 실행하려면 로컬 프록시 관리자가 필요합니다. [Charles](http://charlesproxy.com) 같은 로컬 프록시 애플리케이션을 사용할 수 있습니다.

#### macOS 네트워크 환경설정 열기

1.  Mac에서 `System Preferences`를 엽니다(Apple Menu > System Preferences).
2.  Network로 이동합니다.
3.  `Location`이 "Automatic"이 아니라 프록시 네트워크로 설정되어 있는지 확인합니다.
4.  왼쪽에서 Wi-Fi 및/또는 ethernet connection을 선택한 상태로 창 오른쪽 아래의 `Advanced...`를 클릭합니다.

#### 프록시 주소 설정하기

1.  "Automatic Proxy Configuration"이 설정되어 있다면 비활성화하거나 체크를 해제합니다.
2.  "Web Proxy (HTTP)"를 체크하고 "Web Proxy Server"를 127.0.0.1 : 8888로 설정합니다
3.  "Secure Web Proxy (HTTPS)"를 체크하고 "Secure Web Proxy Server"를 127.0.0.1 : 8888로 설정합니다

### `Charles` 설정하기

1.  Charles를 엽니다
    
2.  macOS Network Configuration을 관리할지 묻는다면 허용하지 마세요. 앞 단계에서 이미 이를 처리했습니다. (Charles port를 바꾸는 경우 이전 단계의 기본값 8888 대신 올바른 port로 업데이트하세요)
    
3.  Charles 메뉴에서 `Proxy > External Proxy Settings`로 이동해 `Use external proxy servers`를 체크합니다
    
4.  `Web Proxy (HTTP)`를 체크하고 `your-corporate-proxy-uri:port-number`를 입력합니다
    
5.  `Proxy server requires a password`를 체크합니다
    
6.  Domain: YOUR DOMAIN, Username: YOUR USERNAME Password: YOUR PASSWORD
    
7.  Secure Web Proxy (HTTPS)도 동일하게 설정합니다. _같은 proxy, username, password address 필드를 반드시 입력하세요._
    
8.  `Bypass external proxies for the following hosts:` 텍스트 영역에 다음을 입력합니다:
    
    ```text
    localhost
    *.local
    ```
    
    메일 서버나 다른 사내 네트워크 주소를 포함해야 할 수도 있습니다.
    
9.  "Always bypass external proxies for localhost"를 체크합니다
    

### iOS Simulator 설정

이미 작동하지 않는 기존 iOS Simulator custom setup이 있다면 메뉴에서 "Simulator > Reset Content and Settings"를 실행합니다.

Simulator가 아직 열려 있다면 종료합니다.

이제 Charles의 "Help" 메뉴 아래에서 Install Charles Root Certificate를 실행하고, 이어서 Install Charles Root Certificate in iOS Simulators도 실행합니다.

> **기술 참고:** Expo를 실행하는 데 필요한 [https://exp.host/](https://exp.host/)에 대해 iOS Simulator가 실제 certificate가 아니라 잘못된 프록시 certificate를 받게 되고 이를 허용하지 않기 때문에 이 전체 과정이 필요합니다.  
> **추가 참고:** Spotify처럼 인터넷 접근이 필요한 애플리케이션은 프록시로 [http://localhost:8888](http://localhost:8888)을 사용하도록 설정하세요. Chrome과 Firefox 같은 일부 앱은 설정에서 "System Network Preferences"를 사용하도록 구성할 수 있으며, 그러면 Apple menu/network preferences에서 "Location"을 어떻게 설정했는지에 따라 Charles : 8888 또는 프록시 없음이 적용됩니다. "Automatic"으로 설정되어 있으면 프록시를 사용하지 않고, "your proxy network"로 설정되어 있으면 프록시를 사용하며 Charles가 실행 중이어야 합니다.

## 명령줄 애플리케이션 프록시 설정

npm, git, Brew, Curl, 그리고 다른 모든 command line application에도 프록시 접근이 필요합니다.

#### npm의 경우

`~/.npmrc`를 열고 다음을 설정합니다:

```ini
http_proxy=http://localhost:8888
https_proxy=http://localhost:8888
```

### git의 경우

`~/.gitconfig`를 열고 다음을 설정합니다

```ini
[http]
  proxy = http://localhost:8888
[https]
  proxy = http://localhost:8888
```

### 명령줄 애플리케이션의 경우

사용 중인 shell과 설정에 따라 `~/.bashrc`, `~/.bash_profile`, `~/.zshrc` 또는 shell 변수를 설정하는 다른 파일을 열고 다음을 설정합니다:

```bash
export HTTP_PROXY="http://localhost:8888"
export http_proxy="http://localhost:8888"
export ALL_PROXY="http://localhost:8888"
export all_proxy="http://localhost:8888"
export HTTPS_PROXY="http://localhost:8888"
export https_proxy="http://localhost:8888"
```

> npm 또는 git을 사용하기 위해 네트워크 위치를 다시 "Automatic"으로 바꾼다면, 비활성화하려는 줄 앞에 `#`를 붙여 이 줄들을 주석 처리해야 합니다. 원한다면 command-line proxy manager를 대신 사용할 수도 있습니다.
