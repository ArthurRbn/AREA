# Todoist OAuth

## Front implement of Todoist OAuth

Add these environement variables
```env
TODOIST_ID=
TODOIST_SECRET=
```
## Get oauth token
GET - {{url}}/services/todoist/connect

This request will send you the oauth url in plain text

## Redirect to Todoist
Redirect the user to this url

Upon successful authentication, the callback url set in Todoist dev dashbord (here : `localhost:8081/todoist/link`)
will receive a request containing the `code`.

## Send Token to Backend
POST - {{url}}/services/todoist/link

In this request you need to send a body like that:
```JSON
{
	"token": "token",
}
``` 
Now, the backend will send this token to the Todoist API to get the access_token