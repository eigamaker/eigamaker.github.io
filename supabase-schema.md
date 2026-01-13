# Supabase 完全スキーマ情報

**最終更新日**: 2025年1月10日  
**Supabase URL**: `https://jehpkwqaphfcxnuzpavi.supabase.co`  
**PostgREST バージョン**: 12.2.3 (519615d)  
**取得方法**: OpenAPIスキーマから自動取得

> **注意**: このドキュメントは実際のSupabaseデータベースから取得した情報を基に作成されています。  
> 全21テーブル、10個のRPC関数の情報を含みます。

---

## 📊 テーブル一覧（全21テーブル）

### 主要テーブル

#### users

ユーザー情報を保存するテーブル。

**カラム（14個）**:
- `user_id` (UUID, PRIMARY KEY) - ユーザーID
- `user_name` (TEXT) - ユーザー名
- `gender` (TEXT) - 性別
- `age` (INTEGER) - 年齢
- `birthdate` (TEXT) - 生年月日
- `country_of_residence` (TEXT) - 居住国
- `email` (TEXT) - メールアドレス
- `language` (TEXT) - 言語設定
- `is_starter_complete` (BOOLEAN) - 初期設定完了フラグ
- `privacy_policy_version` (TEXT) - プライバシーポリシーの同意バージョン
- `eula_version` (TEXT) - 利用規約の同意バージョン
- `created_at` (TIMESTAMP) - 作成日時
- `updated_at` (TIMESTAMP) - 更新日時
- `last_synced_at` (TIMESTAMP) - 最終同期日時

**REST API パス**: `/users`

---

#### responses

診断の回答データを保存するテーブル。

**カラム（8個）**:
- `response_id` (UUID, PRIMARY KEY) - 回答ID
- `external_response_id` (UUID) - 外部システム（アプリ）の回答ID
- `user_id` (UUID, FOREIGN KEY → `users.user_id`) - ユーザーID
- `question_id` (INTEGER) - 質問ID（1-30の整数）
- `answer_value` (INTEGER) - 回答値（1-5の整数、Likertスケール）
- `answer_text` (TEXT) - 回答テキスト（オプション）
- `created_at` (TIMESTAMP) - 作成日時
- `last_synced_at` (TIMESTAMP) - 最終同期日時

**REST API パス**: `/responses`

**データ形式**:
- ウェブ側: `-2 ～ 2`（5段階）
- アプリ側: `1 ～ 5`（Likertスケール）
- 変換式: `appValue = webValue + 3`

---

#### response_scores

診断結果のスコアを保存するテーブル。

**カラム（10個）**:
- `response_score_id` (UUID, PRIMARY KEY) - スコアID
- `external_response_score_id` (UUID) - 外部システムのスコアID
- `response_id` (UUID, FOREIGN KEY → `responses.response_id`) - 回答ID
- `external_response_id` (UUID, FOREIGN KEY → `responses.external_response_id`) - 外部システムの回答ID
- `theory` (TEXT) - 診断理論名（例: "MBTI", "16PF", "DISC", "Profilecode"）
- `category` (TEXT) - カテゴリ名（例: "E/I", "温かさ", "D"）
- `score` (DOUBLE PRECISION) - スコア値
- `user_id` (UUID, FOREIGN KEY → `users.user_id`) - ユーザーID
- `created_at` (TIMESTAMP) - 作成日時
- `last_synced_at` (TIMESTAMP) - 最終同期日時

**REST API パス**: `/response_scores`

**診断理論の種類**:
- `MBTI`: 4指標（E/I, S/N, T/F, J/P）
- `16PF`: 16因子
- `DISC`: 4スタイル（D, I, S, C）
- `Profilecode`: Profilecode独自診断

---

#### personal_targets

相性診断の相手リスト（フレンドリスト）を保存するテーブル。

**カラム（5個）**:
- `user_id` (UUID, PRIMARY KEY, FOREIGN KEY → `users.user_id`) - ユーザーID
- `target_id` (UUID, PRIMARY KEY) - 相手のユーザーID
- `target_name` (TEXT) - 相手の名前
- `linked_at` (TIMESTAMP) - リンク作成日時
- `expires_at` (TIMESTAMP) - 有効期限

**REST API パス**: `/personal_targets`

**主キー**: 複合主キー `(user_id, target_id)`

---

#### user_scores

集計済みスコアを保存するテーブル（キャッシュ用）。

