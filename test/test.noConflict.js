const expect = require("chai").expect;

describe("noConflict", function () {

    it("should return the exposed function without modifying the Promise global", function () {
        const noConflict = require("./noConflict");
        const exposed = require("./exposed");
        expect(noConflict === exposed).to.equal(true);
        expect(Promise.hasOwnProperty("exposed")).to.equal(false);
    });

});
