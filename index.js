const loaderUtils = require('loader-utils')
const frontmatter = require('front-matter')

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

  const stringified = JSON.stringify(fm)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');

  return `module.exports = ${stringified}`;
}
