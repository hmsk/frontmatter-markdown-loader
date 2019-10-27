# Migrate to `3.*`

If you're using `vue.component`, `vue.render` or `vue.staticRenderFns` by importing. The upgrade may affect your project.

On the template for Vue component by compiling markdown,

- Source attributes for `img`, `video`, `source`, `image`, `use` tag
- `![alt text](Image URL)` on Markdown

are transformed as Webpack env's assets like `require(originalPath)` as default. So, check each element is working as you intended.

To disable this transformation, give `vue.transformAssetUrls: false`.

```js
{
  test: /\.md$/,
  loader: 'frontmatter-markdown-loader'
  options: {
    mode: [Mode.VUE_COMPONENT]
    vue: {
      transformAssetUrls: false
    }
  }
}
```

And `vue.render`, `vue.staticRenderFns` becomes to return functions instead of string of functions.

```diff
import fm from "something.md"
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

  render (createElement) {
    return this.templateRender ? this.templateRender() : createElement("div", "Rendering");
  },

  created () {
-    this.templateRender = new Function(fm.vue.render)();
-    this.$options.staticRenderFns = new Function(fm.vue.staticRenderFns)()
+    this.templateRender = fm.vue.render;
+    this.$options.staticRenderFns = fm.vue.staticRenderFns;
  }
}
```

# Migrate to `2.*`/`3.*` from `1.*`

From `2.0.0`, `mode` is added to load contents selectively. That was breaking change but compresses the build size a lot.

See the section as your use-case in 1.x.y:

[[toc]]

## Was importing `md.html` only

As v2's default behavior, `html` and `attributes` will be returned. So nothing to configure in your end. The config will be really simple.

```js
{
  test: /\.md$/,
  loader: 'frontmatter-markdown-loader'
}
```

Then the loader gives `[Mode.HTML]` for `options.mode`.

## Was importing `md.body`

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

## Was importing `md.attributes._meta`

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

## Was using `vue: true` option

### To use `md.vue.render`, `md.vue.staticRenderFns`

Have `Mode.VUE_RENDER_FUNCTIONS` (`vue-render-functions` as string) on `options.mode`.

```js
import Mode from "frontmatter-markdown-loader/mode"

...

{
  test: /\.md$/,
  loader: 'frontmatter-markdown-loader'
  options: {
    mode: [Mode.VUE_RENDER_FUNCTIONS]
  }
}
```

If you had `vue.root`, you can keep that to specify the class name of root element.

```js
{
  test: /\.md$/,
  loader: 'frontmatter-markdown-loader'
  options: {
    mode: [Mode.VUE_RENDER_FUNCTIONS],
    vue: {
      root: 'myAwesomeMarkdown'
    }
  }
}
```

### To use `md.vue.component`

Have `Mode.VUE_COMPONENT` (`vue-component` as string) on `options.mode`.

```js
import Mode from "frontmatter-markdown-loader/mode"

...

{
  test: /\.md$/,
  loader: 'frontmatter-markdown-loader'
  options: {
    mode: [Mode.VUE_COMPONENT]
  }
}
```

If you had `vue.root`, you can keep that to specify the class name of root element.

```js
{
  test: /\.md$/,
  loader: 'frontmatter-markdown-loader'
  options: {
    mode: [Mode.VUE_COMPONENT],
    vue: {
      root: 'myAwesomeMarkdown'
    }
  }
}
```
