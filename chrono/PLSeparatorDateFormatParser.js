var moment = require('moment');
var chrono = require('chrono-node');

var Parser = chrono.Parser;
var ParsedResult = chrono.ParsedResult;

var PATTERN = /(\W|^)([0-9]{1,2})\.([0-9]{1,2})(\.([0-9]{4}|[0-9]{2}))?(\W|$)/i;

exports.Parser = function PLSeparatorDateFormatParser(argument) {
    Parser.call(this);

    this.pattern = function () { return PATTERN; };
    this.extract = function(text, ref, match, opt) {
        if (match[1] == '/' || match[1] == '.' || match[1] == '-' || match[6] == '/' || match[6] == '.') return;

        var index = match.index + match[1].length;
        text = match[0].substr(match[1].length, match[0].length - match[6].length);
        var result = new ParsedResult({
            text: text,
            index: index,
            ref: ref
        });

        var day = parseInt(match[2]);
        var month = parseInt(match[3]);
        var year = parseInt(match[5] || moment(ref).year() + '');
        
        if ((month < 1 || month > 12) || (day < 1 || day > 31)) {
            return null;
        } 

        if (year < 100) {
            year = year + 2000; //AD
        }
        
        var date = moment(year + '-' + month + '-' + day, 'YYYY-M-D');

        if (!date || date.date() != day || date.month() != (month - 1)) {
            return null;
        }
        
        result.start.assign('day', date.date());
        result.start.assign('month', date.month() + 1);
        result.start.assign('year', date.year());

        result.tags.PLSeparatorDateFormatParser = true;
        return result;
    };
};