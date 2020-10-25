# node-image-processing
A library for automatically generating optimized images at various image sizes. The main function returns the relevant data, such as `srcSet`, `sizes`, `lqip`, so they can be used for responsive optimized images in the browser.

## Getting started
Install the following peer dependencies:
```
"axios": ">=0.20.0",
"sharp": ">=0.26.0"
```

## Commands

```bash
npm start # or yarn start
```
This builds to `/dist` and runs the project in watch mode so any edits you save inside `src` causes a rebuild to `/dist`.
<br/><br>

```bash
npm run build # or yarn build
```
Builds a one-off build.
<br/><br>

```bash
npm test # or yarn test
```
Runs tests.
<br/><br/>

```bash
npm run dev # or yarn dev
```
Copies the compiled files in the `dist/` folder to the target project/directory specified in `scripts/dev.env.js`. See `Local Development` section below for more details.
<br/><br/>

## Local Development
For easier local devopment when using this package in another project, run `bash npm run dev (or yarn dev)`. This runs the `scripts/dev.js` file that watches for file changes in the `dist/` folder and copies the content into the folder specified in `scripts/dev.env.js`. I find this method to be significantly simpler than using `yarn link`

## Configuration

Code quality is set up for you with `prettier`, `husky`, and `lint-staged`. Adjust the respective fields in `package.json` accordingly.

### Bundle Analysis

[`size-limit`](https://github.com/ai/size-limit) is set up to calculate the real cost of your library with `npm run size` and visualize the bundle with `npm run analyze`.

### Rollup

TSDX uses [Rollup](https://rollupjs.org) as a bundler and generates multiple rollup configs for various module formats and build settings. See [Optimizations](#optimizations) for details.

## Continuous Integration

### GitHub Actions

Two actions are added by default:

- `main` which installs deps w/ cache, lints, tests, and builds on all pushes against a Node and OS matrix
- `size` which comments cost comparison of your library on every pull request using [`size-limit`](https://github.com/ai/size-limit)

## Module Formats

CJS, ESModules, and UMD module formats are supported.

The appropriate paths are configured in `package.json` and `dist/index.js` accordingly. Please report if any issues are found.

## Publishing to NPM

We recommend using [np](https://github.com/sindresorhus/np).
