# link.profilecode.codes 実装・修正要望

質問リストの回答と現在の状況に基づく、具体的な実装・修正要望です。

---

## 📊 現在の状況

### 実装状況（2024年更新）

1. **✅ `link.profilecode.codes` 側の実装 - 完了**
   - `link.profilecode.codes/join` の処理を実装済み
   - ディープリンクは正常に動作している
   - パス判定: `path.startsWith("/join")` を使用
   - カスタムスキーム: `com.profilecode.profilecode://` を使用
   - `apple-app-site-association` の `paths` を正しく設定
   - ⚠️ iOSでApp Storeで止まる問題は残っているが、ディープリンク自体は動作

2. **✅ `profilecode.codes` 側の修正 - 完了**
   - ✅ `profilecode.codes/join` → `link.profilecode.codes/join` にリダイレクト
   - ✅ `index.html` から `/join` 処理を削除
   - ✅ `index.html` をランディングページに変更

3. **既知の問題**
   - iOSでアプリがインストールされている場合、App Storeで止まる問題が残っている
   - ただし、ディープリンク自体は正常に動作している
   - この問題は後続の改善で対応予定

---

## 🚨 必須実装・修正項目

### ✅ 実装1: `link.profilecode.codes` の実装 - 完了

**実装状況**:
- ✅ `link.profilecode.codes` の実装完了
- ✅ `/join` 処理を実装（`path.startsWith("/join")` を使用）
- ✅ `apple-app-site-association` ファイルを配置（正しい `paths` 設定）
- ✅ ディープリンクは正常に動作

**実装内容**: 下記の「実装詳細」セクションを参照

**既知の問題**:
- ⚠️ iOSでアプリがインストールされている場合、App Storeで止まる問題が残っている
- ただし、ディープリンク自体は正常に動作している
- この問題は後続の改善で対応予定

**優先度**: ✅ **完了**

---

### ✅ 修正1: パス判定の厳密一致を修正 - 完了

**実装状況**:
- ✅ `path.startsWith("/join")` を使用して実装済み
- ✅ `/join/anything` のようなサブパスも処理可能

**優先度**: ✅ **完了**

---

### ✅ 修正2: iOSのカスタムスキームを正しく実装 - 完了

**実装状況**:
- ✅ `com.profilecode.profilecode://join?token=${token}` を使用して実装済み
- ✅ アプリ側の要件と一致

**優先度**: ✅ **完了**

---

### ✅ 修正3: apple-app-site-associationのpaths設定を正しく実装 - 完了

**実装状況**:
- ✅ `["/join*", "/auth/callback*", "/reset-password*", "/login-callback*"]` を設定済み
- ✅ セキュリティ上の懸念を解消

**優先度**: ✅ **完了**

---

### ✅ 実装2: `profilecode.codes/join` のリダイレクト実装 - 完了

**目的**: 既存の `/join` アクセスを `link.profilecode.codes/join` にリダイレクト

**実装状況**:
- ✅ `profilecode.codes` 側で `join.html` を作成（リダイレクト処理）
- ✅ `index.html` から `/join` 処理を削除
- ✅ `index.html` をランディングページに変更

**実装内容**: 下記の「実装詳細」セクションを参照

**優先度**: ✅ **完了**

---

## ⚠️ 要確認項目（修正後に対応）

### 確認1: apple-app-site-associationのHTTPアクセス確認

**確認項目**:
- HTTPステータス: `200 OK`
- Content-Type: `application/json`
- リダイレクトされていない（301/302ではない）

**確認コマンド**:
```bash
curl -I https://link.profilecode.codes/.well-known/apple-app-site-association
```

**期待される結果**:
```
HTTP/2 200
content-type: application/json
...
```

**対応**: GitHub Pagesを使用している場合、通常は自動的に設定されるが、確認が必要

---

### 確認2: HTTPS/SSL証明書の確認

**確認項目**:
- HTTPSでアクセス可能
- SSL証明書が有効

**確認コマンド**:
```bash
curl -I https://link.profilecode.codes/join
```

**期待される結果**:
```
HTTP/2 200
...
```

