const { Schema, model } = require('mongoose');

const TABLE_NAME = 'Instance';

const Params = new Schema({
  name: String,
  type: String,
  value: String,
}, { _id: false });

const WidgetSchema = new Schema({
  name: String,
  serviceName: String,
  displayName: String,
  webhookId: String,
  params: [Params],
}, { _id: false });

const InstanceSchema = new Schema({
  name: String,
  userId: String,
  action: WidgetSchema,
  reaction: WidgetSchema,
});

const Instance = model(TABLE_NAME, InstanceSchema);

module.exports = Instance;
