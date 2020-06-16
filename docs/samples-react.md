# React App

[[toc]]

## NextJS

- https://www.netlifycms.org/docs/nextjs/

The sample guide for Netlify CMS with NextJS is using `frontmatter-markdown-loader` and its `Mode.REACT`.

### Register the loader in config `next.config.js`

```js
module.exports = {
  webpack: (cfg) => {
    cfg.module.rules.push({
      test: /\.md$/,
      use: 'frontmatter-markdown-loader',
      options: { mode: ['react-component'] }
    })
    return cfg
  }
}
```

Otherwise, just refer [React Component Guide](./react).

## Rewired create-react-app

[react-app-rewired](https://github.com/timarney/react-app-rewired) enables us to edit Webpack config easily.

### Register the loader in config `config-overrides.js`

```js
module.exports = function override(config, env) {
  config.module.rules.push({
    test: /\.md$/,
    loader: 'frontmatter-markdown-loader',
    options: {
      mode: ['react-component']
    }
  })
  return config
}
```

[react-app-rewire-frontmatter-markdown](https://www.npmjs.com/package/react-app-rewire-frontmatter-markdown) makes that config simpler and safer.

```js
const rewireFrontmatterMarkdown = require('react-app-rewire-frontmatter-markdown')

module.exports = function override(config, env) {
  rewireFrontmatterMarkdown(config)
  return config
}
```

Otherwise, just refer [React Component Guide](./react).
