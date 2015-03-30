var chrono = require("../chronoCustomPL");
var chai = require('chai');

chai.config.includeStack = true;
var expect = chai.expect;

describe('chronoCustomPL', function() {
    function parse(text /*, refDate */) {
        return (arguments.length === 2) ? chrono.parse(text, arguments[1]) : chrono.parse(text);
    }

    describe('.parse()', function() {
        it('should parse single date in YYYY-MM-dd format', function() {
            var result = parse("2015-08-15")[0];
            expect(result.start.date()).to.deep.equal(new Date(2015, 7, 15));
        });

        it('should parse single date in YYYY-MM-dd format with description', function() {
            var result = parse("2015-08-15 something")[0];
            expect(result.start.date()).to.deep.equal(new Date(2015, 7, 15));
        });

        it('should parse single date in dd.MM.YYYY format', function() {
            var result = parse("18.05.2020")[0];
            expect(result.start.date()).to.deep.equal(new Date(2020, 4, 18));
        });

        it('should parse single date in dd.MM format', function() {
            var result = parse("18.05", new Date(2015, 0, 1))[0];
            expect(result.start.date()).to.deep.equal(new Date(2015, 4, 18));
        });

        it('should parse single date in d.M format', function() {
            var result = parse("8.8", new Date(2015, 0, 1))[0];
            expect(result.start.date()).to.deep.equal(new Date(2015, 7, 8));
        });

        it('should parse single today date in casual format', function() {
            var result = chrono.parse("dzisiaj", new Date(2015, 5, 8))[0];
            expect(result.start.date()).to.deep.equal(new Date(2015, 5, 8));
        });

        it('should parse single tommorow date in casual format', function() {
            var result = chrono.parse("jutro", new Date(2015, 5, 8))[0];
            expect(result.start.date()).to.deep.equal(new Date(2015, 5, 9));
        });

        it('should parse single day-after-tommorow date in casual format', function() {
            var result = chrono.parse("pojutrze", new Date(2015, 5, 8))[0];
            expect(result.start.date()).to.deep.equal(new Date(2015, 5, 10));
        });

        it('should parse date range separated with dash. no spaces', function() {
            var result = parse("18.05-20.05", new Date(2015, 0, 1))[0];
            expect(result.start.date()).to.deep.equal(new Date(2015, 4, 18));
            expect(result.end.date()).to.deep.equal(new Date(2015, 4, 20));
        });

        it('should parse date range separated with dash & spaces', function() {
            var result = parse("18.05 - 20.05", new Date(2015, 0, 1))[0];
            expect(result.start.date()).to.deep.equal(new Date(2015, 4, 18));
            expect(result.end.date()).to.deep.equal(new Date(2015, 4, 20));
        });

        it('should parse date range separated with dash & spaces', function() {
            var result = parse("18.05 - 20.05", new Date(2015, 0, 1))[0];
            expect(result.start.date()).to.deep.equal(new Date(2015, 4, 18));
            expect(result.end.date()).to.deep.equal(new Date(2015, 4, 20));
        });

        it('should parse date range in different formats separated with dash & spaces', function() {
            var result = parse("jutro - 20.05", new Date(2015, 0, 1))[0];
            expect(result.start.date()).to.deep.equal(new Date(2015, 0, 2));
            expect(result.end.date()).to.deep.equal(new Date(2015, 4, 20));
        });

        it('should parse date range in casual format separated with dash & spaces', function() {
            var result = parse("dziś - pojutrze", new Date(2015, 0, 1))[0];
            expect(result.start.date()).to.deep.equal(new Date(2015, 0, 1));
            expect(result.end.date()).to.deep.equal(new Date(2015, 0, 3));
        });

        it('should parse casual polish date range in YYYY-MM-dd format', function() {
            var result = parse("2015-05-10 do 2015-05-20", new Date(2015, 0, 1))[0];
            expect(result.start.date()).to.deep.equal(new Date(2015, 4, 10));
            expect(result.end.date()).to.deep.equal(new Date(2015, 4, 20));
        });

        it('should parse casual polish date range in YYYY-MM-dd format with prefix', function() {
            var result = parse("jestem od 2015-05-10 do 2015-05-20", new Date(2015, 0, 1))[0];
            expect(result.index).to.equal(7);
            expect(result.start.date()).to.deep.equal(new Date(2015, 4, 10));
            expect(result.end.date()).to.deep.equal(new Date(2015, 4, 20));
        });

        it('should parse casual polish date range in d.M format with prefix', function() {
            var result = parse("jestem od 4.5 do 12.5", new Date(2015, 0, 1))[0];
            expect(result.index).to.equal(7);
            expect(result.start.date()).to.deep.equal(new Date(2015, 4, 4));
            expect(result.end.date()).to.deep.equal(new Date(2015, 4, 12));
        });

        it('should parse casual polish date range in casual format with prefix', function() {
            var result = parse("jestem od jutra do pojutrze", new Date(2015, 0, 1))[0];
            expect(result.index).to.equal(7);
            expect(result.start.date()).to.deep.equal(new Date(2015, 0, 2));
            expect(result.end.date()).to.deep.equal(new Date(2015, 0, 3));
        });
    });
});