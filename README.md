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

We can `resolve` or `reject` the original promise even from its sub-promises created by `then`, `catch` and `finally`.
```js
const promise = Promise.exposed().then(console.log);
promise.resolve("This should show up in the console.");
```

versus

```js
let resolvePromise;
const promise = new Promise(function (resolve, reject){
    resolvePromise = resolve;
}).then(console.log);
resolvePromise("This should show up in the console.");
```

We can create concurrent resolvers without `Promise.race`.
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

versus

```js
const longPromise = new Promise(function (resolve, reject){
    setTimeout(function (){
        resolve("I almost fell asleep.")
    }, 100000);
});
const shortPromise = new Promise(function (resolve, reject){
    setTimeout(function (){
        resolve("I don't want to wait that much.")
    }, 100);
});
Promise.race([longPromise, shortPromise]).then(console.log);
```

We can return the rejected promise (or its sub-promise) if a condition fails without the need of nested functions.

```js
function doThings(){
    const result = Promise.exposed();
    if (Math.random() > 0.5)
        return result.reject(new Error("bad"));
    return result.resolve("good");
}
```

versus

```js
function doThings(){
    return new Promise(function (resolve, reject){
        if (Math.random() > 0.5)
            return reject(new Error("bad"));
        resolve("good");
    });
}
```