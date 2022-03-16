
# Trello Oauth 1.0a

## Get oauth token
POST - {{url}}/services/trello/connect

In this request you need to send a body like that:
```JSON
{
    "callback": "http://localhost:8081/trello/link"
}
```

After this request you will receive an object like that :
```JSON
{
	"status": true,
	"redirectUrl": "XXXXXXXXXXXX"
}
```
## Redirect to Trello
Redirect the user to : `redirectURL`
Upon successful authentication, your `callback_url` would receive a request containing the `oauth_token` and `oauth_verifier` parameters (http://localhost:8081/trello/link).

## Send Token to db
POST - {{url}}/services/trello/link
In this request you need to send a body like that:
```JSON
{
	"oauthToken": "{{oauthToken}}",
	"oauthVerifier": "{{oauthVerifier}}",
}
```
Now the user oauth token and oauth secret token are stored in db.