**カラム（7個）**:
- `user_id` (UUID, PRIMARY KEY, FOREIGN KEY → `users.user_id`) - ユーザーID
- `theory` (TEXT, PRIMARY KEY) - 診断理論名
- `category` (TEXT, PRIMARY KEY) - カテゴリ名
- `average_score` (DOUBLE PRECISION) - 平均スコア
- `recent_score` (DOUBLE PRECISION) - 最新スコア
- `updated_at` (TIMESTAMP) - 更新日時
- `last_synced_at` (TIMESTAMP) - 最終同期日時

**REST API パス**: `/user_scores`

**主キー**: 複合主キー `(user_id, theory, category)`

---

### 質問・診断関連テーブル

#### questions

質問データを保存するテーブル。

**カラム（20個）**:
- `question_id` (INTEGER, PRIMARY KEY) - 質問ID
- `question_text` (TEXT) - 質問文（デフォルト言語）
- `question_type` (TEXT) - 質問タイプ
- `answer_type` (TEXT) - 回答タイプ
- `starter` (BOOLEAN) - スターター質問フラグ
- `is_deleted` (INTEGER) - 削除フラグ
- 多言語対応カラム:
  - `question_text_ja` (TEXT) - 日本語
  - `question_text_ko` (TEXT) - 韓国語
  - `question_text_zh_hans` (TEXT) - 簡体字中国語
  - `question_text_zh_hant` (TEXT) - 繁体字中国語
  - `question_text_es` (TEXT) - スペイン語
  - `question_text_fr` (TEXT) - フランス語
  - `question_text_pt` (TEXT) - ポルトガル語
  - `question_text_ar` (TEXT) - アラビア語
  - `question_text_hi` (TEXT) - ヒンディー語
  - `question_text_de` (TEXT) - ドイツ語
  - `question_text_it` (TEXT) - イタリア語
  - `question_text_id` (TEXT) - インドネシア語
- `created_at` (TIMESTAMP) - 作成日時
- `updated_at` (TIMESTAMP) - 更新日時

**REST API パス**: `/questions`

---

#### question_theory_category

質問と診断理論・カテゴリのマッピングテーブル。

**カラム（8個）**:
- `question_id` (INTEGER, PRIMARY KEY, FOREIGN KEY → `questions.question_id`) - 質問ID
- `theory` (TEXT, PRIMARY KEY) - 診断理論名
- `category` (TEXT, PRIMARY KEY) - カテゴリ名
- `weight` (DOUBLE PRECISION) - 重み
- `is_reverse_scored` (BOOLEAN) - 逆スコアリングフラグ
- `is_deleted` (INTEGER) - 削除フラグ
- `created_at` (TIMESTAMP) - 作成日時
- `updated_at` (TIMESTAMP) - 更新日時

**REST API パス**: `/question_theory_category`

**主キー**: 複合主キー `(question_id, theory, category)`

---

#### global_scores

グローバル平均スコアを保存するテーブル。

**カラム（5個）**:
- `id` (INTEGER, PRIMARY KEY) - ID
- `theory` (TEXT) - 心理学理論名
- `category` (TEXT) - 理論内のカテゴリor特性
- `global_average_score` (DOUBLE PRECISION) - グローバル平均スコア
- `updated_at` (TIMESTAMP) - 更新日時

**REST API パス**: `/global_scores`

---

#### score_substitutes

スコアの代替マッピングテーブル。

**カラム（8個）**:
- `id` (INTEGER, PRIMARY KEY) - ID
- `target_theory` (TEXT) - 対象理論
- `target_category` (TEXT) - 対象カテゴリ
- `substitute_theory` (TEXT) - 代替理論
- `substitute_category` (TEXT) - 代替カテゴリ
- `priority` (INTEGER) - 優先度
- `created_at` (TIMESTAMP) - 作成日時
- `updated_at` (TIMESTAMP) - 更新日時

**REST API パス**: `/score_substitutes`

---

### グループ機能テーブル（アプリ専用）

#### groups

グループ情報を保存するテーブル。

**カラム（6個）**:
- `group_id` (UUID, PRIMARY KEY) - グループID
- `created_by` (UUID, FOREIGN KEY → `users.user_id`) - 作成者
- `group_name` (TEXT) - グループ名
- `created_at` (TIMESTAMP) - 作成日時
- `expires_at` (TIMESTAMP) - 有効期限
- `last_updated_at` (TIMESTAMP) - 最終更新日時

**REST API パス**: `/groups`

---

#### group_members

グループメンバーを保存するテーブル。

