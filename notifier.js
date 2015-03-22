"use strict";

var Q = require('q');
var requestify = require('requestify');
var config = require('./config');

function prepareMessage(context) {
    var description = context.eventType.isHomeOffice() ? 'będzie pracował z domu' : 'będzie nieobecny';
    var items = [ 
        context.user,
        description + ':',
        '"' + context.command.text + '".\n',
        "Wpis w kalendarzu:",
        "<" + context.postEventResult.url + ">"
    ];
    return { text: items.join(' ') };
}

function sendNotification(context) {
    var send = function(payload) {
        return requestify.post(config.slackWebhookUrl, { payload: JSON.stringify(payload)}, { dataType: 'form-url-encoded' });
    };
    return Q.fcall(prepareMessage, context).then(send);
}

module.exports = {
    sendNotification: sendNotification
};