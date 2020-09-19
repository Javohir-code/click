const mongoose = require('mongoose');
const Joi = require('joi');


// News Schema
const newSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
});

// News Model
const News = mongoose.model('News', newSchema);

// News Validation
function validateNews(news) {
  const schema = Joi.object({
    title: Joi.string().min(3).max(50).trim().required(),
    description: Joi.string().trim().required(),
  });
  return schema.validate(news);
}

exports.News = News;
exports.validate = validateNews;
