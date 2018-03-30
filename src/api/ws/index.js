import DB from '../../services/loki'
import MESSAGE_HANDLER from './handler'

// local instance of the websocketserver singleton
var websocketServer = {}

/*
  Register a new websocketServer to be used by the API
*/
const register = (wss) => {
  websocketServer = wss
}

/*
Actions required on a connection socket. Create a new run and send this id back
to the user so it can be used to join this run. For now we're storing all our
info on the socket ;-)
*/
const onSocketConnected = (socket) => {
  let run = DB.generateRun()
  let response = { 'type': 'connected', 'payload': { 'run_id': run.run_id } }

  // Register this run to the socket
  socket.socket_id = run.run_id
  socket.joined_run_id = run.run_id
  socket.run_ready = false
  // Send the response with the ID allowing other users to join
  socket.send(JSON.stringify(response))

  // log activity
  console.log('New connection ' + socket.socket_id)
}

/*
Apply all the MESSAGE_HANDLERs on the socket. Typically you'll want to call this when
the socket has connected.
*/
const setSocketHandlers = (socket) => {
  // On connection lost MESSAGE_HANDLER
  socket.on('close', () => {
    console.log('Lost connection ' + socket.socket_id)
  })

  // On message received MESSAGE_HANDLER
  socket.on('message', (message) => {
    try {
      handleMessageReceived(socket, message)
    } catch (err) {
      socket.send(JSON.stringify({'type': 'error', 'payload': { 'message': 'Error! Could not handle message! ' + err }}))
    }
  })
}

/*
  Handle incomming messages. All messages must comply to the following format:
  {
      "type":{desired command},
      "payload": {
        {command specific payload}
    }
  }

  Messages are dispatched based on their type. Unknown types should be thrown back
  to the user.
*/
function handleMessageReceived (socket, message) {
  let msgAsJson = JSON.parse(message)
  let type = msgAsJson['type']
  let payload = msgAsJson['payload']

  switch (type) {
    case 'setname':
      MESSAGE_HANDLER.handleSetName(socket, payload)
      break
    case 'join':
      MESSAGE_HANDLER.handleJoin(websocketServer, socket, payload)
      break
    case 'update':
      MESSAGE_HANDLER.handleUpdate(websocketServer, socket, payload)
      break
    case 'getRunners':
      MESSAGE_HANDLER.getRunners(websocketServer, socket)
      break
    case 'runnerReady':
      MESSAGE_HANDLER.ready(websocketServer, socket, payload)
      break
    case 'startRun':
      MESSAGE_HANDLER.startRun(websocketServer, socket)
      break
    default:
      socket.send(JSON.stringify({'type': 'error', 'payload': { 'message': `Could not handle message of type ${type}` }}))
  }
}

module.exports = {
  register,
  onSocketConnected,
  setSocketHandlers
}
