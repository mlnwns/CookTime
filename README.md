# 🍳 CookTime (쿡타임)

요리를 위한 다단계 타이머 관리 앱입니다. 여러 단계의 요리 과정을 체계적으로 관리하고, 각 단계별 시간과 불세기를 설정하여 완벽한 요리를 도와줍니다.

![CookTime](images/cooktime_main.png)

## 📱 주요 기능

### 타이머 관리

- **다단계 타이머 생성**: 여러 단계의 요리 과정을 하나의 타이머로 관리
- **타이머 실행/정지/리셋**: 실시간 타이머 제어
- **타이머 수정**: 기존 타이머 정보 수정
- **타이머 삭제**: 불필요한 타이머 삭제

### 폴더 관리

- **폴더 생성**: 타이머를 카테고리별로 그룹화
- **폴더 수정**: 폴더 이름, 아이콘, 색상 변경
- **폴더별 타이머 조회**: 폴더 내 타이머 목록 확인

### 커스터마이징

- **아이콘 선택**: 다양한 이모지 아이콘으로 타이머 구분
- **색상 선택**: 5가지 색상 테마 제공
- **불세기 설정**: 약불, 중불, 강불 등 각 단계별 불세기 설정
- **메모 기능**: 각 단계별 메모 작성

### 알림 및 사용자 경험

- **푸시 알림**: 각 단계 완료 시 알림 제공
- **알람 소리**: 타이머 완료 시 커스텀 알람 소리 재생
- **진동**: 알림 시 진동 기능
- **스와이프 제스처**: 상세 정보 확인을 위한 직관적인 제스처
- **앱 상태 모니터링**: 백그라운드/포그라운드 전환 시 타이머 동기화

## 🛠 기술 스택

### 프레임워크 및 라이브러리

- **React Native** 0.76.1
- **React** 18.2.0
- **TypeScript** 5.0.4

### 상태 관리

- **Zustand** 5.0.2 - 경량 상태 관리 라이브러리

### 네비게이션

- **React Navigation** 7.x - 네이티브 스택 네비게이션

### 스타일링

- **styled-components** 6.1.13 - CSS-in-JS 스타일링
- **react-native-size-matters** 0.4.2 - 반응형 크기 조정

### 데이터 저장

- **AsyncStorage** 2.1.0 - 로컬 데이터 영구 저장

### 알림

- **react-native-push-notification** 8.1.1 - 푸시 알림
- **@react-native-community/push-notification-ios** 1.11.0 - iOS 알림

### 애니메이션

- **react-native-reanimated** 3.16.7 - 고성능 애니메이션
- **react-native-gesture-handler** 2.21.2 - 제스처 처리

### 기타

- **@gorhom/bottom-sheet** 5.1.2 - 바텀 시트 모달
- **react-native-vector-icons** 10.2.0 - 아이콘
- **react-native-sound** 0.11.2 - 사운드 재생
- **@react-native-google-signin/google-signin** 13.1.0 - Google 로그인

## 📁 프로젝트 구조

```
src/
├── App.tsx                 # 메인 앱 컴포넌트 및 네비게이션 설정
├── components/             # 재사용 가능한 컴포넌트
│   ├── common/            # 공통 컴포넌트 (Header, ColorPicker, IconPicker 등)
│   ├── detail/            # 타이머 상세 페이지 컴포넌트
│   ├── timer/             # 타이머 관련 컴포넌트
│   ├── timerCreate/       # 타이머 생성 컴포넌트
│   ├── folderCreate/      # 폴더 생성 컴포넌트
│   └── modal/             # 모달 컴포넌트
├── pages/                 # 페이지 컴포넌트
│   ├── mainView/         # 메인 뷰 (타이머 목록)
│   ├── DetailPage.jsx    # 타이머 상세 실행 페이지
│   ├── TimerCreatePage.jsx # 타이머 생성 페이지
│   ├── TimerUpdatePage.jsx # 타이머 수정 페이지
│   ├── FolderPage.jsx    # 폴더 내 타이머 목록 페이지
│   ├── FolderCreatePage.jsx # 폴더 생성 페이지
│   └── FolderUpdatePage.jsx # 폴더 수정 페이지
├── store/                 # 상태 관리
│   ├── store.js          # 타이머 상태 관리 (Zustand)
│   └── uiStore.js        # UI 상태 관리 (삭제 모드 등)
├── hooks/                 # 커스텀 훅
│   ├── useAppStateMonitor.jsx # 앱 상태 모니터링
│   └── useDeleteData.jsx # 데이터 삭제 훅
├── utils/                 # 유틸리티 함수
│   ├── timerUtils.js     # 타이머 관련 유틸리티
│   ├── checkFirstUser.jsx # 첫 사용자 체크
│   └── openURL.jsx       # URL 열기
├── constants/             # 상수
│   └── color.js          # 색상 상수
├── data/                  # 데이터
│   └── initialMockData.js # 초기 목업 데이터
└── assets/                # 리소스
    ├── fonts/            # 폰트 파일
    ├── images/           # 이미지 파일
    └── sounds/           # 사운드 파일
```

