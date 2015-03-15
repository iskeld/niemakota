var config = {};

config.token = process.env.SLACK_TOKEN || "________________________";
config.port = process.env.LISTEN_PORT || 8998;

config.gapi = {
    serviceAccountEmail: 'somethingsomething@developer.gserviceaccount.com',
    keyFilePath: 'mykeyfile.pem'
};

module.exports = config;