**対応**: GitHub Pagesを使用している場合、自動的にHTTPSが有効

---

### 確認3: HTTP→HTTPSリダイレクトの確認

**確認項目**:
- HTTPからHTTPSへのリダイレクトが動作する

**確認コマンド**:
```bash
curl -I http://link.profilecode.codes/join
```

**期待される結果**:
```
HTTP/1.1 301 Moved Permanently
Location: https://link.profilecode.codes/join
...
```

**対応**: GitHub Pagesを使用している場合、通常は自動的にリダイレクトされる

---

### 確認4: レスポンス時間の確認

**確認項目**:
- `/join` ページの読み込み時間が3秒以内

**確認コマンド**:
```bash
time curl -o /dev/null -s -w "%{time_total}\n" https://link.profilecode.codes/join
```

**期待される結果**: 1秒以内（静的HTMLファイルのため）

---

### 確認5: iOS実機テスト

**確認項目**:
1. Safariで `https://link.profilecode.codes/join?token=test123` を開く
2. アプリがインストール済み → アプリが起動するか確認
3. アプリ未インストール → フォールバックページが表示されるか確認

**期待される動作**:
- アプリインストール済み: アプリが起動し、ディープリンクが処理される
- アプリ未インストール: フォールバックページが表示される

---

### 確認6: Android実機テスト

**確認項目**:
1. Chromeで `https://link.profilecode.codes/join?token=test123` を開く
2. アプリがインストール済み → アプリが起動するか確認
3. アプリ未インストール → フォールバックページが表示されるか確認

**期待される動作**:
- アプリインストール済み: アプリが起動し、ディープリンクが処理される
- アプリ未インストール: フォールバックページが表示される

**代替確認方法**:
```bash
adb shell am start -a android.intent.action.VIEW \
  -d "https://link.profilecode.codes/join?token=test123"
```

---

### 確認7: メインドメインの設定確認

**確認項目**:
- `profilecode.codes/join` へのアクセス時の動作

**期待される動作**:
- `link.profilecode.codes/join` にリダイレクトされる
- または404を返す

**対応**: メインドメインのリポジトリまたはサーバー設定を確認する必要がある

---

## 📋 実装・修正チェックリスト

### ✅ 必須実装項目（`link.profilecode.codes`） - 完了

- [x] **実装1**: `link.profilecode.codes` 用のリポジトリ/プロジェクトを作成
- [x] **実装2**: `index.html` を実装（パス判定: `path.startsWith("/join")`）
- [x] **実装3**: カスタムスキーム: `com.profilecode.profilecode://` を使用
- [x] **実装4**: `.well-known/apple-app-site-association` を配置（正しい`paths`）
- [x] **実装5**: `_config.yml` で `.well-known` をインクルード
- [x] **実装6**: デプロイして動作確認
- [x] **実装7**: ディープリンクの動作確認（正常に動作）

**既知の問題**:
- ⚠️ iOSでApp Storeで止まる問題が残っている（後続の改善で対応予定）

### ✅ 必須修正項目（`profilecode.codes`） - 完了

- [x] **修正1**: `join.html` を作成（リダイレクト処理）
- [x] **修正2**: `index.html` から `/join` 処理を削除
- [x] **修正3**: `index.html` をランディングページに変更
- [ ] **修正4**: デプロイして動作確認（デプロイ待ち）

### 確認項目

- [ ] `apple-app-site-association`のHTTPアクセス確認
- [ ] HTTPS/SSL証明書の確認
- [ ] HTTP→HTTPSリダイレクトの確認
- [ ] レスポンス時間の確認
- [ ] iOS実機テスト
- [ ] Android実機テスト
- [ ] メインドメインの設定確認

---

## 🔧 実装手順

### ステップ1: `link.profilecode.codes` の実装（最優先、約1時間）

#### 1-1. リポジトリ/プロジェクトの作成

1. `link.profilecode.codes` 用のリポジトリ/プロジェクトを作成
2. GitHub Pagesまたは静的ホスティングサービスを設定
3. カスタムドメイン `link.profilecode.codes` を設定

