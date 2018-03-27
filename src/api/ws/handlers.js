
/*
  Setting a name to the socket. For now we're just abusing the connection to store user
  related information as it's the only connection we have :-)
*/
const handleSetName = (socket, payload) => {
  socket.socket_name = payload['name']
  socket.send(JSON.stringify({'type': 'info', 'payload': { 'message': `Changed the name to to ${payload.name}` }}))
}

/*
  When a user joins we'll change the joined field away from their own id and broadcast the
  event to any socket matching the joined_id of join request
*/
const handleJoin = (websocketServer, socket, payload) => {
  socket.joined_run_id = payload['runtojoin']
  broadcastToRun(websocketServer, socket.joined_run_id, JSON.stringify({'type': 'joined', 'payload': { 'message': `${socket.socket_name} has joined the run!`, 'name': socket.socket_name }}))
}

/*
  Update the last_location of the socket and notify the fellow runners
*/
const handleUpdate = (websocketServer, socket, payload) => {
  socket.last_location = {'type': 'update', 'payload': { 'runner': socket.socket_id, 'longtitude': payload['longtitude'], 'latitude': payload['longtitude'] }}
  broadcastToRun(websocketServer, socket.joined_run_id, JSON.stringify(socket.last_location))
}

/*
  Get the names from all the sockets that are connected to the given run id
*/
const getRunners = (websocketServer, socket) => {
  let runners = [...websocketServer.clients]
    .filter(e => e.joined_run_id === socket.joined_run_id)
    .map(e => e.socket_name)

  socket.send(JSON.stringify({'type': 'getRunnerResponse', 'payload': { 'runners': runners }}))
}

/*
  Mark the sockets partaking in the run as ready to start
*/
const ready = (websocketServer, socket, payload) => {
  socket.run_ready = payload.state
  broadcastToRun(websocketServer, socket.joined_run_id, JSON.stringify({'type': 'runnerReadyResponse', 'payload': {'name': socket.socket_name, 'state': socket.run_ready}}))
}

/*
  Start the run. All sockets will be marked as started and the start time will be broadcasted to each runner
*/
const startRun = (websocketServer, socket) => {
  [...websocketServer.clients]
    .filter(e => e.joined_run_id === socket.joined_run_id)
    .forEach(e => (e.run_started = true))

  let startTime = new Date().getTime()
  broadcastToRun(websocketServer, socket.joined_run_id, JSON.stringify({'type': 'runStarted', 'payload': {'time': startTime}}))
}

/*
  Simple broadcast to sockets matching a given id
*/
function broadcastToRun (websocketServer, id, msg) {
  [...websocketServer.clients]
    .filter(e => e.joined_run_id === id)
    .forEach(e => e.send(msg))
}

module.exports = {
  handleSetName,
  handleJoin,
  handleUpdate,
  getRunners,
  ready,
  startRun
}
