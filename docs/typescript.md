# In TypeScript project

## Type declarations

You may see an error "Cannot Import Module" due to missing type declarations when you try to `import` a `.md` file.

In an arbitary `d.ts` file, declare about imported content.

### Frontmatter attributes

```ts
declare module '*.md' {
  const attributes: Record<string, unknown>;
  export { attributes };
}
```

This is the most optimistic declarations. As your project expects, `*.md` could be more isolated, `attributes` could be more detailed to avoid unpleasant casting in an importer's end.

### HTML

```ts
declare module '*.md' {
  const html: string;
  export { html };
}
```

### React

[When passing a component to mount](react.html#the-react-component-can-takes-prop-for-components-on-markdown), give a generic for `React.VFC` like `React.VFC<{ MyComponent: TypeOfMyComponent }>`.

```ts
declare module '*.md' {
  import React from 'react';
  const react: React.VFC;
  export { react };
}
```

### Vue

```ts
declare module '*.md' {
  import { ComponentOptions } from 'vue';
  const vue: ComponentOptions;
  export { vue };
}
```
