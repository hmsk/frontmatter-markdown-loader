# frontmatter-markdown-loader [![frontmatter-markdown-loader Dev Token](https://badge.devtoken.rocks/frontmatter-markdown-loader)](https://devtoken.rocks/package/frontmatter-markdown-loader)

[![npm](https://img.shields.io/npm/v/frontmatter-markdown-loader.svg?style=for-the-badge)](https://www.npmjs.com/package/frontmatter-markdown-loader)
[![CircleCI](https://img.shields.io/circleci/project/github/hmsk/frontmatter-markdown-loader/master.svg?style=for-the-badge)](https://circleci.com/gh/hmsk/frontmatter-markdown-loader/tree/master)


Webpack Loader for: FrontMatter (.md) which returns Compiled HTML + Attributes (+ [Compiled object as a Vue component](https://github.com/hmsk/frontmatter-markdown-loader-vue-sample))

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

And there are some convenience features for Vue stack 😉

See [documentation](https://hmsk.github.io/frontmatter-markdown-loader/) for the further detail.

## Inspired/Referred

- [egoist/vmark: Convert markdown to Vue component.](https://github.com/egoist/vmark)
- [webpack-contrib/json-loader: json loader module for webpack](https://github.com/webpack-contrib/json-loader)

## Contributor

- [Daniel Roe / @danielroe](https://github.com/danielroe)

## License

- [MIT](LICENSE) Copyright Kengo Hamasaki
