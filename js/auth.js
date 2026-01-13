/**
 * 認証機能
 * Supabase Authを使用した認証機能を提供
 */

// Supabaseクライアントを取得
function getSupabaseClient() {
  if (typeof window.getSupabaseClient === 'function') {
    return window.getSupabaseClient();
  }
  throw new Error('Supabaseクライアントが初期化されていません。supabase-config.jsを読み込んでください。');
}

/**
 * メールアドレスとパスワードでアカウントを作成
 * @param {string} email - メールアドレス
 * @param {string} password - パスワード
 * @returns {Promise<{success: boolean, user?: object, error?: string}>}
 */
async function registerWithEmail(email, password) {
  try {
    const supabase = getSupabaseClient();
    
    // 1. Supabase Authでアカウント作成
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password
    });
    
    if (error) {
      console.error('アカウント作成エラー:', error);
      return { success: false, error: error.message };
    }
    
    if (data.user) {
      // 2. usersテーブルにユーザー情報を保存
      const { error: userError } = await supabase
        .from('users')
        .insert({
          user_id: data.user.id,
          email: email,
          user_name: email.split('@')[0], // メールアドレスの@より前をユーザー名に
          language: navigator.language.split('-')[0] || 'en',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (userError) {
        console.error('ユーザー情報の保存エラー:', userError);
        // ユーザー情報の保存に失敗しても、認証は成功しているので続行
      }
      
      // 3. セッション管理
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userId', data.user.id);
      localStorage.setItem('isLoggedIn', 'true');
      
      return { success: true, user: data.user };
    }
    
    return { success: false, error: 'アカウント作成に失敗しました' };
  } catch (e) {
    console.error('アカウント作成処理エラー:', e);
    return { success: false, error: e.message };
  }
}

/**
 * メールアドレスとパスワードでログイン
 * @param {string} email - メールアドレス
 * @param {string} password - パスワード
 * @returns {Promise<{success: boolean, user?: object, error?: string}>}
 */
async function loginWithEmail(email, password) {
  try {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });
    
    if (error) {
      console.error('ログインエラー:', error);
      return { success: false, error: error.message };
    }
    
    if (data.user) {
      // セッション管理
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userId', data.user.id);
      localStorage.setItem('isLoggedIn', 'true');
      
      // Supabaseから解答履歴を同期
      if (typeof syncAnswersFromSupabase === 'function') {
        try {
          await syncAnswersFromSupabase();
        } catch (e) {
          console.warn('解答履歴の同期に失敗しました:', e);
          // 同期失敗してもログインは成功とする
        }
      }
      
      return { success: true, user: data.user };
    }
    
    return { success: false, error: 'ログインに失敗しました' };
  } catch (e) {
    console.error('ログイン処理エラー:', e);
    return { success: false, error: e.message };
  }
}

/**
 * ログアウト
 * @returns {Promise<{success: boolean, error?: string}>}
 */
async function logout() {
  try {
    const supabase = getSupabaseClient();
    
    await supabase.auth.signOut();
    
    // LocalStorageをクリア
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    localStorage.removeItem('isLoggedIn');
    
    return { success: true };
  } catch (e) {
    console.error('ログアウト処理エラー:', e);
    return { success: false, error: e.message };
  }
}

/**
 * 認証状態をチェック
 * @returns {Promise<{isLoggedIn: boolean, user?: object, needsReLogin?: boolean}>}
 */
async function checkAuthStatus() {
  try {
    const supabase = getSupabaseClient();
    
    // 1. Supabase Authのセッションをチェック
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('セッション取得エラー:', error);
      return { isLoggedIn: false, needsReLogin: false };
    }
    
    if (session && session.user) {
      // セッションが有効
      localStorage.setItem('userEmail', session.user.email);
      localStorage.setItem('userId', session.user.id);
      localStorage.setItem('isLoggedIn', 'true');
      return { isLoggedIn: true, user: session.user };
    }
    
    // 2. LocalStorageからチェック
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');
    
    if (isLoggedIn && userId && userEmail) {
      // LocalStorageに情報があるが、セッションが切れている場合
      // 再ログインを試みる（パスワードが必要なので、ユーザーに再ログインを促す）
      return { isLoggedIn: false, needsReLogin: true };
    }
    
    return { isLoggedIn: false, needsReLogin: false };
  } catch (e) {
    console.error('認証状態チェックエラー:', e);
    return { isLoggedIn: false, needsReLogin: false };
  }
}

/**
 * 現在のユーザー情報を取得
 * @returns {Promise<{user?: object, error?: string}>}
 */
async function getCurrentUser() {
  try {
    const supabase = getSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('ユーザー情報取得エラー:', error);
      return { error: error.message };
    }
    
    return { user: user };
  } catch (e) {
    console.error('ユーザー情報取得処理エラー:', e);
    return { error: e.message };
  }
}

// グローバルに公開
if (typeof window !== 'undefined') {
  window.registerWithEmail = registerWithEmail;
  window.loginWithEmail = loginWithEmail;
  window.logout = logout;
  window.checkAuthStatus = checkAuthStatus;
  window.getCurrentUser = getCurrentUser;
}

