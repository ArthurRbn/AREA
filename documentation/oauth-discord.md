# Discord OAuth 2.0

## Front implement of Discord OAuth 2.0

### Web

Add these environement variable

```env
GITHUB_CLIENT_ID=

```

### Mobile

Do a `GET` request to http://localhost:8080/services/discord/env and get:

```json
{
	"status": true,
	"clientId": "{{clientId}}",
	"scope": "{{scope}}",
}
```

### Both

Implement the authentication

Example:
```js

<a href={`https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&permissions=8&redirect_uri=http%3A%2F%2Flocalhost%3A8081%2Fdiscord%2Flink&response_type=code&scope=${process.env.DISCORD_SCOPE}`}>
    discord authentication
</a>
```

The `redirect uri` is http://localhost:8081/discord/link

Upon successful authentication, your `redirect_uri` would receive a request containing the `code`, `guild_id` and `permissions` parameters

You will then only have to make a `POST` request to http://localhost:8080/services/discord/link and put in body:

```json
{
	"code": "{{code}}",
	"guildId": "{{guildId}}",
	"permissions": "{{permissions}}",
}
```

If you receive `status: true` from the server if everything goes well and the discord token is now saved in the database.

## Comments

