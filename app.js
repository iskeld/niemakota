var http = require('http');
var concat = require('concat-stream');
var log = require('npmlog');
var zSchema = require('z-schema');
var querystring = require('querystring');
var config = require('./config');
var controller = require('./controller');

var rawContentType = {'Content-Type': 'text/plain'};

var slackSchema = {
    "title": "Slack request schema",
    "type": "object",
    "properties": {
        "token": { "type": "string" },
        "team_id": { "type": "string" },
        "team_domain": { "type": "string" },
        "channel_id": { "type": "string" },
        "channel_name": { "type": "string" },
        "user_id": { "type": "string" },
        "user_name": { "type": "string" },
        "command": { "type": "string" },
        "text": { "type": "string" }
    },
    "required": ["token", "team_id", "team_domain", "channel_id", "channel_name", "user_id", "user_name", "command", "text"]
};

var schemaValidator = new zSchema();

function validateSchema(obj) {
    return schemaValidator.validate(obj, slackSchema);
}

function validateToken(obj) {
    var tokensArray = config.tokens;
    for (var i = 0; i < tokensArray.length; i++) {
        if (obj.token === tokensArray[i]) { 
            return true;
        }
    }
    return false;
}

function handler(req, res) {
    if (req.method == 'POST') {
        req.on('error', function(err) {
            log.error("Error in request. Error details: %j", err);
            process.exit(1);
        });

        req.pipe(concat(function(buffer) {
            log.verbose("request", "buffer received");
            
            var requestData = querystring.parse(buffer.toString());

            log.info("request", "received data: %j", requestData);

            if (!validateSchema(requestData)) {
                res.writeHead(400, "Bad Request. Malformed JSON", rawContentType);
                res.end("Malformed JSON");
            } else {
                if (!validateToken(requestData)) {
                    log.warn("request", "[403] Invalid token '%s'", requestData.token);
                    res.writeHead(403, "Invalid token", rawContentType);
                    res.end("Invalid token");
                } else {
                    controller.handle(requestData)
                        .then(function(result) {
                            res.writeHead(200, "OK", rawContentType);
                            res.end("Event successfully added. Url: " + result.url);
                        })
                        .catch(function(error) {
                            res.writeHead(500, "Error", rawContentType);
                            res.end("Error " + error.toString());
                        }).done();
                }
            }
        }));
    } else {
        log.warn("request", "[405] Unsupported request '%s' to '%s'", req.method, req.url);
        res.writeHead(405, "Method not supported", rawContentType);
        res.end("Method not supported");
    }
}

http.createServer(handler).listen(config.port);
log.info("general", "server is running");
