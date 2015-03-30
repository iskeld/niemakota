var _ = require("lodash");
var chrono = require('chrono-node');
var PLSeparatorDateFormatParser = require('./chrono/PLSeparatorDateFormatParser.js').Parser;
var PLCasualDateParser = require('./chrono/PLCasualDateParser.js').Parser;
var ImplyMidnightRefiner = require('./chrono/implyMidnightRefiner.js').Refiner;
var PLMergeDateRangeRefiner = require('./chrono/PLMergeDateRangeRefiner.js').Refiner;

var custom = new chrono.Chrono();
var enISOParserIndex = _.findIndex(custom.parsers, function(parser) {
    return parser.constructor.name == "ENISOFormatParser";
});
if (enISOParserIndex < 0) {
    throw new Error("Could not find ENISOFormatParser");
}

var unlikelyRefinerIndex = _.findIndex(custom.refiners, function(refiners) {
    return refiners.constructor.name == "UnlikelyFormatFilter";
});
if (unlikelyRefinerIndex >= 0) {
    custom.refiners.splice(unlikelyRefinerIndex, 1);
}

var enISOParser = custom.parsers[enISOParserIndex];

custom.parsers = [ enISOParser, new PLSeparatorDateFormatParser(), new PLCasualDateParser() ];

custom.refiners.push(new PLMergeDateRangeRefiner());
custom.refiners.push(new ImplyMidnightRefiner());

module.exports = { 
    parse: function(text, refDate, opt) {
        return custom.parse(text, refDate, opt);
    }
};