# frontmatter-markdown-loader [![frontmatter-markdown-loader Dev Token](https://badge.devtoken.rocks/frontmatter-markdown-loader)](https://devtoken.rocks/package/frontmatter-markdown-loader)

[![npm](https://img.shields.io/npm/v/frontmatter-markdown-loader.svg?style=for-the-badge)](https://www.npmjs.com/package/frontmatter-markdown-loader)
[![CircleCI](https://img.shields.io/circleci/project/github/hmsk/frontmatter-markdown-loader/master.svg?style=for-the-badge)](https://circleci.com/gh/hmsk/frontmatter-markdown-loader/tree/master)


Webpack Loader for: FrontMatter (.md) which returns Compiled HTML + Attributes (+ [Object compiled as a Vue component](https://hmsk.github.io/frontmatter-markdown-loader/vue.html))

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
```

And there are [some convenience features for Vue stack](https://hmsk.github.io/frontmatter-markdown-loader/vue) 😉

📚 See the [documentation](https://hmsk.github.io/frontmatter-markdown-loader/) for the further detail.

## 🔰 You have trouble with missing object?

The loader got the breaking changes in the latest major update. The article which you referred might premise on the old version. Check the installed version, if that says `1.x.y`, see [this guide](https://hmsk.github.io/frontmatter-markdown-loader/migration).

## Inspired/Referred

- [egoist/vmark: Convert markdown to Vue component.](https://github.com/egoist/vmark)
- [webpack-contrib/json-loader: json loader module for webpack](https://github.com/webpack-contrib/json-loader)

## License

- [MIT](LICENSE) Copyright 2018-present Kengo Hamasaki
- [Contributors](https://github.com/hmsk/frontmatter-markdown-loader/graphs/contributors)
