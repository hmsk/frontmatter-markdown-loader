# Nuxt examples

## Register the loader through `nuxt.config.js`

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

## Using Vue component mode in a static template

```js
<template>
  <StaticMarkdownComponent />
</template>

<script>
import StaticMarkdownComponent from '~/README.md'

export default {
  components: { StaticMarkdownComponent: StaticMarkdownComponent.vue.component }
}
</script>
```

## Using Vue component mode in a dynamic template

Instantiate a [Vue async component](https://vuejs.org/v2/guide/components-dynamic-async.html#Async-Components) in create lifecycle hook which gets [executed during server-side-render](https://ssr.vuejs.org/guide/universal.html#data-reactivity-on-the-server).

```js
<template>
  <component :is="dynamicMarkdownComponent" />
</template>

<script>
export default {
  data: () => ({ dynamicMarkdownComponent: null }),
  created () {
    this.dynamicMarkdownComponent = async () =>
      (await import(`~/content/${this.$route.id}`)).vue.component
  }
}
</script>
```