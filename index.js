const loaderUtils = require('loader-utils')
const frontmatter = require('front-matter')

const md = require('markdown-it')({
  html: true,
});

const stringify = (src) => JSON.stringify(src).replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');

let vueCompiler, vueCompilerStripWith
try {
  vueCompiler = require('vue-template-compiler')
  vueCompilerStripWith = require('vue-template-es2015-compiler')
} catch (err) {
}

module.exports = function (source) {
  if (this.cacheable) this.cacheable();

  const options = loaderUtils.getOptions(this) || {}

  const fm = frontmatter(source)

  if (options.markdown) {
    fm.html = options.markdown(fm.body);
  } else {
    fm.html = md.render(fm.body);
  }

  const attributes = {
    ...fm.attributes,
    _meta: {
      resourcePath: this.resourcePath
    }
  };

  let output = `
    body: ${stringify(fm.body)},
    html: ${stringify(fm.html)},
    attributes: ${stringify(attributes)}`;

  if (!!options.vue && vueCompiler && vueCompilerStripWith) {
    const rootClass = options.vue.root || "frontmatter-markdown"
    const template = fm
      .html
      .replace(/<(code\s.+)>/g, "<$1 v-pre>")
      .replace(/<code>/g, "<code v-pre>");
    const compiled = vueCompiler.compile(`<div class="${rootClass}">${template}</div>`)
    const render = `return ${vueCompilerStripWith(`function render() { ${compiled.render} }`)}`

    let staticRenderFns = '';
    if (compiled.staticRenderFns.length > 0) {
      staticRenderFns = `return ${vueCompilerStripWith(`[${compiled.staticRenderFns.map(fn => `function () { ${fn} }`).join(',')}]`)}`
    }

    output += `,
      vue: {
        render: ${stringify(render)},
        staticRenderFns: ${stringify(staticRenderFns)},
        component: {
          data: function () {
            return {
              templateRender: null
            }
          },
          render: function (createElement) {
            return this.templateRender ? this.templateRender() : createElement("div", "Rendering");
          },
          created: function () {
            this.templateRender = ${vueCompilerStripWith(`function render() { ${compiled.render} }`)};
            this.$options.staticRenderFns = ${vueCompilerStripWith(`[${compiled.staticRenderFns.map(fn => `function () { ${fn} }`).join(',')}]`)};
          }
        }
      }
    `;
  }

  return `module.exports = { ${output} }`;
}
