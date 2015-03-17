var config = {};

config.tokens = [ "commandtoken1", "commandtoken2" ];
config.port = process.env.LISTEN_PORT || 1337;
config.calendarId = "mycalendar@gmail.com"

config.gapi = {
    serviceAccountEmail: 'somethingsomething@developer.gserviceaccount.com',
    keyFilePath: 'mykeyfilekey.pem'
};

module.exports = config;