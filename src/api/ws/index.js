import db from '../../services/loki'
import handlers from './handlers'

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
  let run = db.generateRun()
  let response = { run_id: run.run_id }

  // Register this run to the socket
  socket.socket_id = run.run_id
  socket.joined_run_id = run.run_id
  // Send the response with the ID allowing other users to join
  socket.send(JSON.stringify(response))

  // log activity
  console.log('New connection ' + socket.socket_id)
}

/*
Apply all the handlers on the socket. Typically you'll want to call this when
the socket has connected.
*/
const setSocketHandlers = (socket) => {
  // On connection lost handler
  socket.on('close', () => {
    console.log('Lost connection ' + socket.socket_id)
  })

  // On message received handler
  socket.on('message', (message) => {
    try {
      handleMessageReceived(socket, message)
    } catch (err) {
      socket.send('Error! Could not handle message! ' + err)
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
      handlers.handleSetName(socket, payload)
      break
    case 'join':
      handlers.handleJoin(websocketServer, socket, payload)
      break
    case 'update':
      handlers.handleUpdate(websocketServer, socket, payload)
      break
    default:
      socket.send('Warning! Could not handle message! Unsupported type')
  }
}

module.exports = {
  register,
  onSocketConnected,
  setSocketHandlers
}