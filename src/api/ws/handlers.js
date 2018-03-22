
/*
  Setting a name to the socket. For now we're just abusing the connection to store user
  related information as it's the only connection we have :-)
*/
const handleSetName = (socket, payload) => {
  socket.socket_name = payload['name']
  socket.send(`Seting your name to ${payload.name}`)
}

/*
  When a user joins we'll change the joined field away from their own id and broadcast the
  event to any socket matching the joined_id of join request
*/
const handleJoin = (websocketServer, socket, payload) => {
  socket.joined_run_id = payload['runtojoin']
  broadcastToRun(websocketServer, socket.joined_run_id, `${socket.socket_name} has joined the run!`)
}

/*
  Update the last_location of the socket and notify the fellow runners
*/
const handleUpdate = (websocketServer, socket, payload) => {
  socket.last_location = { 'runner': socket.socket_id, 'longtitude': payload['longtitude'], 'latitude': payload['longtitude'] }
  broadcastToRun(websocketServer, socket.joined_run_id, JSON.stringify(socket.last_location))
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
  handleUpdate
}
