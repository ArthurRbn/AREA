# Github OAuth 2.0

## Front implement of Github OAuth 2.0

Add these environement variables

```env

GITHUB_CLIENT_ID=
GITHUB_STATE=github_random_string

```

Example of code for github authentication

```js

const GITHUB_SCOPE = 'repo'

<a href={`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&state=${process.env.GITHUB_STATE}&scope=${GITHUB_SCOPE}`}>
    github authentication
</a>

```

The `redirect uri` is http://localhost:8081/

Upon successful authentication, your `redirect_uri` would receive a request containing the `code` and `state` parameters

You will then only have to make a `POST` request to http://localhost:8080/services/github/link and put in body:

```json
{
	"code": "{{code}}",
	"state": "{{state}}",
}
```

If you receive `status: true` from the server, everything goes well and the github token is now save in the database.

### Test

To test, you can make a `GET` request to http://localhost:8080/services/github/user

and you will receive a description of the registered user.