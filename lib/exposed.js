function exposed(executor) {
    let resolver;
    let rejector;
    const promise = new Promise(function surrogateExecutor(resolve, reject) {
        resolver = function (...args){
            resolve(...args);
            return this;
        };
        rejector = function (...args){
            reject(...args);
            return this;
        };
    });
    promise.resolve = resolver;
    promise.reject = rejector;

    function exposedThen(fulfilled, rejected) {
        let nextPromise = Promise.prototype.then.call(this, fulfilled, rejected);
        nextPromise.resolve = resolver;
        nextPromise.reject = rejector;
        nextPromise.then = exposedThen;
        nextPromise.catch = exposedCatch;
        nextPromise.finally = exposedFinally;
        return nextPromise;
    }

    function exposedCatch(rejected) {
        return exposedThen.call(this, undefined, rejected);
    }

    function exposedFinally(fulfilled) {
        return exposedThen.call(this, fulfilled, undefined);
    }

    promise.then = exposedThen;
    promise.catch = exposedCatch;
    promise.finally = exposedFinally;
    if (executor instanceof Function)
        executor(resolver, rejector);
    return promise;
}

module.exports = exposed;