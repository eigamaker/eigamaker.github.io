# 質問履歴同期機能の実装計画

**作成日**: 2025年1月  
**目的**: ログイン後の質問出題ロジックとSupabaseとの同期機能の実装

---

## 📋 現状の確認

### アプリ側の実装

**質問数**:
- スターター質問: **40問**（`starter`フラグで管理）
- 質問出題前にSupabaseから`user_question_history`を取得
- 既に回答済みの質問を除外
- 未回答の質問からランダムに出題

**実装ロジック**:
```
1. 診断開始時
   ↓
2. Supabaseからuser_question_historyを取得
   ↓
3. 既に回答済みのquestion_idをリスト化
   ↓
4. スターター質問（40問）から未回答の質問を抽出
   ↓
5. 未回答の質問からランダムに出題
```

---

### ウェブ側の現状

**質問数**:
- 現在: **30問**（`questions.js`にハードコード）
- アプリ側と異なる

**質問出題ロジック**:
- 固定の30問を順番に出題
- 質問履歴の同期機能は未実装
- ログイン後も同じ30問をやり直す形

---

## 🔧 改善提案

### 1. 質問数を40問に増やす（アプリ側と揃える）

**実装方針**:
- `questions.js`に40問の質問を追加
- アプリ側のスターター質問と同じ`question_id`を使用
- 質問IDの整合性を保つ

**確認事項**:
- [ ] アプリ側のスターター質問の`question_id`を確認
- [ ] ウェブ側の`questions.js`に40問を追加
- [ ] 質問IDの整合性を確認

---

### 2. 質問履歴の同期機能を実装

**実装ファイル**: `js/question-history.js`（新規作成）

**実装内容**:
```javascript
/**
 * 質問履歴の同期機能
 * Supabaseから質問履歴を取得し、既に回答済みの質問を除外
 */

// Supabaseから質問履歴を取得
async function getQuestionHistory() {
  try {
    const supabase = getSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, history: [] };
    }
    
    const { data: history, error } = await supabase
      .from('user_question_history')
      .select('question_id')
      .eq('user_id', user.id)
      .eq('is_synced', true);
    
    if (error) {
      console.error('質問履歴の取得エラー:', error);
      return { success: false, history: [] };
    }
    
    const answeredQuestionIds = history.map(h => h.question_id);
    return { success: true, history: answeredQuestionIds };
  } catch (e) {
    console.error('質問履歴取得処理エラー:', e);
    return { success: false, history: [] };
  }
}

// 未回答の質問を取得（スターター質問から）
function getUnansweredStarterQuestions(questions, answeredQuestionIds) {
  // スターター質問（question_id 1-40）を抽出
  const starterQuestions = questions.filter(q => q.id >= 1 && q.id <= 40);
  // 既に回答済みの質問を除外
  return starterQuestions.filter(q => !answeredQuestionIds.includes(q.id));
}

// 質問をランダムに出題（未回答の質問から選択）
function getRandomQuestion(unansweredQuestions) {
  if (unansweredQuestions.length === 0) {
    return null; // すべて回答済み
  }
  const randomIndex = Math.floor(Math.random() * unansweredQuestions.length);
  return unansweredQuestions[randomIndex];
}
```

---

### 3. 診断開始時の質問履歴同期

**実装ファイル**: `test.html`

**実装内容**:
```javascript
// 診断開始時に質問履歴を取得
async function startDiagnosis() {
  // ログイン状態をチェック
  const authStatus = await checkAuthStatus();
  
  if (authStatus.isLoggedIn) {
    // 質問履歴を取得
    const historyResult = await getQuestionHistory();
    
    if (historyResult.success && historyResult.history.length > 0) {
      // 既に回答済みの質問を除外
      const allQuestions = getSharedQuestions();
      const unansweredQuestions = getUnansweredStarterQuestions(
        allQuestions,
        historyResult.history
      );
      
      if (unansweredQuestions.length === 0) {
        // すべて回答済みの場合
        alert('すべての質問に回答済みです。診断をやり直す場合は、アプリから履歴をクリアしてください。');
        return;
      }
      
      // 未回答の質問から出題（ランダム）
      // または、固定の順番で出題
      test.questions = unansweredQuestions;
    } else {
      // 履歴がない場合、スターター質問（40問）をそのまま使用
      const allQuestions = getSharedQuestions();
      test.questions = allQuestions.filter(q => q.id >= 1 && q.id <= 40);
    }
  } else {
    // 未ログインの場合、スターター質問（40問）をそのまま使用
    const allQuestions = getSharedQuestions();
    test.questions = allQuestions.filter(q => q.id >= 1 && q.id <= 40);
  }
  
  // 診断を開始
  test.reset();
  displayQuestion();
}
```

---

### 4. 質問出題方法の選択

**オプションA: ランダム出題（アプリ側と同様）**

**メリット**:
- アプリ側と同様の体験
- 既に回答済みの質問を除外できる

**デメリット**:
- 実装が複雑になる
- 進捗バーの表示が難しくなる

**実装**:
```javascript
// 未回答の質問からランダムに出題
function getNextRandomQuestion() {
  const unansweredQuestions = test.questions.filter(q => {
    return !test.answers.some(a => a.questionId === q.id);
  });
  
  if (unansweredQuestions.length === 0) {
    return null; // すべて回答済み
  }
  
  const randomIndex = Math.floor(Math.random() * unansweredQuestions.length);
  return unansweredQuestions[randomIndex];
}
```

---

**オプションB: 固定順序で出題（既に回答済みの質問はスキップ）**

**メリット**:
- 実装が簡単
- 進捗バーの表示が容易

**デメリット**:
- アプリ側と異なる体験

**実装**:
```javascript
// 固定順序で出題（既に回答済みの質問はスキップ）
function getNextQuestion() {
  for (let i = 0; i < test.questions.length; i++) {
    const question = test.questions[i];
    const isAnswered = test.answers.some(a => a.questionId === question.id);
    
    if (!isAnswered) {
      return question;
    }
  }
  return null; // すべて回答済み
}
```

---

## 📊 実装の優先順位

### 高優先度
1. **質問数を40問に増やす**（アプリ側と整合性を保つため）
2. **保存提案UIのメッセージ変更**（既に実装済み）

### 中優先度
3. **質問履歴の同期機能の実装**（アプリ側と同様の機能）

### 低優先度
4. **ランダム質問出題機能**（アプリ側と同様の機能、オプション）

---

## ✅ 実装チェックリスト

### 質問数の統一
- [ ] アプリ側のスターター質問の`question_id`を確認
- [ ] ウェブ側の`questions.js`に40問を追加
- [ ] 質問IDの整合性を確認

### 質問履歴の同期
- [ ] `js/question-history.js`を作成
- [ ] `getQuestionHistory()`関数を実装
- [ ] `getUnansweredStarterQuestions()`関数を実装
- [ ] 診断開始時に質問履歴を取得する処理を追加

### 質問出題ロジック
- [ ] ログイン済みの場合、未回答の質問から出題
- [ ] 未ログインの場合、スターター質問（40問）をそのまま使用
- [ ] すべて回答済みの場合の処理を実装

---

**作成者**: AI Assistant  
**最終更新**: 2025年1月