**カラム（3個）**:
- `group_id` (UUID, PRIMARY KEY, FOREIGN KEY → `groups.group_id`) - グループID
- `user_id` (UUID, PRIMARY KEY, FOREIGN KEY → `users.user_id`) - ユーザーID
- `joined_at` (TIMESTAMP) - 参加日時

**REST API パス**: `/group_members`

**主キー**: 複合主キー `(group_id, user_id)`

---

#### group_members_expanded

グループメンバーの拡張ビュー。

**カラム（3個）**:
- `group_id` (UUID, PRIMARY KEY, FOREIGN KEY → `groups.group_id`) - グループID
- `user_id` (UUID, PRIMARY KEY, FOREIGN KEY → `users.user_id`) - ユーザーID
- `joined_at` (TIMESTAMP) - 参加日時

**REST API パス**: `/group_members_expanded`

**注意**: これはビュー（VIEW）の可能性があります。

---

#### share_tokens

シェアリンクのトークンを保存するテーブル。

**カラム（8個）**:
- `id` (UUID, PRIMARY KEY) - ID
- `token` (TEXT) - トークン
- `user_id` (UUID, FOREIGN KEY → `users.user_id`) - ユーザーID
- `group_id` (UUID, FOREIGN KEY → `groups.group_id`) - グループID
- `name` (TEXT) - 名前
- `used` (BOOLEAN) - 使用済みフラグ
- `expires_at` (TIMESTAMP) - 有効期限
- `created_at` (TIMESTAMP) - 作成日時

**REST API パス**: `/share_tokens`

---

### その他のテーブル

#### app_announcements

アプリの告知を保存するテーブル。

**カラム（9個）**:
- `id` (UUID, PRIMARY KEY) - ID
- `title` (TEXT) - タイトル
- `body` (TEXT) - 本文
- `link_url` (TEXT) - リンクURL
- `is_popup` (BOOLEAN) - ポップアップ表示フラグ
- `is_important` (BOOLEAN) - 重要フラグ
- `is_visible` (BOOLEAN) - 表示フラグ
- `created_at` (TIMESTAMP) - 作成日時
- `updated_at` (TIMESTAMP) - 更新日時

**REST API パス**: `/app_announcements`

---

#### user_inquiries

ユーザーからのお問い合わせを保存するテーブル（アプリ側）。

**カラム（6個）**:
- `id` (INTEGER, PRIMARY KEY) - ID
- `user_id` (UUID) - ユーザーID
- `email` (TEXT) - メールアドレス
- `inquiry_type` (TEXT) - お問い合わせ種別
- `message` (TEXT) - メッセージ内容
- `created_at` (TIMESTAMP) - 作成日時

**REST API パス**: `/user_inquiries`

---

#### web_user_inquiries

ウェブからのお問い合わせを保存するテーブル。

**カラム（5個）**:
- `id` (UUID, PRIMARY KEY) - ID
- `email` (TEXT) - メールアドレス
- `inquiry_type` (TEXT) - お問い合わせ種別（`delete_account` または `question`）
- `message` (TEXT) - メッセージ内容
- `created_at` (TIMESTAMP) - 作成日時

**REST API パス**: `/web_user_inquiries`

**使用箇所**:
- `inquiry-form.html`: お問い合わせフォームから送信

---

#### user_question_history

ユーザーの質問履歴を保存するテーブル。

**カラム（6個）**:
- `id` (INTEGER, PRIMARY KEY) - ID
- `user_id` (UUID) - ユーザーID
- `question_id` (INTEGER) - 質問ID
- `local_id` (INTEGER) - ローカルID
- `is_synced` (BOOLEAN) - 同期済みフラグ
- `created_at` (TIMESTAMP) - 作成日時

**REST API パス**: `/user_question_history`

---

#### user_daily_generation

ユーザーの日次生成回数を管理するテーブル。

**カラム（5個）**:
- `user_id` (UUID, PRIMARY KEY) - ユーザーID
- `generated_date` (TEXT, PRIMARY KEY) - 生成日
- `free_count` (INTEGER) - 無料回数
- `reward_count` (INTEGER) - 報酬回数
- `free_used_up` (BOOLEAN) - 無料回数使用済みフラグ

**REST API パス**: `/user_daily_generation`

**主キー**: 複合主キー `(user_id, generated_date)`

---

#### user_generation_history

ユーザーの生成履歴を保存するテーブル。

