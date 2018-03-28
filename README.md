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

After connecting to the websocket you can use the following commands (send as json):

### Set the runners name =>

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


## Playing locally

Run the server in development mode.

```bash
$ npm run dev
Express server listening on http://0.0.0.0:9000, in development mode
```

## Directory structure

### Overview

You can customize the `src` and `api` directories.
