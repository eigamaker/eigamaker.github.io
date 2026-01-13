# ウェブ側実装の改善提案

**作成日**: 2025年1月  
**目的**: ユーザーフィードバックに基づく改善提案

---

## 📋 改善項目

### 1. LocalStorageについての説明

**質問**: LocalStorageはキャッシュなのか？

**回答**:
- ❌ **LocalStorageはキャッシュではありません**
- ✅ **LocalStorageはブラウザのストレージ機能**（データを永続的に保存）
- キャッシュとは異なり、明示的に削除しない限りデータが残る
- ブラウザを閉じてもデータは残る
- ただし、ブラウザの設定でLocalStorageをクリアするとデータが消える

**説明**:
```
LocalStorage（ローカルストレージ）
├── ブラウザのストレージ機能
├── データを永続的に保存（ブラウザを閉じても残る）
├── 容量制限: 通常5-10MB
└── 削除方法: ブラウザの設定でクリア、またはJavaScriptで削除

キャッシュ
├── 一時的なデータ保存
├── 自動的に削除される可能性がある
└── 主にパフォーマンス向上のため
```

---

### 2. ステップ2のメッセージ変更

**現状のメッセージ**:
```
「診断結果を保存しますか？」
「メールアドレスを登録すると、診断結果をSupabaseに保存し、
複数のデバイスでアクセスできるようになります。」
```

**改善提案**:
```
「AIで診断したいなら、アカウントを作成してアプリからログインすると
AIで診断できるよ。」
```

**実装方針**:
- 保存提案UIのメッセージを変更
- アプリへの誘導を明確にする

---

### 3. ログイン後の質問の扱い

**現状の実装**:
- 質問は固定の30問（`questions.js`にハードコード）
- 同じセットをやり直す形
- 質問履歴の同期機能は未実装

**アプリ側の実装**:
- 質問出題前にSupabaseから最新の履歴を取得
- 既に回答済みの質問を除外
- ランダムで質問を出題（未回答の質問から選択）

**改善提案**:
1. **質問履歴の同期機能を実装**
   - 診断開始前にSupabaseから`user_question_history`を取得
   - 既に回答済みの質問を除外
   - 未回答の質問から出題

2. **質問の出題方法**
   - アプリ側と同様に、未回答の質問からランダムに出題
   - または、固定の30問セットをやり直す（既に回答済みの質問はスキップ）

---

### 4. 初期の固定質問の数をアプリと揃える

**現状**:
- ウェブ側: 30問（`questions.js`にハードコード）
- アプリ側: 質問数を確認する必要がある

**確認事項**:
- [ ] アプリ側の初期質問数は何問か？
- [ ] アプリ側は固定の質問セットか、ランダムか？
- [ ] 質問IDの整合性は保たれているか？

**推奨対応**:
- ✅ **アプリ側と質問数を揃える**（質問IDの整合性のため）
- ✅ **同じ質問セットを使用**（データの互換性のため）

---

## 🔧 実装改善案

### 1. 保存提案UIのメッセージ変更

**実装ファイル**: `test.html`

**変更内容**:
```javascript
// 現状
saveOptionDiv.innerHTML = `
  <div class="save-option-card">
    <h3>診断結果を保存しますか？</h3>
    <p>メールアドレスを登録すると、診断結果をSupabaseに保存し、複数のデバイスでアクセスできるようになります。</p>
    <button class="save-btn" onclick="showRegisterModal()">結果を保存する</button>
    <button class="skip-btn" onclick="hideSaveOption()">今はしない</button>
  </div>
`;

// 改善案
saveOptionDiv.innerHTML = `
  <div class="save-option-card">
    <h3>AIで診断したいなら</h3>
    <p>アカウントを作成してアプリからログインすると、AIで診断できるよ。</p>
    <p style="font-size: 0.9em; color: #666; margin-top: 10px;">
      アカウントを作成すると、診断結果をSupabaseに保存し、複数のデバイスでアクセスできるようになります。
    </p>
    <button class="save-btn" onclick="showRegisterModal()">アカウントを作成</button>
    <button class="save-btn" onclick="showLoginModal()" style="background: #f0f0f0; color: #333; margin-left: 10px;">ログイン</button>
    <button class="skip-btn" onclick="hideSaveOption()">今はしない</button>
  </div>
`;
```

---

### 2. 質問履歴の同期機能の実装

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

// 未回答の質問を取得
function getUnansweredQuestions(questions, answeredQuestionIds) {
  return questions.filter(q => !answeredQuestionIds.includes(q.id));
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
      const unansweredQuestions = getUnansweredQuestions(
        allQuestions,
        historyResult.history
      );
      
      if (unansweredQuestions.length === 0) {
        // すべて回答済みの場合
        alert('すべての質問に回答済みです。診断をやり直す場合は、アプリから履歴をクリアしてください。');
        return;
      }
      
      // 未回答の質問から出題
      test.questions = unansweredQuestions;
    }
  }
  
  // 診断を開始
  test.reset();
  displayQuestion();
}
```

---

### 4. 質問数の確認と統一

**確認事項**:
- [ ] アプリ側の初期質問数は何問か？
- [ ] アプリ側は固定の質問セットか、ランダムか？

**推奨対応**:
- アプリ側の質問数を確認
- ウェブ側の質問数をアプリ側と揃える
- 質問IDの整合性を保つ

---

## 📊 実装の優先順位

### 高優先度
1. **保存提案UIのメッセージ変更**（簡単な修正）
2. **質問数の確認と統一**（アプリ側と整合性を保つため）

### 中優先度
3. **質問履歴の同期機能の実装**（アプリ側と同様の機能）

### 低優先度
4. **ランダム質問出題機能**（アプリ側と同様の機能）

---

**作成者**: AI Assistant  
**最終更新**: 2025年1月

