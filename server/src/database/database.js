const mongoose = require('mongoose');

const clientOptions = {
  useNewUrlParser: true,
  dbName: 'area',
};

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, clientOptions);
    console.log('connected to database.');
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  connectToDatabase,
};
