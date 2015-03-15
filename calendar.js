var Q = require('q');
var log = require('npmlog');
var google = require('googleapis');
var config = require('./config');

var scopes = ["https://www.googleapis.com/auth/calendar"];

function sendEvent(calendarId, eventDetails, callback) {
    var deferred = Q.defer();
    var jwtClient = new google.auth.JWT(config.gapi.serviceAccountEmail, config.gapi.keyFilePath, null, scopes);

    jwtClient.authorize(function (err, tokens) {
        if (err) {
            log.error("Error in jwtClient.authorize. Error details: %s", err.toString());
            deferred.reject(err);
        } else {
            var calendar = google.calendar({version: 'v3', auth: jwtClient});
            calendar.events.insert({
                calendarId: calendarId,
                resource: eventDetails
            }, function (err, result) {
                if (err) {
                    log.error("Error in calendar.events.insert. Error details: %s", err.toString());
                    deferred.reject(err);
                } else {
                    log.info("Calendar event successfully created");
                    deferred.resolve({
                        id: result.id,
                        url: result.htmlLink
                    });
                }
            });
        }
    });

    return deferred.promise.nodeify(callback);
}

module.exports = {
    sendEvent: sendEvent
};