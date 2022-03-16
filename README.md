B-YEP-500-STG-5-1-yearendproject-alexandre.sauner

# Run the project

`docker-compose up --build`

## Extra steps for the server

To make the webhooks work while respecting the subject and run the server on a local port, we need some additional steps.

Hookdeck is a tool that allows us to retrieve webhooks even when developing locally. It is temporary until we deploy it.

### Install

Go to this page: https://github.com/hookdeck/hookdeck-cli/releases/tag/v0.4.4

Download the package corresponding to your OS.\
(Ubuntu: `hookdeck_0.4.4_linux_amd64.deb`, Windows: `scoop bucket add hookdeck https://github.com/hookdeck/scoop-hookdeck-cli.git`)

Then install the package.\
(Ubuntu: `dpkg -i hookdeck_0.4.4_linux_amd64.deb`, Windows: `scoop install hookdeck`)

Finally install `expect` tool.

### Run

#### First time

Go in `server` directory.

Give the right to the two `hookdeck*.sh` file the right to be executed.\
(ubuntu: `chmod 764 hookdeck*.sh`, Windows: TODO)

Then You have to run this command in the server directory:
`./hookdeckConfig.sh`

It will create a `.env.tmp` file with the right tunnels endpoint from every service.

Example:

```env
GITHUB_WEBHOOK=https://events.hookdeck.com/e/src_XXXX
TRELLO_WEBHOOK=https://events.hookdeck.com/e/src_XXXX
```

You then just have to copy this in your local .env

Keep the script running until you stop the server.

#### All other times

Just run the `hookdeckConfig.sh` and that all.

Keep the script running until you stop the server.

## API

You can get a list of the actions and reactions by doing a GET request on `/about.json`.

### User profile

To get user information do a GET request on `/profile` it will return a JSON like this :

```json
{
  "username": "Arthur",
  "email": "arthur.robine@epitech.eu",
  "twitterLinked": true,
  "githubLinked": true,
  "trelloLinked": true,
  "discordLinked": true,
  "redditLinked": true,
  "todoistLinked": true
}
```

You can edit these informations by doing a PATCH request to the same route with a JSON containing only the modified fields.

### Actions and Reactions

To know which parameters the actions and reactions need you can make GET requests on `/actions` and `/reactions`.

### Instances

To get the list of the existing instances do a GET request to `/instances`.

To create an instance make a POST request to `/instances` with a JSON like :

```json
{
  "action": {
    "name": "push",
    "serviceName": "github",
    "displayName": "New push on repository",
    "webhookId": "default",
    "params": [
      {
        "name": "repository",
        "type": "string",
        "value": "test"
      }
    ]
  },
  "reaction": {
    "name": "sendEmail",
    "serviceName": "mail",
    "displayName": "Send me an email",
    "params": [
      {
        "name": "subjects",
        "type": "string",
        "value": "subject"
      },
      {
        "name": "body",
        "type": "string",
        "value": "mail content"
      }
    ]
  }
}
```

You can also update these instances by doing a POST request to `/instances/:id` with a JSON like the previous.

To remove an instance do a DELETE request to `/instances/:id`.