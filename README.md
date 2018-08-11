# frontmatter-markdown-loader

[![npm](https://img.shields.io/npm/v/frontmatter-markdown-loader.svg?style=for-the-badge)](https://www.npmjs.com/package/frontmatter-markdown-loader)
![CircleCI](https://img.shields.io/circleci/project/github/hmsk/frontmatter-markdown-loader.svg?style=for-the-badge)


Webpack Loader for: FrontMatter (.md) -> Markdown + Meta -> HTML + Meta (+ Vue template)

This FrontMatter markdown file `something.md`:

```md
---
subject: Hello
tags:
  - tag1
  - tag2
---
# Title

message
```

is loaded as:

```js
import fm from "something.md"

fm.attributes // FrontMatter attributes => { subject: "Hello", tags: ["tag1", "tag2"] }
fm.body // Markdown source => "# Title\n\nmessage\n"
fm.html // Compiled markdown as HTML => "<h1>Title</h1>\n<p>message</p>\n"
```

# Instllation

```
$ npm i -D frontmatter-markdown-loader
```

Or

```
$ yarn add -D frontmatter-markdown-loader
```

# Setup

Configure the loader for Markdown files like:

```js
{
  test: /\.md$/,
  loader: 'frontmatter-markdown-loader'
}
```

Then you can get frontmatter attributes and compiled markdown 🎉

```js
import fm from "something.md"
```

# Options

## Use your own markdown compiler

```js
{
  test: /\.md$/,
  loader: 'frontmatter-markdown-loader'
  options: {
    markdown: (body) => {
      return compileWithYourMDCompiler(body)
    }
  }
}
```

As default, compiling markdown body with [markdown-it](https://www.npmjs.com/package/markdown-it) with allowing HTML. So behave as same as:

```js
const md = require('markdown-it')

...

{
  test: /\.md$/,
  loader: 'frontmatter-markdown-loader'
  options: {
    markdown: (body) => {
      return md.render(body)
    }
  }
}
```

## Vue template

The loader could compile HTML section of files as Vue template.

```js
{
  test: /\.md$/,
  loader: 'frontmatter-markdown-loader'
  options: {
    vue: true
  }
}
```

This returns functions by compiled template as string `render`, `staticRenderFns` which are Vue component requires.

```js
import fm from "something.md"

fm.vue.render //=> render function as string
fm.vue.staticRenderFns //=> List of staticRender function as string
```

so, you can use them in your Vue component:

```js
import OtherComponent from "OtherComponent.vue"

export default {
  data () {
    return {
      templateRender: null
    }
  },

  components: {
    OtherComponent // If markdown has `<other-component>` in body, will work :)
  },

  render: function (createElement) {
    return this.templateRender ? this.templateRender() : createElement("div", "Rendering");
  },

  created: function () {
    this.templateRender = new Function(fm.vue.render)();
    this.$options.staticRenderFns = new Function(fm.vue.staticRenderFns)();
  }
}
```

This component renders the compiled markdown including workable `OtherComponent` 🎉


Also you can give the class name of body html with `options.vue.root`.

```js
{
  test: /\.md$/,
  loader: 'frontmatter-markdown-loader'
  options: {
    vue: {
      root: 'dynamicContent'
    }
  }
}
```

# Inspired/Refered

- [egoist/vmark: Convert markdown to Vue component.](https://github.com/egoist/vmark)
- [webpack-contrib/json-loader: json loader module for webpack](https://github.com/webpack-contrib/json-loader)

# License

- [MIT](LICENSE) Copyright Kengo Hamasaki
