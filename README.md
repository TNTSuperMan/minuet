> [!WARNING]
> **これは非公式です、Scratchチーム・MIT Media Lab・その他公式Scratch組織とは一切関係ありません。**
> 
> "Scratch"はMIT MediaLabの商標であり、このリポジトリはそれに関する権利を主張しません。
>
> 現在、このプロジェクトでは商標の削除に取り組んでいますが、
> まだScratchの商標が一部含まれているため、再配布等は控えてください。

> [!WARNING]
> minuetでは、修正バージョンのScratchエディターが使われる予定です。
> Scratchでは、利用規約4.4により、Scratchエディターの修正バージョンを使用して作成したプロジェクトをアップロードすることは禁止されているため、
> minuetで作成したプロジェクトは、**絶対にScratchにアップロードしないでください**。

# minuet
Scratchを基に、プログラミングコミュニティーのプログラムを作ってます。
多分オフラインでも動きます。

## クレジット
本プロジェクトでは、[scratch-www](https://github.com/scratchfoundation/scratch-www)と[scratch-editor](https://github.com/scratchfoundation/scratch-editor/blob/develop/package.json)のフォークが使われています。それぞれのクレジットのリンクは以下です。

https://github.com/TNTSuperMan/minuet-www?tab=readme-ov-file#%E3%82%AF%E3%83%AC%E3%82%B8%E3%83%83%E3%83%88

https://github.com/TNTSuperMan/minuet-editor?tab=readme-ov-file#%E3%82%AF%E3%83%AC%E3%82%B8%E3%83%83%E3%83%88

また、minuet自体のAPI設計においても[scratch-www](https://github.com/scratchfoundation/scratch-www)を参考にしています。  
[scratch-www](https://github.com/scratchfoundation/scratch-www)のライセンスの全文は、[こちら](https://github.com/scratchfoundation/scratch-www/blob/develop/LICENSE)をご参照ください。

これら主に使わせていただいたプログラムの原作者であるScratch Foundation様などに感謝を示します。

## 環境
|名目|名前|
|-|-|
|ランタイム|Bun|
|フレームワーク|Elysia|
|データベース|SQLite(or MySQL&PostgreSQL(未確認))|

## 環境変数
.envなりコマンドラインなりで環境変数いじってね
|名前|初期値・無い時の挙動|説明|
|-|-|-|
|API_PORT|4519|APIサーバーのポート番号|
|WWW_PORT|4517|WWWサーバーのポート番号|
|PROJECT_PORT|4513|プロジェクトサーバーのポート番号|
|STATIC_PORT|4514|アップロードサーバーのポート番号|
|ASSET_PORT|4518|アセットサーバーのポート番号|
|HOST|http://localhost|フロントエンドがアクセスするサーバーのURL|
|ORIGINS||CORSのオリジン(カンマ区切り)|
|DATABASE_URL|知らん|データベースのURIスキーム(詳細は[Bunのドキュメント](https://bun.com/docs/api/sql)見て)|
|JWT_KEY_PATH|毎回生成されます|セッション管理に使われる鍵のファイルパス|
|CSRF_SECRET|毎回生成されます|CSRFトークンの生成・検証に使う文字列の秘密鍵|
|TURNSTILE_SITE_KEY|Turnstile認証は行われません|Turnstile認証用のサイトキー|

## 導入
- ないのであれば[bun](https://bun.sh/)をインストール
- ここで`bun i`
- そして`sh setup.sh`

> [!WARNING]
> 現在setup.sh(minuet-www)周辺の環境変数とかそういう所が結構面倒くさいことになっています。
> いつか改善します()

## 実行
```sh
$ bun dev
```
