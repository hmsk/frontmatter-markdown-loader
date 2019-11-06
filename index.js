const loaderUtils = require('loader-utils')
const frontmatter = require('front-matter')
const Mode = require('./mode')
const markdownIt = require('markdown-it');

const stringify = (src) => JSON.stringify(src).replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');

function getNormalizedMarkdownCompiler(options) {
  if (options.markdown && options.markdownIt) {
    throw new Error(
      "Both markdown and markdownIt options were specified. This is not supported. \n" +
      "Please refer to the documentation for usage: \n" +
      "https://hmsk.github.io/frontmatter-markdown-loader/options.html#markdown-compilation"
    );
  }

  // If you've specified the markdown option, hand over control
  if (options.markdown) {
    return { render: options.markdown };
  }

  // If you've passed in a MarkdownIt instance, just use that
  if (options.markdownIt instanceof markdownIt) {
    return options.markdownIt;
  }

  // Configuration object? Pass it to our default compiler
  if (typeof options.markdownIt === 'object') {
    return markdownIt(options.markdownIt);
  }

  // If no configuration is passed - use a sensible default
  return markdownIt({ html: true });
}

module.exports = function (source) {
  if (this.cacheable) this.cacheable();

  const options = loaderUtils.getOptions(this) || {}
  const requestedMode = Array.isArray(options.mode) ? options.mode : [Mode.HTML];
  const enabled = (mode) => requestedMode.includes(mode);

  let exported = '', prependOutput = '';
  const addPrepend = (code) => {
    prependOutput = prependOutput.concat(`${code}\n`)
  };
  const addProperty = (key, value) => {
    exported += `
      ${key}: ${value},
    `;
  };

  const fm = frontmatter(source);
  const markdownCompiler = getNormalizedMarkdownCompiler(options);
  fm.html = markdownCompiler.render(fm.body);

  addProperty('attributes', stringify(fm.attributes));
  if (enabled(Mode.HTML)) addProperty('html', stringify(fm.html));
  if (enabled(Mode.BODY)) addProperty('body', stringify(fm.body));
  if (enabled(Mode.META)) {
    const meta = {
      resourcePath: this.resourcePath
    };
    addProperty('meta', stringify(meta));
  }

  if ((enabled(Mode.VUE_COMPONENT) || enabled(Mode.VUE_RENDER_FUNCTIONS))) {
    let vueCompiler, compileVueTemplate;
    try {
      vueCompiler = require('vue-template-compiler')
      compileVueTemplate = require('@vue/component-compiler-utils').compileTemplate
    } catch (err) {
      throw new Error(
        "Failed to import vue-template-compiler or/and @vue/component-compiler-utils: \n" +
        "If you intend to use 'vue-component', `vue-render-functions` mode, install both to your project: \n" +
        "https://hmsk.github.io/frontmatter-markdown-loader/vue.html"
      );
    }

    const rootClass = options.vue && options.vue.root ? options.vue.root : 'frontmatter-markdown';
    const template = fm
      .html
      .replace(/<(code\s.+)>/g, "<$1 v-pre>")
      .replace(/<code>/g, "<code v-pre>");

    const compileOptions = {
      source: `<div class="${rootClass}">${template}</div>`,
      filename: this.resourcePath,
      compiler: vueCompiler,
      compilerOptions: {
        outputSourceRange: true
      },
      transformAssetUrls: (options.vue && (options.vue.transformAssetUrls === false || options.vue.transformAssetUrls)) ? options.vue.transformAssetUrls : true,
      isProduction: process.env.NODE_ENV === 'production'
    };

    const compiled = compileVueTemplate(compileOptions);
    addPrepend(`const extractVueFunctions = () => {\n${compiled.code}\nreturn { render, staticRenderFns }\n}\nconst vueFunctions = extractVueFunctions()`);

    let vueOutput = '';

    if (enabled(Mode.VUE_RENDER_FUNCTIONS)) {
      vueOutput += `
        render: vueFunctions.render,
        staticRenderFns: vueFunctions.staticRenderFns,
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
            this.templateRender = vueFunctions.render;
            this.$options.staticRenderFns = vueFunctions.staticRenderFns;
          }
        }
      `;
    }

    addProperty('vue', `{${vueOutput}}`);
  }

  if (enabled(Mode.REACT)) {
    let babelCore;

    try {
      babelCore = require('@babel/core');
      require('@babel/preset-react');
    } catch (err) {
      throw new Error(
        "Failed to import @babel/core or/and @babel/preset-react: \n" +
        "If you intend to use 'react' mode, install both to your project: \n" +
        "https://hmsk.github.io/frontmatter-markdown-loader/react.html"
      );
    }

    addPrepend(`const React = require('react')`);

    const compiled = babelCore
      .transformSync(`
        const markdown =
          <div>
            ${fm.html}
          </div>
        `, {
        presets: ['@babel/preset-react']
      });

    const reactComponent = `
      function (props) {
        Object.entries(props).forEach(([key, value]) => {
          this[key] = value;
        });
        ${compiled.code}
        return markdown;
      }
    `
    addProperty('react', reactComponent);
  }

  return `${prependOutput}\nmodule.exports = { ${exported} }`;
}
