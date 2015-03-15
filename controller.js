var Q = require('q');
var log = require('npmlog');
var moment = require('moment');
var chrono = require('chrono-node');
var calendar = require('./calendar');
var config = require('./config');

function getUserName(slackName, slackId) {
    // TODO: users database
    return slackName;
}

function parseDetails(eventType, txt) {
    var deferred = Q.defer();

    var parseResults = chrono.parse(txt);
    if (parseResults.length === 0) {
        deferred.reject(new Error("Cannot parse input: '" + txt + "'"));
        return deferred.promise;
    }

    var remains = txt.substr(0, parseResults[0].index) + txt.substr(parseResults[0].index + parseResults[0].text.length);
    var location = null;
    var locationIndex = remains.indexOf('@');

    if (locationIndex > 0) {
        location = remains.substr(locationIndex + 1);
        remains = remains.substring(0, locationIndex);
    }

    var start = parseResults[0].start.date();
    var end = new Date(start);
    end.setDate(start.getDate() + 1);

    var result = {
        allDay: true,
        start: start,
        end: end,
        summary: remains,
        location: location
    };

    log.info("Parsed event details %j", result);

    deferred.resolve(result);
    return deferred.promise;
}

function postEvent(googleCalendarEvent) {
    return calendar.sendEvent(config.calendarId, googleCalendarEvent);
}

function prepareGoogleEvent(eventType, user, details) {
    var toGDate = function(date) {
        var result;
        if (details.allDay) {
            result = { date: moment(date).format('YYYY-MM-DD') };
        } else {
            result = { dateTime: date.toISOString() };
        }
        return result;
    };

    var summary = [ '[' + eventType + ']', '[' + user + ']', details.summary ].join(' ');
    
    var result = {
        summary: summary,
        start: toGDate(details.start),
        end: toGDate(details.end),
        reminders: { 
            useDefault: false
        }
    };

    if (details.location) {
        result.location = details.location;
    }
    return result;
}

function handle(slackCommand, callback) {
    var user = getUserName(slackCommand.user_name, slackCommand.user_id);

    var eventType;
    if (slackCommand.command.toLowerCase() === '/ooo') {
        eventType = 'OOO';
    } else if (slackCommand.command.toLowerCase() === '/ho') {
        eventType = 'HO';
    }

    var prepareEvent = function(details) { 
        return Q.fcall(prepareGoogleEvent, eventType, user, details);
    };

    var result = parseDetails(eventType, slackCommand.text)
        .then(prepareEvent)
        .then(postEvent)
        .nodeify(callback);

    return result;
}

module.exports = {
    handle: handle
};