# メールアドレス登録までの流れと診断結果のSupabase連携

**作成日**: 2025年1月  
**目的**: ユーザーフローの説明と診断結果のSupabase連携の仕組み

---

## 📋 メールアドレス登録までの流れ

### ステップ1: 匿名診断（ログイン不要）

```
1. ユーザーが診断を開始
   ↓
2. 質問に回答（30問）
   ↓
3. 各質問の回答はLocalStorageに保存
   - 保存先: `localStorage.getItem('personalityTestAnswers')`
   - 形式: JSON配列 `[{questionId: 1, value: 2}, ...]`
   ↓
4. 診断完了（30問すべて回答）
   ↓
5. 診断結果を計算（クライアントサイド）
   - Profilecode、MBTI、16PF、DISCの結果を計算
   ↓
6. 診断結果を画面に表示
```

**重要なポイント**:
- ⚠️ **診断途中の質問回答はLocalStorageのみに保存**
- ⚠️ **診断途中ではSupabaseに保存されない**
- ✅ 診断完了後、診断結果が表示される

---

### ステップ2: 保存提案UIの表示

```
診断結果表示後
   ↓
保存提案UIが自動的に表示される
   ↓
「診断結果を保存しますか？」
   - 「結果を保存する」ボタン
   - 「ログイン」ボタン
   - 「今はしない」ボタン
```

**表示内容**:
- 未ログインの場合: 保存提案UIを表示
- ログイン済みの場合: 自動的にSupabaseに保存を試みる

---

### ステップ3: メールアドレス登録

```
ユーザーが「結果を保存する」をクリック
   ↓
メールアドレス登録モーダルが表示される
   ↓
メールアドレスとパスワードを入力
   ↓
「登録」ボタンをクリック
   ↓
1. Supabase Authでアカウント作成
   ↓
2. usersテーブルにユーザー情報を保存
   ↓
3. LocalStorageからSupabaseへのデータ移行
   - `migrateLocalStorageToSupabase()`関数を実行
   - LocalStorageの`personalityTestAnswers`を取得
   - `responses`テーブルに回答を保存（回答値の変換: -2～2 → 1～5）
   - `response_scores`テーブルにスコアを保存
   - `user_question_history`テーブルに履歴を保存
   ↓
4. 診断結果をSupabaseに保存
   - `saveDiagnosisResultsToSupabase()`関数を実行
   ↓
5. 保存完了メッセージを表示
```

**重要なポイント**:
- ✅ **メールアドレス登録時に、既存のLocalStorageデータがSupabaseに移行される**
- ✅ **診断完了時の診断結果もSupabaseに保存される**

---

## 🔍 診断の質問回答結果のSupabase連携

### 現在の実装状況

#### ❌ 診断途中の質問回答はSupabaseに連携されない

**理由**:
- ウェブ側は診断完了時の一括保存方式を採用
- アプリ側はリアルタイム同期（質問回答時に即座にSupabaseに保存）
- ウェブ側は診断途中ではLocalStorageのみに保存

**実装コード**:
```javascript
// js/personality-test.js
saveAnswer(value) {
  const question = this.getCurrentQuestion();
  this.answers.push({
    questionId: question.id,
    value: value
  });
  
  // LocalStorageに保存（Supabaseには保存しない）
  localStorage.setItem('personalityTestAnswers', JSON.stringify(this.answers));
}
```

---

#### ✅ 診断完了時にSupabaseに連携される

**タイミング**:
1. **ログイン済みの場合**: 診断完了時に自動的にSupabaseに保存
2. **未ログインの場合**: メールアドレス登録時にSupabaseに移行

**実装コード**:
```javascript
// test.html - showResults()関数
async function showResults() {
  // ... 診断結果の計算と表示
  
  // ログイン状態をチェックして保存提案UIを表示
  await showSaveOption(results);
}

// test.html - showSaveOption()関数
async function showSaveOption(results) {
  const authStatus = await checkAuthStatus();
  
  if (authStatus.isLoggedIn) {
    // ログイン済みの場合、自動保存を試みる
    const saveResult = await saveDiagnosisResultsToSupabase(
      results,
      test.answers,
      test.questions
    );
  } else {
    // 未ログインの場合、保存提案を表示
    // 「結果を保存する」ボタンを表示
  }
}
```

---

### アプリ側との違い

| 項目 | アプリ側 | ウェブ側 |
|------|---------|---------|
| **診断途中の保存** | ✅ リアルタイム同期（質問回答時に即座にSupabaseに保存） | ❌ LocalStorageのみ（Supabaseには保存しない） |
| **診断完了時の保存** | ✅ 自動的にSupabaseに保存 | ✅ ログイン済みの場合、自動的にSupabaseに保存 |
| **未ログイン時の保存** | ✅ 匿名アカウントでSupabaseに保存 | ❌ LocalStorageのみ（メールアドレス登録時に移行） |

---

## 🔐 ログインしたら何ができるようになるか

### ログイン済みユーザーの機能

#### 1. 診断結果の自動保存 ✅

**機能**:
- 診断完了時に自動的にSupabaseに保存される
- 保存先テーブル:
  - `responses` - 回答データ
  - `response_scores` - 診断スコア
  - `user_question_history` - 質問履歴

**実装**:
```javascript
// ログイン済みの場合、診断完了時に自動保存
if (authStatus.isLoggedIn) {
  const saveResult = await saveDiagnosisResultsToSupabase(
    results,
    test.answers,
    test.questions
  );
}
```

---

#### 2. 複数デバイスでのアクセス ✅

**機能**:
- 同じメールアドレスでログインすると、すべてのデバイスで診断結果にアクセス可能
- アプリとウェブで同じアカウントを使用可能

