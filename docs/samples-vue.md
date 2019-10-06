# vue-cli app

- [Sample Project: hmsk/frontmatter-markdown-loader-vue-sample](https://github.com/hmsk/frontmatter-markdown-loader-vue-sample)

## Register the loader through `vue.config.js`

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
            mode: [Mode.VUE_COMPONENT],
            vue: {
              root: 'markdown-body'
            }
          }
        })
  }
}
```

# Nuxt app

::: warning TBD
Will be filled with nice samples later
:::

```ts
import FMMode from "frontmatter-markdown-loader/mode";

  ...
  build: {
    extend (config: any): void {
      config.module.rules.push(
        {
          test: /\.md$/,
          loader: "frontmatter-markdown-loader",
          include: episodeDir,
          options: {
            mode: [FMMode.VUE_COMPONENT],
            vue: {
              root: "episodeMarkdown"
            },
            markdown: (body: string) => {
              return md.render(body);
            }
          }
        }
      )
    },
    ...
  }
  ...
```
