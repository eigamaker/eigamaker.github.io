/**
 * アカウント移行機能
 * LocalStorageからSupabaseへのデータ移行機能を提供
 */

// Supabaseクライアントを取得
function getSupabaseClient() {
  if (typeof window.getSupabaseClient === 'function') {
    return window.getSupabaseClient();
  }
  throw new Error('Supabaseクライアントが初期化されていません。supabase-config.jsを読み込んでください。');
}

/**
 * LocalStorageからSupabaseへのデータ移行
 * @param {string} userId - ユーザーID
 * @param {Array} answers - 回答データ（オプション、指定しない場合はLocalStorageから取得）
 * @param {Array} questions - 質問データ（オプション、指定しない場合はsharedQuestionsから取得）
 * @returns {Promise<{success: boolean, migrated: boolean, error?: string}>}
 */
async function migrateLocalStorageToSupabase(userId, answers = null, questions = null) {
  try {
    const supabase = getSupabaseClient();
    
    // 1. LocalStorageから既存の回答データを取得
    if (!answers) {
      const savedAnswers = localStorage.getItem('personalityTestAnswers');
      if (!savedAnswers) {
        console.log('移行するデータがありません');
        return { success: true, migrated: false };
      }
      answers = JSON.parse(savedAnswers);
    }
    
    if (!questions) {
      // questions.jsから質問データを取得
      if (typeof getSharedQuestions === 'function') {
        questions = getSharedQuestions();
      } else if (typeof sharedQuestions !== 'undefined') {
        questions = sharedQuestions;
      } else {
        return { success: false, error: '質問データが取得できません' };
      }
    }
    
    // 2. Supabaseに保存
    const externalResponseId = crypto.randomUUID();
    const now = new Date().toISOString();
    
    // responsesテーブルに保存
    const responseInserts = answers.map(answer => {
      const answerValue = answer.value + 3; // -2～2 → 1～5
      return {
        external_response_id: externalResponseId,
        user_id: userId,
        question_id: answer.questionId,
        answer_value: answerValue,
        answer_text: null,
        created_at: now,
        last_synced_at: now
      };
    });
    
    const { error: responseError } = await supabase
      .from('responses')
      .insert(responseInserts);
    
    if (responseError) {
      // PostgreSQLエラーコード23505（重複エラー）の処理
      if (responseError.code === '23505') {
        console.warn('データが既に存在します。スキップします。');
        return { success: true, migrated: false, skipped: true };
      }
      console.error('回答の移行に失敗:', responseError);
      throw responseError;
    }
    
    // 3. response_scoresテーブルに保存（診断結果を再計算）
    // PersonalityTestインスタンスが必要なため、呼び出し側で処理することを推奨
    // ここでは、基本的な移行のみを実行
    
    console.log('データ移行が完了しました');
    return { success: true, migrated: true };
  } catch (e) {
    console.error('データ移行エラー:', e);
    return { success: false, error: e.message };
  }
}

/**
 * 診断結果のスコアをSupabaseに保存
 * @param {string} userId - ユーザーID
 * @param {string} externalResponseId - 外部レスポンスID
 * @param {Array} answers - 回答データ
 * @param {Array} questions - 質問データ
 * @param {Object} results - 診断結果（オプション、指定しない場合は再計算）
 * @returns {Promise<{success: boolean, error?: string}>}
 */
async function saveDiagnosisScoresToSupabase(userId, externalResponseId, answers, questions, results = null) {
  try {
    const supabase = getSupabaseClient();
    
    // 診断結果を再計算（指定されていない場合）
    if (!results) {
      if (typeof PersonalityTest === 'undefined') {
        return { success: false, error: 'PersonalityTestクラスが定義されていません' };
      }
      const test = new PersonalityTest();
      test.answers = answers;
      test.questions = questions;
      results = test.calculateResults();
    }
    
    const now = new Date().toISOString();
    const scoreInserts = [];
    
    // Profilecode診断のスコアを保存
    if (results.profilecode) {
      // キャリア適性
      if (results.profilecode.career && results.profilecode.career.scores) {
        Object.entries(results.profilecode.career.scores).forEach(([category, score]) => {
          scoreInserts.push({
            external_response_score_id: crypto.randomUUID(),
            external_response_id: externalResponseId,
            user_id: userId,
            theory: 'Profilecode',
            category: `career_${category}`,
            score: score,
            created_at: now,
            last_synced_at: now
          });
        });
      }
      
      // 学習スタイル
      if (results.profilecode.learning && results.profilecode.learning.scores) {
        Object.entries(results.profilecode.learning.scores).forEach(([category, score]) => {
          scoreInserts.push({
            external_response_score_id: crypto.randomUUID(),
            external_response_id: externalResponseId,
            user_id: userId,
            theory: 'Profilecode',
            category: `learning_${category}`,
            score: score,
            created_at: now,
            last_synced_at: now
          });
        });
      }
    }
    
    // MBTI診断のスコアを保存
    if (results.mbti && results.mbti.scores) {
      Object.entries(results.mbti.scores).forEach(([dimension, score]) => {
        scoreInserts.push({
          external_response_score_id: crypto.randomUUID(),
          external_response_id: externalResponseId,
          user_id: userId,
          theory: 'MBTI',
          category: dimension,
          score: score,
          created_at: now,
          last_synced_at: now
        });
      });
    }
    
    // 16PF診断のスコアを保存
    if (results.sixteenFactor && results.sixteenFactor.factors) {
      Object.entries(results.sixteenFactor.factors).forEach(([factor, score]) => {
        scoreInserts.push({
          external_response_score_id: crypto.randomUUID(),
          external_response_id: externalResponseId,
          user_id: userId,
          theory: '16PF',
          category: factor,
          score: score,
          created_at: now,
          last_synced_at: now
        });
      });
    }
    
    // DISC診断のスコアを保存
    if (results.disc && results.disc.scores) {
      Object.entries(results.disc.scores).forEach(([style, score]) => {
        scoreInserts.push({
          external_response_score_id: crypto.randomUUID(),
          external_response_id: externalResponseId,
          user_id: userId,
          theory: 'DISC',
          category: style,
          score: score,
          created_at: now,
          last_synced_at: now
        });
      });
    }
    
    // response_scoresテーブルに保存
    if (scoreInserts.length > 0) {
      const { error: scoreError } = await supabase
        .from('response_scores')
        .insert(scoreInserts);
      
      if (scoreError) {
        console.error('スコアの保存に失敗:', scoreError);
        throw scoreError;
      }
    }
    
    return { success: true };
  } catch (e) {
    console.error('スコア保存エラー:', e);
    return { success: false, error: e.message };
  }
}

// グローバルに公開
if (typeof window !== 'undefined') {
  window.migrateLocalStorageToSupabase = migrateLocalStorageToSupabase;
  window.saveDiagnosisScoresToSupabase = saveDiagnosisScoresToSupabase;
}

