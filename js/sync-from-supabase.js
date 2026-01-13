/**
 * Supabaseから解答履歴をブラウザに同期する機能
 * ログイン時にSupabaseから解答履歴を取得してLocalStorageに保存
 */

// Supabaseクライアントを取得
function getSupabaseClient() {
  if (typeof window.getSupabaseClient === 'function') {
    return window.getSupabaseClient();
  }
  throw new Error('Supabaseクライアントが初期化されていません。supabase-config.jsを読み込んでください。');
}

/**
 * Supabaseから解答履歴を取得してLocalStorageに同期
 * @returns {Promise<{success: boolean, answers?: Array, error?: string}>}
 */
async function syncAnswersFromSupabase() {
  try {
    const supabase = getSupabaseClient();
    
    // 1. ログイン状態をチェック
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.log('ログインしていないため、Supabaseから解答履歴を取得しません');
      return { success: false, error: 'ログインが必要です' };
    }
    
    // 2. 最新のexternal_response_idを取得（最新の診断結果）
    const { data: latestResponse, error: responseError } = await supabase
      .from('responses')
      .select('external_response_id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (responseError && responseError.code !== 'PGRST116') {
      // PGRST116は「データが見つからない」エラー（正常な場合もある）
      console.error('最新の診断結果取得エラー:', responseError);
      return { success: false, error: responseError.message };
    }
    
    if (!latestResponse) {
      // 診断結果がない場合
      console.log('Supabaseに診断結果がありません');
      return { success: true, answers: [] };
    }
    
    // 3. 最新の診断結果の回答を取得
    const { data: responses, error: responsesError } = await supabase
      .from('responses')
      .select('question_id, answer_value')
      .eq('user_id', user.id)
      .eq('external_response_id', latestResponse.external_response_id)
      .order('question_id', { ascending: true });
    
    if (responsesError) {
      console.error('回答取得エラー:', responsesError);
      return { success: false, error: responsesError.message };
    }
    
    // 4. 回答値を変換（1～5 → -2～2）
    const answers = responses.map(response => ({
      questionId: response.question_id,
      value: response.answer_value - 3 // 1～5 → -2～2
    }));
    
    // 5. LocalStorageに保存
    localStorage.setItem('personalityTestAnswers', JSON.stringify(answers));
    
    console.log('Supabaseから解答履歴を同期しました:', answers.length, '件');
    return { success: true, answers: answers };
  } catch (e) {
    console.error('解答履歴同期エラー:', e);
    return { success: false, error: e.message };
  }
}

/**
 * Supabaseから質問履歴を取得
 * @returns {Promise<{success: boolean, history?: Array, error?: string}>}
 */
async function getQuestionHistoryFromSupabase() {
  try {
    const supabase = getSupabaseClient();
    
    // 1. ログイン状態をチェック
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.log('ログインしていないため、質問履歴を取得しません');
      return { success: false, history: [] };
    }
    
    // 2. user_question_historyから質問履歴を取得
    const { data: history, error: historyError } = await supabase
      .from('user_question_history')
      .select('question_id')
      .eq('user_id', user.id)
      .eq('is_synced', true);
    
    if (historyError) {
      console.error('質問履歴取得エラー:', historyError);
      return { success: false, history: [] };
    }
    
    const answeredQuestionIds = history.map(h => h.question_id);
    return { success: true, history: answeredQuestionIds };
  } catch (e) {
    console.error('質問履歴取得処理エラー:', e);
    return { success: false, history: [] };
  }
}

// グローバルに公開
if (typeof window !== 'undefined') {
  window.syncAnswersFromSupabase = syncAnswersFromSupabase;
  window.getQuestionHistoryFromSupabase = getQuestionHistoryFromSupabase;
}

