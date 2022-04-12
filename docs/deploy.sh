#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

# navigate into the build output directory
cd .vuepress/dist

git init
git add -A
git commit -m 'Deploy Doc'

git push -f git@github.com:hmsk/frontmatter-markdown-loader.git master:gh-pages

cd -
