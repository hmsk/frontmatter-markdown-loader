**frontmatter-markdown-loader** is the Webpack Loader for: FrontMatter (.md) which returns Compiled HTML + Attributes.

A markdown file `something.md`:

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

fm.attributes //=> { subject: "Hello", tags: ["tag1", "tag2"] }
fm.html //=> "<h1>Title</h1>\n<p>message</p>\n"
```

And there are [some convenience features for Vue stack](vue) 😉

## Setup

The module is published on [npmjs.org](https://www.npmjs.com/package/frontmatter-markdown-loader).

```sh
npm i -D frontmatter-markdown-loader
```

```sh
yarn add -D frontmatter-markdown-loader
```

### Configure Webpack

Add this loader setting to your Webpack's config.

```js
{
  test: /\.md$/,
  loader: 'frontmatter-markdown-loader'
}
```

You can change `test` as you need.
