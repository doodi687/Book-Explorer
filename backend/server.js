require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const bookRoutes = require("./routes/bookRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// connect to MongoDB (local for now)
mongoose.connect("mongodb://127.0.0.1:27017/book_explorer", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.log("❌ MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("Book Explorer API is running 🚀");
});

app.use("/api/books", bookRoutes);

const PORT = 5000;

const Book = require("./models/Book");

app.get("/api/seed", async (req, res) => {
  await Book.deleteMany({}); 
  await Book.insertMany([
    {
      title: "The Beginner’s Guide to Node.js",
      price: 15.99,
      availability: "In stock",
      rating: "Four",
      detailUrl: "http://example.com/nodejs",
      imageUrl: "http://example.com/img1.jpg"
    },
    {
      title: "Learning React the Easy Way",
      price: 20.5,
      availability: "In stock",
      rating: "Five",
      detailUrl: "http://example.com/react",
      imageUrl: "http://example.com/img2.jpg"
    },
    {
      title: "Mastering MongoDB",
      price: 18.0,
      availability: "Out of stock",
      rating: "Three",
      detailUrl: "http://example.com/mongodb",
      imageUrl: "http://example.com/img3.jpg"
    }
  ]);
  res.send("Dummy data inserted ✅");
});



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
