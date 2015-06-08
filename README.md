# metalsmith-browserify [![Build Status](https://travis-ci.org/mpd106/metalsmith-browserify.svg?branch=master)](https://travis-ci.org/mpd106/metalsmith-browserify)

A metalsmith plugin to browserify your javascript.

## Installation

    $ npm install metalsmith-browserify

### Usage

#### metalsmith.json

```json
{
  "plugins": {
    "metalsmith-browserify": {
      "files": ["path/to/source"],
      "dest": "path/to/dest"
    }
  }
}
```

#### Javascript

```js
metalsmith.use(browserify({
  files: ['path/to/source'],
  dest: 'path/to/destination'
}));
```

#### Options

- `files`: array of source file paths
- `dest`: bundle destination path
- `transforms`: array of transform instances to be passed through to b.transform
- `excludeOtherSources`: if true, remove all js files other than `dest` from the output (default true)
- `emitSourceMap`: if true, append a source map to `dest` (default false)

## License

MIT
