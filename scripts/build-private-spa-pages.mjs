import fs from 'node:fs';

const sourceFile = 'private-spa-gangnam.html';
const variants = {
  ko: {
    file: 'private-spa-gangnam-ko.html', locale: 'ko_KR', title: '강남 프라이빗 관리실·1인실·2인실 안내 | AIRE SPA',
    description: '서울 강남 AIRE SPA의 예약제 프라이빗 스파 안내입니다. 1인 및 2인 전용 공간에서 바디와 페이셜 관리 프로그램을 제공합니다.',
    about: 'about.html', menu: 'menu.html', home: 'index.html',
    replacements: {
      'Main navigation':'주요 메뉴','ABOUT':'소개','PROGRAMS':'프로그램','SPACE':'공간','LOCATION':'위치','RESERVATION':'예약','Open menu':'메뉴 열기','Close menu':'메뉴 닫기',
      'Private Spa<br>in Gangnam, Seoul':'서울 강남의<br>프라이빗 스파','A private setting for body and facial care in Gangnam, with rooms for individual and couple appointments.':'강남에서 바디와 페이셜 관리를 받을 수 있는 프라이빗 공간으로, 1인 및 2인 예약이 가능합니다.',
      'Designed for a more<br>private appointment.':'보다 프라이빗한<br>예약을 위한 공간.','AIRE SPA &amp; AESTHETIC is located in Gangnam, Seoul and operates by reservation.':'AIRE SPA &amp; AESTHETIC은 서울 강남에 위치하며 예약제로 운영합니다.','Each appointment takes place in a private room, with separate rooms available for individual and couple visits.':'모든 관리는 독립된 공간에서 진행하며 1인실과 2인실을 각각 운영합니다.',
      'PRIVATE ROOMS':'프라이빗 룸','Your own space throughout the appointment.':'예약 시간 동안 이용하는 독립된 공간.','Private rooms are arranged for one or two guests. Each room includes its own shower area, allowing the appointment and preparation to take place within the same space.':'1인 또는 2인이 이용할 수 있는 독립된 관리실입니다. 각 룸 안에 샤워 공간이 있어 관리와 준비를 한 공간에서 마칠 수 있습니다.',
      'BODY &amp; FACIAL':'바디 &amp; 페이셜','Body and facial care programs.':'바디와 페이셜 관리 프로그램.','AIRE SPA offers body and facial care programs. Program durations, included services and prices are listed on the Programs page.':'바디와 페이셜 관리 프로그램을 운영합니다. 프로그램별 시간, 포함 항목과 가격은 프로그램 페이지에서 확인할 수 있습니다.','VIEW PROGRAMS':'프로그램 보기',
      'FOR TWO':'두 분을 위한 공간','A private room for two.':'두 분이 함께 이용하는 프라이빗 룸.','Couple rooms are arranged with two beds so that two guests can receive care in the same private room.':'2인실에는 두 개의 베드가 마련되어 있어 두 분이 같은 독립 공간에서 함께 관리받을 수 있습니다.','VIEW COUPLE CARE':'커플 관리 보기',
      'GANGNAM, SEOUL':'서울 강남','Location':'위치','Google Maps':'구글 지도','Open map':'지도 열기','VISITING AIRE':'이용 안내','Frequently<br>asked questions.':'자주 묻는<br>질문.',
      'Is AIRE SPA available by reservation?':'AIRE SPA는 예약제로 운영하나요?','Yes. AIRE SPA operates by reservation.':'네. AIRE SPA는 예약제로 운영합니다.','Are the treatment rooms private?':'관리실은 독립된 공간인가요?','Yes. Appointments take place in private rooms, with separate rooms for individual and couple visits.':'네. 모든 관리는 독립된 공간에서 진행하며 1인실과 2인실을 각각 운영합니다.','What types of care are available?':'어떤 관리 프로그램이 있나요?','AIRE SPA offers body care and facial care programs. Current program details, durations and prices are listed on the Programs page.':'바디와 페이셜 관리 프로그램을 운영합니다. 현재 프로그램 구성, 시간과 가격은 프로그램 페이지에서 확인할 수 있습니다.','Do the private rooms have shower areas?':'프라이빗 룸 안에 샤워 공간이 있나요?','Yes. Each private room includes its own shower area.':'네. 각 프라이빗 룸 안에 샤워 공간이 마련되어 있습니다.','Where is AIRE SPA located?':'AIRE SPA는 어디에 있나요?','AIRE SPA is on the second floor at 14-15, Teheran-ro 78-gil, Gangnam-gu, Seoul 06194, Republic of Korea.':'AIRE SPA는 서울특별시 강남구 테헤란로78길 14-15, 2층에 있습니다.',
      'BY APPOINTMENT':'예약제 운영','Reservation':'예약','Review the current programs before contacting AIRE SPA to arrange an appointment.':'예약 문의 전 현재 프로그램을 확인해 주세요.','PHONE':'전화','If the landline is unavailable, please call the mobile number.':'유선전화 연결이 어려울 때는 휴대전화로 연락해 주세요.','Reservation inquiries are also available through Instagram direct message.':'인스타그램 다이렉트 메시지로도 예약 문의가 가능합니다.','Footer':'하단 메뉴',
      '2F, 14-15, Teheran-ro 78-gil,<br>Gangnam-gu, Seoul 06194,<br>Republic of Korea':'서울특별시 강남구<br>테헤란로78길 14-15, 2층','2F, 14-15, Teheran-ro 78-gil, Gangnam-gu, Seoul 06194, Republic of Korea':'서울특별시 강남구 테헤란로78길 14-15, 2층'
    }
  },
  ja: {
    file: 'private-spa-gangnam-ja.html', locale: 'ja_JP', title: '江南の個室スパ・1名様用・2名様用ルーム | AIRE SPA',
    description: 'ソウル・江南の予約制AIRE SPA。1名様用・2名様用の個室で、ボディとフェイシャルのケアプログラムをご提供します。',
    about: 'ja-about.html', menu: 'ja-menu.html', home: 'ja.html',
    replacements: {
      'Main navigation':'メインメニュー','ABOUT':'AIREについて','PROGRAMS':'プログラム','SPACE':'施設','LOCATION':'アクセス','RESERVATION':'予約','Open menu':'メニューを開く','Close menu':'メニューを閉じる',
      'Private Spa<br>in Gangnam, Seoul':'ソウル・江南の<br>プライベートスパ','A private setting for body and facial care in Gangnam, with rooms for individual and couple appointments.':'江南でボディとフェイシャルのケアを受けられるプライベート空間。1名様・2名様でご予約いただけます。',
      'Designed for a more<br>private appointment.':'よりプライベートな<br>時間のための空間。','AIRE SPA &amp; AESTHETIC is located in Gangnam, Seoul and operates by reservation.':'AIRE SPA &amp; AESTHETICはソウル・江南に位置し、予約制で運営しています。','Each appointment takes place in a private room, with separate rooms available for individual and couple visits.':'すべての施術は個室で行い、1名様用と2名様用のルームをご用意しています。',
      'PRIVATE ROOMS':'個室','Your own space throughout the appointment.':'ご予約中を個室で。','Private rooms are arranged for one or two guests. Each room includes its own shower area, allowing the appointment and preparation to take place within the same space.':'1名様または2名様でご利用いただける個室です。各室にシャワースペースがあり、施術から身支度まで同じ空間で行えます。',
      'BODY &amp; FACIAL':'ボディ &amp; フェイシャル','Body and facial care programs.':'ボディとフェイシャルのケア。','AIRE SPA offers body and facial care programs. Program durations, included services and prices are listed on the Programs page.':'ボディとフェイシャルのケアプログラムをご提供しています。所要時間、内容、料金はプログラムページでご確認いただけます。','VIEW PROGRAMS':'プログラムを見る',
      'FOR TWO':'お二人で','A private room for two.':'お二人で利用できる個室。','Couple rooms are arranged with two beds so that two guests can receive care in the same private room.':'2名様用の個室にはベッドを2台設置し、お二人が同じ空間で施術を受けられます。','VIEW COUPLE CARE':'カップルケアを見る',
      'GANGNAM, SEOUL':'ソウル・江南','Location':'アクセス','Google Maps':'Googleマップ','Open map':'地図を開く','VISITING AIRE':'ご利用案内','Frequently<br>asked questions.':'よくある<br>ご質問.',
      'Is AIRE SPA available by reservation?':'AIRE SPAは予約制ですか？','Yes. AIRE SPA operates by reservation.':'はい。AIRE SPAは予約制で運営しています。','Are the treatment rooms private?':'施術室は個室ですか？','Yes. Appointments take place in private rooms, with separate rooms for individual and couple visits.':'はい。すべての施術は個室で行い、1名様用と2名様用のルームをご用意しています。','What types of care are available?':'どのようなケアがありますか？','AIRE SPA offers body care and facial care programs. Current program details, durations and prices are listed on the Programs page.':'ボディとフェイシャルのケアプログラムがあります。現在の内容、所要時間、料金はプログラムページでご確認いただけます。','Do the private rooms have shower areas?':'個室にシャワースペースはありますか？','Yes. Each private room includes its own shower area.':'はい。各個室にシャワースペースがあります。','Where is AIRE SPA located?':'AIRE SPAはどこにありますか？','AIRE SPA is on the second floor at 14-15, Teheran-ro 78-gil, Gangnam-gu, Seoul 06194, Republic of Korea.':'AIRE SPAはソウル特別市江南区テヘラン路78キル14-15、2階にあります。',
      'BY APPOINTMENT':'予約制','Reservation':'予約','Review the current programs before contacting AIRE SPA to arrange an appointment.':'ご予約のお問い合わせ前に、現在のプログラムをご確認ください。','PHONE':'電話','If the landline is unavailable, please call the mobile number.':'固定電話につながらない場合は、携帯電話へご連絡ください。','Reservation inquiries are also available through Instagram direct message.':'Instagramのダイレクトメッセージからも予約のお問い合わせが可能です。','Footer':'フッターメニュー',
      '2F, 14-15, Teheran-ro 78-gil,<br>Gangnam-gu, Seoul 06194,<br>Republic of Korea':'大韓民国 ソウル特別市 江南区<br>テヘラン路78キル14-15、2階','2F, 14-15, Teheran-ro 78-gil, Gangnam-gu, Seoul 06194, Republic of Korea':'大韓民国 ソウル特別市 江南区 テヘラン路78キル14-15、2階'
    }
  }
};

