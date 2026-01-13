/**
 * Supabase Configuration
 * 
 * このファイルはSupabase接続情報を一元管理します。
 * すべてのHTMLファイルでこの設定を使用することで、
 * Supabase URLやキーの変更時に1箇所だけ修正すれば済みます。
 * 
 * ⚠️ セキュリティに関する注意:
 * - このファイルに含まれる `anonKey` は公開しても安全です
 * - Supabaseのanon keyはRow Level Security (RLS)で保護されています
 * - Service Role Keyは絶対にこのファイルに含めないでください
 * - 詳細は SECURITY.md を参照してください
 */

// Supabase接続情報
// ⚠️ anonKeyは公開可能（RLSで保護されているため）
const SUPABASE_CONFIG = {
  url: 'https://jehpkwqaphfcxnuzpavi.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplaHBrd3FhcGhmY3hudXpwYXZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg1NDA3MTMsImV4cCI6MjA0NDExNjcxM30.A5xe0cFzRPjNIIGcTINjK1Yi9K0O7Aw67RDxbLyVstY'
};

/**
 * Supabaseクライアントを初期化して返す
 * 
 * @returns {Object} Supabaseクライアントインスタンス
 * 
 * 使用例:
 * ```javascript
 * // HTMLでスクリプトを読み込む
 * <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js"></script>
 * <script src="js/supabase-config.js"></script>
 * 
 * // JavaScriptで使用
 * const supabaseClient = getSupabaseClient();
 * const { data, error } = await supabaseClient.from('table_name').select('*');
 * ```
 */
function getSupabaseClient() {
  if (typeof supabase === 'undefined') {
    throw new Error('Supabaseライブラリが読み込まれていません。HTMLに以下を追加してください:\n<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js"></script>');
  }
  
  return supabase.createClient(
    SUPABASE_CONFIG.url,
    SUPABASE_CONFIG.anonKey
  );
}

// グローバルに公開（既存のコードとの互換性のため）
if (typeof window !== 'undefined') {
  window.SUPABASE_CONFIG = SUPABASE_CONFIG;
  window.getSupabaseClient = getSupabaseClient;
}

