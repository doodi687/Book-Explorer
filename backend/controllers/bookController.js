const Book = require("../models/Book");

exports.getBooks = async (req, res) => {
  try {
    let { page = 1, limit = 20, title, rating, minPrice, maxPrice, stock, sort } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const query = {};

    if (title) query.title = { $regex: title, $options: "i" };
    if (rating) query.rating = rating;
    if (stock) query.availability = stock === "true" ? "In stock" : "Out of stock";
    if (minPrice && maxPrice) query.price = { $gte: minPrice, $lte: maxPrice };

    const sortOption = {};
    if (sort === "price_asc") sortOption.price = 1;
    if (sort === "price_desc") sortOption.price = -1;
    if (sort === "rating_asc") sortOption.rating = 1;
    if (sort === "rating_desc") sortOption.rating = -1;

    const books = await Book.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Book.countDocuments(query);

    res.json({ total, page, limit, books });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
