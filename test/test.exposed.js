const expect = require("chai").expect;
const exposed = require("./exposed");

describe("exposed", function () {

    it("should create a new Promise", function () {
        expect(exposed() instanceof Promise).to.equal(true);
    });

    it("should create every time a different Promise", function () {
        expect(exposed() === exposed()).to.equal(false);
    });

    describe("the created Promise", function () {

        it("should be resolvable from the outside", function (done) {
            const promise = exposed();
            let called = false;
            promise.then(function () {
                called = true;
            });
            promise.resolve();
            expect(called).to.equal(false);
            setTimeout(function () {
                expect(called).to.equal(true);
                done();
            }, 1);
        });

        it("should be rejectable from the outside", function (done) {
            const promise = exposed();
            let called = false;
            promise.catch(function () {
                called = true;
            });
            promise.reject();
            expect(called).to.equal(false);
            setTimeout(function () {
                expect(called).to.equal(true);
                done();
            }, 1);
        });

        it("should be resolvable from the outside by using a then Promise", function (done) {
            const promise = exposed();
            let called = false;
            const thenPromise = promise.then(function () {
                called = true;
            });
            thenPromise.resolve();
            expect(called).to.equal(false);
            setTimeout(function () {
                expect(called).to.equal(true);
                done();
            }, 1);
        });

        it("should be resolvable from the outside by using a catch Promise", function (done) {
            const promise = exposed();
            let called = false;
            const thenPromise = promise.then(function () {
                called = true;
            });
            const catchPromise = thenPromise.catch(function () {
            });
            catchPromise.resolve();
            expect(called).to.equal(false);
            setTimeout(function () {
                expect(called).to.equal(true);
                done();
            }, 1);
        });

        it("should be resolvable from the outside by using a finally Promise", function (done) {
            const promise = exposed();
            let called = false;
            const finallyPromise = promise.finally(function () {
                called = true;
            });
            finallyPromise.resolve();
            expect(called).to.equal(false);
            setTimeout(function () {
                expect(called).to.equal(true);
                done();
            }, 1);
        });

        it("should be rejectable from the outside by using a then Promise", function (done) {
            const promise = exposed();
            let called = false;
            const thenPromise = promise.then(function () {
            });
            const catchPromise = thenPromise.catch(function () {
                called = true;
            });
            thenPromise.reject();
            expect(called).to.equal(false);
            setTimeout(function () {
                expect(called).to.equal(true);
                done();
            }, 1);
        });

        it("should be rejectable from the outside by using a catch Promise", function (done) {
            const promise = exposed();
            let called = false;
            const catchPromise = promise.catch(function () {
                called = true;
            });
            catchPromise.reject();
            expect(called).to.equal(false);
            setTimeout(function () {
                expect(called).to.equal(true);
                done();
            }, 1);
        });

        it("should be rejectable from the outside by using a finally Promise", function (done) {
            const promise = exposed();
            let called = false;
            const catchPromise = promise.catch(function () {
                called = true;
            });
            const finallyPromise = catchPromise.finally(function () {
            });
            finallyPromise.reject();
            expect(called).to.equal(false);
            setTimeout(function () {
                expect(called).to.equal(true);
                done();
            }, 1);
        });

        it("should be resolvable from the outside by using a deeply nested Promise", function (done) {
            const promise = exposed();
            let called = false;
            let lastThen = promise.then(function () {
            });
            for (let index = 0; index < 100; ++index)
                lastThen = lastThen.then(function () {
                });
            lastThen = lastThen.then(function () {
                called = true
            });
            lastThen.resolve();
            expect(called).to.equal(false);
            setTimeout(function () {
                expect(called).to.equal(true);
                done();
            }, 1);
        });

        it("should be rejectable from the outside by using a deeply nested Promise", function (done) {
            const promise = exposed();
            let called = false;
            let lastThen = promise.then(function () {
            });
            for (let index = 0; index < 100; ++index)
                lastThen = lastThen.then(function () {
                });
            const catchPromise = lastThen.catch(function () {
                called = true
            });
            catchPromise.reject();
            expect(called).to.equal(false);
            setTimeout(function () {
                expect(called).to.equal(true);
                done();
            }, 1);
        });

        it("should pass the given value when resolving from outside", function (done) {
            const promise = exposed();
            let value = 1;
            promise.then(function (result) {
                value = result;
            });
            promise.resolve(2);
            expect(value).to.equal(1);
            setTimeout(function () {
                expect(value).to.equal(2);
                done();
            }, 1);
        });

        it("should pass the given value when rejecting from outside", function (done) {
            const promise = exposed();
            let value = 1;
            promise.catch(function (result) {
                value = result;
            });
            promise.reject(2);
            expect(value).to.equal(1);
            setTimeout(function () {
                expect(value).to.equal(2);
                done();
            }, 1);
        });

        it("should call the given executor", function () {
            let called = false;
            const promise = exposed(function (resolve, reject) {
                called = true;
            });
            expect(called).to.equal(true);
        });

        it("should pass the resolve function to the given executor", function (done) {
            let called = false;
            exposed(function (resolve, reject) {
                setTimeout(resolve, 1);
            }).then(function () {
                called = true;
            });
            setTimeout(function () {
                expect(called).to.equal(true);
                done();
            }, 2);
        });

        it("should pass the reject function to the given executor", function (done) {
            let called = false;
            exposed(function (resolve, reject) {
                setTimeout(reject, 1);
            }).catch(function () {
                called = true;
            });
            setTimeout(function () {
                expect(called).to.equal(true);
                done();
            }, 2);
        });

        it("should handle executor vs outside races", function (done) {
            const log = [];
            const logger = function (value) {
                log.push(value);
            };
            const promise1 = exposed(function (resolve, reject) {
                setTimeout(function () {
                    resolve(1);
                }, 1);
            }).then(logger);
            setTimeout(function () {
                promise1.resolve(2);
            }, 2);
            const promise2 = exposed(function (resolve, reject) {
                setTimeout(function () {
                    reject(2);
                }, 2);
            }).catch(logger);
            setTimeout(function () {
                promise2.reject(1);
            }, 1);
            setTimeout(function () {
                expect(log).to.deep.equal([1, 1]);
                done();
            }, 3);
        });

        describe("the reject and resolve methods", function (){

            it("should return the created Promise when it is called directly", function (){
                const promise = exposed();
                expect(promise.resolve()).to.equal(promise);
                expect(promise.reject()).to.equal(promise);
            });

            it("should return a sub-promise when it is called indirectly by using for example then", function (){
                const promise = exposed();
                const subPromise = promise.then(function (){});
                expect(subPromise).to.not.equal(promise);
                expect(subPromise.resolve()).to.equal(subPromise);
                expect(subPromise.reject()).to.equal(subPromise);
            });

        });
    });

});