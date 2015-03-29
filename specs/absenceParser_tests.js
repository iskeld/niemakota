var absenceParser = require("../absenceParser");
var chai = require('chai');

chai.config.includeStack = true;
var expect = chai.expect;

describe('absenceParser', function() {
    function parseAbsence(text) {
        return absenceParser.parse({ command: { text: text }});
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
            return parseAbsence("2015-08-15 work from home @Pabianice, ul. Ludzi z cegłami").then(function(result) {
                expect(result.date).to.deep.equal(wholeSingleDay(new Date(2015, 7, 15)));
                expect(result.summary).to.equal("work from home @Pabianice, ul. Ludzi z cegłami");
                expect(result.location).to.equal("Pabianice, ul. Ludzi z cegłami");
            });
        });
    });
});