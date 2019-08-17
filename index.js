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

export const Mode = {
  HTML: 'html',
  BODY: 'body',
  META: 'meta',
  VUE_COMPONENT: 'vue-component',
  VUE_RENDER_FUNCTIONS: 'vue-render-functions'
};

export default function (source) {
  if (this.cacheable) this.cacheable();

  const options = loaderUtils.getOptions(this) || {}
  const requestedMode = Array.isArray(options.mode) ? options.mode : [Mode.HTML, Mode.BODY];
  const enabled = (mode) => requestedMode.includes(mode);

  let output = '';
  const addProperty = (key, value) => {
    output += `
      ${key}: ${value},
    `;
  };

  const fm = frontmatter(source);
  fm.html = options.markdown ? options.markdown(fm.body) : md.render(fm.body);

  addProperty('attributes', stringify(fm.attributes));
  if (enabled(Mode.HTML)) addProperty('html', stringify(fm.html));
  if (enabled(Mode.BODY)) addProperty('body', stringify(fm.body));
  if (enabled(Mode.META)) {
    const meta = {
      resourcePath: this.resourcePath
    };
    addProperty('meta', stringify(meta));
  }

  if ((enabled(Mode.VUE_COMPONENT) || enabled(Mode.VUE_RENDER_FUNCTIONS)) && vueCompiler && vueCompilerStripWith) {
    const rootClass = options.vue && options.vue.root ? options.vue.root : 'frontmatter-markdown';
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

    let vueOutput = '';

    if (enabled(Mode.VUE_RENDER_FUNCTIONS)) {
      vueOutput += `
        render: ${stringify(render)},
        staticRenderFns: ${stringify(staticRenderFns)},
      `;
    }

    if (enabled(Mode.VUE_COMPONENT)) {
      vueOutput += `
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
      `;
    }

    addProperty('vue', `{${vueOutput}}`);
  }

  return `module.exports = { ${output} }`;
}
