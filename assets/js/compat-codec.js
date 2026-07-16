/* 相性診断リンクのエンコード/デコード。
   フラグメント形式: #c=<version>.<answers>.<name?>
   - version: QUESTIONS_VERSION(質問セット版)
   - answers: questionId昇順の40回答(-2..2 → 0..4)を3bitずつパック
              = 120bit = 15バイト → base64url 20文字
   - name:    任意の表示名(UTF-8 → base64url、24文字まで)
   フラグメントはサーバーに送信されない(プライバシー保護)。 */
(function () {
  'use strict';

  var ANSWER_COUNT = 40;

  function b64urlFromBytes(bytes) {
    var bin = '';
    for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  function bytesFromB64url(s) {
    s = s.replace(/-/g, '+').replace(/_/g, '/');
    while (s.length % 4) s += '=';
    var bin = atob(s);
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
  }

  /** @param {{questionId:number, value:number}[]} answers */
  function encodeAnswers(answers, name) {
    if (!Array.isArray(answers) || answers.length !== ANSWER_COUNT) {
      throw new Error('answers must have exactly ' + ANSWER_COUNT + ' entries');
    }
    var sorted = answers.slice().sort(function (a, b) { return a.questionId - b.questionId; });
    var bytes = new Uint8Array(15);
    var bitPos = 0;
    for (var i = 0; i < ANSWER_COUNT; i++) {
      var v = sorted[i].value + 2; // -2..2 → 0..4
      if (v < 0 || v > 4) throw new Error('answer value out of range: ' + sorted[i].value);
      for (var b = 2; b >= 0; b--) {
        var bit = (v >> b) & 1;
        bytes[bitPos >> 3] |= bit << (7 - (bitPos & 7));
        bitPos++;
      }
    }
    var payload = (typeof QUESTIONS_VERSION !== 'undefined' ? QUESTIONS_VERSION : 1) +
      '.' + b64urlFromBytes(bytes);
    if (name) {
      var trimmed = String(name).slice(0, 24);
      payload += '.' + b64urlFromBytes(new TextEncoder().encode(trimmed));
    }
    return payload;
  }

  /** @returns {{version:number, answers:{questionId:number,value:number}[], name:string|null} | null} */
  function decodePayload(payload) {
    try {
      var parts = String(payload).split('.');
      var version = parseInt(parts[0], 10);
      var expected = typeof QUESTIONS_VERSION !== 'undefined' ? QUESTIONS_VERSION : 1;
      if (!version || version !== expected) return null;
      var bytes = bytesFromB64url(parts[1]);
      if (bytes.length !== 15) return null;
      var answers = [];
      var bitPos = 0;
      for (var i = 0; i < ANSWER_COUNT; i++) {
        var v = 0;
        for (var b = 0; b < 3; b++) {
          v = (v << 1) | ((bytes[bitPos >> 3] >> (7 - (bitPos & 7))) & 1);
          bitPos++;
        }
        if (v > 4) return null;
        answers.push({ questionId: i + 1, value: v - 2 });
      }
      var name = null;
      if (parts[2]) {
        name = new TextDecoder().decode(bytesFromB64url(parts[2])).slice(0, 24);
      }
      return { version: version, answers: answers, name: name };
    } catch (e) {
      return null;
    }
  }

  function buildShareUrl(answers, name) {
    return location.origin + '/compatibility/#c=' + encodeAnswers(answers, name);
  }

  function parseShareFragment() {
    var m = location.hash.match(/^#c=(.+)$/);
    return m ? decodePayload(m[1]) : null;
  }

  window.PcCompat = {
    encodeAnswers: encodeAnswers,
    decodePayload: decodePayload,
    buildShareUrl: buildShareUrl,
    parseShareFragment: parseShareFragment,
  };
})();
