# Runny

A Websocket API created for runny prototypes


## Running for development

1. Clone this repository using git clone https://github.com/tlhsmeenk/runny-nodejs-prototype
2. Go the the root of the cloned repository and type npm install
3. Create a .env in the root of the project and add MASTER_KEY=masterKey. Save the file.
4. To run the project as a dev type npm run dev from the root of the repository

## Typical run flow

1. Connect to the websocket server. You will receive a run-id in a JSON response (see section commands)
2. Now you can set the desired name using the set-name command
3. Either join a run using the join-run command or share your own run-id and wait for people to join your run
4. Wait for every runner to indicate they are ready (monitor the ready-state commands on the websocket)
5. Start the run using the start-run command.
6. Start sending updates to the server 

## Commands

After you generate your project, these commands are available in `package.json`.

```bash
npm test # test using Jest
npm run coverage # test and open the coverage report in the browser
npm run lint # lint using ESLint
npm run dev # run the API in development mode
npm run prod # run the API in production mode
npm run docs # generate API docs
```

## Websocket Commands

Every websocket command will expect the following base structure:

```json
{
  "type":"{NAME_OF_THE_COMMAND}",
  "payload [Optional]":{
    "command_specific": "The payload will contain the command specific fields"
  }
}
```

After connecting to the websocket you will receive a response from the server:

```json
{
  "type":"connected",
  "payload":{
    "run-id": "432ER"
  }
}
```
The run ID can be used to let other users join your run. After receiving the connected message the followings commands are available:


### Set the runners name:

```json
{
  "type":"set-name",
  "payload":{
    "name": "Desired name of the user"
  }
}
```
Response =>
```json
{
  "type":"set-name_response",
  "payload":{
    "name": "Changed the name to ${payload.name}"
  }
}
```

### Join a run:

```json
{
  "type":"join",
  "payload":{
    "runtojoin": "The ID of the run to join. See the connected bit of this part of the readme"
  }
}
```
Response (Send to every runner that's connected to the run!) =>
```json
{
  "type":"join_response",
  "payload":{
    "message": "${name} has joined the run!",
    "name": "Name the runner has set to him/herself using the set-name command. Can be undefined!"
  }
}
```

### Get the names of the runners partaking in the run:

```json
{
  "type":"get-runners"
}
```
Response (Send to every runner that's connected to the run!) =>
```json
{
  "type":"get-runners_response",
  "payload":{
    "runners": ["runner1", "runner2"]
  }
}
```

### Update wheter the connected runner is ready or not. Runners cannot be forced to be ready by other runners:

```json
{
  "type":"runner-readystate-update",
  "payload":{
    "state": true
  }
}
```
Response (Send to every runner that's connected to the run!) =>
```json
{
  "type":"runner-readystate-update_response",
  "payload":{
    "name": "name of the runner that changed it state",
    "state": true
  }
}
```

### Start a run! Every connected runner will receive a global start time.

```json
{
  "type":"start-run"
}
```
Response (Send to every runner that's connected to the run!). Contains the time in millis since 1970 (js new Date().getTime())=>
```json
{
  "type":"start-run_response",
  "payload":{
    "starttime": 1522416125000
  }
}
```

### After a run has started you can send updates!

```json
{
  "type":"update",
  "payload":{
    "longtitude": 1.232323,
    "latitude": 5.4324234
  }
}
```
Response (Send to every runner that's connected to the run!) The returned distance is always in meters. =>
```json
{
  "type":"update_response",
  "payload":{
    "runner": "name of the runner",
    "longtitude": 1.232323,
    "latitude": 5.4324234,
    "distance": 43.43234234
  }
}
```
