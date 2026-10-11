# 作文アプリ｜共通デザイン仕様書

## 1. デザインコンセプト

**テーマ：宇宙の書斎・静かなSFファンタジー**

深いネイビーをベースに、月明かりのようなゴールドをアクセントに使う。

透明感のあるカード、控えめな光、十分な余白で、静かで居心地のよい雰囲気にする。

派手な宇宙イラストを多用せず、色・透明感・余白・控えめな光で世界観を表現する。

## 2. カラーパレット

| 用途 | カラーコード |
|---|---|
| ページ背景 | `#171D32` |
| カード背景 | `#252D46` |
| カード hover | `#2D3651` |
| メインアクセント | `#E5C96A` |
| メインテキスト | `#D0D5E4` |
| 補助テキスト | `#A7B0C9` |
| 基本の枠線 | `#414A65` |

透明感を出すための追加カラー：

- カード枠線：`rgba(145, 169, 206, 0.28)`
- カード内側のハイライト：`rgba(208, 213, 228, 0.04)`
- hover時のゴールド枠線：`rgba(229, 201, 106, 0.4)`

色はCSS変数として定義し、全ページで統一する。

## 3. HTMLの基本構造

ページの構造は統一し、HTMLの意味に合った要素を使用する。

| HTML要素 | 用途 |
|---|---|
| `header` | ページ上部 |
| `main` | メインコンテンツ |
| `section` | 関連する内容のまとまり |
| `article` | 独立したカード・コンテンツ |
| `h1` | ページタイトル |
| `h2` | セクション見出し |
| `h3` | カードなどの小見出し |
| `p` | 説明文・本文 |
| `label` | 入力欄の説明 |
| `button` | 操作ボタン |
| `nav` | ナビゲーション |

### 見出しのルール

- 原則として、1ページに `h1` は1つ。
- 大きなセクションには `h2` を使う。
- セクション内のカードには必要に応じて `h3` を使う。
- 見た目の大きさではなく、内容の階層で見出しレベルを決める。

### 共通HTMLの例

```html
<div class="app-container">
  <header class="page-header">
    <p class="eyebrow">YOUR LITTLE UNIVERSE</p>
    <h1>ページタイトル</h1>
    <p class="page-description">
      ページの説明文
    </p>
  </header>

  <main>
    <section class="content-section">
      <h2 class="section-heading">セクション名</h2>

      <article class="card">
        <h3>カードのタイトル</h3>
        <p class="card-description">
          カードの説明文
        </p>
        <button class="btn btn-primary" type="button">
          始める
        </button>
      </article>
    </section>
  </main>
</div>
```

## 4. レイアウト

- コンテンツ最大幅：`600px`
- スマートフォンでは画面幅に合わせる。
- 左右に十分な余白を取る。
- カード間の間隔を統一する。
- 見出し・説明文・操作ボタンを整理して配置する。
- 下部固定ナビゲーションがある場合、本文が隠れないように余白を確保する。

## 5. カードのデザイン

カードは、背景色だけでなく枠線と光の表現で透明感を出す。

- 背景：ネイビー同士の薄いグラデーション。
- 枠線：青みのある細い線。
- 内側：ごく薄いハイライト。
- 影：控えめにする。
- hover時：枠線を薄いゴールドに変化させる。
- 角丸：`16〜18px`。

カードの共通クラスは `.card` とする。

## 6. ボタンのデザイン

### メインボタン

- 背景：`#E5C96A`
- 文字：`#171D32`
- 形：横長のカプセル型
- 角丸：`999px`
- 用途：作文開始、保存、決定などの主要操作

### サブボタン

- 背景：`#252D46`
- 文字：`#D0D5E4`
- 枠線：`#414A65`
- 形：横長のカプセル型
- 用途：キャンセル、補助操作など

### アイコンボタン

戻る・追加など、アイコンのみのボタンは円形を基本とする。

**文字の入ったボタンは横丸、カードは角丸四角形にして形を区別する。**

## 7. 入力欄・テキスト

- 入力欄も暗いネイビー系に統一し、白背景は基本的に使わない。
- 本文：`#D0D5E4`
- 補足・説明：`#A7B0C9`
- 枠線：`#414A65`
- フォーカス時：ゴールド系で控えめに強調する。
- フォント：システム標準のサンセリフ体。
- 行間と余白を確保し、長い文章も読みやすくする。

## 8. CSSの共通クラス

