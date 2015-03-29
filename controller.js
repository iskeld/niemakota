var Q = require('q');
var log = require('npmlog');
var moment = require('moment');
var chrono = require('chrono-node');
var requestify = require('requestify');
var calendar = require('./calendar');
var config = require('./config');
var notifier = require('./notifier');
var absenceParser = require('./absenceParser');
var models = require('./models');

function getUserName(slackName, slackId) {
    return slackName;
}

function parseDetails(context) {
    return absenceParser.parse(context);
}

function postEvent(context) {
    return calendar.sendEvent(config.calendarId, context.calendarEvent);
}

function prepareGoogleEvent(context) {
    var details = context.details;
    var absenceDate = details.date;

    var toGDate = function(date) {
        var result;
        if (absenceDate.allDay) {
            result = { date: moment(date).format('YYYY-MM-DD') };
        } else {
            result = { dateTime: date.toISOString() };
        }
        return result;
    };

    var summary = [ '[' + context.eventType.toString() + ']', '[' + context.user + ']', details.summary ].join(' ');
    
    var result = {
        summary: summary,
        start: toGDate(absenceDate.start),
        end: toGDate(absenceDate.end),
        reminders: { 
            useDefault: false
        }
    };

    if (details.location) {
        result.location = details.location;
    }
    return result;
}

function parseCommandType(command) {
    if (!command) {
        throw new Error("Command cannot be empty");
    }
    if (command.toLowerCase() === '/ooo') {
        return models.EventTypes.outOfOffice;
    } else if (command.toLowerCase() === '/ro') {
        return models.EventTypes.remoteOffice;
    }
    throw new Error("Unknown command: '" + command + "'");
}

function handle(slackCommand, callback) {
    var context = { 
        command: slackCommand,
        user: getUserName(slackCommand.user_name, slackCommand.user_id)
    };

    var prepareEvent = function(context) { 
        return Q.fcall(prepareGoogleEvent, context);
    };

    var result = Q.fcall(parseCommandType, slackCommand.command)
        .then(function(eventType) { context.eventType = eventType; return context;})
        .then(parseDetails)
        .then(function(details) { context.details = details; return context;})
        .then(prepareEvent)
        .then(function(calendarEvent) { context.calendarEvent = calendarEvent; return context;})
        .then(postEvent)
        .then(function(postEventResult) { context.postEventResult = postEventResult; return context;})
        .then(notifier.sendNotification)
        .then(function() { return context.postEventResult; })
        .nodeify(callback);

    return result;
}

module.exports = {
    handle: handle
};