const urls = {en:'private-spa-gangnam.html',ko:'private-spa-gangnam-ko.html',ja:'private-spa-gangnam-ja.html'};
const alternates = `<link rel="alternate" hreflang="ko" href="https://airespaseoul.com/${urls.ko}">\n<link rel="alternate" hreflang="en" href="https://airespaseoul.com/${urls.en}">\n<link rel="alternate" hreflang="ja" href="https://airespaseoul.com/${urls.ja}">\n<link rel="alternate" hreflang="x-default" href="https://airespaseoul.com/${urls.en}">`;
let source = fs.readFileSync(sourceFile,'utf8')
  .replace(/<link rel="alternate" hreflang="[^"]+"[^>]+>\n?/g,'')
  .replace(/(<link rel="canonical" href="[^"]+">)/,`$1\n${alternates}`);
source = source.replace('<div class="header-actions"><div class="lang"><a href="index.html">KR</a><a class="active" href="en.html" aria-label="English home">EN</a><a href="ja.html">JP</a></div>',`<div class="header-actions"><div class="lang"><a href="${urls.ko}">KR</a><a class="active" href="${urls.en}">EN</a><a href="${urls.ja}">JP</a></div>`);
fs.writeFileSync(sourceFile,source);

for (const [lang,v] of Object.entries(variants)) {
  let html=source.replace('<html lang="en">',`<html lang="${lang}">`);
  const url=`https://airespaseoul.com/${v.file}`;
  html=html.replace(/<title>[^<]+<\/title>/,`<title>${v.title}</title>`)
    .replace(/<meta name="description" content="[^"]+">/,`<meta name="description" content="${v.description}">`)
    .replace(/<link rel="canonical" href="[^"]+">/,`<link rel="canonical" href="${url}">`)
    .replace(/<meta property="og:title" content="[^"]+">/,`<meta property="og:title" content="${v.title}">`)
    .replace(/<meta property="og:description" content="[^"]+">/,`<meta property="og:description" content="${v.description}">`)
    .replace(/<meta property="og:url" content="[^"]+">/,`<meta property="og:url" content="${url}">`)
    .replace(/<meta property="og:locale" content="[^"]+">/,`<meta property="og:locale" content="${v.locale}">`)
    .replace(/<meta name="twitter:title" content="[^"]+">/,`<meta name="twitter:title" content="${v.title}">`)
    .replace(/<meta name="twitter:description" content="[^"]+">/,`<meta name="twitter:description" content="${v.description}">`)
    .replaceAll('https://airespaseoul.com/private-spa-gangnam.html#',`${url}#`)
    .replace('"url": "https://airespaseoul.com/private-spa-gangnam.html"',`"url": "${url}"`)
    .replace('"name": "Private Spa in Gangnam, Seoul | AIRE SPA"',`"name": "${v.title}"`)
    .replace('"description": "AIRE SPA is a reservation-only private spa in Gangnam, Seoul, with private rooms for individual and couple body and facial care appointments."',`"description": "${v.description}"`)
    .replace('"inLanguage": "en"',`"inLanguage": "${lang}"`)
    .replaceAll('href="en-about.html"',`href="${v.about}"`).replaceAll('href="en-menu.html',`href="${v.menu}`).replaceAll('href="en.html#top"',`href="${v.home}#top"`)
    .replace(`<div class="header-actions"><div class="lang"><a href="${urls.ko}">KR</a><a class="active" href="${urls.en}">EN</a><a href="${urls.ja}">JP</a></div>`,`<div class="header-actions"><div class="lang"><a${lang==='ko'?' class="active"':''} href="${urls.ko}">KR</a><a${lang==='en'?' class="active"':''} href="${urls.en}">EN</a><a${lang==='ja'?' class="active"':''} href="${urls.ja}">JP</a></div>`);
  for(const [from,to] of Object.entries(v.replacements)) html=html.replaceAll(from,to);
  if(lang==='ko') html=html
    .replaceAll('VIEW 프로그램','프로그램 보기')
    .replace('AIRE SPA offers body care and facial care programs. Current program details, durations and prices are listed on the <a href="menu.html">Programs page</a>.','바디와 페이셜 관리 프로그램을 운영합니다. 현재 프로그램 구성, 시간과 가격은 <a href="menu.html">프로그램 페이지</a>에서 확인할 수 있습니다.')
    .replace('예약 inquiries are also available through Instagram direct message.','인스타그램 다이렉트 메시지로도 예약 문의가 가능합니다.')
    .replaceAll('alt="AIRE SPA private treatment room prepared for an appointment"','alt="예약을 위해 준비된 AIRE SPA 프라이빗 관리실"')
    .replaceAll('alt="AIRE SPA private room with an individual shower area"','alt="개별 샤워 공간이 있는 AIRE SPA 프라이빗 관리실"')
    .replaceAll('alt="AIRE SPA private room with two treatment beds"','alt="두 개의 관리 베드가 있는 AIRE SPA 2인실"');
  if(lang==='ja') html=html
    .replaceAll('VIEW プログラム','プログラムを見る')
    .replace('AIRE SPA offers body care and facial care programs. Current program details, durations and prices are listed on the <a href="ja-menu.html">Programs page</a>.','ボディとフェイシャルのケアプログラムがあります。現在の内容、所要時間、料金は<a href="ja-menu.html">プログラムページ</a>でご確認いただけます。')
    .replace('予約 inquiries are also available through Instagram direct message.','Instagramのダイレクトメッセージからも予約のお問い合わせが可能です。')
    .replace('よくある<br>ご質問.','よくある<br>ご質問。')
    .replaceAll('alt="AIRE SPA private treatment room prepared for an appointment"','alt="予約に合わせて準備されたAIRE SPAの個室"')
    .replaceAll('alt="AIRE SPA private room with an individual shower area"','alt="専用シャワースペースを備えたAIRE SPAの個室"')
    .replaceAll('alt="AIRE SPA private room with two treatment beds"','alt="ベッドを2台備えたAIRE SPAの2名様用個室"');
  fs.writeFileSync(v.file,html);
}
console.log('Generated Korean and Japanese private spa landing pages.');
