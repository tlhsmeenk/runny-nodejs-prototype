
const setNameResponse = (name) => {
  return JSON.stringify(
    {
      'type': 'set-name_response',
      'payload':
        {
          'message': `Changed the name to ${name}`
        }
    })
}

const joinResponse = (name) => {
  return JSON.stringify(
    { 'type': 'join_response',
      'payload':
            {
              'message': `${name} has joined the run!`,
              'name': name
            }
    })
}

const readyResponse = (name, readystate) => {
  return JSON.stringify(
    {
      'type': 'runner-readystate-update_response',
      'payload':
        {
          'name': name,
          'state': readystate
        }
    })
}

const startRunResponse = (starttime) => {
  return JSON.stringify(
    {
      'type': 'start-run_response',
      'payload': {'time': starttime}
    })
}

const getRunnersResponse = (runners) => {
  return JSON.stringify(
    {
      'type': 'get-runners_response',
      'payload':
        {
          'runners': runners
        }
    })
}

module.exports = {
  joinResponse,
  readyResponse,
  startRunResponse,
  getRunnersResponse,
  setNameResponse
}
