
# Add a new service

Allows any new person to understand how to implement a new service with its actions and reactions.

So you need first to create a new folder with the name of your service in `/server/src/routes/services/`.

## Oauth2

To add a service, it is quite possible that you will have to implement oauth of it.

To do so, you will have to do implement 3 routes:

`GET` `localhost:8080/services/SERVICE_NAME/connect` (get the authentification url of your app service)

`POST` `localhost:8080/services/SERVICE_NAME/link` (post the required information to register the user and get the access_token)

`POST` `localhost:8080/services/SERVICE_NAME/unlink` (unlink the user to the service and revoke the token)

Once done, don't forget to add your routes to the index.js file in `server/src/routes/services`.

## Add an action

### Register the action

To add an action, you will have to add a description of it and its parameters in a json, in `/server/src/actions/SERVICE_NAME/ACTION_NAME/index.js`

it should look like this:

```js
const path = require('path');

const metadata = {
  name: path.basename(__dirname),
  displayName: '{{name}}',
  description: '{{description}}',
  event: '{{eventName}}',
  params: [
    {
      name: '{{name}}',
      type: '{{type}}',
      placeholder: '{{placeholder}}',
    },
  ],
};

module.exports = metadata;
```

There are several types of parameters, such as `string`, `number`, `boolean` or other particular parameters explain in `special-parameter-type.md`.

### Implement the action in the workflow

Then we will have to implement a `CREATE` `UPDATE` and `DELETE` function for your action.

The `CREATE` function name will have to be added in `/server/src/routes/instances/createInstance.js` like that:

```js
const createAction = {
  ...
  SERVICE_NAME: require('../services/SERVICE_NAME/actions/create'),
  ...
};

```

The `UPDATE` function name will have to be added in `/server/src/routes/instances/updateInstance.js` like that:

```js
const updateAction = {
  ...
  SERVICE_NAME: require('../services/SERVICE_NAME/actions/update'),
  ...
};

```

And finally and very surprising, the `DELETE` function name will have to be added in `/server/src/routes/instances/removeInstance.js` like that:

```js
const deleteAction = {
  ...
  SERVICE_NAME: require('../services/SERVICE_NAME/actions/delete'),
  ...
};
```

If using **webhook**, refer to `Create a hookdeck tunnel` in `hookdeck.md` to register your webhook endpoint.

### Trigger the instance

In your endpoint (if using webhook) you will have to retrieve in the database all instance related to the trigger.

Afterwards, you have to call `runInstance` and give the array of instances.

This function will redistribute all reactions related to the action to the different services.


## Add a reaction

### Register the reaction

As for the action, you will have to add a description of it and its parameters in a json, in `/server/src/reactions/SERVICE_NAME/ACTION_NAME/index.js`

it should look exactly the same as an action.

### Implement the reaction in the workflow

You just have to create the `server/src/routes/SERVICE_NAME/reactions/index.js` that redistribute to the different reaction.

Example:
```js
const runReaction = {
  createX: require('./createX'),
};

const YRunReaction = async (instance) => {
  await runReaction[instance.reaction.name](instance);
};

module.exports = YRunReaction;
```

Then you just have to add your service in the `runReaction` object in `/server/src/routes/instances/runInstance.js`, like that:

```js
const runReaction = {
  ...
  SERVICE_NAME: require('../services/SERVICE_NAME/reactions'),
  ...
};
```