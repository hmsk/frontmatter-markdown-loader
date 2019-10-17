# React Component

By `Mode.REACT`, importing `.md` returns `react` property which is renderable React component as well as `Mode.VUE_COMPONENT`.

::: warning Additional dependencies
To use this mode, your project need to be installed [@babel/core](https://www.npmjs.com/package/@babel/core) and [@babel/preset-react](https://www.npmjs.com/package/@babel/preset-react).
:::

```js
import React from 'react'

import { react as Sample } from './sample.md' // <-- THIS

export default function OneComponent() {
  return (
    <div>
      <h1>Content</h1>
      <Sample /> <!-- This renders compiled markdown! -->
    </div>
  );
}
```

## The React component can takes prop for components on markdown

```md
---
title: A frontmatter
description: Having ExternalComponent on the content
---

Hi, I'm a component. <MyDecorator>Apparently, this sentence will be made bold and italic</MyDecorator>
```

```js
import React from 'react'
import { react as Sample } from './sample.md'

export default function DecoratedMarkdown() {
  const BoldAndItalic = ({children}) => <strong><i>{children}</i></strong>

  return (
    <div>
      <h1>Content</h1>
      <Sample MyDecorator={BoldAndItalic} />
    </div>
  );
}
```

Then `DecoratedMarkdown` renders:

```html
<div>
  <h1>Content</h1>
  <p>Hi, I'm a component. <strong><i>Apparently, this sentence will be made bold and italic</i></strong></p>
</div>
```

`MyDecorator` isn't the specific name for props. We can specify any external component with PascalCase.
