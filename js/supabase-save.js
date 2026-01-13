/**
 * 診断結果のSupabase保存機能
 * ログイン済みユーザーの診断結果をSupabaseに保存
 */

// Supabaseクライアントを取得
function getSupabaseClient() {
  if (typeof window.getSupabaseClient === 'function') {
    return window.getSupabaseClient();
  }
  throw new Error('Supabaseクライアントが初期化されていません。supabase-config.jsを読み込んでください。');
}

/**
 * 診断結果をSupabaseに保存
 * @param {Object} results - 診断結果
 * @param {Array} answers - 回答データ
 * @param {Array} questions - 質問データ
 * @returns {Promise<{success: boolean, error?: string, externalResponseId?: string}>}
 */
async function saveDiagnosisResultsToSupabase(results, answers, questions) {
  try {
    const supabase = getSupabaseClient();
    
    // 1. ログイン状態をチェック
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.log('ログインしていないため、Supabaseには保存しません');
      return { success: false, error: 'ログインが必要です' };
    }
    
    // 2. external_response_idを生成
    const externalResponseId = crypto.randomUUID();
    const now = new Date().toISOString();
    
    // 3. responsesテーブルに保存
    const responseInserts = answers.map(answer => {
      const answerValue = answer.value + 3; // -2～2 → 1～5
      return {
        external_response_id: externalResponseId,
        user_id: user.id,
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
        return { 
          success: false, 
          error: 'この診断結果は既に保存されています',
          code: 'DUPLICATE'
        };
      }
      throw responseError;
    }
    
    // 4. response_scoresテーブルに保存
    if (typeof saveDiagnosisScoresToSupabase === 'function') {
      const scoreResult = await saveDiagnosisScoresToSupabase(
        user.id,
        externalResponseId,
        answers,
        questions,
        results
      );
      
      if (!scoreResult.success) {
        console.error('スコアの保存に失敗:', scoreResult.error);
        // スコアの保存に失敗しても、回答データは保存されているので続行
      }
    }
    
    // 5. user_question_historyテーブルに保存（アプリ側と同様に）
    const historyInserts = answers.map((answer, index) => ({
      user_id: user.id,
      question_id: answer.questionId,
      local_id: index + 1,
      is_synced: true,
      created_at: now
    }));
    
    const { error: historyError } = await supabase
      .from('user_question_history')
      .insert(historyInserts);
    
    if (historyError) {
      console.warn('質問履歴の保存に失敗:', historyError);
      // 質問履歴の保存に失敗しても、回答データは保存されているので続行
    }
    
    return { success: true, externalResponseId: externalResponseId };
  } catch (e) {
    console.error('診断結果の保存エラー:', e);
    return { success: false, error: e.message };
  }
}

// グローバルに公開
if (typeof window !== 'undefined') {
  window.saveDiagnosisResultsToSupabase = saveDiagnosisResultsToSupabase;
}

