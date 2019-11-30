# Vue Component/Renderers

frontmatter-markdown-loader allows you to import the compiled markdown body as **Vue's render function**, **Vue component**.

Those feature is enabled by `Mode.VUE_COMPONENT`, `Mode.VUE_RENDER_FUNCTIONS` in ["mode" option](mode#vue-component).

::: warning Additional dependencies
To use this mode, your project need to be installed some dependencies.

### After 3.0.0

- [vue-template-compiler](https://www.npmjs.com/package/vue-template-compiler)
- [@vue/component-compiler-utils](https://www.npmjs.com/package/@vue/component-compiler-utils)

In Vue CLI app, `@vue/component-compiler-utils` are installed. In Nuxt.js app, both are installed. So you may not install them explicitly.

### Until 2.3.0

- [vue-template-compiler](https://www.npmjs.com/package/vue-template-compiler)
- [vue-template-es2015-compiler](https://www.npmjs.com/package/vue-template-es2015-compiler)

:::


## Import Vue Component (`Mode.VUE_COMPONENT`)

`Mode.VUE_COMPONENT` enables us to import Vue component from a markdown file.
There are some ways to render/mount that.

::: tip
Imported component is ready-made Vue component. We don't need to have Vue compiler on the fly.
:::

### A. Mount imported markdown

```vue
<template>
  <div>
    <h1>This component mounts `something.md` as Vue component</h1>
    <h2>{{ title }}</h2>
    <from-something />
  </div>
</template>

<script>
  import fm from "something.md"

  export default {
    components: {
      FromSomething: fm.vue.component
    },
    data () {
      return {
        title: fm.attributes.title
      }
    }
  }
</script>
```

### B. Import dynamically

In Webpack based Vue app (Like vue-cli, Nuxt,js) [enables us to import files asynchrounously](https://vuejs.org/v2/guide/components-dynamic-async.html#Async-Components). That allows us to give file name dynamically.
This may help you to build CMS, Blog...etc 😉

```vue
<template>
  <div>
    <h1>This component mounts `../contents/${file name which is passed through props}.md` as Vue component dynamically</h1>
    <h2>{{ title }}</h2>
    <component :is="dynamicComponent" />
  </div>
</template>

<script>
  export default {
    props: ['fileName'],
    data () {
      return {
        title: null,
        dynamicComponent: null
      }
    },
    created () {
      this.dynamicComponent = () => import(`../contents/${this.fileName}.md`).then((md) => {
        this.title = md.title
        return md.vue.component
      })
    }
  }
</script>
```

### C. Inject other components

If the compiled markdown has `<sub-component-name>` on body, that can run as Vue component if we register sub components. Our markdown may get special behaviors magically ✨

```js
<script>
  import fm from "something.md"

  export default {
    extends: fm.vue.component,
    components: {
      OtherComponent // `<other-component>` on something.md` renders OtherComponent :)
    }
  }
</script>
```

## Legacy: Import Vue Renderers (`Mode.VUE_RENDER_FUNCTIONS`)

`render` and `staticRenderFns` are necessary members of Vue's component internally. The loader can return these and we can call in the hand-made Vue component. Then you can inject components as sub-components. If the markdown body has the matching HTML tag to their name, Vue will run as Vue component 🧙‍♀️.

Not Recommended: This feature may be deprecated in the future 🤔

### After 3.0.0

```js
<script>
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
      this.templateRender = fm.vue.render;
      this.$options.staticRenderFns = fm.vue.staticRenderFns;
    }
  }
</script>
```

### Until 2.3.0

`vue.render` and `vue.staticRenderFns` were just the string of the source.

```js
<script>
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
      this.templateRender = new Function(fm.vue.render)();
      this.$options.staticRenderFns = new Function(fm.vue.staticRenderFns)();
    }
  }
</script>
```
