# profilecode.codes 側の修正ガイド

`link.profilecode.codes` 側の実装が完了したため、次のステップとして `profilecode.codes` 側の修正を行います。

---

## 📊 現在の状況

### ✅ 完了した作業

1. **`link.profilecode.codes` 側の実装**
   - `link.profilecode.codes/join` の処理を実装済み
   - ディープリンクは正常に動作している
   - パス判定: `path.startsWith("/join")` を使用
   - カスタムスキーム: `com.profilecode.profilecode://` を使用
   - `apple-app-site-association` の `paths` を正しく設定

### ✅ 完了した作業

2. **`profilecode.codes` 側の修正 - 完了**
   - ✅ `profilecode.codes/join` を `link.profilecode.codes/join` にリダイレクト
   - ✅ `index.html` から `/join` 処理を削除
   - ✅ `index.html` をランディングページに変更

---

## 🎯 実装目標

### 最終的な構成

```
profilecode.codes/
├── /                          # ランディングページ（メイン）
├── /join                       # link.profilecode.codes/join にリダイレクト
├── /test                       # ウェブ診断の入り口
├── /privacy-policy.html        # プライバシーポリシー（既存）
└── /eula.html                  # 利用規約（既存）

link.profilecode.codes/
└── /join?token=...             # ディープリンク処理専用（実装済み）
```

---

## 📋 実装手順

### ステップ1: `join.html` の作成

`profilecode.codes` 側で `join.html` を作成し、`link.profilecode.codes/join` にリダイレクトします。

**ファイル**: `profilecode.codes` リポジトリの `join.html`

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redirecting...</title>
    <script>
        // /joinへのアクセスをlink.profilecode.codesにリダイレクト
        (function() {
            const currentUrl = new URL(window.location.href);
            const queryString = currentUrl.search;
            const hash = currentUrl.hash;
            
            // link.profilecode.codes/joinにリダイレクト（クエリパラメータとハッシュを保持）
            window.location.href = `https://link.profilecode.codes/join${queryString}${hash}`;
        })();
    </script>
</head>
<body>
    <p>アプリを開いています...</p>
</body>
</html>
```

**重要なポイント**:
- クエリパラメータ（`?token=xxx`）を保持
- ハッシュ（`#xxx`）を保持
- 即座にリダイレクト（`window.onload`を待たない）

---

### ステップ2: `_config.yml` の設定（GitHub Pages使用時）

`profilecode.codes` 側の `_config.yml` に以下を追加（オプション）:

```yaml
redirect_from:
  - /join
  - /join/
```

または、`join.html` を配置することで、自動的に `/join` でアクセス可能になります。

---

### ステップ3: `index.html` から `/join` 処理を削除

`profilecode.codes` 側の `index.html` から以下のコードを削除します：

**削除対象**:
```javascript
// 削除するコード
if (path === "/join" && token) {
    // Sharelinkの場合
    window.location.href = `intent://join?token=${token}...`;
}
```

または、`path.startsWith("/join")` を使用している場合は：

```javascript
// 削除するコード
if (path.startsWith("/join") && token) {
    // Sharelinkの場合
    window.location.href = `intent://join?token=${token}...`;
}
```

**確認方法**:
- `index.html` 内で `/join` を検索
- ディープリンク処理に関連するコードをすべて削除

---

### ステップ4: `index.html` をランディングページに変更

`profilecode.codes` 側の `index.html` をランディングページのコンテンツに変更します。

**実装内容**:
- アプリ紹介
- アプリダウンロードリンク（App Store / Google Play Store）
- ウェブ診断への導線
- その他のマーケティングコンテンツ

**例**:
```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profilecode - あなたのプロフィールを診断</title>
    <!-- その他のメタタグ -->
</head>
<body>
    <h1>Profilecode</h1>
    <p>あなたのプロフィールを診断します</p>
    
    <!-- アプリダウンロードリンク -->
    <a href="https://apps.apple.com/app/id6747016000">App Storeでダウンロード</a>
    <a href="https://play.google.com/store/apps/details?id=com.profilecode.profilecode">Google Playでダウンロード</a>
    
    <!-- ウェブ診断への導線 -->
    <a href="/test">ウェブ診断を始める</a>
    
    <!-- その他のコンテンツ -->
</body>
</html>
```

---

## ✅ 実装チェックリスト

### ✅ `profilecode.codes` 側の修正 - 完了

- [x] **ステップ1**: `join.html` を作成（リダイレクト処理）
- [x] **ステップ2**: `_config.yml` で `redirect_from: /join` を設定（既存設定を維持）
- [x] **ステップ3**: `index.html` から `/join` 処理を削除
- [x] **ステップ4**: `index.html` をランディングページに変更
- [ ] **ステップ5**: デプロイして動作確認（デプロイ待ち）

---

## 🧪 動作確認

### 確認項目

1. **リダイレクトの確認**
   ```bash
   curl -I https://profilecode.codes/join?token=test123
   ```
   - 期待される結果: `Location: https://link.profilecode.codes/join?token=test123`

2. **ブラウザでの確認**
   - `https://profilecode.codes/join?token=test123` にアクセス
   - `https://link.profilecode.codes/join?token=test123` にリダイレクトされることを確認

3. **ランディングページの確認**
   - `https://profilecode.codes/` にアクセス
   - ランディングページが表示されることを確認

4. **ディープリンクの確認**
   - `https://link.profilecode.codes/join?token=test123` でアプリが起動することを確認

---

## ⚠️ 注意事項

### 実装時の注意点

1. **クエリパラメータの保持**: `join.html` でクエリパラメータとハッシュを必ず保持する
2. **即座にリダイレクト**: `window.onload` を待たずに即座にリダイレクトする
3. **既存の処理を削除**: `index.html` から `/join` 処理を完全に削除する

### デプロイ後の確認

1. `profilecode.codes/join?token=test123` が正しくリダイレクトされることを確認
2. `profilecode.codes/` がランディングページとして表示されることを確認
3. 既存の機能（`/test`, `/privacy-policy.html`, `/eula.html` など）が正常に動作することを確認

---

## 📝 実装完了報告フォーマット

実装完了報告：

```
実装完了日時: 2024年（実装完了）
実装者: profilecode開発チーム

必須修正項目（profilecode.codes）:
- [x] join.htmlの作成
- [x] index.htmlから/join処理を削除
- [x] index.htmlをランディングページに変更
- [ ] デプロイと動作確認（デプロイ待ち）

動作確認（デプロイ後）:
- [ ] profilecode.codes/joinがリダイレクトされる
- [ ] profilecode.codes/がランディングページとして表示される
- [ ] 既存の機能が正常に動作する

実装内容:
- join.html: link.profilecode.codes/joinへのリダイレクト処理を実装
- index.html: /join処理を削除し、ランディングページに変更
- ランディングページ: アプリ紹介、ダウンロードリンク、ウェブ診断への導線を追加
```

---

## 🔗 参考情報

- `link.profilecode.codes` の実装: 完了済み
- 実装計画: `link_profilecode_implementation_plan.md`
- 修正要望: `link_profilecode_fix_requirements_final.md`

---

**最終更新**: 2024年（実装完了）
**作成者**: profilecode開発チーム
**実装状況**: 
- ✅ join.htmlの作成 - 完了
- ✅ index.htmlの修正 - 完了
- ✅ ランディングページ化 - 完了
- ⏳ デプロイと動作確認 - デプロイ待ち

