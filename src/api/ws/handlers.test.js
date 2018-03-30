const handlers = require('./handlers')

let websocketServer, socket, payload

const SOCKET_ID = 1337
const SOCKET_NAME = 'Hans von Diehard'
const LOCATION_UPDATE_COMMAND_PAYLOAD =
{
  'longtitude': 6.218671,
  'latitude': 51.960170
}

const PREVIOUS_LOCATION =
{
  'type': 'runner-state',
  'payload':
    {'longtitude': 6.218341,
      'latitude': 51.960208,
      'runner': SOCKET_ID,
      'distance': 0
    }
}

beforeEach(() => {
  socket = {
    'socket_id': SOCKET_ID,
    'socket_name': SOCKET_NAME,
    send: jest.fn((msg) => socket)
  }
  payload = LOCATION_UPDATE_COMMAND_PAYLOAD
  websocketServer = {
    clients: [ { send: jest.fn((msg) => socket) }, { send: jest.fn((msg) => socket) } ]
  }
})

describe('onUpdate', () => {
  it('Header type socket.last_location are set and contain the right values', () => {
    handlers.handleUpdate(websocketServer, socket, payload)

    expect(socket.last_location).toBeDefined()
    expect(socket.last_location['type']).toBeDefined()
    expect(socket.last_location['type']).toEqual('runner-update_response')
  })
})

describe('onUpdate', () => {
  it('Required fields in socket.last_location are set and contain the right values', () => {
    handlers.handleUpdate(websocketServer, socket, payload)

    expect(socket.last_location).toBeDefined()
    expect(socket.last_location.payload['runner']).toBeDefined()
    expect(socket.last_location.payload['runner']).toEqual(SOCKET_NAME)
    expect(socket.last_location.payload['distance']).toBeDefined()
    expect(socket.last_location.payload['distance']).toEqual(0)
    expect(socket.last_location.payload['longtitude']).toBeDefined()
    expect(socket.last_location.payload['longtitude']).toEqual(6.218671)
    expect(socket.last_location.payload['latitude']).toBeDefined()
    expect(socket.last_location.payload['latitude']).toEqual(51.960170)
  })
})

describe('onUpdate', () => {
  it('Calculate the right distance if there is a previous location', () => {
    socket.last_location = PREVIOUS_LOCATION
    handlers.handleUpdate(websocketServer, socket, payload)

    expect(socket.last_location).toBeDefined()
    expect(socket.last_location.payload['distance']).toBeDefined()
    expect(socket.last_location.payload['distance']).toEqual(23.01000490632922)
  })
})

describe('onUpdate', () => {
  it('Inform the runners when an update takes place', () => {
    handlers.handleUpdate(websocketServer, socket, payload)

    expect(websocketServer.clients[0].send).toHaveBeenCalledTimes(1)
    expect(websocketServer.clients[1].send).toHaveBeenCalledTimes(1)
  })
})