**実装**:
- Supabaseの`user_id`でデータを紐付け
- 同じメールアドレス = 同じ`user_id` = 同じデータにアクセス可能

---

#### 3. 診断履歴の保存 ✅

**機能**:
- `user_question_history`テーブルに質問履歴を保存
- アプリ側と同様に、既に回答済みの質問を除外できる（将来的な実装）

**実装**:
```javascript
// user_question_historyテーブルに保存
const historyInserts = answers.map((answer, index) => ({
  user_id: user.id,
  question_id: answer.questionId,
  local_id: index + 1,
  is_synced: true,
  created_at: now
}));
```

---

#### 4. 診断結果の永続化 ✅

**機能**:
- 診断結果がSupabaseに保存されるため、ブラウザのLocalStorageをクリアしてもデータが残る
- アプリとウェブで同じ診断結果にアクセス可能

---

### 未ログイン時の機能

#### 1. 診断の実行 ✅

**機能**:
- ログインなしで診断可能
- 質問に回答して診断結果を表示

---

#### 2. LocalStorageへの保存 ✅

**機能**:
- 診断結果はLocalStorageに保存される
- ブラウザのLocalStorageをクリアするとデータが消える

---

#### 3. Supabaseへの保存 ❌

**機能**:
- Supabaseには保存されない
- メールアドレス登録時に移行可能

---

## 📊 データフロー図

### 未ログイン時のフロー

```
【診断中】
質問に回答
  ↓
LocalStorageに保存（personalityTestAnswers）
  ↓
【診断完了】
診断結果を計算
  ↓
診断結果を表示
  ↓
保存提案UIを表示
  ↓
【メールアドレス登録】
「結果を保存する」をクリック
  ↓
メールアドレスとパスワードを入力
  ↓
Supabase Authでアカウント作成
  ↓
LocalStorageからSupabaseへのデータ移行
  - responsesテーブルに回答を保存
  - response_scoresテーブルにスコアを保存
  - user_question_historyテーブルに履歴を保存
  ↓
保存完了メッセージを表示
```

---

### ログイン済み時のフロー

```
【診断中】
質問に回答
  ↓
LocalStorageに保存（personalityTestAnswers）
  ↓
【診断完了】
診断結果を計算
  ↓
診断結果を表示
  ↓
ログイン状態をチェック
  ↓
自動的にSupabaseに保存
  - responsesテーブルに回答を保存
  - response_scoresテーブルにスコアを保存
  - user_question_historyテーブルに履歴を保存
  ↓
保存完了メッセージを表示
```

---

## ⚠️ 重要な注意事項

### 1. 診断途中の質問回答はSupabaseに保存されない

**現状**:
- 診断途中の質問回答はLocalStorageのみに保存
- 診断完了時にSupabaseに保存される

**影響**:
- 診断途中でブラウザを閉じた場合、LocalStorageのデータは残るが、Supabaseには保存されない
- メールアドレス登録時に、LocalStorageのデータがSupabaseに移行される

---

### 2. アプリ側との違い

**アプリ側**:
- 質問回答時にリアルタイム同期（即座にSupabaseに保存）
- 診断途中でもSupabaseに保存される

**ウェブ側**:
- 診断完了時の一括保存
- 診断途中ではSupabaseに保存されない

**推奨対応**:
- 現時点では診断完了時の一括保存で問題ない
- 将来的にリアルタイム同期を実装する場合は、アプリ側と同じロジックを使用

---

## 🔄 改善提案（オプション）

### 1. 診断途中のリアルタイム同期（将来的な実装）

**実装方針**:
```javascript
// js/personality-test.js の改善案
saveAnswer(value) {
  const question = this.getCurrentQuestion();
  this.answers.push({
    questionId: question.id,
    value: value
  });
  
  // LocalStorageに保存
  localStorage.setItem('personalityTestAnswers', JSON.stringify(this.answers));
  
  // ログイン済みの場合、リアルタイム同期
  if (typeof checkAuthStatus === 'function') {
    checkAuthStatus().then(authStatus => {
      if (authStatus.isLoggedIn) {
        // 質問回答をSupabaseに保存
        saveAnswerToSupabase(question.id, value);
      }
    });
  }
}
```

**メリット**:
- アプリ側と同様に、診断途中でもSupabaseに保存される
- データの整合性が向上

**デメリット**:
- ネットワークリクエストが増える
- 実装が複雑になる

---

## ✅ まとめ

### メールアドレス登録までの流れ

1. **匿名診断**（ログイン不要）
   - 質問に回答（LocalStorageに保存）
   - 診断結果を表示

2. **保存提案UIの表示**
   - 「結果を保存する」ボタンを表示

3. **メールアドレス登録**
   - メールアドレスとパスワードを入力
   - アカウント作成
   - LocalStorageからSupabaseへのデータ移行
   - 診断結果をSupabaseに保存

---

### 診断の質問回答結果のSupabase連携

**現状**:
- ❌ **診断途中の質問回答はSupabaseに連携されない**（LocalStorageのみ）
- ✅ **診断完了時にSupabaseに連携される**（ログイン済みの場合、またはメールアドレス登録時）

---

### ログインしたら何ができるようになるか

1. ✅ **診断結果の自動保存**（診断完了時に自動的にSupabaseに保存）
2. ✅ **複数デバイスでのアクセス**（同じメールアドレスでログインすると、すべてのデバイスでアクセス可能）
3. ✅ **診断履歴の保存**（`user_question_history`テーブルに保存）
4. ✅ **診断結果の永続化**（ブラウザのLocalStorageをクリアしてもデータが残る）

---

**作成者**: AI Assistant  
**最終更新**: 2025年1月

