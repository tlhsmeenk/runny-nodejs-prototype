import http from 'http'
import { env, port, ip, apiRoot } from './config'
import express from './services/express'
import api from './api'
import ws_ from './api/ws'

const WebSocket = require('ws')
const app = express(apiRoot, api)
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

setImmediate(() => {
  server.listen(port, ip, () => {
    ws_.register(wss)
    console.log('The API is listening on http://%s:%d (Websockets -> ws://%s:%d), in %s mode', ip, port, ip, port, env)
  })
})

// setup the primary websocket connection handlers
wss.on('connection', function connection (ws, req) {
  ws_.onSocketConnected(ws)
  ws_.setSocketHandlers(ws)
})

export default app
