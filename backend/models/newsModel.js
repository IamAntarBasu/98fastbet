const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
  content: { type: String, required: true }
});

const News = mongoose.model("News", newsSchema);
module.exports = News;