**カラム（7個）**:
- `id` (UUID, PRIMARY KEY) - ID
- `user_id` (UUID) - ユーザーID
- `generated_date` (TEXT) - 生成日
- `free_count` (INTEGER) - 無料回数
- `reward_count` (INTEGER) - 報酬回数
- `free_used_up` (BOOLEAN) - 無料回数使用済みフラグ
- `created_at` (TIMESTAMP) - 作成日時

**REST API パス**: `/user_generation_history`

---

#### temp_translations

一時的な翻訳データを保存するテーブル。

**カラム（14個）**:
- `question_id` (INTEGER, PRIMARY KEY) - 質問ID
- `question_text` (TEXT) - 質問文（デフォルト）
- 多言語対応カラム:
  - `ja` (TEXT) - 日本語
  - `ko` (TEXT) - 韓国語
  - `zh_hans` (TEXT) - 簡体字中国語
  - `zh_hant` (TEXT) - 繁体字中国語
  - `es` (TEXT) - スペイン語
  - `fr` (TEXT) - フランス語
  - `pt` (TEXT) - ポルトガル語
  - `ar` (TEXT) - アラビア語
  - `hi` (TEXT) - ヒンディー語
  - `de` (TEXT) - ドイツ語
  - `it` (TEXT) - イタリア語
  - `id` (TEXT) - インドネシア語

**REST API パス**: `/temp_translations`

---

#### inactive_users_monitoring

非アクティブユーザーを監視するテーブル（ビュー）。

**カラム（7個）**:
- `id` (UUID, PRIMARY KEY) - ユーザーID
- `email` (TEXT) - メールアドレス
- `created_at` (TIMESTAMP) - 作成日時
- `last_sign_in_at` (TIMESTAMP) - 最終サインイン日時
- `days_inactive` (INTEGER) - 非アクティブ日数
- `is_deleted` (TEXT) - 削除フラグ
- `deleted_at` (TIMESTAMP) - 削除日時

**REST API パス**: `/inactive_users_monitoring`

**注意**: これはビュー（VIEW）の可能性があります。

---

## 🔧 RPC関数一覧

### validate_share_token

シェアリンクのトークンを検証する関数。

**パス**: `/rpc/validate_share_token`  
**メソッド**: GET, POST

**パラメータ**:
- `token` (TEXT): シェアリンクのトークン

**戻り値**:
- JSONB: `{ user_id, user_name, target_type, ... }`

**使用例**:
```javascript
const { data, error } = await supabaseClient.rpc('validate_share_token', {
  token: 'share-link-token'
});
```

**用途**:
- アプリ側で生成されたシェアリンクの検証
- ウェブ側では使用しない（アプリ専用）

---

### generate_personal_link

個人リンクを生成する関数（アプリ専用）。

**パス**: `/rpc/generate_personal_link`  
**メソッド**: GET, POST

**パラメータ**:
- `user_id` (UUID): ユーザーID
- `valid_days` (INTEGER): 有効日数

**戻り値**:
- JSONB: `{ token, ... }`

**注意**: ウェブ側では実装不要（アプリ専用）

---

### insert_personal_target

個人ターゲットを挿入する関数。

**パス**: `/rpc/insert_personal_target`  
**メソッド**: GET, POST

**パラメータ**:
- `target_user_id` (UUID): ターゲットユーザーID
- `target_name` (TEXT): ターゲット名
- `valid_days` (INTEGER): 有効日数

**用途**:
- シェアリンク経由で個人ターゲットを追加

---

### create_anonymous_user

匿名ユーザーを作成する関数。

**パス**: `/rpc/create_anonymous_user`  
**メソッド**: GET, POST

**パラメータ**:
- `device_id` (TEXT): デバイスID

**戻り値**:
- JSONB: `{ user_id, email, ... }`

**用途**:
- アプリ側で匿名ユーザーを作成

---

### delete_user_data

ユーザーデータを削除する関数。

**パス**: `/rpc/delete_user_data`  
**メソッド**: GET, POST

**パラメータ**:
- `user_id` (UUID): ユーザーID

**用途**:
- アカウント削除リクエストの処理

---

### create_group_with_token

グループをトークンで作成する関数（アプリ専用）。

**パス**: `/rpc/create_group_with_token`  
**メソッド**: GET, POST

**用途**:
- グループ機能（アプリ専用）

---

### generate_group_link

グループリンクを生成する関数（アプリ専用）。

**パス**: `/rpc/generate_group_link`  
**メソッド**: GET, POST

