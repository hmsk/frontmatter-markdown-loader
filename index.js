const loaderUtils = require('loader-utils')
const frontmatter = require('front-matter')
const vueTemplateCompiler = require('vue-template-compiler')
const vueTemplateStripWith = require('vue-template-es2015-compiler')

const md = require('markdown-it')({
  html: true,
});

module.exports = function (source) {
  if (this.cacheable) this.cacheable();

  const options = loaderUtils.getOptions(this) || {}

  fm = frontmatter(source)

  if (options.markdown) {
    fm.html = options.markdown(fm.body);
  } else {
    fm.html = md.render(fm.body);
  }

  if (options.vue) {
    const compiled = vueTemplateCompiler.compile(`<div>${fm.html}</div>`)
    fm.vue['render'] = vueTemplateStripWith(`function render() { ${compiled.render} }`)

    let staticRenderFns = '';
    if (compiled.staticRenderFns.length > 0) {
      staticRenderFns = vueTemplateStripWith(`[${compiled.staticRenderFns.map(fn => `function () { ${fn} }`).join(',')}]`)
    }
    fm.vue['staticRenderFns'] = staticRenderFns
  }

  const stringified = JSON.stringify(fm)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');

  return `module.exports = ${stringified}`;
}
