if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const newsRoute = require('./routes/news');
const { statsRoute, dumpStats, readStats } = require('./routes/stats');

// Connecting to MongoDB
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB...');
  })
  .catch((err) => {
    console.log('ERROR...', err);
  });

// Checking Routes
function getRoute(req) {
  const route = req.route ? req.route.path : ''; // check if the handler exist
  const baseUrl = req.baseUrl ? req.baseUrl : ''; // adding the base url if the handler is a child of another handler

  return route ? `${baseUrl === '/' ? '' : baseUrl}${route}` : 'unknown route';
}

// Middlewares
app.use(express.json());

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const stats = readStats();
    let event = `${req.method} ${getRoute(req)} ${res.statusCode}`;
    stats[event] = stats[event] ? stats[event] + 1 : 1;
    stats['avgTime'] = `${(Date.now() - start) / stats[event]} ms`;
    stats['totalRes'] = stats['totalRes'] ? stats['totalRes'] + 1 : 1;
    dumpStats(stats);
  });

  next();
});

// Routes
app.use('/news', newsRoute);
app.use('/stats', statsRoute);

const port = process.env.PORT || 5000;

// LISTENING PORT
app.listen(port, () => {
  console.log(`${port} port listened...`);
});
