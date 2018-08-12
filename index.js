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

  let output = `
    body: ${stringify(fm.body)},
    html: ${stringify(fm.html)},
    attributes: ${stringify(fm.attributes)}`;

  if (!!options.vue && vueCompiler && vueCompilerStripWith) {
    const rootClass = options.vue.root || "frontmatter-markdown"
    const compiled = vueCompiler.compile(`<div class="${rootClass}">${fm.html}</div>`)
    const render = `return ${vueCompilerStripWith(`function render() { ${compiled.render} }`)}`

    let staticRenderFns = '';
    if (compiled.staticRenderFns.length > 0) {
      staticRenderFns = `return ${vueCompilerStripWith(`[${compiled.staticRenderFns.map(fn => `function () { ${fn} }`).join(',')}]`)}`
    }

    output += `,
      vue: {
        render: ${stringify(render)},
        staticRenderFns: ${stringify(staticRenderFns)},
        buildComponent () {
          return {
            data () {
              return {
                templateRender: null
              }
            },
            render (createElement) {
              return this.templateRender ? this.templateRender() : createElement("div", "Rendering");
            },
            created () {
              this.templateRender = new Function(${stringify(render)})();
              this.$options.staticRenderFns = new Function(${stringify(staticRenderFns)})();
            }
          }
        }
      }
    `;
  }

  return `module.exports = { ${output} }`;
}
