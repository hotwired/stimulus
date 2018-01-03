# <img src="assets/logo.svg?sanitize=true" width="24" height="24" alt="Stimulus"> Stimulus

### 既存のHTMLのための控えめなJavaScriptフレームワーク

Stimulusはつつましい野望を持ったJavaScriptフレームワークです。あなたのフロントエンド環境をそっくり置き換えようなどとは画策していません。
事実、HTMLレンダリングには一切かかわりません。
代わりに、HTMLを輝かせる必要な最低限の振る舞いを与えて、増強することを念頭に置いて設計されています。
Stimulusは[Turbolinks](https://github.com/turbolinks/turbolinks)との素晴らしいペアにより、高速で魅力的なアプリケーションを最小限の労力で構築する完全なソリューションを提供できます。

どのように動作するのでしょうか？マジックコントローラとターゲットとアクションアトリビュートを加えたHTMLを書きましょう。

```html
<div data-controller="hello">
  <input data-target="hello.name" type="text">
  <button data-action="click->hello#greet">Greet</button>
</div>
```

そして対応するコントローラを書きます。Stimulusは自動的に命を与えます。


```js
// hello_controller.js
import { Controller } from "stimulus"

export default class extends Controller {
  greet() {
    console.log(`Hello, ${this.name}!`)
  }

  get name() {
    return this.targets.find("name").value
  }
}
```

Stimulus は継続的にページを監視し、マジックアトリビュートが現れたり消えたりするたびに変化を与えます。
どのようなDOMの変化でも対応します。フルページロードでも、Turbolinksページの変化でも、Ajaxリクエストでも構いません。
Stimulusは全ライフサイクルを管理します。

[Stimulusハンドブック](handbook/README.md)を見ながら5分で最初のコントローラーを書くことができます。

新しいフレームワークを作った理由については[Stimulusの始まり](ORIGIN.md)で読むことができます。


## Stimulusのインストール

Stimulus は[webpack](https://webpack.js.org/)アセットパッケージャと統合でき、自動的にコントローラファイルをあなたのアプリのフォルダからロードします。

他のアセットパッケージシステムでも使用できます。
もしビルド作業なんかしたくないなら単に<script>タグをページ内に置くだけで仕事にとりかかれます。


詳細なインストラクションについては[インストールガイド](INSTALLING.md)をご覧ください。


## 貢献する

Stimulus は[MITライセンス](LICENSE.md)のオープンソースソフトウェアで、[Ruby on Rails](http://rubyonrails.org)の創始者たちである[Basecamp](https://basecamp.com/)から生まれました。

質問がありますか？バグを発見しましたか？ドキュメントに進歩の余地がありますか？我々の[issueトラッカー](issue tracker)に来てください。助けるために最善を尽くします。プルリクエストも大歓迎です。

我々はすべてのStimulusコントリビュータが[Code of Conduct](CONDUCT.md)を遵守することを期待します。

---

© 2018 Basecamp, LLC.
