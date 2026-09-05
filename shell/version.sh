#!/bin/sh
set -e
baseVersion=2.1
releaseVersion=${baseVersion}.${1}
nextVersion=${baseVersion}.$((${1}+1))-SNAPSHOT
writeEditorVersion() {
  printf 'export const editorVersion = "%s";\n' "$1" > src/editor/editor-version.ts
}
# do lint
rm -rf temp
mkdir -p artifacts
rm -f artifacts/v${releaseVersion}.tgz
yarn lint
yarn version --new-version=${releaseVersion} --no-git-tag-version
writeEditorVersion "${releaseVersion}"
git add package.json yarn.lock src/editor/editor-version.ts
git commit -m"v${releaseVersion}"
git tag "v${releaseVersion}"
mkdir -p temp/shell && cp README.md temp && cp -R src temp && cp package.json temp && cp tsconfig.json temp/tsconfig.json && cp tsconfig-pack.json temp/tsconfig-pack.json && cp tsconfig-markdown.json temp && cp shell/build-markdown.cjs temp/shell && cp .eslintrc.json temp
rm -rf temp/src/pages
rm -rf temp/src/index.tsx
rm -rf temp/src/react-app-env.d.ts
cd temp && tsc --project tsconfig-pack.json --incremental false && yarn build:markdown && yarn pack --filename v${releaseVersion}.tgz
cd ..
cp "temp/dist/markdown/zrlog-markdown.umd.js" "artifacts/zrlog-markdown-v${releaseVersion}.min.js"
mv temp/*.tgz artifacts && rm -rf temp
git add artifacts shell src public package.json yarn.lock README.md build
git commit -m"release by shell[${releaseVersion}]"
yarn version --new-version=${nextVersion} --no-git-tag-version
writeEditorVersion "${nextVersion}"
git add package.json yarn.lock src/editor/editor-version.ts
git commit -m"v${nextVersion}"
git tag "v${nextVersion}"
git push
