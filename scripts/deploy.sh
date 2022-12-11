#!/bin/bash

npm run build
npm version patch
git push
git push --tags
npm publish --access=public
