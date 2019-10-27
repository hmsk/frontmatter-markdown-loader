# Vue Component/Renderers

frontmatter-markdown-loader allows you to import the compiled markdown body as **Vue's render function**, **Vue component**.

Those feature is enabled by `Mode.VUE_COMPONENT`, `Mode.VUE_RENDER_FUNCTIONS` in ["mode" option](mode#vue-component).

::: warning Additional dependencies
To use this mode, your project need to be installed some dependencies.

### After 3.0.0

- [vue-template-compiler](https://www.npmjs.com/package/vue-template-compiler)
- [@vue/component-compiler-utils](https://www.npmjs.com/package/@vue/component-compiler-utils)

### Until 2.3.0

- [vue-template-compiler](https://www.npmjs.com/package/vue-template-compiler)
- [vue-template-es2015-compiler](https://www.npmjs.com/package/vue-template-es2015-compiler)

:::

## Extendable component

We can get the base component of Vue from the markdown! That is extendable with injecting sub components.

If the compiled markdown has `<sub-component-name>`, Vue expects the sub component exists. Our markdown may get special behaviors magically ✨

```js
import fm from "something.md"

export default {
  extends: fm.vue.component,
  components: {
    OtherComponent // If markdown has `<other-component>` in body, will work :)
  }
}
```

## Render functions

`render` and `staticRenderFns` are necessary members of Vue's component internally. The loader can return these and we can call in the hand-made Vue component. Then you can inject components as sub-components. If the markdown body has the matching HTML tag to their name, Vue will run as Vue component 🧙‍♀️.

### After 3.0.0

```js
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
```

### Until 2.3.0

`vue.render` and `vue.staticRenderFns` were just the string of the source.

```js
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
```
