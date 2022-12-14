const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION: 🚨 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    // passes connection string MONGO_URL into our mongoose URL
    useNewUrlParser: true,
    // create index function instead the older ensure index function
    useCreateIndex: true,
    // disable the outdated way of updating Mongo data
    useFindAndModify: false,
    // Mongoose will use the updated way of talking to clusters of Mongo databases
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successfull!'));

// START SERVER
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('UNHANDLER EXCEPTION: 🚨 Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});

// a signal used to call programm to stop running
// Heroku use this to shut down application for every 24 hours
process.on('SIGTERM', () => {
  console.log('🚨 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('🚨 Process terminated!');
  });
});
