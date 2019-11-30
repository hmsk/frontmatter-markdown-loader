module.exports = {
  title: 'frontmatter-markdown-loader',
  base: '/frontmatter-markdown-loader/',
  themeConfig: {
    repo: 'hmsk/frontmatter-markdown-loader',
    nav: [
    ],
    sidebarDepth: 0,
    sidebar: [
      {
        title: 'Guide',
        collapsable: false,
        children: [
          ['/', 'Setup'],
          ['/options', 'Options'],
          ['/react', 'React Component'],
          ['/vue', 'Vue Compoent/Renderers']
        ]
      },
      {
        title: 'Samples',
        collapsable: false,
        children: [
          ['/samples-react', 'React App'],
          ['/samples-vue', 'Vue App']
        ]
      },
      {
        title: 'Migration',
        collapsable: false,
        children: [
          ['/migration', 'When you update major version'],
        ]
      }
    ]
  }
}