#### 1-2. `index.html` の実装

`index.html` を作成し、以下のコードを実装：

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Opening Profilecode...</title>
    <script>
        (function() {
            const path = window.location.pathname;
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get("token");
            
            // apple-app-site-associationファイルへのアクセスは特別処理をスキップ
            if (path === '/.well-known/apple-app-site-association') {
                return;
            }
            
            // /joinで始まるパスを処理（path.startsWith("/join")を使用）
            if (path.startsWith("/join") && token) {
                const isAndroid = /Android/i.test(navigator.userAgent);
                const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
                
                const playStoreLink = 'https://play.google.com/store/apps/details?id=com.profilecode.profilecode';
                const appStoreLink = 'https://apps.apple.com/app/YOUR_APP_ID';
                
                if (isAndroid) {
                    // Android Intentスキーム
                    window.location.href = `intent://join?token=${token}#Intent;scheme=https;package=com.profilecode.profilecode;S.browser_fallback_url=${encodeURIComponent(playStoreLink)};end`;
                } else if (isIOS) {
                    // iOS Universal Links → カスタムスキーム → App Store
                    const universalLink = `https://link.profilecode.codes/join?token=${token}`;
                    // カスタムスキームは com.profilecode.profilecode:// を使用
                    const customScheme = `com.profilecode.profilecode://join?token=${token}`;
                    
                    let appLaunched = false;
                    let customSchemeTimeout;
                    let appStoreTimeout;
                    
                    // アプリが起動したことを検知する関数
                    function detectAppLaunch() {
                        appLaunched = true;
                        // タイマーをクリア
                        if (customSchemeTimeout) {
                            clearTimeout(customSchemeTimeout);
                        }
                        if (appStoreTimeout) {
                            clearTimeout(appStoreTimeout);
                        }
                    }
                    
                    // ページが非表示になったらアプリが起動したと判断
                    document.addEventListener('visibilitychange', function() {
                        if (document.hidden) {
                            detectAppLaunch();
                        }
                    });
                    
                    // ページがアンロードされる前にアプリが起動したと判断
                    window.addEventListener('pagehide', function() {
                        detectAppLaunch();
                    });
                    
                    // ウィンドウがフォーカスを失ったらアプリが起動したと判断
                    window.addEventListener('blur', function() {
                        detectAppLaunch();
                    });
                    
                    // まずUniversal Linksを試す
                    window.location.href = universalLink;
                    
                    // 3秒後にアプリが起動していなければカスタムURLスキームを試す
                    customSchemeTimeout = setTimeout(function() {
                        if (!appLaunched) {
                            window.location.href = customScheme;
                            
                            // さらに3秒後にアプリが起動していなければApp Storeに遷移
                            appStoreTimeout = setTimeout(function() {
                                if (!appLaunched) {
                                    window.location.href = appStoreLink;
                                }
                            }, 3000);
                        }
                    }, 3000);
                } else {
                    // その他のデバイス
                    window.location.href = playStoreLink;
                }
            }
        })();
    </script>
</head>
<body>
    <p>アプリを開いています...</p>
</body>
</html>
```

**重要なポイント**:
- ✅ パス判定: `path.startsWith("/join")` を使用
- ✅ カスタムスキーム: `com.profilecode.profilecode://` を使用

#### 1-3. `.well-known/apple-app-site-association` の配置

`.well-known/apple-app-site-association` ファイルを作成：

```json
{
    "applinks": {
        "apps": [],
        "details": [
            {
                "appID": "J4SJR8W4AS.com.profilecode.profilecode",
                "paths": [
                    "/join*",
                    "/auth/callback*",
                    "/reset-password*",
                    "/login-callback*"
                ]
            }
        ]
    }
}
```

#### 1-4. `_config.yml` の設定（GitHub Pages使用時）

```yaml
include:
  - .well-known
```

#### 1-5. デプロイと動作確認

1. 変更をデプロイ
2. `https://link.profilecode.codes/join?token=test123` で動作確認
3. 実機テストでアプリが起動することを確認

---

