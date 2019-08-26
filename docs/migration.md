# Migration from 1.x

From `2.0.0`, `mode` is added to load contents selectively. That was breaking change but compresses the build size a lot.

See the section as your use-case in 1.x.

[[toc]]

## Was using `md.body`

Have `Mode.BODY` (`body` as string) on `options.mode`.

```js
import Mode from "frontmatter-markdown-loader/mode"

...

{
  test: /\.md$/,
  loader: 'frontmatter-markdown-loader'
  options: {
    mode: [Mode.HTML, Mode.BODY]
  }
}
```

## Was using `md.attributes._meta`

Have `Mode.META` (`meta` as string) on `options.mode`.

```js
import Mode from "frontmatter-markdown-loader/mode"

...

{
  test: /\.md$/,
  loader: 'frontmatter-markdown-loader'
  options: {
    mode: [Mode.HTML, Mode.META]
  }
}
```

## Was using `md.vue.render`, `md.vue.staticRenderFns`

Have `Mode.VUE_RENDER_FUNCTIONS` (`vue-render-functions` as string) on `options.mode`.

```js
import Mode from "frontmatter-markdown-loader/mode"

...

{
  test: /\.md$/,
  loader: 'frontmatter-markdown-loader'
  options: {
    mode: [Mode.HTML, Mode.VUE_RENDER_FUNCTIONS]
  }
}
```

If you had `vue.root`, you can keep that to specify the class name of root element.

```js
{
  test: /\.md$/,
  loader: 'frontmatter-markdown-loader'
  options: {
    mode: [Mode.HTML, Mode.VUE_RENDER_FUNCTIONS],
    vue: {
      root: 'myAwesomeMarkdown'
    }
  }
}
```

## Was using `md.vue.component`

Have `Mode.VUE_COMPONENT` (`vue-component` as string) on `options.mode`.

```js
import Mode from "frontmatter-markdown-loader/mode"

...

{
  test: /\.md$/,
  loader: 'frontmatter-markdown-loader'
  options: {
    mode: [Mode.HTML, Mode.VUE_COMPONENT]
  }
}
```

If you had `vue.root`, you can keep that to specify the class name of root element.

```js
{
  test: /\.md$/,
  loader: 'frontmatter-markdown-loader'
  options: {
    mode: [Mode.HTML, Mode.VUE_COMPONENT],
    vue: {
      root: 'myAwesomeMarkdown'
    }
  }
}
```
