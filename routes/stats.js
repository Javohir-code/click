const express = require('express');
const router = express.Router();
const fs = require('fs');
const FILE_PATH = './stats.json';



// read json object from file
const readStats = () => {
  let result = {};
  try {
    result = JSON.parse(fs.readFileSync(FILE_PATH));
  } catch (err) {
    console.error(err);
  }
  return result;
};

// dump json object to file
const dumpStats = (stats) => {
  try {
    fs.writeFileSync(FILE_PATH, JSON.stringify(stats), { flag: 'w+' });
  } catch (err) {
    console.error(err);
  }
};


// GET: Getting Statistics
router.get('/', (req, res) => {
  res.json(readStats());
});


exports.statsRoute = router;
exports.dumpStats = dumpStats;
exports.readStats = readStats;