### ステップ2: `profilecode.codes/join` のリダイレクト実装（約30分）

#### 2-1. `join.html` の作成

`profilecode.codes` 側で `join.html` を作成：

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redirecting...</title>
    <script>
        // /joinへのアクセスをlink.profilecode.codesにリダイレクト
        window.onload = function() {
            const currentUrl = new URL(window.location.href);
            const queryString = currentUrl.search;
            const hash = currentUrl.hash;
            
            // link.profilecode.codes/joinにリダイレクト（クエリパラメータとハッシュを保持）
            window.location.href = `https://link.profilecode.codes/join${queryString}${hash}`;
        };
    </script>
</head>
<body>
    <p>アプリを開いています...</p>
</body>
</html>
```

#### 2-2. `index.html` から `/join` 処理を削除

`profilecode.codes` 側の `index.html` から以下のコードを削除：

```javascript
// 削除対象
if (path === "/join" && token) {
    // Sharelinkの場合
    window.location.href = `intent://join?token=${token}...`;
}
```

#### 2-3. `index.html` をランディングページに変更

`index.html` をランディングページのコンテンツに変更（アプリ紹介、ダウンロードリンクなど）

#### 2-4. デプロイと動作確認

1. 変更をデプロイ
2. `https://profilecode.codes/join?token=test123` が `link.profilecode.codes/join?token=test123` にリダイレクトされることを確認
3. `https://profilecode.codes/` がランディングページとして表示されることを確認

---

### ステップ3: 動作確認（約30分）

1. `link.profilecode.codes/join?token=test123` でアプリが起動することを確認
2. `profilecode.codes/join?token=test123` が正しくリダイレクトされることを確認
3. 実機テストで動作確認
4. HTTPアクセスで各種設定を確認

---

## 📊 実装前後の比較

### 実装前

| 項目 | 状態 | 問題 |
|------|------|------|
| `link.profilecode.codes` | ❌ | 未実装 |
| `profilecode.codes/join` | ⚠️ | メインドメインで処理（混在） |
| パス判定 | ❌ | 厳密一致のみ（`path === "/join"`） |
| カスタムスキーム | ❌ | `profilecode://`（誤り） |
| paths設定 | ⚠️ | 全パス許可（`["*"]`） |

### 実装後

| 項目 | 状態 | 改善 |
|------|------|------|
| `link.profilecode.codes` | ✅ | 実装済み |
| `profilecode.codes/join` | ✅ | リダイレクト（役割分離） |
| パス判定 | ✅ | サブパスも対応（`path.startsWith("/join")`） |
| カスタムスキーム | ✅ | `com.profilecode.profilecode://`（正しい） |
| paths設定 | ✅ | 特定パスのみ許可 |

---

## 🎯 期待される結果

実装完了後、以下の動作が期待されます：

1. ✅ `link.profilecode.codes/join?token=TOKEN` でアプリが起動する
2. ✅ `link.profilecode.codes/join/anything?token=TOKEN` でもアプリが起動する
3. ✅ `profilecode.codes/join?token=TOKEN` が `link.profilecode.codes/join?token=TOKEN` にリダイレクトされる
4. ✅ `profilecode.codes/` がランディングページとして表示される
5. ✅ アプリ未インストール時、カスタムスキームが正しく試行される
6. ✅ `apple-app-site-association`が正しく配信される
7. ✅ セキュリティが向上する（特定パスのみ許可）
8. ✅ 役割が明確に分離される（メインドメイン = マーケティング、サブドメイン = ディープリンク）

---

## ⚠️ 注意事項

### 実装時の注意点

1. **パス判定**: `path.startsWith("/join")` を使用（厳密一致ではない）
2. **カスタムスキーム**: `com.profilecode.profilecode://` を使用（`profilecode://` ではない）
3. **apple-app-site-association**: 正しい `paths` を設定（`["*"]` ではない）
4. **リダイレクト**: クエリパラメータとハッシュを保持する

### デプロイ後の確認

1. `link.profilecode.codes/join?token=test123` でアプリが起動することを確認
2. `profilecode.codes/join?token=test123` が正しくリダイレクトされることを確認
3. 実機テストでアプリが正しく起動することを確認
4. HTTPアクセスで各種設定を確認

