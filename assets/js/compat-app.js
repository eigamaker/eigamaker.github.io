/* 相性診断ページのコントローラ。
   モード:
   - 受信(#c=... あり): 自分の回答があれば即比較、なければテストへ誘導
     (ペイロードは sessionStorage に退避し、テスト完了後に戻ってくる)
   - 送信(#c= なし): 自分の回答から共有リンク/QR/Web Share を生成 */
(function () {
  'use strict';

  var INCOMING_KEY = 'pcCompatIncoming';
  var NAME_KEY = 'pcCompatMyName';
  var APP_URL_IOS = 'https://apps.apple.com/jp/app/profilecode-codes/id6747016000';
  var APP_URL_ANDROID = 'https://play.google.com/store/apps/details?id=com.profilecode.profilecode';

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
  function renderSender(container, answers) {
    var savedName = localStorage.getItem(NAME_KEY) || '';
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
      '</div>' +
      appCtaHtml() + footerLinks();

    function currentUrl() {
      var name = el('cpName').value.trim();
      return PcCompat.buildShareUrl(answers, name || null);
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

  function renderReport(container, mine, incoming) {
    var result;
    try {
      result = PcCompatEngine.compare(mine, incoming.answers, sharedQuestions);
    } catch (e) {
      console.error('compat compare failed:', e);
      container.innerHTML = '<div class="cp-card"><p>' + ct('invalidLink') + '</p></div>' + footerLinks();
      return;
    }
    track('compat_compared', { overall: result.overall, band: result.band });

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

  // ---- 起動 ----------------------------------------------------------------------
  function init() {
    var container = el('cpMain');
    var incoming = PcCompat.parseShareFragment();

    if (incoming) {
      // フラグメントは遷移で失われるため退避
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
      }
    }

    var mine = myAnswers();

    if (incoming) {
      if (mine) renderReport(container, mine, incoming);
      else renderGate(container, incoming.name);
    } else {
      if (mine) renderSender(container, mine);
      else renderNoResult(container);
    }
  }

  document.addEventListener('DOMContentLoaded', init);
  document.addEventListener('languageChanged', init);
  // フラグメントのみの遷移(ページ内でリンクを開いた場合)にも対応
  window.addEventListener('hashchange', init);
})();
