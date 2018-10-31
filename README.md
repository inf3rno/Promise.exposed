# Promise.exposed

[![Build Status](https://travis-ci.org/inf3rno/Promise.exposed.svg?branch=master)](https://travis-ci.org/inf3rno/Promise.exposed)

Resolving or rejecting Javascript Promise from outside.

# installation

```sh
npm install @inf3rno/promise.exposed
```

# usage

```js
require("@inf3rno/promise.exposed");
const anExposedPromise = Promise.exposed();
```

or in no-conflict mode:

```js
const createExposedPromise = require("@inf3rno/promise.exposed/noConflict");
const anExposedPromise = createExposedPromise();
```

# examples

```js
const promise = Promise.exposed().then(console.log);
promise.resolve("This should show up in the console.");
```

```js
const promise = Promise.exposed(function (resolve, reject){
    setTimeout(function (){
        resolve("I almost fell asleep.")
    }, 100000);
}).then(console.log);

setTimeout(function (){
    promise.resolve("I don't want to wait that much.");
}, 100);
```