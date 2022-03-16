
# Hookdeck

Hookdeck is a tool that allows us to retrieve webhooks even when developing locally.

It is temporary and useful only in developpement.

### Install

Go to this page: https://github.com/hookdeck/hookdeck-cli/releases/tag/v0.4.4

Download this one if your on ubuntu: `hookdeck_0.4.4_linux_amd64.deb`

And finally run `dpkg -i hookdeck_0.4.4_linux_amd64.deb`

Then install `expect`. (Ubuntu: `sudo apt install expect`)

## Run

### First time

You just have to run this command in the server direcory:
`./hookdeckConfig.sh`

It will create a `.env.tmp` file with the right tunnels endpoint from every services.

Example:
```env
GITHUB_WEBHOOK=https://events.hookdeck.com/e/src_XXXX
TRELLO_WEBHOOK=https://events.hookdeck.com/e/src_XXXX
```

You then just have to copy this in your local .env

### All other times

Just run the `hookdeckConfig.sh` and that all.

## Create a hookdeck tunnel

Just add and fill this two line in the script `hookdeckConfig.sh`

```sh
(./hookdeckService.sh "service name" "path the webhook will be forwarding to")&
sleep 5
```

Example:
```sh
(./hookdeckService.sh "github" "/services/github/webhook")&
sleep 5
```

there is surely a simpler way but I didn't find it so osef.
