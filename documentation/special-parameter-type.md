
# Special parameter type

There are 3 new types of parameters. 

If you can't implement them, it doesn't matter, I made sure there is a default value.

### dropdown

The first type is "dropdown", which allows to have a defined list of options.

The option field has an array of posssible option. 

Each element has 3 values:

name -> name that will be displayed\
value->  value to send to the backend\
type -> type of the value return to the backend

### Example
```js
{
	name: 'type',
	type: 'dropdown',
	options: [{
		name: 'text channel',
		value: 0,
		type: 'number',
	}, {
		name: 'voice channel',
		value: 2,
		type: 'number',
	}, {
		name: 'category channel',
		value: 4,
		type: 'number',
	}],
	placeholder: 'channel type',
	isOptional: true,
},
```

If he choose voice channel, the object to send is:
```js
	{
		name: 'type',
		value: 0,
		type: number
	}
```

## get

This parameter is the same as "dropdown" with the difference that the list is retrieved with a request to the backend.

it has no field option, but it has a route field which specifies the route where to make the request.

### Example

```js
{
	name: 'channel',
	type: 'get',
	route: '/services/discord/get/channels/2',
	placeholder: 'channel in which the event will take place',
	isOptional: true,
},
```

the `GET` request to `http://localhost:8080//services/discord/get/channels/2` send something like:
```json
[
    {
        "name": "welcome",
        "value": "941758848216232018",
        "type": "string"
    },
    {
        "name": "goal",
        "value": "941758848216232020",
        "type": "string"
    },
]
```

## time

If you are really determined, you can implement this type which returns a string of format "10:00".

### Example

```js
{
	name: 'time',
	type: 'time',
	placeholder: 'Event start time',
	isOptional: true,
},
```