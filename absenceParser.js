var Q = require('q');
var _ = require('lodash');
var log = require('npmlog');
var chronoCustom = require('./chronoCustomPL');

function parse(context, options) {
    var deferred = Q.defer();
    options = _.isEmpty(options) ? {} : options;

    var txt = context.command.text;
    var parseResults = _.isDate(options.referenceDate) ? chronoCustom.parse(txt, options.referenceDate) : chronoCustom.parse(txt);

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

    var end;
    var parsedEnd = parseResults[0].end;
    if (_.isEmpty(parsedEnd)) {
        end = new Date(start);
        end.setDate(start.getDate() + 1);
    } else {
        var parsedEndDate = parsedEnd.date();
        end = new Date(parsedEndDate);
        end.setDate(parsedEndDate.getDate() + 1);
    }

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