## 🚀 시작하기

### 필수 요구사항

- **Node.js** >= 18
- **Yarn** 3.6.4 (또는 npm)
- **React Native 개발 환경** 설정 완료
  - [React Native 환경 설정 가이드](https://reactnative.dev/docs/environment-setup)

### 설치

1. 저장소 클론

```bash
git clone <repository-url>
cd Gimmick-FE
```

2. 의존성 설치

```bash
yarn install
# 또는
npm install
```

3. iOS 의존성 설치 (iOS만 해당)

```bash
cd ios
pod install
cd ..
```

### 실행

#### Metro 번들러 시작

```bash
yarn start
# 또는
npm start
```

#### Android 실행

```bash
yarn android
# 또는
npm run android
```

#### iOS 실행

```bash
yarn ios
# 또는
npm run ios
```

## 📱 주요 화면

### 메인 화면

- 타이머 및 폴더 목록 표시
- 가로 스와이프로 마이페이지 이동
- 삭제 모드 지원

### 타이머 상세 화면

- 원형 프로그레스 바로 진행 상황 표시
- 현재 단계의 불세기 및 메모 표시
- 시작/정지/리셋 버튼
- 스와이프로 전체 정보 확인

### 타이머 생성 화면

- 타이머 이름 입력
- 아이콘 및 색상 선택
- 다단계 타이머 설정 (시간, 불세기, 메모)
- 총 시간 자동 계산

### 폴더 화면

- 폴더 내 타이머 목록 표시
- 폴더별 타이머 관리

## 🔧 개발 스크립트

```bash
# Metro 번들러 시작
yarn start

# Android 실행
yarn android

# iOS 실행
yarn ios

# 린트 검사
yarn lint

# 테스트 실행
yarn test
```

## 📝 주요 기능 상세

### 다단계 타이머

각 타이머는 여러 단계로 구성될 수 있으며, 각 단계마다 다음을 설정할 수 있습니다:

- 시간 (분:초)
- 불세기 (약불, 중불, 강불 등)
- 메모

### 폴더 시스템

타이머를 폴더로 그룹화하여 관리할 수 있습니다:

- 폴더별 아이콘 및 색상 설정
- 폴더 내 타이머 목록 조회
- 폴더 수정 및 삭제

### 알림 시스템

- 각 단계 완료 시 푸시 알림
- 커스텀 알람 소리 재생
- 백그라운드에서도 알림 동작

### 데이터 저장

- AsyncStorage를 사용한 로컬 데이터 저장
- 타이머 및 폴더 정보 영구 저장
- 앱 재시작 시 데이터 복원

## 🔐 권한

### Android

- 알림 권한 (Android 13+)
- 백그라운드 실행 권한

### iOS

- 알림 권한
- 백그라운드 모드

## 🐛 문제 해결

### Metro 번들러 오류

```bash
# 캐시 클리어 후 재시작
yarn start --reset-cache
```

### iOS 빌드 오류

```bash
cd ios
pod deintegrate
pod install
cd ..
```

### Android 빌드 오류

```bash
cd android
./gradlew clean
cd ..
```

## 📄 라이선스

이 프로젝트는 비공개 프로젝트입니다.

## 👥 기여

프로젝트 기여 가이드라인은 별도로 제공되지 않습니다.

---
