var Q = require('q');
var log = require('npmlog');
var chronoCustom = require('./chronoCustomPL');

function parse(context) {
    var deferred = Q.defer();

    var txt = context.command.text;

    var parseResults = chronoCustom.parse(txt);
    if (parseResults.length === 0) {
        deferred.reject(new Error("Cannot parse input: '" + txt + "'"));
        return deferred.promise;
    }

    var remains = txt.substr(0, parseResults[0].index) + txt.substr(parseResults[0].index + parseResults[0].text.length);
    var location = null;
    var locationIndex = remains.indexOf('@');

    if (locationIndex > 0) {
        location = remains.substr(locationIndex + 1).trim();
    } 
    if (remains) {
        remains = remains.trim();
    }

    var start = parseResults[0].start.date();
    var end = new Date(start);
    end.setDate(start.getDate() + 1);

    var result = {
        date: {
            allDay: true,
            start: start,
            end: end
        },
        summary: remains,
        location: location
    };

    log.info("Parsed event details %j", result);

    deferred.resolve(result);
    return deferred.promise;
}

module.exports = {
    parse: parse
};