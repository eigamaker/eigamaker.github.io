/* 相性診断ページのコントローラ。
   モード:
   - 受信(#c=... あり): 自分の回答があれば即比較、なければテストへ誘導
     (ペイロードは sessionStorage に退避し、テスト完了後に戻ってくる)
   - 送信(#c= なし): 自分の回答から共有リンク/QR/Web Share を生成 */
(function () {
  'use strict';

  var INCOMING_KEY = 'pcCompatIncoming';
  var NAME_KEY = 'pcCompatMyName';
  var TOKEN_KEY = 'pcCompatMyToken';
  var TOKEN_VALID_DAYS = 14;
  var APP_URL_IOS = 'https://apps.apple.com/jp/app/profilecode-codes/id6747016000';
  var APP_URL_ANDROID = 'https://play.google.com/store/apps/details?id=com.profilecode.profilecode';

  // ---- ログイン連携(tier b): share_tokens による恒久リンク --------------------
  async function authUser() {
    if (typeof checkAuthStatus !== 'function') return null;
    try {
      var st = await checkAuthStatus();
      return st.isLoggedIn ? st.user : null;
    } catch (e) { return null; }
  }

  // ログイン済み送信者用: トークンを発行(セッション内で再利用)。
  // このトークン入りリンクを開いた相手は personal_targets に自動登録され、
  // アプリの友達リストにも反映される。
  async function getOrMintToken(userId) {
    try {
      var cached = JSON.parse(sessionStorage.getItem(TOKEN_KEY) || 'null');
      if (cached && cached.userId === userId && cached.exp > Date.now()) return cached.token;
    } catch (e) { /* fall through */ }
    try {
      var supabase = getSupabaseClient();
      var res = await supabase.rpc('generate_personal_link', {
        user_id: userId,
        valid_days: TOKEN_VALID_DAYS,
      });
      if (res.error || !res.data) return null;
      sessionStorage.setItem(TOKEN_KEY, JSON.stringify({
        userId: userId,
        token: res.data,
        exp: Date.now() + (TOKEN_VALID_DAYS - 1) * 86400000,
      }));
      track('compat_permlink_created');
      return res.data;
    } catch (e) {
      return null;
    }
  }

  // 受信者がログイン済みで ?t= がある場合: 検証+friend登録(RPC側で自動)
  async function consumeToken(token) {
    try {
      var supabase = getSupabaseClient();
      var res = await supabase.rpc('validate_share_token', { token: token });
      if (res.error || !res.data) return null;
      track('compat_permlink_opened');
      return res.data; // {user_id, group_id, user_name, group_name}
    } catch (e) {
      return null;
    }
  }

  function myAnswers() {
    try {
      var a = JSON.parse(localStorage.getItem('personalityTestAnswers') || '[]');
      if (!Array.isArray(a)) return null;
      // 過去バージョンのデータは再回答で重複を含むことがある(最後の回答が有効)
      var byId = {};
      a.forEach(function (ans) { byId[ans.questionId] = ans; });
      var deduped = Object.keys(byId).map(function (k) { return byId[k]; });
      return deduped.length === 40 ? deduped : null;
    } catch (e) { return null; }
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function track(ev, params) {
    if (typeof pcTrack === 'function') pcTrack(ev, params || {});
  }

  function el(id) { return document.getElementById(id); }

  function appCtaHtml() {
    return '<div class="cp-app-cta">' +
      '<h2>' + ct('appCtaHeading') + '</h2>' +
      '<p>' + ct('appCtaDesc') + '</p>' +
      '<a class="pc-btn" href="' + APP_URL_IOS + '" target="_blank" rel="noopener" ' +
      'onclick="pcTrack(\'compat_group_app_clicked\', {store: \'ios\'})">' + ct('appCtaButton') + ' (App Store)</a> ' +
      '<a class="pc-btn" href="' + APP_URL_ANDROID + '" target="_blank" rel="noopener" style="margin-top:8px;" ' +
      'onclick="pcTrack(\'compat_group_app_clicked\', {store: \'android\'})">' + ct('appCtaButton') + ' (Google Play)</a>' +
      '</div>';
  }

  function footerLinks() {
    var lang = (typeof i18n !== 'undefined' && i18n.getCurrentLanguage()) || 'en';
    var home = lang === 'ja' ? '/ja/' : '/en/';
    return '<div class="cp-footer-links"><a href="' + home + '">Home</a>' +
      '<a href="/test.html?lang=' + lang + '">' + ct('retake') + '</a></div>' +
      '<p class="cp-disclaimer">' + ct('disclaimer') + '</p>';
  }

  // ---- 送信モード -------------------------------------------------------------
  // token あり(ログイン済み)ならハイブリッドリンク ?t=<token>#c=<payload> を生成:
  // トークンが友達関係(アプリ連携)、フラグメントが比較データを運ぶ。
  function renderSender(container, answers, token) {
    var savedName = localStorage.getItem(NAME_KEY) || '';
    var lang = (typeof i18n !== 'undefined' && i18n.getCurrentLanguage()) || 'en';
    var accountNote = token
      ? '<p class="cp-account-note cp-account-note--ok">' + ct('permlinkNote') + '</p>'
      : '<p class="cp-account-note">' + ct('loginHint') +
        ' <a href="/test.html?lang=' + lang + '" onclick="pcTrack(\'compat_signup_from_compat\')">' + ct('loginHintLink') + '</a></p>';
    container.innerHTML =
      '<div class="cp-card">' +
      '<h2>' + ct('senderHeading') + '</h2>' +
      '<p>' + ct('senderDesc') + '</p>' +
      '<div class="cp-name-row"><label for="cpName">' + ct('nameLabel') + '</label>' +
      '<input id="cpName" maxlength="24" placeholder="' + esc(ct('namePlaceholder')) + '" value="' + esc(savedName) + '"></div>' +
      '<div class="cp-link-box"><input id="cpLink" readonly></div>' +
      '<div class="cp-buttons">' +
      '<button class="pc-btn pc-btn--primary" id="cpCopy">' + ct('copyLink') + '</button>' +
      (navigator.share ? '<button class="pc-btn pc-btn--soft" id="cpShare">' + ct('webShare') + '</button>' : '') +
      '<button class="pc-btn pc-btn--ghost" id="cpQrToggle">' + ct('showQr') + '</button>' +
      '</div>' +
      '<div class="cp-qr" id="cpQr" style="display:none;"></div>' +
      accountNote +
      '</div>' +
      appCtaHtml() + footerLinks();

    function currentUrl() {
      var name = el('cpName').value.trim();
      var payload = PcCompat.encodeAnswers(answers, name || null);
      return location.origin + '/compatibility/' +
        (token ? '?t=' + encodeURIComponent(token) : '') + '#c=' + payload;
    }
    function refresh() {
      el('cpLink').value = currentUrl();
      localStorage.setItem(NAME_KEY, el('cpName').value.trim());
      if (el('cpQr').style.display !== 'none') drawQr();
    }
    function drawQr() {
      var qr = qrcode(0, 'M');
      qr.addData(currentUrl());
      qr.make();
      el('cpQr').innerHTML = qr.createSvgTag({ cellSize: 4, margin: 2 });
    }

    el('cpName').addEventListener('input', refresh);
    el('cpCopy').addEventListener('click', function () {
      navigator.clipboard.writeText(currentUrl()).then(function () {
        el('cpCopy').textContent = ct('copied');
        setTimeout(function () { el('cpCopy').textContent = ct('copyLink'); }, 1600);
      });
      track('compat_link_created', { method: 'copy' });
    });
    if (el('cpShare')) {
      el('cpShare').addEventListener('click', function () {
        navigator.share({ url: currentUrl() }).catch(function () {});
        track('compat_link_created', { method: 'webshare' });
      });
    }
    el('cpQrToggle').addEventListener('click', function () {
      var box = el('cpQr');
      var showing = box.style.display !== 'none';
      box.style.display = showing ? 'none' : 'block';
      el('cpQrToggle').textContent = showing ? ct('showQr') : ct('hideQr');
      if (!showing) { drawQr(); track('compat_link_created', { method: 'qr' }); }
    });
    refresh();
  }

  // ---- テスト誘導(自分の回答なし) ----------------------------------------------
  function renderGate(container, incomingName) {
    var lang = (typeof i18n !== 'undefined' && i18n.getCurrentLanguage()) || 'en';
    var heading = incomingName
      ? (lang === 'ja' ? esc(incomingName) + ct('incomingHeading') : esc(incomingName) + ct('incomingHeading'))
      : ct('incomingHeadingAnon');
    container.innerHTML =
      '<div class="cp-card">' +
      '<h2>' + heading + '</h2>' +
      '<p>' + ct('incomingGateDesc') + '</p>' +
      '<div class="cp-buttons"><a class="pc-btn pc-btn--primary" id="cpGateGo" href="/test.html?lang=' + lang + '&return=compat">' +
      ct('takeTest') + '</a></div>' +
      '</div>' + footerLinks();
    el('cpGateGo').addEventListener('click', function () {
      track('compat_gate_test_started');
    });
  }

  function renderNoResult(container) {
    var lang = (typeof i18n !== 'undefined' && i18n.getCurrentLanguage()) || 'en';
    container.innerHTML =
      '<div class="cp-card">' +
      '<h2>' + ct('noResultHeading') + '</h2>' +
      '<p>' + ct('noResultDesc') + '</p>' +
      '<div class="cp-buttons"><a class="pc-btn pc-btn--primary" href="/test.html?lang=' + lang + '&return=compat">' +
      ct('takeTest') + '</a></div>' +
      '</div>' + footerLinks();
  }

  // ---- 相性レポート -------------------------------------------------------------
  function theoryBlock(titleKey, th, narrativeKey, pairHtml, extraHtml) {
    var bands = ctBands();
    var band = bands[th.band];
    return '<div class="cp-theory">' +
      '<div class="cp-theory-head"><h3>' + ct(titleKey) + '</h3>' +
      '<span class="cp-theory-score">' + th.score + '%</span></div>' +
      '<div class="cp-theory-bar"><div style="width:' + th.score + '%"></div></div>' +
      (pairHtml ? '<div class="cp-pair">' + pairHtml + '</div>' : '') +
      '<p>' + band[narrativeKey] + '</p>' +
      (extraHtml || '') +
      '</div>';
  }

  function renderReport(container, mine, incoming, ctx) {
    ctx = ctx || {};
    var result;
    try {
      result = PcCompatEngine.compare(mine, incoming.answers, sharedQuestions);
    } catch (e) {
      console.error('compat compare failed:', e);
      container.innerHTML = '<div class="cp-card"><p>' + ct('invalidLink') + '</p></div>' + footerLinks();
      return;
    }
    track('compat_compared', { overall: result.overall, band: result.band });

    // 友達リンク(トークン)の状態表示
    var connectNote = '';
    if (ctx.connected) {
      var who = ctx.connected.user_name ? esc(ctx.connected.user_name) : ct('partner');
      connectNote = '<p class="cp-account-note cp-account-note--ok">' + who + ct('connectedNote') + '</p>';
    } else if (ctx.token && !ctx.user) {
      connectNote = '<p class="cp-account-note">' + ct('connectLoginHint') + '</p>';
    }

    var bands = ctBands();
    var lang = (typeof i18n !== 'undefined' && i18n.getCurrentLanguage()) || 'en';
    var partnerLabel = incoming.name ? esc(incoming.name) : ct('partner');
    var heading = incoming.name
      ? (lang === 'ja' ? esc(incoming.name) + ct('with') : 'Compatibility with ' + esc(incoming.name))
      : ct('withAnon');
    var t = result.theories;

    var highlights = t.sixteenFactor.highlights;
    var highlightsHtml = '<div class="cp-highlights">' +
      '<div><b>' + ct('alikeLabel') + ':</b> ' + highlights.alike.map(esc).join(' / ') + '</div>' +
      '<div><b>' + ct('diffLabel') + ':</b> ' + highlights.different.map(esc).join(' / ') + '</div>' +
      '</div>';

    container.innerHTML =
      '<div class="cp-versus">' +
      '<div class="cp-avatar"><img src="/assets/img/characters/career-' + t.career.typeA + '.svg" alt="">' +
      '<span class="cp-avatar-label">' + ct('you') + '</span></div>' +
      '<div class="cp-heart">💞</div>' +
      '<div class="cp-avatar"><img src="/assets/img/characters/career-' + t.career.typeB + '.svg" alt="">' +
      '<span class="cp-avatar-label">' + partnerLabel + '</span></div>' +
      '</div>' +
      '<h2 style="text-align:center;margin:0 0 4px;">' + heading + '</h2>' +
      connectNote +
      '<div class="cp-overall"><div class="cp-overall-score">' + result.overall + '%</div>' +
      '<span class="cp-overall-band">' + bands[result.band].name + '</span></div>' +
      '<div class="cp-card">' +
      theoryBlock('theoryCareer', t.career, 'careerN',
        ct('you') + ': ' + esc(t.career.nameA) + ' × ' + partnerLabel + ': ' + esc(t.career.nameB)) +
      theoryBlock('theoryLearning', t.learning, 'learningN',
        ct('you') + ': ' + esc(t.learning.nameA) + ' × ' + partnerLabel + ': ' + esc(t.learning.nameB)) +
      theoryBlock('theoryMbti', t.mbti, 'mbtiN',
        ct('you') + ': ' + t.mbti.typeA + ' × ' + partnerLabel + ': ' + t.mbti.typeB) +
      theoryBlock('theory16pf', t.sixteenFactor, 'pfN', null, highlightsHtml) +
      theoryBlock('theoryDisc', t.disc, 'discN',
        ct('you') + ': ' + esc(t.disc.nameA) + ' × ' + partnerLabel + ': ' + esc(t.disc.nameB)) +
      '</div>' +
      '<div class="cp-buttons" style="justify-content:center;">' +
      '<button class="pc-btn pc-btn--primary" id="cpMakeOwn">' + ct('makeOwnLink') + '</button>' +
      '</div>' +
      appCtaHtml() + footerLinks();

    el('cpMakeOwn').addEventListener('click', function () {
      sessionStorage.removeItem(INCOMING_KEY);
      history.replaceState(null, '', '/compatibility/');
      init();
    });
  }

  // ---- トークンのみのリンク(比較データなし) ----------------------------------
  function renderTokenOnly(container, connected, user) {
    var lang = (typeof i18n !== 'undefined' && i18n.getCurrentLanguage()) || 'en';
    var body;
    if (connected) {
      var who = connected.user_name ? esc(connected.user_name) : ct('partner');
      body = '<h2>' + who + ct('connectedNote') + '</h2><p>' + ct('tokenOnlyDesc') + '</p>';
    } else if (!user) {
      body = '<h2>' + ct('incomingHeadingAnon') + '</h2><p>' + ct('connectLoginHint') + '</p>';
    } else {
      body = '<p>' + ct('invalidLink') + '</p>';
    }
    container.innerHTML =
      '<div class="cp-card">' + body +
      '<div class="cp-buttons"><a class="pc-btn pc-btn--primary" href="/test.html?lang=' + lang + '&return=compat">' +
      ct('takeTest') + '</a></div></div>' + footerLinks();
  }

  // ---- 起動 ----------------------------------------------------------------------
  async function init() {
    var container = el('cpMain');
    var incoming = PcCompat.parseShareFragment();
    var token = new URLSearchParams(location.search).get('t');

    if (incoming) {
      // フラグメントは遷移で失われるため退避(友達リンクのトークンも一緒に)
      if (token) incoming.token = token;
      sessionStorage.setItem(INCOMING_KEY, JSON.stringify(incoming));
      track('compat_link_opened');
    } else if (location.hash.indexOf('#c=') === 0) {
      // フラグメントはあるがデコード不能 = 無効リンク
      container.innerHTML = '<div class="cp-card"><p>' + ct('invalidLink') + '</p></div>' + footerLinks();
      return;
    } else {
      var stashed = sessionStorage.getItem(INCOMING_KEY);
      if (stashed) {
        try { incoming = JSON.parse(stashed); } catch (e) { incoming = null; }
        if (incoming && incoming.token) token = incoming.token;
      }
    }

    var mine = myAnswers();
    var user = await authUser();

    // ログイン済み受信者: トークン検証で友達関係を自動登録(アプリ連携)
    var connected = null;
    if (token && user) connected = await consumeToken(token);

    if (incoming) {
      if (mine) renderReport(container, mine, incoming, { connected: connected, token: token, user: user });
      else renderGate(container, incoming.name);
    } else if (token) {
      renderTokenOnly(container, connected, user);
    } else {
      if (mine) {
        var myToken = user ? await getOrMintToken(user.id) : null;
        renderSender(container, mine, myToken);
      } else {
        renderNoResult(container);
      }
    }
  }

  document.addEventListener('DOMContentLoaded', init);
  document.addEventListener('languageChanged', init);
  // フラグメントのみの遷移(ページ内でリンクを開いた場合)にも対応
  window.addEventListener('hashchange', init);
})();
