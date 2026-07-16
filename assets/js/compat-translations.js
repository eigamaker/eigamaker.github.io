/* 相性診断ページの文言(ja/en、他言語はenへフォールバック)。
   ct(key) でアクセスする。ナラティブはポジティブ・成長志向のトーンで統一
   (「悪い相性」は存在しない設計)。 */
(function () {
  'use strict';

  window.PC_COMPAT_I18N = {
    ja: {
      pageTitle: '相性診断 | Profilecode',
      heading: '相性診断',
      intro: '診断結果をリンクで交換して、ふたりの相性をその場でチェック。アカウント登録は不要です。',
      senderHeading: 'あなたの相性診断リンク',
      senderDesc: 'このリンクを友達に送ると、相手の画面であなたとの相性が表示されます。',
      nameLabel: '表示名(任意)',
      namePlaceholder: '例: たかお',
      copyLink: 'リンクをコピー',
      copied: 'コピーしました!',
      showQr: 'QRコードを表示',
      hideQr: 'QRコードを隠す',
      webShare: '共有する',
      noResultHeading: 'まずは性格診断を受けましょう',
      noResultDesc: '相性診断には、あなた自身の診断結果が必要です。40問・約5分で完了します。',
      takeTest: '無料で診断を受ける(約5分)',
      incomingHeading: 'さんから相性診断が届きました',
      incomingHeadingAnon: '相性診断が届きました',
      incomingGateDesc: '相性を見るには、あなたも性格診断に回答してください(40問・約5分)。回答後、自動でこの画面に戻ります。',
      invalidLink: 'このリンクは無効か、古いバージョンの診断リンクです。相手に新しいリンクを作ってもらってください。',
      resultHeading: 'ふたりの相性',
      with: 'さんとの相性',
      withAnon: '相手との相性',
      you: 'あなた',
      partner: '相手',
      overall: '総合相性',
      theoryCareer: 'キャリア適性の相性',
      theoryLearning: '学習スタイルの相性',
      theoryMbti: 'MBTIの相性',
      theory16pf: '性格因子(16PF)の相性',
      theoryDisc: '行動スタイル(DISC)の相性',
      alikeLabel: '特に似ているところ',
      diffLabel: '特に違うところ',
      shareResult: 'この結果を共有',
      makeOwnLink: '自分のリンクを作る',
      retake: '診断をやり直す',
      permlinkNote: '✓ ログイン済み: このリンクは友達リンクつきです。開いた相手はあなたの友達リストに追加され、アプリでも相性を確認できます(有効期限14日)。',
      loginHint: 'アカウントにログインして診断を保存すると、友達リストに残る恒久リンクを作成でき、アプリとも連携されます。',
      loginHintLink: '診断ページでログイン/登録する',
      connectedNote: 'さんと繋がりました! アプリの友達リストにも追加されています。',
      connectLoginHint: 'ログインすると、この相手が友達リストに保存され、アプリでも相性を確認できるようになります。',
      tokenOnlyDesc: 'このリンクには比較データが含まれていません。相性を見るには、あなたも診断を受けて自分のリンクを相手に送りましょう。',
      appCtaHeading: 'グループの相性はアプリで',
      appCtaDesc: 'アプリなら、グループを作ってメンバー全員との相性を診断できます。診断結果の保存・同期も可能です。',
      appCtaButton: 'アプリをダウンロード',
      disclaimer: 'この相性診断はProfilecodeウェブ版独自のルールベース計算です。エンターテインメントおよび自己理解のヒントとしてお楽しみください。',
      bands: {
        soulmate: { name: 'ぴったり', careerN: 'キャリアの価値観がとても近いふたり。目指す方向が自然に揃うので、仕事の話が尽きません。', learningN: '学び方のスタイルがほぼ同じ。一緒に勉強したり、おすすめの学び方を共有すると効果絶大です。', mbtiN: 'ものの見方・決め方がそっくり。言葉にしなくても通じ合える場面が多いはず。', pfN: '性格の土台が非常に似ています。安心感のある、居心地のよい関係を築きやすいでしょう。', discN: '行動のリズムがぴったり。一緒に動くとテンポよく物事が進みます。' },
        great:    { name: 'とても良い', careerN: '大事にしているものが近く、互いのキャリアの選択を自然に応援し合えます。', learningN: '学び方が近いので、知識のシェアがスムーズ。教え合う関係になれます。', mbtiN: '思考のパターンが近く、会話がかみ合いやすい組み合わせです。', pfN: '性格の相性が良く、無理をしなくても一緒にいられる関係です。', discN: '行動ペースが合いやすく、協力すると強いコンビになります。' },
        good:     { name: '良い', careerN: '共通点と違いのバランスが良好。互いの強みを持ち寄れる関係です。', learningN: '学び方に少し違いがあり、相手のやり方から新しい発見が得られます。', mbtiN: '似ているところと違うところが半々。違いが会話を面白くします。', pfN: '性格のバランスが取れた組み合わせ。互いに補い合えます。', discN: '行動スタイルが適度に違い、役割分担がしやすい関係です。' },
        exciting: { name: '違いが刺激', careerN: '目指す方向はけっこう違いますが、だからこそ視野が広がる関係。相手の選択に学びがあります。', learningN: '学び方が大きく異なります。相手の学習法を試すと、新しい扉が開くかもしれません。', mbtiN: 'ものの見方がかなり違うふたり。意識して聞き合えば、最高の相談相手になります。', pfN: '性格はだいぶ違いますが、それは弱点を補い合えるということでもあります。', discN: '行動リズムが異なるので、互いのペースを尊重するのが心地よい関係のコツです。' },
        opposite: { name: '正反対で学び合う', careerN: 'キャリア観は正反対。でも、自分にない発想を一番くれるのはこういう相手です。', learningN: '学び方が真逆。ふたりで取り組めば、あらゆる角度から理解できるチームになれます。', mbtiN: 'ほぼ正反対のタイプ。理解に努力は要りますが、そのぶん世界が2倍に広がります。', pfN: '性格は対照的。違いを面白がれれば、唯一無二の組み合わせになります。', discN: '行動スタイルは対極ですが、攻めと守りの役割分担ができる最強タッグの素質があります。' },
      },
    },
    en: {
      pageTitle: 'Compatibility Test | Profilecode',
      heading: 'Compatibility Test',
      intro: 'Exchange result links with a friend and check your compatibility instantly. No account needed.',
      senderHeading: 'Your compatibility link',
      senderDesc: 'Send this link to a friend — they will see their compatibility with you.',
      nameLabel: 'Display name (optional)',
      namePlaceholder: 'e.g. Alex',
      copyLink: 'Copy link',
      copied: 'Copied!',
      showQr: 'Show QR code',
      hideQr: 'Hide QR code',
      webShare: 'Share',
      noResultHeading: 'Take the personality test first',
      noResultDesc: 'Compatibility needs your own test result. It takes 40 questions, about 5 minutes.',
      takeTest: 'Take the free test (~5 min)',
      incomingHeading: ' sent you a compatibility invite',
      incomingHeadingAnon: 'You received a compatibility invite',
      incomingGateDesc: 'To see your compatibility, answer the personality test first (40 questions, ~5 min). You will return here automatically.',
      invalidLink: 'This link is invalid or from an older version. Ask your friend to create a new link.',
      resultHeading: 'Your compatibility',
      with: '', // suffix unused in en; heading built differently
      withAnon: 'Compatibility with your friend',
      you: 'You',
      partner: 'Friend',
      overall: 'Overall compatibility',
      theoryCareer: 'Career aptitude match',
      theoryLearning: 'Learning style match',
      theoryMbti: 'MBTI match',
      theory16pf: 'Personality factors (16PF) match',
      theoryDisc: 'Behavior style (DISC) match',
      alikeLabel: 'Most alike',
      diffLabel: 'Most different',
      shareResult: 'Share this result',
      makeOwnLink: 'Create your own link',
      retake: 'Retake the test',
      permlinkNote: '✓ Signed in: this link includes a friend connection. Whoever opens it is added to your friend list and can check compatibility in the app too (valid 14 days).',
      loginHint: 'Sign in and save your results to create permanent links that persist in your friend list and sync with the app.',
      loginHintLink: 'Sign in / register on the test page',
      connectedNote: ' is now connected! They were also added to your friend list in the app.',
      connectLoginHint: 'Sign in to save this person to your friend list and check compatibility in the app as well.',
      tokenOnlyDesc: 'This link does not include comparison data. Take the test and send your own link to see your compatibility.',
      appCtaHeading: 'Group compatibility in the app',
      appCtaDesc: 'With the app you can create groups and check compatibility with every member, plus save and sync your results.',
      appCtaButton: 'Download the app',
      disclaimer: 'This compatibility check is a rule-based calculation unique to the Profilecode web version. Enjoy it as entertainment and a hint for self-understanding.',
      bands: {
        soulmate: { name: 'Perfect match', careerN: 'Your career values are remarkably close — your goals align naturally.', learningN: 'You learn in almost the same way. Studying together works wonders.', mbtiN: 'You see and decide things alike; you often understand each other without words.', pfN: 'Your core personalities are very similar — an easy, reassuring relationship.', discN: 'Your rhythms match perfectly; working together feels effortless.' },
        great:    { name: 'Great match', careerN: 'You value similar things and naturally support each other\'s career choices.', learningN: 'Similar learning styles make sharing knowledge smooth.', mbtiN: 'Your thinking patterns are close — conversation flows easily.', pfN: 'A comfortable personality match with little friction.', discN: 'Your paces align well; you make a strong team.' },
        good:     { name: 'Good match', careerN: 'A healthy balance of common ground and difference — you bring complementary strengths.', learningN: 'Slightly different learning styles give you fresh perspectives from each other.', mbtiN: 'Half alike, half different — the differences keep conversations interesting.', pfN: 'A balanced pairing where you complement each other.', discN: 'Moderately different styles make dividing roles easy.' },
        exciting: { name: 'Stimulating difference', careerN: 'Your directions differ — which is exactly why this relationship broadens your horizons.', learningN: 'Very different learning styles. Trying each other\'s methods may open new doors.', mbtiN: 'You see the world quite differently. Listen actively and you become each other\'s best advisors.', pfN: 'Quite different personalities — meaning you can cover each other\'s blind spots.', discN: 'Different rhythms; respecting each other\'s pace is the key to comfort.' },
        opposite: { name: 'Opposites who teach each other', careerN: 'Opposite career outlooks — but nobody offers you fresher ideas than this person.', learningN: 'Opposite learning styles. Together you can understand anything from every angle.', mbtiN: 'Nearly opposite types. Understanding takes effort, but your world doubles in size.', pfN: 'Contrasting personalities — enjoy the difference and you\'re a one-of-a-kind pair.', discN: 'Opposite styles with perfect offense/defense role potential.' },
      },
    },
  };

  window.ct = function (key) {
    var lang = (typeof i18n !== 'undefined' && i18n.getCurrentLanguage()) || 'en';
    var dict = window.PC_COMPAT_I18N[lang] || window.PC_COMPAT_I18N.en;
    return (key in dict) ? dict[key] : window.PC_COMPAT_I18N.en[key];
  };

  window.ctBands = function () {
    var lang = (typeof i18n !== 'undefined' && i18n.getCurrentLanguage()) || 'en';
    var dict = window.PC_COMPAT_I18N[lang] || window.PC_COMPAT_I18N.en;
    return dict.bands;
  };
})();
