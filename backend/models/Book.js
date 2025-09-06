const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: String,
  price: Number,
  availability: String,
  rating: String,
  detailUrl: String,
  imageUrl: String,
});

module.exports = mongoose.model("Book", bookSchema);
