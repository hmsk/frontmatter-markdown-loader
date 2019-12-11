# frontmatter-markdown-loader [![frontmatter-markdown-loader Dev Token](https://badge.devtoken.rocks/frontmatter-markdown-loader)](https://devtoken.rocks/package/frontmatter-markdown-loader)

[![npm](https://img.shields.io/npm/v/frontmatter-markdown-loader.svg?style=for-the-badge)](https://www.npmjs.com/package/frontmatter-markdown-loader)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/hmsk/frontmatter-markdown-loader/Node%20CI?style=for-the-badge)](https://github.com/hmsk/frontmatter-markdown-loader/actions?query=workflow%3A%22Node+CI%22)

Webpack Loader for [Front Matter](https://jekyllrb.com/docs/front-matter/) files (.md) which returns:

- Front Matter attributes
- Compiled markdown as HTML
- [Compiled markdown as a React component](https://hmsk.github.io/frontmatter-markdown-loader/react.html)
- [Compiled markdown as a Vue component](https://hmsk.github.io/frontmatter-markdown-loader/vue.html)

This FrontMatter markdown file `something.md`:

```md
---
subject: Hello
tags:
  - tag1
  - tag2
---
# Title

message
```

is loadable as:

```js
import fm from "something.md"

fm.attributes // FrontMatter attributes => { subject: "Hello", tags: ["tag1", "tag2"] }
fm.html // Compiled markdown as HTML => "<h1>Title</h1>\n<p>message</p>\n"
fm.react // Component function for React which renders compiled markdown (Disabled as default)
fm.vue.component // Extendable component object for Vue which renders compiled markdown (Disabled as default)
```

📚 See the [documentation](https://hmsk.github.io/frontmatter-markdown-loader/) for the further detail.

<details>
<summary>🔰 You have trouble with missing object?</summary>

The loader got the breaking changes in the latest major update. The article which you referred might premise on the old version. Check the installed version, if that says `1.x.y`, see [this guide](https://hmsk.github.io/frontmatter-markdown-loader/migration).
</details>

## Samples

- [vue-cli app](https://github.com/hmsk/frontmatter-markdown-loader-vue-sample)
- [Nuxt.js](https://github.com/hmsk/frontmatter-markdown-loader-nuxt-sample)
- [NextJS (w/ Netlify CMS)](https://www.netlifycms.org/docs/nextjs/)

## Inspired/Referred

- [egoist/vmark: Convert markdown to Vue component.](https://github.com/egoist/vmark)
- [webpack-contrib/json-loader: json loader module for webpack](https://github.com/webpack-contrib/json-loader)

## License

- [MIT License](LICENSE) Copyright 2018-present Kengo Hamasaki
- And thanks for [Contributors](https://github.com/hmsk/frontmatter-markdown-loader/graphs/contributors)
