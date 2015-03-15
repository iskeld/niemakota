var config = {};

config.token = process.env.SLACK_TOKEN || "________________________";
config.port = process.env.LISTEN_PORT || 1337;
config.calendarId = "mycalendar@gmail.com"

config.gapi = {
    serviceAccountEmail: 'somethingsomething@developer.gserviceaccount.com',
    keyFilePath: 'mykeyfilekey.pem'
};

module.exports = config;