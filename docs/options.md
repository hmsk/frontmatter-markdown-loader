# Options

The loader accepts some options to configure.

[[toc]]

## Mode

`options.mode` option requests what you can import from frontmatter markdown data.

This option is added since 2.0.0. So see [Migration Guide](migration) if you are using `1.x`.

```js
import Mode from 'frontmatter-markdown-loader/mode'
```

will provide constats. `Mode.NAME_OF_MODE`.

::: tip Plain string is available
You may not want to import `frontmatter-markdown-loader/mode`. Then you can just give string instead.

- `Mode.HTML` -> `"html"`
- `Mode.BODY` -> `"body"`
- `Mode.META` -> `"meta"`
- `Mode.VUE_COMPONENT` -> `"vue-component"`
- `Mode.VUE_RENDER_FUNCTIONS` -> `"vue-render-functions"`
:::

### Default

By default (When we don't specify any `mode` option), `attributes` and `html` are only available.

That's equivalent to:

```js
{
  test: /\.md$/,
  loader: 'frontmatter-markdown-loader'
  options: {
    mode: [Mode.HTML]
  }
}
```

```js
import fm from "something.md"

fm.attributes //=> { subject: "Hello", tags: ["tag1", "tag2"] }
fm.html //=> "<h1>Title</h1>\n<p>message</p>\n"
```

### Raw markdown

`Mode.BODY` gives raw string of Markdown part on frontmatter markdown.

```js
{
  test: /\.md$/,
  loader: 'frontmatter-markdown-loader'
  options: {
    mode: [Mode.BODY]
  }
}
```

```js
import fm from "something.md"

fm.attributes //=> { subject: "Hello", tags: ["tag1", "tag2"] }
fm.html //=> undefined
fm.body //=> "# Title\n\nmessage\n"
```

### Metadata

`Mode.META` shows the metadata of the frontmatter markdown file.

```js
{
  test: /\.md$/,
  loader: 'frontmatter-markdown-loader'
  options: {
    mode: [Mode.META]
  }
}
```

```js
import fm from "something.md"

fm.meta //=> { resourcePath: "/somepath/something.md" }
```

Currently, only `resourcePath` is available which returns [the path for the file in Webpack's context](https://webpack.js.org/api/loaders/#thisresourcepath).

### Vue component

`Mode.VUE_COMPONENT` requests to get the extendable component object of Vue.

```js
{
  test: /\.md$/,
  loader: 'frontmatter-markdown-loader'
  options: {
    mode: [Mode.VUE_COMPONENT]
  }
}
```

```js
import fm from "something.md"

fm.vue.component //=> The object which can be extendable as Vue component which has compiled HTML as the template
```

::: tip How to use in Vue
To see the usage of `fm.vue.component`, see [this page](/vue).
:::

### Vue's render functions

`Mode.VUE_RENDER_FUNCTIONS` requests to get functions which are required to build Vue component. The function is having the compiled markdown as template of component.

```js
{
  test: /\.md$/,
  loader: 'frontmatter-markdown-loader'
  options: {
    mode: [Mode.VUE_RENDER_FUNCTIONS]
  }
}
```

```js
import fm from "something.md"

fm.vue.render //=> render function as string
fm.vue.staticRenderFns //=> List of staticRender function as string
```

::: tip How to use in Vue
To see the usage of `fm.vue.component`, see [this page](/vue).
:::

## Markdown compiler

By default, we use the [`markdown-it`](https://github.com/markdown-it/markdown-it) package for compiling the Markdown into HTML. There are several ways you can customize this behavior.

If you want to pass custom options, you can do so by passing them to the `markdownIt` option parameter in your Webpack config:

```js
{
  test: /\.md$/,
  loader: 'frontmatter-markdown-loader'
  options: {
    markdownIt: { html: true },
  }
}
```

The example above is the default behavior, but there are [many more options available](https://markdown-it.github.io/markdown-it/#MarkdownIt.new).

If you want to further customize the markdown-it instance (with [plugins](https://www.npmjs.com/search?q=keywords:markdown-it-plugin), for instance), you can also pass in your own instance of `markdown-it`:

```js
const markdownIt = require('markdown-it');
const markdownItPrism = require('markdown-it-prism');
{
  test: /\.md$/,
  loader: 'frontmatter-markdown-loader'
  options: {
    markdownIt: markdownIt({ html: true }).use(markdownItPrism),
  }
}
```

You can also specify a completely different compiler for Markdown if you like. `options.markdown` expects the callback function which takes the string of markdown for its argument. And expects returning compiled HTML.

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

## Vue's root element

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

can specify the class name of the root element on the imported Vue's template.
