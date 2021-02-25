# 🧑 Untact Interview

인터뷰를 진행하고 영상과 음성 인식으로 기록된 내 답변을 바탕으로  
피드백을 작성함으로써 혼자 면접을 준비하는 사람에게  
도움이 되는 웹 애플리케이션 입니다.

## 📌 배포 링크

https://untact-interview.site

**❗ issue :** 음성 녹음 라이브러리 버전 문제로 배포 환경에서
음성인식, 타임스탬프 기능 사용은 불가능 합니다.

## 💡 프로젝트 동기

현재 코로나 바이러스로 인해 비대면 시대가 초래하게 되었습니다.  
그래서 취업을 앞두고 있는 청년들이 혼자 면접 준비를 효과적으로 할 수 있는  
애플리케이션을 만들어보자는 생각을 하게 되었습니다.

## 🎯 주요 기능

![세션진행중](https://user-images.githubusercontent.com/47707076/107195595-e5bacb80-6a34-11eb-8901-e96495b2f1a5.gif)

1.  인터뷰 진행시 영상을 녹화하고, 음성을 인식하여 기록 해줍니다.

![타임스탬프](https://user-images.githubusercontent.com/47707076/107195722-0edb5c00-6a35-11eb-841e-474aefc9b37a.gif)

2.  기록된 나의 답변을 클릭시 알맞는 비디오 시간으로 이동해주는
    타임스탬프 기능을 구현 하였습니다.

![피드백](https://user-images.githubusercontent.com/47707076/107195727-100c8900-6a35-11eb-9321-730a4c3c626b.PNG) 3. 피드백 페이지에서 질문, 나의 답변, 피드백을 한눈에 알아볼 수 있도록 하였습니다.

## 🔧 기술 스택

- **Frontend**

  - Next.js
  - React
  - Redux Saga
  - RecordRTC
  - Styled-components

- **Backend**

  - Node.js express
  - MongoDB
  - Google Cloud Speech-to-text
  - Socket.io

- **deploy**

  - AWS ec2
  - nginx

## 💾 로컬환경 실행

1.  깃 저장소를 클론 받습니다.

```
git clone https://github.com/nathaneast/untact_interview.git
```

2. local 브랜치로 이동 합니다.

```
git checkout local
```

3. 음성인식을 사용하기 위해서 sox 설치와 환경변수 추가가 필요 합니다.

- Window:
  - [sox 14.4.1 download link](https://sourceforge.net/projects/sox/files/sox/14.4.1/)

4. redis를 설치하고 redis-server를 실행 합니다.

- Window:
  - [redis download link](https://github.com/microsoftarchive/redis/releases/tag/win-3.2.100)

5.  front, back 각 폴더에서 터미널에 아래 명령어를 입력하고 .env 파일을 추가 합니다.

```
front
5-1. npm install

5-2. npm run build

5-3. npm run start
```

```
back
5-4. npm install

5-5. .env 파일을 만들고 아래 내용을 복사하여 본인에 해당하는 값을 넣어 주세요
    PORT="7000"
    MONGO_URI="< YOUR SECRET KEY >"
    COOKIE_SECRET="< YOUR COOKIE SECRET >"
    GOOGLE_APPLICATION_CREDENTIALS="< YOUR PATH >"

5-6. npm run start
```

[mongoDB Atlas](https://account.mongodb.com/account/login?n=%2Fv2%2F5f4b240fb000ed4c2dc3c915&nextHash=%23clusters)  
[Google Speech-To-Text](https://console.cloud.google.com/apis/library/speech.googleapis.com?hl=ko&pli=1&project=sodium-port-298702&folder=&organizationId=)

## 📆 세부내용

- **총 작업기간**: 7주

- 마인드맵을 이용한 브레인 스토밍
  - ✨[프로젝트 아이디어 구상](https://nathaneast-dev.tistory.com/72)
  - 📘 [기능 정리](https://nathaneast-dev.tistory.com/73)
  - 💻 [페이지, 컴포넌트 구조 구상](https://nathaneast-dev.tistory.com/74)
  - 📲 [백엔드 스키마 구조](https://nathaneast-dev.tistory.com/75)

## 😂 어려웟던점

### **1. 배포 환경에서 음성인식 기능이 동작하지 않는 문제**

음성 녹음을 도와주는 sox 라이브러리 최신 버전을 사용 시 오류가 발생하여
이전 버전을 설치하면 해결되는 이슈가 있었다.
그러나 배포한 리눅스 서버에서 이전 버전의 패키지는 제공되지 않았고
이전 버전의 깃 저장소를 clone 받고 환경 변수에 추가, node_monule에서 sox 설정 변경, 음성 녹음 다른 라이브러리 사용 등등 다양한 방법을 시도해보았으나 결국 해결책을 찾지 못했다.

### **2. 질문에 대한 답변, 타임스탬프 기능 엣지케이스 처리**

Google Speech-To-Text 기술적인 문제로 음성을 인식하고 바로 데이터를 주는 것이 아니고, 인터뷰 진행시 각 질문에 제한 시간이 있기 때문에  
이 부분을 감안해서 음성 인식되어 만들어진 문장이 몇 번째 문제의 답변으로 처리되어야 하는지 구하는 것과, 타임스탬프 기능을 위해서 해당 질문에 처음 말하는 시간을 구하는 것이 참 힘들었다.  
무엇보다 위 문제를 해결하기 위해 음성 인식과, 데이터가 잘 처리되고 있는지 일일이 테스트하는 시간이 오래 걸려 개발 기간이 길어진 게 아쉬운 부분인 것 같다.

## 🏆 느낀점

### **1. 포기하는것도 용기다**

앞서 말했다시피 배포 환경에서 핵심 기능인 음성인식이 동작하지 않고 해결하지 못한 건 정말 속상하고 좌절감이 느껴지는 경험이었다.
하지만 시간은 유한하며 일정은 정해져 있다. 할 수 있는 모든 해결책을 시도 후에도 해결할 수 없었다면 더 해볼 수 있는 건 다른 음성인식 라이브러리들을 실험하며 내 코드에 적용, Speech-To-Text 다른 플랫폼 사용, 서버의 우분투 버전 변경 혹은 운영체제 변경 등등 기반이 되는 코드의 큰 틀 자체를 바꾸는 문제들이었다. 고심 끝에 여기서 프로젝트를 마무리하기로 결정하였고 긴 시간 삽질을 하는 경험을 통해서 리눅스 폴더 구조나 환경 변수 설정 방법, 패키지 부분을 공부하게 된 계기가 되었다.

### **2. 모든 기술은 유기적으로 연결되어있다.**

배포 환경에서 웹소켓은 https에서만 사용이 가능하기 때문에 https를 적용하고 http, https에서 모두 접속이 가능하도록 리버스 프록시를 적용하였고, 이 부분은 보안과 네트워크의 개념을 알아야 이해하고 사용할 수 있겠다는 생각을 하게 되었다. 정말 개발 공부는 꼬리가 꼬리를 물고 끝이 없는 것 같다.

### **3. 개발 스케줄에 대한 아쉬움**

개발 기간이 가장 많이 걸린 작업은 Speech-To-Text 엣지 케이스를 테스트하고 수정하는 부분이었다. 서비스를 이용하는데 큰 지장만 없다면 다음 작업으로 넘어가서 배포까지 한 후에 엣지 케이스 디테일을 수정했으면 개발 기간을 더 단축할 수 있지 않았을까라는 생각이 들었다. 이 부분은 정말 판단하기 어려운 문제이지만 다음 프로젝트에선 더 신중하게 고려해야겠다고 생각했다.
