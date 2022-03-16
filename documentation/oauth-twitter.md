
# Twitter Oauth 1.0a

## Get oauth token
POST - {{url}}/services/twitter/connect

In this request you need to send a body like that:
```JSON
{
    "callback": "http://localhost:8081/twitter/link"
}
```

After this request you will receive an object la that :
```JSON
{
	"status": true,
	"oauthToken": "XXXXXXXXXXXX"
}
```
## Redirect to Twitter
Redirect the user to : https://api.twitter.com/oauth/authorize?oauth_token={{my_oauth_token}}
Upon successful authentication, your `callback_url` would receive a request containing the `oauth_token` and `oauth_verifier` parameters (http://localhost:8081/twitter/link).

## Send Token to db
POST - {{url}}/services/twitter/link
In this request you need to send a body like that:
```JSON
{
	"oauthToken": "{{oauthToken}}",
	"oauthVerifier": "{{oauthVerifier}}",
}
```
Now the user oauth token and oauth secret token are stored in db.
