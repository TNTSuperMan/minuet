> [!WARNING]
> **これは非公式です。**　**THIS IS UNOFFICIAL**
> 
> "Scratch"はMIT MediaLabの商標であり、このリポジトリはそれに関する権利を主張しません。  
> Scratch" is a trademark of MIT MediaLab and this repository claims no rights thereto.
> 
> そのため、このプログラムの使用は教育・研究・個人利用に留めてください。  
> Therefore, this program should be used only for educational, research, and personal use.

# scratch-replica
Scratchのウェブサイトを~~Hono~~Elysiaで模倣しています。  
多分オフラインでも動きます。

## 環境
|名目|名前|
|-|-|
|ランタイム|Bun|
|フレームワーク|Elysia|
|データベース|SQLite|

## 導入
- ないのであれば[bun](https://bun.sh/)をインストール
- ここで`bun i`
- そして`sh setup.sh`

## 実行
```sh
$ bun dev
```
APIサーバーは[http://localhost:4519](http://localhost:4519)、  
Webサーバーは[http://localhost:4517](http://localhost:4517)、  
プロジェクトサーバーは[http://localhost:4513](http://localhost:4513)、  
リソースサーバーは[http://localhost:4514](http://localhost:4514)、
アセットサーバーは[http://localhost:4518](http://localhost:4518)で動きます。
