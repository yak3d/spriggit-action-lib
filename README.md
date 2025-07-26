# spriggit-action-lib

> Template to kickstart creating a Node.js module using TypeScript and VSCode

Inspired by [node-module-boilerplate](https://github.com/sindresorhus/node-module-boilerplate)

## Features

- [Semantic Release](https://github.com/semantic-release/semantic-release)
- [Issue Templates](https://github.com/ryansonshine/spriggit-action-lib/tree/main/.github/ISSUE_TEMPLATE)
- [GitHub Actions](https://github.com/ryansonshine/spriggit-action-lib/tree/main/.github/workflows)
- [Codecov](https://about.codecov.io/)
- [VSCode Launch Configurations](https://github.com/ryansonshine/spriggit-action-lib/blob/main/.vscode/launch.json)
- [TypeScript](https://www.typescriptlang.org/)
- [Husky](https://github.com/typicode/husky)
- [Lint Staged](https://github.com/okonet/lint-staged)
- [Commitizen](https://github.com/search?q=commitizen)
- [Jest](https://jestjs.io/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)

## Getting started

### Set up your repository

**Click the "Use this template" button.**

Alternatively, create a new directory and then run:

```bash
curl -fsSL https://github.com/ryansonshine/spriggit-action-lib/archive/main.tar.gz | tar -xz --strip-components=1
```

Replace `FULL_NAME`, `GITHUB_USER`, and `REPO_NAME` in the script below with your own details to personalize your new package:

```bash
FULL_NAME="John Smith"
GITHUB_USER="johnsmith"
REPO_NAME="my-cool-package"
sed -i.mybak "s/\([\/\"]\)(ryansonshine)/$GITHUB_USER/g; s/spriggit-action-lib\|spriggit-action-lib/$REPO_NAME/g; s/Yak/$FULL_NAME/g" package.json package-lock.json README.md
rm *.mybak
```

### Add NPM Token

Add your npm token to your GitHub repository secrets as `NPM_TOKEN`.

### Add Codecov integration

Enable the Codecov GitHub App [here](https://github.com/apps/codecov).

**Remove everything from here and above**

---

# spriggit-action-lib

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Code Coverage][codecov-img]][codecov-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]
[![Semantic Release][semantic-release-img]][semantic-release-url]

> A TypeScript library for downloading, extracting, and managing Spriggit CLI tools

## Install

```bash
npm install spriggit-action-lib
```

## Usage

### Download and Extract Files

```ts
import { downloadFileToDestination } from 'spriggit-action-lib';

// Download a file from URL to local destination
await downloadFileToDestination('https://example.com/file.zip', './downloads/file.zip');
```

### Extract ZIP Files

```ts
import { unzipFile } from 'spriggit-action-lib';

// Extract a ZIP file to a destination directory
await unzipFile('./downloads/file.zip', './extracted/');
```

### Download Spriggit

```ts
import { downloadSpriggit } from 'spriggit-action-lib';

// Download and set up Spriggit CLI for a specific version
await downloadSpriggit('v1.2.3');
```

### Complete Example

```ts
import { downloadSpriggit, downloadFileToDestination, unzipFile } from 'spriggit-action-lib';

async function setupSpriggit() {
  try {
    // Download and set up Spriggit CLI
    await downloadSpriggit('v1.2.3');
    console.log('Spriggit setup complete!');
  } catch (error) {
    console.error('Failed to setup Spriggit:', error);
  }
}

setupSpriggit();
```

[build-img]:https://github.com/ryansonshine/spriggit-action-lib/actions/workflows/release.yml/badge.svg
[build-url]:https://github.com/ryansonshine/spriggit-action-lib/actions/workflows/release.yml
[downloads-img]:https://img.shields.io/npm/dt/spriggit-action-lib
[downloads-url]:https://www.npmtrends.com/spriggit-action-lib
[npm-img]:https://img.shields.io/npm/v/spriggit-action-lib
[npm-url]:https://www.npmjs.com/package/spriggit-action-lib
[issues-img]:https://img.shields.io/github/issues/ryansonshine/spriggit-action-lib
[issues-url]:https://github.com/ryansonshine/spriggit-action-lib/issues
[codecov-img]:https://codecov.io/gh/ryansonshine/spriggit-action-lib/branch/main/graph/badge.svg
[codecov-url]:https://codecov.io/gh/ryansonshine/spriggit-action-lib
[semantic-release-img]:https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]:https://github.com/semantic-release/semantic-release
[commitizen-img]:https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]:http://commitizen.github.io/cz-cli/
