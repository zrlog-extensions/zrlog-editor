#/bin/sh
# do lint
rm -rf temp
rm -rf artifacts
mkdir -p artifacts
yarn lint
baseVersion=2.0
releaseVersion=${baseVersion}.${1}
nextVersion=${baseVersion}.$((${1}+1))-SNAPSHOT
yarn version --new-version=${releaseVersion}
mkdir -p temp && cp README.md temp && cp -R src temp && cp package.json temp && cp tsconfig.json temp/tsconfig.json && cp tsconfig-pack.json temp/tsconfig-pack.json && cp .eslintrc.json temp
rm -rf temp/src/pages
rm -rf temp/src/index.tsx
rm -rf temp/src/react-app-env.d.ts
cd temp && tsc && yarn pack --filename v${releaseVersion}.tgz
cd ..
mv temp/*.tgz artifacts && rm -rf temp
git add artifacts shell src package.json yarn.lock README.md build
git commit -m"release by shell[${releaseVersion}]"
yarn version --new-version=${nextVersion}
git push