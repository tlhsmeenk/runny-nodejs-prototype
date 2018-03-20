import http from 'http'
import { env, mongo, port, ws_port, ip, apiRoot } from './config'
import mongoose from './services/mongoose'
import express from './services/express'
import api from './api'
import run from './services/run'
import db from './services/loki'

const WebSocket = require('ws');
const app = express(apiRoot, api)
const server = http.createServer(app)
const wss = new WebSocket.Server({ server });

mongoose.connect(mongo.uri, { useMongoClient: true })
mongoose.Promise = Promise

setImmediate(() => {
  server.listen(port, ip, () => {
    console.log('The API is listening on http://%s:%d (Websockets -> ws://%s:%d), in %s mode', ip, port,ip, port, env)
  })
})




wss.on('connection', function connection(ws, req) {
  //const location = url.parse(req.url, true);
  // You might use location.query.access_token to authenticate or share sessions
  // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

  ws.on('message', function incoming(message) {
    ws.send(message)
  });

  var record = db.generateRun()
  ws.send(`Other people can join using: ${record.runId}`)
  //ws.send(run.generateRunId());
});

wss.on('close', function connection(ws, req) {
  console.log('Oh oh ')
});


export default app
