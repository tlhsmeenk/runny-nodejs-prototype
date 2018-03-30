import geo from '../../services/geo'

/*
  Setting a name to the socket. For now we're just abusing the connection to store user
  related information as it's the only connection we have :-)
*/
const handleSetName = (socket, payload) => {
  socket.socket_name = payload['name']
  socket.send(JSON.stringify({'type': 'set-name_response', 'payload': { 'message': `Changed the name to ${payload.name}` }}))
}

/*
  When a user joins we'll change the joined field away from their own id and broadcast the
  event to any socket matching the joined_id of join request
*/
const handleJoin = (websocketServer, socket, payload) => {
  socket.joined_run_id = payload['run-to-join']
  broadcastToRun(websocketServer, socket.joined_run_id, JSON.stringify({'type': 'join_response', 'payload': { 'message': `${socket.socket_name} has joined the run!`, 'name': socket.socket_name }}))
}

/*
  Update the last_location of the socket and notify the fellow runners
*/
const handleUpdate = (websocketServer, socket, payload) => {
  let update = {'type': 'runner-update_response', 'payload': { 'runner': socket.socket_name, 'longtitude': payload['longtitude'], 'latitude': payload['latitude'] }}

  // If there is no last known location we're only registering the first point traveled. If not calculate the distance
  !socket.last_location
    ? update.payload['distance'] = 0
    : update.payload['distance'] =
      geo.distance(
        { 'longtitude': payload['longtitude'], 'latitude': payload['latitude'] },
        { 'longtitude': socket.last_location.payload['longtitude'], 'latitude': socket.last_location.payload['latitude'] })

  socket.last_location = update

  broadcastToRun(websocketServer, socket.joined_run_id, JSON.stringify(socket.last_location))
}

/*
  Get the names from all the sockets that are connected to the given run id
*/
const getRunners = (websocketServer, socket) => {
  let runners = [...websocketServer.clients]
    .filter(e => e.joined_run_id === socket.joined_run_id)
    .map(e => e.socket_name)

  socket.send(JSON.stringify({'type': 'get-runners_response', 'payload': { 'runners': runners }}))
}

/*
  Mark the sockets partaking in the run as ready to start
*/
const ready = (websocketServer, socket, payload) => {
  socket.run_ready = payload.state
  broadcastToRun(websocketServer, socket.joined_run_id, JSON.stringify({'type': 'runner-readystate-update_response', 'payload': {'name': socket.socket_name, 'state': socket.run_ready}}))
}

/*
  Start the run. All sockets will be marked as started and the start time will be broadcasted to each runner
*/
const startRun = (websocketServer, socket) => {
  [...websocketServer.clients]
    .filter(e => e.joined_run_id === socket.joined_run_id)
    .forEach(e => (e.run_started = true))

  let startTime = new Date().getTime()
  broadcastToRun(websocketServer, socket.joined_run_id, JSON.stringify({'type': 'start-run_response', 'payload': {'time': startTime}}))
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
