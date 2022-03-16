# Reddit OAuth

## Front implement of Reddit OAuth

Add these environement variables
```env
REDDIT_ID=
REDDIT_SECRET=
```
## Get oauth token
GET - {{url}}/services/reddit/connect

This request will send you the oauth url in plain text

## Redirect to Redit
Redirect the user to this url

Upon successful authentication, the callback url set in reddit dev dashbord (here : `localhost:8081/reddit/link`)
will receive a request containing the `code`.

## Send Token to Backend
POST - {{url}}/services/reddit/link

In this request you need to send a body like that:
```JSON
{
	"token": "token",
}
``` 
Now, the backend will send this token to the reddit API to get the access_token and refresh_token