---

## 📝 実装完了報告フォーマット

### ✅ `link.profilecode.codes` 側の実装 - 完了

```
実装完了日時: 2024年（完了済み）
実装者: [名前]

必須実装項目（link.profilecode.codes）:
- [x] リポジトリ/プロジェクトの作成
- [x] index.htmlの実装
- [x] apple-app-site-associationの配置
- [x] デプロイと動作確認
- [x] ディープリンクの動作確認（正常に動作）

既知の問題:
- ⚠️ iOSでApp Storeで止まる問題が残っている（後続の改善で対応予定）
```

### ✅ `profilecode.codes` 側の修正 - 完了

実装完了報告：

```
実装完了日時: 2024年（実装完了）
実装者: profilecode開発チーム

必須修正項目（profilecode.codes）:
- [x] join.htmlの作成
- [x] index.htmlから/join処理を削除
- [x] index.htmlをランディングページに変更
- [ ] デプロイと動作確認（デプロイ待ち）

確認項目（デプロイ後）:
- [ ] profilecode.codes/joinがlink.profilecode.codes/joinにリダイレクトされる
- [ ] profilecode.codes/がランディングページとして表示される
- [ ] 既存の機能（/test, /privacy-policy.html, /eula.htmlなど）が正常に動作する
- [ ] link.profilecode.codes/joinでアプリが起動する（再確認）

実装内容:
- join.html: link.profilecode.codes/joinへのリダイレクト処理を実装
- index.html: /join処理を削除し、ランディングページに変更
- ランディングページ: アプリ紹介、ダウンロードリンク、ウェブ診断への導線を追加
```

**詳細な実装ガイド**: `profilecode_codes_migration_guide.md` を参照してください。

---

## 🔗 参考情報

- アプリ側の実装: `lib/deep_link/deep_link_handler.dart`
- iOS設定: `ios/Runner/Info.plist`, `apple-app-site-association`
- Android設定: `android/app/src/main/AndroidManifest.xml`
- 実装計画: `docs/link_profilecode_implementation_plan.md`
- 詳細な確認チェックリスト: `docs/link_profilecode_verification_checklist.md`
- 質問リスト: `docs/link_profilecode_verification_questions.md`

---

---

## 📱 iOS アプリ起動後のストア遷移問題（追加修正）

### 問題の症状

iOSでアプリがインストールされている場合、アプリが起動するがすぐにストアに遷移してしまう問題が報告されています。

**症状**:
- ✅ Android: 正常動作（アプリ起動 or ストア遷移）
- ✅ iOS（アプリ未インストール）: 正常動作（ストア遷移）
- ❌ iOS（アプリインストール済み）: アプリが起動するが、すぐにストアに遷移してしまう

### 原因

**アプリ側は問題ありません**。問題は `link.profilecode.codes` 側の実装にあります。

現在の実装では、Universal Linksでアプリが起動しても、JavaScriptのタイマーが動作し続けるため、3秒後にカスタムスキームを試行し、さらに3秒後にApp Storeに遷移してしまいます。

### 解決策

アプリが起動したことを検知し、タイマーをクリアする必要があります。上記の `index.html` の修正コードには、以下のアプリ起動検知機能が含まれています：

1. **`visibilitychange`イベント**: ページが非表示になったらアプリが起動したと判断
2. **`pagehide`イベント**: ページがアンロードされる前にアプリが起動したと判断
3. **`blur`イベント**: ウィンドウがフォーカスを失ったらアプリが起動したと判断

これらのイベントでアプリ起動を検知し、タイマーをクリアすることで、ストアへの遷移を防ぎます。

詳細は `docs/link_profilecode_ios_fix.md` を参照してください。

---

**最終更新**: 2024年（profilecode.codes側の修正完了）
**作成者**: profilecode開発チーム
**実装状況**: 
- ✅ link.profilecode.codes側の実装 - 完了
- ✅ profilecode.codes側の修正 - 完了（デプロイ待ち）