**用途**:
- グループ機能（アプリ専用）

---

### get_active_group_members

アクティブなグループメンバーを取得する関数（アプリ専用）。

**パス**: `/rpc/get_active_group_members`  
**メソッド**: GET, POST

**用途**:
- グループ機能（アプリ専用）

---

### clean_expired_groups

期限切れのグループをクリーンアップする関数。

**パス**: `/rpc/clean_expired_groups`  
**メソッド**: GET, POST

**用途**:
- バックグラウンドジョブで実行

---

### cleanup_inactive_users

非アクティブユーザーをクリーンアップする関数。

**パス**: `/rpc/cleanup_inactive_users`  
**メソッド**: GET, POST

**用途**:
- バックグラウンドジョブで実行

---

## 🔐 認証設定

### Supabase Auth

**認証方式**:
- Email認証（匿名認証対応）
- メール検証: `@example.invalid`ドメイン用に無効化されている可能性

**匿名認証**:
- アプリ側で `device_${uuid}@example.invalid` 形式のメールアドレスを使用
- メール検証をスキップして認証

**セッション管理**:
- LocalStorageにセッショントークンを自動保存
- ページリロード後も自動的にセッションを復元
- トークンの有効期限が切れる前に自動更新

---

## 🔒 Row Level Security (RLS)

すべてのテーブルでRLSが有効になっている想定。

**基本ポリシー**:
- **SELECT**: ユーザーは自分のデータのみ閲覧可能
- **INSERT**: ユーザーは自分のデータのみ挿入可能
- **UPDATE**: ユーザーは自分のデータのみ更新可能
- **DELETE**: ユーザーは自分のデータのみ削除可能

**実装例**:
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

---

## 📝 データ形式

### 回答値の変換

**ウェブ側の形式**: `-2 ～ 2`（5段階）
- `-2`: 強く反対する
- `-1`: 反対する
- `0`: どちらでもない
- `1`: 同意する
- `2`: 強く同意する

**アプリ側の形式**: `1 ～ 5`（Likertスケール）
- `1`: 強く反対する
- `2`: 反対する
- `3`: どちらでもない
- `4`: 同意する
- `5`: 強く同意する

**変換式**:
```javascript
// ウェブ側 → アプリ側
const appValue = webValue + 3;  // -2→1, -1→2, 0→3, 1→4, 2→5

// アプリ側 → ウェブ側
const webValue = appValue - 3;  // 1→-2, 2→-1, 3→0, 4→1, 5→2
```

---

## 🔄 データフロー

### 診断結果の保存フロー

```
1. ユーザーが診断を完了
   ↓
2. クライアントサイドで計算（MBTI, 16PF, DISC, Profilecode）
   ↓
3. Supabaseに保存
   ├── responses テーブル（回答データ）
   └── response_scores テーブル（スコア）
   ↓
4. user_scores テーブルに集計（アプリ側で自動更新）
```

### 相性診断のフロー

```
1. ユーザーAがシェアリンクを生成（アプリ側）
   ↓
2. ユーザーBがシェアリンクを開く
   ↓
3. validate_share_token でトークンを検証
   ↓
4. insert_personal_target で personal_targets テーブルに追加
   ↓
5. 相性診断を実行（user_scores から取得）
```

---

## 📋 テーブル関係図

```
users (user_id)
  ├── responses (user_id → users.user_id)
  │     └── response_scores (response_id → responses.response_id)
  │
  ├── personal_targets (user_id → users.user_id)
  │
  ├── user_scores (user_id → users.user_id)
  │
  ├── group_members (user_id → users.user_id)
  │     └── groups (group_id)
  │
  ├── share_tokens (user_id → users.user_id)
  │
  ├── user_inquiries (user_id)
  │
  ├── user_question_history (user_id)
  │
  └── user_daily_generation (user_id)

questions (question_id)
  └── question_theory_category (question_id → questions.question_id)

global_scores (独立)
score_substitutes (独立)
app_announcements (独立)
web_user_inquiries (独立)
temp_translations (独立)
inactive_users_monitoring (ビュー)
```

---

## 🔗 関連ドキュメント

- [ウェブ診断実装状況](./web_diagnosis_implementation_status.md)
- [実装計画](./implementation_plan.md)
- [必要な情報チェックリスト](./required_information_checklist.md)

---

**作成者**: AI Assistant  
**最終更新**: 2025年1月10日  
**バージョン**: 3.0（完全版 - 全21テーブル、10個のRPC関数）
