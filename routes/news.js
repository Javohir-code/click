const express = require('express');
const mongoose = require('mongoose');
const { News, validate } = require('../models/new');
const router = express.Router();

// GET: All News
router.get('/', async (req, res) => {
  const news = await News.find({});
  res.status(200).send(news);
});

// GET: News By Id
router.get('/:id', async (req, res) => {
  var valid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (valid) {
    const news = await News.findById(req.params.id);
    return res.status(200).send(news);
  } else {
    return res
      .status(404)
      .send({ error: 'Information not found with given Id' });
  }
});



// POST: Create News
router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let news = new News(req.body);
  await news.save();

  res.status(201).send(news);
});


// PUT: Update News
router.put('/:id', async (req, res) => {
  var valid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (valid) {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let news = await News.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title, description: req.body.description },
      { new: true }
    );

    return res.status(201).send(news);
  } else {
    return res
      .status(404)
      .send({ error: 'Information not found with given Id' });
  }
});


// DELETE: Delete News
router.delete('/:id', async (req, res) => {
  var valid = mongoose.Types.ObjectId.isValid(req.params.id);
  if(valid) {
    const news = await News.findByIdAndRemove(req.params.id);

    return res.status(200).send(news);
  }  else {
    return res.status(404).send({error: 'Information not found with given Id'})
  }
})



module.exports = router;
