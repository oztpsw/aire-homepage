# 한국어 채용 페이지

`index.html` → `/careers/`, `apply/index.html` → `/careers/apply/`.
기존 GitHub Pages 배포를 사용한다. 새 프레임워크나 빌드 도구가 필요하지 않다.
`config.js`에는 공개 접수 API 주소만 있다. 데이터베이스 키를 넣지 않는다.
모집요강/개인정보/보유기간/채용 상태는 운영 시스템의 `/recruitment/settings`에서 관리한다.
서버 미설정·접수 중단·오류 시 지원 버튼과 입력 폼은 열리지 않는다.

검사: 저장소 루트에서 `node scripts/check-careers.mjs`, `node --check careers/careers.js`.
배포·설정·보안·확장 문서는 운영 저장소의 `docs/recruitment-phase1.md`를 참조한다.
