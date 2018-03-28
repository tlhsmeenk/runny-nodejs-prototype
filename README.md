# Runny

A Websocket API created for runny prototypes


## Playing locally

Installation.

1. Clone this repository using git clone https://github.com/tlhsmeenk/runny-nodejs-prototype
2. Go the the root of the cloned repository and type npm install
3. Create a .env in the root of the project and add MASTER_KEY=masterKey. Save the file.
4. To run the project as a dev type npm run dev from the root of the repository

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
  "payload":{
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
The run ID can be used to let other users join your run. AFter receiving the connected message the followings commands are available:


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
  "type":"info",
  "payload":{
    "name": "Changed the name to ${payload.name}"
  }
}
```

### Set the runners name:

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
  "type":"joined",
  "payload":{
    "message": "${name} has joined the run!",
    "name": "Name the runner has set to him/herself using the set-name command. Can be undefined!"
  }
}
```
