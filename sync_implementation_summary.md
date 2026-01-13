# 解答履歴同期機能の実装サマリー

**作成日**: 2025年1月  
**目的**: ログイン時にSupabaseから解答履歴をブラウザに同期する機能の実装

---

## ✅ 実装完了項目

### 1. Supabaseから解答履歴を同期する機能

**実装ファイル**: `js/sync-from-supabase.js`（新規作成）

**実装内容**:
- `syncAnswersFromSupabase()` - Supabaseから解答履歴を取得してLocalStorageに保存
- `getQuestionHistoryFromSupabase()` - Supabaseから質問履歴を取得

**機能**:
1. ログイン状態をチェック
2. 最新の`external_response_id`を取得
3. 最新の診断結果の回答を取得
4. 回答値を変換（1～5 → -2～2）
5. LocalStorageに保存

---

### 2. ログイン時の自動同期

**実装ファイル**: `js/auth.js`

**実装内容**:
- `loginWithEmail()`関数内で、ログイン成功後に`syncAnswersFromSupabase()`を呼び出し

**フロー**:
```
ログイン成功
  ↓
セッション管理（LocalStorageに保存）
  ↓
Supabaseから解答履歴を同期
  ↓
LocalStorageに保存
```

---

### 3. ページ読み込み時の自動同期

**実装ファイル**: `test.html`

**実装内容**:
- `initializeTest()`関数を追加
- ページ読み込み時にログイン状態をチェック
- ログイン済みの場合、Supabaseから解答履歴を同期

**フロー**:
```
ページ読み込み
  ↓
ログイン状態をチェック
  ↓
ログイン済みの場合、Supabaseから解答履歴を同期
  ↓
LocalStorageから解答を読み込み
  ↓
診断画面を表示
```

---

## 📊 データフロー

### ログイン時のフロー

```
ユーザーがログイン
  ↓
Supabase Authでログイン
  ↓
セッション管理（LocalStorageに保存）
  ↓
Supabaseから解答履歴を取得
  - responsesテーブルから最新の診断結果を取得
  - 回答値を変換（1～5 → -2～2）
  ↓
LocalStorageに保存（personalityTestAnswers）
  ↓
testオブジェクトを更新
  ↓
診断画面を表示（既に回答済みの質問はスキップ）
```

---

### ページ読み込み時のフロー

```
ページ読み込み
  ↓
ログイン状態をチェック
  ↓
ログイン済みの場合
  ↓
Supabaseから解答履歴を取得
  - responsesテーブルから最新の診断結果を取得
  - 回答値を変換（1～5 → -2～2）
  ↓
LocalStorageに保存（personalityTestAnswers）
  ↓
LocalStorageから解答を読み込み
  ↓
診断画面を表示（既に回答済みの質問はスキップ）
```

---

## 🔧 実装詳細

### 1. `syncAnswersFromSupabase()`関数

**機能**:
- Supabaseから最新の診断結果を取得
- 回答値を変換（1～5 → -2～2）
- LocalStorageに保存

**実装コード**:
```javascript
async function syncAnswersFromSupabase() {
  // 1. ログイン状態をチェック
  // 2. 最新のexternal_response_idを取得
  // 3. 最新の診断結果の回答を取得
  // 4. 回答値を変換（1～5 → -2～2）
  // 5. LocalStorageに保存
}
```

---

### 2. `getQuestionHistoryFromSupabase()`関数

**機能**:
- Supabaseから質問履歴を取得
- 既に回答済みの質問IDのリストを返す

**実装コード**:
```javascript
async function getQuestionHistoryFromSupabase() {
  // 1. ログイン状態をチェック
  // 2. user_question_historyから質問履歴を取得
  // 3. 回答済みの質問IDのリストを返す
}
```

---

## ✅ 確認事項

### 実装済み
- [x] Supabaseから解答履歴を取得する機能
- [x] 回答値の変換（1～5 → -2～2）
- [x] LocalStorageへの保存
- [x] ログイン時の自動同期
- [x] ページ読み込み時の自動同期

### 今後の実装（オプション）
- [ ] 質問履歴を取得して、既に回答済みの質問を除外する機能
- [ ] 質問数を40問に増やす（アプリ側と揃える）

---

## 📝 注意事項

### 1. 回答値の変換

**変換式**:
```javascript
// Supabaseから取得: 1～5
// LocalStorageに保存: -2～2
const webValue = supabaseValue - 3;
```

**変換表**:
| Supabase | LocalStorage |
|----------|--------------|
| 1 | -2 |
| 2 | -1 |
| 3 | 0 |
| 4 | 1 |
| 5 | 2 |

---

### 2. データの優先順位

**優先順位**:
1. Supabaseから取得した解答履歴（最新）
2. LocalStorageの解答履歴（古い）

**理由**:
- Supabaseは複数デバイスで同期されるため、最新のデータが保存されている
- LocalStorageはブラウザ固有のため、古いデータが残っている可能性がある

---

## 🔄 次のステップ

### 1. 質問数を40問に増やす（アプリ側と揃える）

**実装方針**:
- `questions.js`に40問の質問を追加
- アプリ側のスターター質問と同じ`question_id`を使用

---

### 2. 質問履歴を取得して、既に回答済みの質問を除外

**実装方針**:
- `getQuestionHistoryFromSupabase()`を使用
- 診断開始時に質問履歴を取得
- 既に回答済みの質問を除外して出題

---

**作成者**: AI Assistant  
**最終更新**: 2025年1月

