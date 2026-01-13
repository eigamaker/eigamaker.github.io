# セキュリティガイドライン

このドキュメントは、Profilecodeウェブサイトのセキュリティに関する重要な情報をまとめています。

**ホスティング環境**: GitHub Pages（静的ホスティング）  
**最終更新**: 2025年1月10日

---

## 🔐 公開して良い情報（Gitに含めてOK）

### Supabase Anon Key

**✅ 公開可能**: `js/supabase-config.js` に含まれる `anonKey`

**理由**:
- Supabaseのanon keyは**公開しても安全**に設計されています
- Row Level Security (RLS) ポリシーで保護されています
- クライアントサイド（ブラウザ）からアクセスする必要があります
- GitHub Pagesのような静的ホスティングでは、コードに直接含める必要があります

**現在の実装**:
```javascript
// js/supabase-config.js
const SUPABASE_CONFIG = {
  url: 'https://jehpkwqaphfcxnuzpavi.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // ✅ 公開OK
};
```

**セキュリティ対策**:
- ✅ RLSポリシーがすべてのテーブルで有効
- ✅ ユーザーは自分のデータのみアクセス可能
- ✅ `auth.uid() = user_id` で制限

---

### Supabase URL

**✅ 公開可能**: SupabaseプロジェクトのURL

**理由**:
- URLは公開情報です
- セキュリティはキーとRLSポリシーで保護されています

---

## 🚫 絶対に公開してはいけない情報

### Supabase Service Role Key

**❌ 絶対に公開禁止**

**理由**:
- Service Role KeyはRLSポリシーを**バイパス**します
- すべてのデータにアクセス可能
- データベースの完全な制御権を持ちます

**対策**:
- ✅ `.gitignore` に追加済み
- ✅ コードに含めない
- ✅ 環境変数として管理（サーバーサイドのみ）
- ✅ GitHub Secretsに保存（CI/CD使用時）

---

### ChatGPT API Key

**❌ 絶対に公開禁止**

**理由**:
- APIキーは認証情報です
- 悪用されると課金が発生します
- クライアントサイド（ブラウザ）から直接使用すべきではありません

**現在の状況**:
- ❌ まだ実装されていません
- ⚠️ 将来的に実装する場合は、**サーバーサイドで実行**する必要があります

**推奨実装方法**:

#### 方法1: Supabase Edge Functions（推奨）

```javascript
// Supabase Edge Function (サーバーサイド)
// supabase/functions/chatgpt-generation/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  // APIキーは環境変数から取得（公開されない）
  const apiKey = Deno.env.get('OPENAI_API_KEY')
  
  // リクエストを処理
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(req.body)
  })
  
  return new Response(JSON.stringify(await response.json()))
})
```

**クライアントサイドからの呼び出し**:
```javascript
// クライアントサイド（ブラウザ）
const { data, error } = await supabase.functions.invoke('chatgpt-generation', {
  body: { prompt: '...' }
})
```

#### 方法2: GitHub Actions + Serverless Function

- GitHub Actionsでサーバーレス関数をデプロイ
- APIキーはGitHub Secretsに保存
- クライアントからは関数のURLを呼び出す

#### 方法3: サードパーティのプロキシサービス

- 既存のプロキシサービスを使用
- APIキーを管理する必要がない

---

## 🔒 セキュリティベストプラクティス

### 1. Supabase RLSポリシーの確認

**すべてのテーブルでRLSが有効であることを確認**:

```sql
-- 例: usersテーブルのRLSポリシー
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own data"
  ON users FOR DELETE
  USING (auth.uid() = user_id);
```

**確認方法**:
- Supabaseダッシュボード → Authentication → Policies
- すべてのテーブルでRLSが有効になっているか確認

---

### 2. 環境変数の管理

**静的サイト（GitHub Pages）の制限**:
- ❌ 環境変数を直接使用できない
- ✅ コードに直接含める必要がある（anon keyのみ）
- ✅ 機密情報はサーバーサイドで処理

**推奨アーキテクチャ**:
```
クライアント（ブラウザ）
  ↓
Supabase Client (anon key) ← 公開OK
  ↓
Supabase Database (RLSで保護)
  ↓
Supabase Edge Functions (service_role key) ← 非公開
  ↓
ChatGPT API (API key) ← 非公開
```

---

### 3. 入力値の検証

**クライアントサイドとサーバーサイドの両方で検証**:

```javascript
// クライアントサイド（UX向上）
function validateInput(input) {
  if (!input || input.length > 1000) {
    return false;
  }
  return true;
}

// サーバーサイド（セキュリティ）
// Supabase Edge FunctionsやRPC関数で検証
```

---

### 4. CORS設定

**Supabase側でCORSを適切に設定**:
- 許可するドメインを制限
- 本番環境と開発環境を分ける

**確認方法**:
- Supabaseダッシュボード → Settings → API
- CORS設定を確認

---

### 5. レート制限

**Supabase側でレート制限を設定**:
- 過度なリクエストを防ぐ
- DDoS攻撃を防ぐ

**確認方法**:
- Supabaseダッシュボード → Settings → API
- Rate Limiting設定を確認

---

## 📋 チェックリスト

### コードレビュー時

- [ ] Service Role Keyがコードに含まれていないか
- [ ] ChatGPT API Keyがコードに含まれていないか
- [ ] その他の機密情報がコードに含まれていないか
- [ ] `.gitignore` に機密ファイルが追加されているか
- [ ] RLSポリシーがすべてのテーブルで有効か

### デプロイ前

- [ ] 環境変数が適切に設定されているか（サーバーサイド）
- [ ] CORS設定が適切か
- [ ] レート制限が設定されているか
- [ ] 入力値検証が実装されているか

### 定期的な確認

- [ ] Supabaseのアクセスログを確認
- [ ] 異常なアクセスパターンを監視
- [ ] APIキーの使用量を監視
- [ ] RLSポリシーの見直し

---

## 🚨 セキュリティインシデント時の対応

### APIキーが漏洩した場合

1. **即座にキーを無効化**
   - Supabaseダッシュボード → Settings → API
   - 新しいキーを生成
   - コードを更新

2. **アクセスログを確認**
   - 不正なアクセスがないか確認
   - 影響範囲を特定

3. **必要に応じてデータを確認**
   - データが改ざんされていないか確認
   - バックアップから復元

---

## 📚 参考資料

- [Supabase Security Best Practices](https://supabase.com/docs/guides/auth/row-level-security)
- [OpenAI API Security](https://platform.openai.com/docs/guides/safety-best-practices)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [GitHub Pages Security](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)

---

## 🔗 関連ドキュメント

- [Supabaseスキーマ情報](./supabase-schema.md)
- [実装計画](./implementation_plan.md)

---

**作成者**: AI Assistant  
**最終更新**: 2025年1月10日  
**バージョン**: 1.0