| クラス | 役割 |
|---|---|
| `.app-container` | ページ全体の幅・余白 |
| `.page-header` | ページ上部 |
| `.eyebrow` | 小さな英字ラベル |
| `.page-description` | ページ説明 |
| `.content-section` | セクションのまとまり |
| `.section-heading` | セクション見出し |
| `.card` | 基本カード |
| `.card-description` | カードの説明文 |
| `.btn` | 共通ボタン |
| `.btn-primary` | メインボタン |
| `.btn-secondary` | サブボタン |
| `.btn-ghost` | 背景を目立たせないボタン |
| `.icon-button` | アイコンボタン |
| `.input-field` | 1行入力 |
| `.textarea-field` | 複数行入力 |
| `.select-field` | 選択欄 |
| `.label` | 入力欄のラベル |
| `.divider` | 区切り線 |

## 9. CSSのファイル構成

CSSは **`style.css` の1ファイルだけ** で管理する。

```text
project/
├── index.html
├── writing.html
├── notes.html
├── settings.html
└── css/
    └── style.css
```

すべてのHTMLファイルで、同じCSSを読み込む。

```html
<link rel="stylesheet" href="css/style.css">
```

### `style.css` 内の整理順

1. CSS変数・カラーパレット
2. リセット・基本設定
3. 共通レイアウト
4. 見出し・テキスト
5. カード
6. ボタン
7. 入力欄
8. ナビゲーション
9. ホーム画面専用スタイル
10. 作文画面専用スタイル
11. ノート画面専用スタイル
12. 設定画面専用スタイル
13. レスポンシブ設定
14. アニメーション・動きを減らす設定

ページ専用スタイルはコメントで区切り、共通デザインと重複しないようにする。

## 10. ホーム画面の見た目

1. 上部：アプリタイトルと短い説明。
2. メインカード：今日のミッション。
3. 学習言語と目安時間。
4. ゴールドの「作文を始める」ボタン。
5. ノート・学習記録・設定・会話練習のメニューカード。
6. 下部：ホーム・作文・ノート・設定のナビゲーション。

## 11. 全ページ共通のルール

- ネイビーとゴールドを基本にする。
- 文字の入ったボタンはカプセル型に統一する。
- カードは透明感のある角丸四角形にする。
- アイコンはシンプルな線画を基本とする。
- 余白を十分に取り、情報を詰め込みすぎない。
- アニメーションは短く控えめにする。
- スマートフォンでも操作しやすいサイズにする。
- 学習対象の文章以外、アプリ内のUI・説明・メニューは日本語にする。

**デザインの方向性：暗い宇宙に、月明かりと小さな星が浮かぶ書斎。**

色・余白・透明感で世界観を表現し、学習に集中できる落ち着いた画面を目指す。

10. 共通CSSの基本形

:root {
  --bg-color: #171D32;
  --card-color: #252D46;
  --card-hover: #2D3651;
  --accent-color: #E5C96A;
  --text-color: #D0D5E4;
  --muted-color: #A7B0C9;
  --border-color: #414A65;

  --glass-border: rgba(145, 169, 206, 0.28);
  --glass-highlight: rgba(208, 213, 228, 0.04);
  --accent-border: rgba(229, 201, 106, 0.4);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--bg-color);
  color: var(--text-color);
  font-family: -apple-system, BlinkMacSystemFont,
    "Segoe UI", sans-serif;
}

.app-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 24px 20px;
}

.card {
  background: linear-gradient(
    145deg,
    rgba(45, 54, 81, 0.72),
    rgba(37, 45, 70, 0.96)
  );
  border: 1px solid var(--glass-border);
  border-radius: 18px;
  box-shadow:
    inset 0 1px 0 var(--glass-highlight),
    0 4px 16px rgba(0, 0, 0, 0.08);
}

.card:hover {
  border-color: var(--accent-border);
}


/* =========================
   共通ボタン
========================= */

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  width: auto;
  padding: 13px 24px;

  background: transparent;
  color: var(--accent-color);
  border: 1px solid #756B49;
  border-radius: 999px;

  font-family: inherit;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0.06em;
  line-height: 1.5;

  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;

  transition:
    background-color 0.25s ease,
    border-color 0.25s ease;
}

.btn:hover {
  background: rgba(229, 201, 106, 0.08);
  border-color: var(--accent-color);
}

.btn:focus-visible {
  outline: 1px solid var(--accent-color);
  outline-offset: 5px;
}

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn:disabled:hover {
  background: transparent;
  border-color: #756B49;
}


.btn-primary {
  background: transparent;
  color: var(--accent-color);
  border: 1px solid #756B49;
}

.btn-primary:hover {
  background: rgba(229, 201, 106, 0.08);
  border-color: var(--accent-color);
}


.btn-secondary {
  background: var(--card-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

これは共通CSSの骨組み。実際の画面に合わせて、見出し、入力欄、フォーカス表示、レスポンシブ対応などを追加する。