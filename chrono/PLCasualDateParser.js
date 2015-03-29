var moment = require('moment');
var chrono = require('chrono-node');

var Parser = chrono.Parser;
var ParsedResult = chrono.ParsedResult;

var PATTERN = /(dziś|dzisiaj|dzis|jutro|jutra|pojutrze)(?=\W|$)/i;

exports.Parser = function PLCasualDateParser(argument) {
    Parser.call(this);

    this.pattern = function () { return PATTERN; };

    this.extract = function(text, ref, match, opt) {
        var index = match.index;
        var text = match[0];

        var result = new ParsedResult({
            index: index,
            text: text,
            ref: ref,
        });

        var refMoment = moment(ref);
        var startMoment = refMoment.clone();
        var lowerText = text.toLowerCase();

        if (lowerText == 'jutro' || lowerText == 'jutra') {
            startMoment.add(1, 'day');
        } else if (lowerText == 'pojutrze') {
            startMoment.add(2, 'day');
        }
        
        result.start.assign('day', startMoment.date())
        result.start.assign('month', startMoment.month() + 1)
        result.start.assign('year', startMoment.year())

        result.tags.PLCasualDateParser = true;
        return result;
    };
};