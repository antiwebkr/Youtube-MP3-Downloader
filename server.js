'use strict';
import express from 'express';
import logger from 'morgan';
import hidePoweredBy from 'hide-powered-by';
import { join } from 'path';
import { json, urlencoded } from 'body-parser';
import { createWriteStream } from 'fs';
import { createServer } from 'http';
import socketio from 'socket.io';
import { socket } from './routes/youtubeProcess';

let app = express();

let http = createServer(app).listen("serverPORT");
let io = socketio(http);

app.set('views', join(__dirname, 'views/'));
app.set('view engine', 'jade');
app.locals.pretty = true;

let accessLogStream = createWriteStream('./access.log', {flags: 'a'});
app.use(logger('{"remote_addr": ":remote-addr", "remote_user": ":remote-user", "date": ":date[iso]", "method": ":method", "url": ":url", "http_version": ":http-version", "status": ":status", "result_length": ":res[content-length]", "referrer": ":referrer", "user_agent": ":user-agent", "response_time": ":response-time"},', {stream: accessLogStream}));

app.use(json({limit: '50mb'}));
app.use(urlencoded({limit: '50mb', extended: true}));
app.use(require('stylus').middleware({src: __dirname + '/public'}));
app.use(express.static(join(__dirname, 'public')));
app.disable('x-powered-by');

socket(io);
app.use(require(join(__dirname, 'routes/url')));

module.exports = app;