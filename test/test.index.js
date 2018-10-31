const expect = require("chai").expect;

describe("index", function () {

    it("should add the exposed method to the Promise global", function () {
        const index = require("./index");
        const exposed = require("./exposed");
        expect(index === exposed).to.equal(false);
        expect(Promise.hasOwnProperty("exposed")).to.equal(true);
        delete(Promise.exposed);
    });

});
