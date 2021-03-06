import * as ws from '.'

let _ws

beforeEach(() => {
  _ws = {
    send: jest.fn((msg) => _ws)
  }
})

describe('connected', () => {
  it('When a socket is connecting the run_id is set to the socket and a valid json is send back over the socket', () => {
    ws.onSocketConnected(_ws)
    expect(_ws.socket_id).toBeDefined()
    expect(_ws.send).toHaveBeenCalledTimes(1)
    expect(_ws.send).toBeValidJsonContaining({run_id: String, key_value: String})
  })
})

expect.extend({
  toBeValidJsonContaining (received, argument) {
    try {
      JSON.parse(received.mock.calls[0])
      return {
        message: () =>
          `${received.mock.calls[0]} is a valid json!`,
        pass: true
      }
    } catch (e) {
      return {
        message: () =>
          `${received.mock.calls[0]} is not a valid json!`,
        pass: false
      }
    }
  }
})
