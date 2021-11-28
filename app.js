const express = require('express');
const mongoose = require('mongoose');

const HttpError = require('./models/http-error');
const usersRoutes = require('./routes/users-routes');
const placesRoutes = require('./routes/places-routes');
const db = require('./config');

const app = express();

app.use(express.json());

app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((error, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error ocurred' });
});

const url = db.url || process.env.MONGO_URI;

const port = 5000 || process.env.PORT;

mongoose
  .connect(url)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on ${port}`);
    });

    console.log('MongoDB connected...');
  })
  .catch((error) => {
    console.log(error);
  });
