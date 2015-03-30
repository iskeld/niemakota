var absenceParser = require("../absenceParser");
var chai = require('chai');

chai.config.includeStack = true;
var expect = chai.expect;

describe('absenceParser', function() {
    function parseAbsence(text, options) {
        return absenceParser.parse({ command: { text: text }}, options);
    }

    function wholeSingleDay(date) {
        var end = new Date(date);
        end.setDate(date.getDate() + 1);
        return {
            allDay: true,
            start: date,
            end: end
        };
    }

    function wholeDateRange(start, end) {        
        return {
            allDay: true,
            start: start,
            end: end
        };
    }

    describe('.parse()', function() {
        it('should parse single date in YYYY-MM-dd format', function() {
            return parseAbsence("2015-08-15").then(function(result) {
                expect(result.date).to.deep.equal(wholeSingleDay(new Date(2015, 7, 15)));
            });
        });

        it('should parse single date in YYYY-MM-dd format with description', function() {
            return parseAbsence("2015-08-15 work from home").then(function(result) {
                expect(result.date).to.deep.equal(wholeSingleDay(new Date(2015, 7, 15)));
                expect(result.summary).to.equal("work from home");
            });
        });

        it('should parse single date in YYYY-MM-dd format with description and location', function() {
            return parseAbsence("2015-08-15 work from home @Pabianice, ul. Ludzi z cegłami").then(function(result) {
                expect(result.date).to.deep.equal(wholeSingleDay(new Date(2015, 7, 15)));
                expect(result.summary).to.equal("work from home @Pabianice, ul. Ludzi z cegłami");
                expect(result.location).to.equal("Pabianice, ul. Ludzi z cegłami");
            });
        });

        it('should parse single date in dd.MM format', function() {
            return parseAbsence("15.8 work from home @Pabianice, ul. Ludzi z cegłami", { referenceDate: new Date(2014, 0, 1)}).then(function(result) {
                expect(result.date).to.deep.equal(wholeSingleDay(new Date(2014, 7, 15)));
                expect(result.summary).to.equal("work from home @Pabianice, ul. Ludzi z cegłami");
                expect(result.location).to.equal("Pabianice, ul. Ludzi z cegłami");
            });
        });

        it('should parse date range in dd.MM format', function() {
            return parseAbsence("5.4 - 10.4 work from home @Pabianice, ul. Ludzi z cegłami", { referenceDate: new Date(2014, 0, 1)}).then(function(result) {
                expect(result.date).to.deep.equal(wholeDateRange(new Date(2014, 3, 5), new Date(2014, 3, 10)));
                expect(result.summary).to.equal("work from home @Pabianice, ul. Ludzi z cegłami");
                expect(result.location).to.equal("Pabianice, ul. Ludzi z cegłami");
            });
        });

        it('should parse casual date range in casual format', function() {
            return parseAbsence("od dziś do pojutrze praca z domu @Pabianice, ul. Ludzi z cegłami", { referenceDate: new Date(2014, 0, 1)}).then(function(result) {
                expect(result.date).to.deep.equal(wholeDateRange(new Date(2014, 0, 1), new Date(2014, 0, 3)));
                expect(result.summary).to.equal("praca z domu @Pabianice, ul. Ludzi z cegłami");
                expect(result.location).to.equal("Pabianice, ul. Ludzi z cegłami");
            });
        });

        it('should parse casual date range in mixed format', function() {
            return parseAbsence("od pojutrze do 10.1 praca z domu @Pabianice, ul. Ludzi z cegłami", { referenceDate: new Date(2014, 0, 1)}).then(function(result) {
                expect(result.date).to.deep.equal(wholeDateRange(new Date(2014, 0, 3), new Date(2014, 0, 10)));
                expect(result.summary).to.equal("praca z domu @Pabianice, ul. Ludzi z cegłami");
                expect(result.location).to.equal("Pabianice, ul. Ludzi z cegłami");
            });
        });
    });
});