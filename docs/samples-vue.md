# Vue app

[[toc]]

## vue-cli app

- [Sample Project: hmsk/frontmatter-markdown-loader-vue-sample](https://github.com/hmsk/frontmatter-markdown-loader-vue-sample)

### Register the loader through `vue.config.js`

```js
const Mode = require('frontmatter-markdown-loader/mode')

module.exports = {
  chainWebpack: config => {
    config.module
      .rule('markdown')
      .test(/\.md$/)
      .use('frontmatter-markdown-loader')
        .loader('frontmatter-markdown-loader')
        .tap(options => {
          return {
            mode: [Mode.VUE_COMPONENT]
          }
        })
  }
}
```

Otherwise, just refer [Vue Component/Renderers Guide](./vue).

## Nuxt.js app

::: tip @nuxt/content is awesome
You are trying to build your blogging system on Nuxt.js with frontmatter-markdown-loader?
Highly recommend using [@nuxt/content](https://content.nuxtjs.org/) instead 😉
:::

- [Sample Project: hmsk/frontmatter-markdown-loader-nuxt-sample](https://github.com/hmsk/frontmatter-markdown-loader-nuxt-sample)

### Register the loader through `nuxt.config.js`

```ts
import FMMode from "frontmatter-markdown-loader/mode";

  ...
  build: {
    extend (config: any): void {
      config.module.rules.push(
        {
          test: /\.md$/,
          loader: "frontmatter-markdown-loader",
          options: {
            mode: [FMMode.VUE_COMPONENT]
          }
        }
      )
    },
    ...
  }
  ...
```

Otherwise, just refer [Vue Component/Renderers Guide](./vue).
