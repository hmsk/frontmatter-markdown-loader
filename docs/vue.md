# Vue compilation

Further about `MODE.VUE_COMPONENT`, `MODE.VUE_RENDER_FUNCTIONS` in ["mode" option](/mode#vue-component).

::: warning Additional dependencies
To use this mode, your project need to install [vue-template-compiler](https://www.npmjs.com/package/vue-template-compiler) and [vue-template-es2015-compiler](https://www.npmjs.com/package/vue-template-es2015-compiler).
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

`render` and `staticRenderFns` are necessary member of Vue's component internally. The loader can return these and we can call in the hand-made Vue component. Then you can inject components as sub-components. If the markdown body has the matching HTML tag to their name, Vue will run as Vue component 🧙‍♀️.

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
